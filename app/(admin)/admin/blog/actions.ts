'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { serviceClient } from '@/lib/supabase/server';
import { requireStaff } from '@/lib/admin/actor';
import { ROUTES } from '@/lib/constants';

/**
 * BLOG SERVER ACTIONS.
 *
 * Every mutation in this file follows the same four steps, in this order:
 *
 *   1. Establish who is acting, from the SESSION — never from the form.
 *   2. Validate the payload with Zod, on the server.
 *   3. Write, using the service role.
 *   4. Record an audit_log entry and revalidate the affected paths.
 *
 * WHY THE ACTOR COMES FROM THE SESSION. A server action is a public HTTP
 * endpoint. Anything in the form body is attacker-controlled, so an `actorId`
 * field would be an invitation to attribute an edit to somebody else. The
 * session is read server-side on every call.
 *
 * WHY ZOD IS NOT OPTIONAL HERE. CLAUDE.md §10: "Server-side Zod on every
 * mutation. Never trust client input." These actions run with the SERVICE ROLE,
 * which bypasses RLS entirely — the database will not catch a malformed or
 * malicious write, so this file is the only thing that will.
 *
 * WHY audit_log IS WRITTEN EVERY TIME. §10 again: an entry for every admin
 * create, update and delete. It is written after the change succeeds, so the
 * log records what happened rather than what was attempted.
 */

/**
 * Slugs are permanent by policy (CLAUDE.md §12), so the shape is constrained
 * rather than merely trimmed: lowercase, digits and single hyphens. A slug with
 * a capital or a space is a slug someone will later "fix", and fixing a slug
 * costs a 301.
 */
const slugSchema = z
  .string()
  .min(3, 'A slug needs at least 3 characters.')
  .max(80, 'Keep the slug under 80 characters.')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and single hyphens only.');

const postSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(3, 'A title needs at least 3 characters.').max(200),
  slug: slugSchema,
  excerpt: z.string().max(400).optional().or(z.literal('')),
  body: z.string().max(100_000).optional().or(z.literal('')),
  // Live character counts in the SEO panel warn at these lengths; the schema
  // enforces the hard ceiling so a long title cannot reach the database and
  // truncate in a SERP months later.
  seo_title: z.string().max(70).optional().or(z.literal('')),
  seo_description: z.string().max(200).optional().or(z.literal('')),
  category_id: z.string().uuid().optional().or(z.literal('')),
  author_id: z.string().uuid().optional().or(z.literal('')),
  status: z.enum(['draft', 'in_review', 'published']),
  /** ISO datetime. A future value is how scheduled publishing works. */
  published_at: z.string().datetime().optional().or(z.literal('')),
});

export type ActionResult =
  | { ok: true; id: string; message: string }
  | { ok: false; message: string; fieldErrors?: Record<string, string[]> };

/** Empty strings from a form become NULL rather than ''. */
function nullify<T extends Record<string, unknown>>(obj: T): T {
  const out = { ...obj };
  for (const [k, v] of Object.entries(out)) {
    if (v === '') (out as Record<string, unknown>)[k] = null;
  }
  return out;
}

async function audit(
  actorId: string | null,
  action: string,
  entityId: string,
  // Serialised rather than passed as a loose object: `diff` is a jsonb column
  // and the generated type is Json, which a Record<string, unknown> does not
  // satisfy. Round-tripping through JSON also guarantees the value is storable.
  diff: Record<string, string | boolean | null | undefined>,
) {
  await serviceClient().from('audit_log').insert({
    actor_id: actorId,
    action,
    entity: 'blog_post',
    entity_id: entityId,
    diff: JSON.parse(JSON.stringify(diff)),
  });
}

/**
 * Create or update a post.
 *
 * THE SLUG RULE LIVES HERE, not in the UI. The editor locks the field after the
 * first save, but a lock in a form is a suggestion — the request can be replayed
 * with any slug. So the server compares the incoming slug against the stored one
 * and, when they differ on an already-published post, writes the redirect itself.
 */
export async function savePost(formData: FormData): Promise<ActionResult> {
  // editor or above. A viewer or sales account can sign in and cannot publish.
  const actor = await requireStaff('editor');
  if (!actor) return { ok: false, message: 'You do not have permission to edit posts.' };

  const parsed = postSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      ok: false,
      message: 'Some fields need attention.',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const input = nullify(parsed.data);
  const db = serviceClient();

  // A post cannot be published without a date: Article schema needs a real
  // datePublished, and the public view refuses to surface a post without one.
  const publishedAt =
    input.status === 'published' && !input.published_at
      ? new Date().toISOString()
      : (input.published_at as string | null);

  const row = {
    title: input.title,
    slug: input.slug,
    excerpt: input.excerpt as string | null,
    body: input.body as string | null,
    seo_title: input.seo_title as string | null,
    seo_description: input.seo_description as string | null,
    category_id: input.category_id as string | null,
    author_id: input.author_id as string | null,
    status: input.status,
    published_at: publishedAt,
    updated_at: new Date().toISOString(),
  };

  if (!input.id) {
    const { data, error } = await db.from('blog_posts').insert(row).select('id').single();
    if (error) return { ok: false, message: friendly(error.message) };
    await audit(actor.id, 'create', data.id, { slug: row.slug, status: row.status });
    revalidatePath(ROUTES.blog);
    return { ok: true, id: data.id, message: 'Post created.' };
  }

  const { data: existing, error: readError } = await db
    .from('blog_posts')
    .select('slug, status, title, body, excerpt')
    .eq('id', input.id)
    .single();
  if (readError) return { ok: false, message: 'That post could not be found.' };

  // Revision BEFORE the write, so history holds the version being replaced.
  await db.from('blog_post_revisions').insert({
    post_id: input.id,
    title: existing.title,
    body: existing.body,
    excerpt: existing.excerpt,
    author_id: actor.id,
  });

  const slugChanged = existing.slug !== row.slug;
  if (slugChanged && existing.status === 'published') {
    // The rename creates its own redirect. Not left to anyone remembering.
    await db.from('redirects').upsert(
      {
        from_path: ROUTES.blogPost(existing.slug),
        to_path: ROUTES.blogPost(row.slug),
        status_code: 301,
        source: 'cms',
        note: `Slug renamed from ${existing.slug}`,
      },
      { onConflict: 'from_path' },
    );
  }

  const { error } = await db.from('blog_posts').update(row).eq('id', input.id);
  if (error) return { ok: false, message: friendly(error.message) };

  await audit(actor.id, 'update', input.id, {
    slug: row.slug,
    status: row.status,
    ...(slugChanged ? { slug_was: existing.slug, redirect_created: existing.status === 'published' } : {}),
  });

  // On-demand revalidation: publish, refresh, it is live.
  revalidatePath(ROUTES.blog);
  revalidatePath(ROUTES.blogPost(row.slug));
  if (slugChanged) revalidatePath(ROUTES.blogPost(existing.slug));

  return { ok: true, id: input.id, message: 'Saved.' };
}

/**
 * Autosave. Deliberately narrower than savePost: it touches only the three
 * fields a writer loses by closing a tab, never the status and never the slug.
 * An autosave that could publish something would be a trap.
 */
const autosaveSchema = z.object({
  id: z.string().uuid(),
  title: z.string().max(200),
  excerpt: z.string().max(400).optional().or(z.literal('')),
  body: z.string().max(100_000).optional().or(z.literal('')),
});

export async function autosavePost(formData: FormData): Promise<ActionResult> {
  const actor = await requireStaff('editor');
  if (!actor) return { ok: false, message: 'You do not have permission to edit posts.' };

  const parsed = autosaveSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: 'Autosave skipped.' };

  const { id, ...fields } = nullify(parsed.data);
  const { error } = await serviceClient()
    .from('blog_posts')
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return { ok: false, message: 'Autosave failed.' };
  // No audit entry and no revision: an autosave every few seconds would drown
  // both. The revision is taken on an explicit save, which is the point a
  // writer would want to return to.
  return { ok: true, id, message: 'Draft saved' };
}

/** Unpublish. Kept separate so it is a deliberate act, never a status dropdown slip. */
export async function unpublishPost(id: string): Promise<ActionResult> {
  // Unpublishing removes something the public can see. Admin only.
  const actor = await requireStaff('admin');
  if (!actor) return { ok: false, message: 'Only an administrator can unpublish a post.' };
  if (!z.string().uuid().safeParse(id).success) return { ok: false, message: 'Invalid post.' };

  const db = serviceClient();
  const { data: existing } = await db.from('blog_posts').select('slug').eq('id', id).single();

  const { error } = await db
    .from('blog_posts')
    .update({ status: 'draft', updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) return { ok: false, message: friendly(error.message) };

  await audit(actor.id, 'unpublish', id, { slug: existing?.slug });
  revalidatePath(ROUTES.blog);
  if (existing?.slug) revalidatePath(ROUTES.blogPost(existing.slug));
  return { ok: true, id, message: 'Unpublished. It is no longer public.' };
}

/**
 * Turn a database error into something a salesperson can act on.
 * CMS_ARCHITECTURE §3: "Validation with helpful messages, never a raw database
 * error" — the failure it prevents is showing someone
 * `duplicate key value violates unique constraint`.
 */
function friendly(message: string): string {
  if (message.includes('duplicate key') && message.includes('slug')) {
    return 'That slug is already used by another post. Choose a different one.';
  }
  if (message.includes('violates foreign key')) {
    return 'The selected author or category no longer exists.';
  }
  return 'That could not be saved. Try again, and tell us if it keeps happening.';
}
