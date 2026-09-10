'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { z } from 'zod';
import { contentTag, serviceClient } from '@/lib/supabase/server';
import { requireStaff } from '@/lib/admin/actor';
import { recordAudit } from '@/lib/admin/audit';
import { ROUTES } from '@/lib/constants';
import { parseSpecs, parseFeatures } from '@/lib/admin/product-fields';

/**
 * PRODUCT SERVER ACTIONS.
 *
 * The Sprint 12 gate begins here: "a staff member adds a product, changes a
 * price ... unaided". Two of the five acts, and the two with money in them.
 *
 * Same four steps as every other admin mutation: actor from the SESSION, Zod on
 * the server, write with the service role, then audit and revalidate.
 */

const slugSchema = z
  .string()
  .min(3, 'A slug needs at least 3 characters.')
  .max(80, 'Keep the slug under 80 characters.')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and single hyphens only.');

/**
 * A price field that distinguishes EMPTY from ZERO.
 *
 * `price_kes IS NULL` is load-bearing on this project: it means "Request
 * price", and the product page then renders a WhatsApp CTA instead of
 * add-to-cart and emits `Product` schema WITHOUT an `Offer`
 * (`DATABASE_ARCHITECTURE.md` §2). `price_kes = 0` means the thing is free.
 *
 * `Number('')` is 0, so the naive coercion turns every blank price field into a
 * product advertised at nothing. Hence the explicit empty check before any
 * coercion happens.
 */
const optionalPrice = z
  .string()
  .trim()
  .transform((value) => (value === '' ? null : value))
  .refine((value) => value === null || /^\d{1,9}$/.test(value), {
    message: 'Enter whole shillings, digits only — or leave it empty for “request price”.',
  })
  .transform((value) => (value === null ? null : Number(value)));

const productSchema = z
  .object({
    id: z.string().uuid().optional().or(z.literal('')),
    name: z.string().trim().min(2, 'A product needs a name.').max(200),
    slug: slugSchema,
    family: z.string().trim().max(80).optional().or(z.literal('')),
    sku: z.string().trim().max(80).optional().or(z.literal('')),
    summary: z.string().trim().max(600).optional().or(z.literal('')),
    body: z.string().trim().max(20_000).optional().or(z.literal('')),
    specs_text: z.string().max(20_000).optional().or(z.literal('')),
    features_text: z.string().max(20_000).optional().or(z.literal('')),
    category_id: z.string().uuid().optional().or(z.literal('')),

    price_kes: optionalPrice,
    price_visible: z.coerce.boolean().optional(),
    availability: z.enum(['in_stock', 'out_of_stock', 'pre_order']),
    featured: z.coerce.boolean().optional(),

    recurring_fee_kes: optionalPrice,
    recurring_fee_period: z.string().trim().max(40).optional().or(z.literal('')),
    recurring_fee_note: z.string().trim().max(300).optional().or(z.literal('')),

    installation_terms: z.string().trim().max(600).optional().or(z.literal('')),

    status: z.enum(['draft', 'in_review', 'published']),
    seo_title: z.string().trim().max(70).optional().or(z.literal('')),
    seo_description: z.string().trim().max(200).optional().or(z.literal('')),
  })
  /**
   * The database has this same rule as a CHECK constraint
   * (`recurring_fee_needs_period`), and it is repeated here on purpose.
   *
   * The constraint is what guarantees the rule; this is what turns a violation
   * into a sentence. Without it the staff member gets
   * `new row for relation "products" violates check constraint
   * "recurring_fee_needs_period"` — which `docs/CMS_ARCHITECTURE.md` §3 names
   * as its own failure mode. Belt and braces where the braces are legible.
   */
  .refine((data) => data.recurring_fee_kes === null || Boolean(data.recurring_fee_period), {
    message: 'A recurring fee needs a period — “year” or “month”. A figure alone means nothing to a reader.',
    path: ['recurring_fee_period'],
  });

export type ProductResult =
  | { ok: true; id: string; message: string }
  | { ok: false; message: string; fieldErrors?: Record<string, string[]> };

/**
 * Round-trip a parsed structure into the `Json` shape the generated types want.
 *
 * `specs` and `features` are jsonb columns, and `types/database.ts` types them
 * as `Json` — a recursive type that requires an index signature on any object.
 * A named interface like `ProductFeature` does not satisfy it, which is the
 * generated types being strict rather than a problem to cast away.
 *
 * Going through JSON does two things: it produces a value TypeScript accepts,
 * and it proves the value is actually serialisable before it reaches the
 * database. Same approach the audit writer uses, for the same reason.
 */
function asJson<T>(value: T) {
  return JSON.parse(JSON.stringify(value));
}

/** Empty strings from a form become NULL rather than ''. */
function nullify<T extends Record<string, unknown>>(obj: T): T {
  const out = { ...obj };
  for (const [key, value] of Object.entries(out)) {
    if (value === '') (out as Record<string, unknown>)[key] = null;
  }
  return out;
}

/**
 * Everything a product change can be visible through.
 *
 * The category index and the solution and industry pages are included because
 * each lists products, and the sitemap because it lists published ones. A
 * product renamed or unpublished without these keeps appearing in three places
 * that were true an hour ago — which is register item V54's shape, and it was
 * expensive enough once.
 */
function revalidateProductSurfaces(slug?: string | null, previousSlug?: string | null) {
  revalidateTag(contentTag('public_products'));
  revalidatePath(ROUTES.products);
  revalidatePath(ROUTES.solutions);
  revalidatePath(ROUTES.industries);
  revalidatePath(ROUTES.home);
  revalidatePath('/sitemap.xml');
  if (slug) revalidatePath(ROUTES.product(slug));
  if (previousSlug && previousSlug !== slug) revalidatePath(ROUTES.product(previousSlug));
}

export async function saveProduct(
  _previous: ProductResult | null,
  formData: FormData,
): Promise<ProductResult> {
  // editor or above — content AND shop, per the role table. A `sales` account
  // reads the inbox and cannot change a price.
  const actor = await requireStaff('editor');
  if (!actor) return { ok: false, message: 'You do not have permission to edit products.' };

  const parsed = productSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      ok: false,
      message: 'Some fields need attention.',
      fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]>,
    };
  }

  const input = nullify(parsed.data);
  const db = serviceClient();

  const row = {
    name: input.name,
    slug: input.slug,
    family: input.family as string | null,
    sku: input.sku as string | null,
    summary: input.summary as string | null,
    body: input.body as string | null,
    specs: asJson(parseSpecs(String(parsed.data.specs_text ?? ''))),
    features: asJson(parseFeatures(String(parsed.data.features_text ?? ''))),
    category_id: input.category_id as string | null,
    price_kes: input.price_kes,
    price_visible: Boolean(parsed.data.price_visible),
    availability: input.availability,
    featured: Boolean(parsed.data.featured),
    recurring_fee_kes: input.recurring_fee_kes,
    recurring_fee_period: input.recurring_fee_period as string | null,
    recurring_fee_note: input.recurring_fee_note as string | null,
    installation_terms: input.installation_terms as string | null,
    status: input.status,
    seo_title: input.seo_title as string | null,
    seo_description: input.seo_description as string | null,
    updated_at: new Date().toISOString(),
  };

  if (!input.id) {
    const { data, error } = await db.from('products').insert(row).select('id').single();
    if (error) return { ok: false, message: friendly(error.message) };

    await recordAudit({
      actorId: actor.id,
      action: 'product.create',
      entity: 'product',
      entityId: data.id,
      diff: { slug: row.slug, status: row.status, price_kes: row.price_kes },
    });
    revalidateProductSurfaces(row.slug);
    return { ok: true, id: data.id, message: 'Product created.' };
  }

  const { data: existing, error: readError } = await db
    .from('products')
    .select('slug, status, price_kes, recurring_fee_kes')
    .eq('id', input.id as string)
    .single();
  if (readError) return { ok: false, message: 'That product could not be found.' };

  const slugChanged = existing.slug !== row.slug;
  if (slugChanged && existing.status === 'published') {
    // The rename writes its own 301. `docs/CMS_ARCHITECTURE.md` §3.1: the
    // redirect is not left to someone remembering, and a product URL that
    // stops resolving is a ranking thrown away.
    await db.from('redirects').upsert(
      {
        from_path: ROUTES.product(existing.slug),
        to_path: ROUTES.product(row.slug),
        status_code: 301,
        source: 'cms',
        note: `Slug renamed from ${existing.slug}`,
      },
      { onConflict: 'from_path' },
    );
  }

  const { error } = await db.from('products').update(row).eq('id', input.id as string);
  if (error) return { ok: false, message: friendly(error.message) };

  /**
   * A price change is audited AS a price change, with both figures.
   *
   * This is the one field on the project where "what was it before" is a
   * question somebody will actually ask, because an order taken at the old
   * price and a page showing the new one is a dispute. Both values are in the
   * log, and neither is PII.
   */
  const priceChanged = existing.price_kes !== row.price_kes;
  await recordAudit({
    actorId: actor.id,
    action: priceChanged ? 'product.price' : 'product.update',
    entity: 'product',
    entityId: input.id as string,
    diff: {
      slug: row.slug,
      status: row.status,
      ...(priceChanged ? { price_was: existing.price_kes, price_now: row.price_kes } : {}),
      ...(existing.recurring_fee_kes !== row.recurring_fee_kes
        ? { recurring_was: existing.recurring_fee_kes, recurring_now: row.recurring_fee_kes }
        : {}),
      ...(slugChanged
        ? { slug_was: existing.slug, redirect_created: existing.status === 'published' }
        : {}),
    },
  });

  revalidateProductSurfaces(row.slug, slugChanged ? existing.slug : null);
  return { ok: true, id: input.id as string, message: 'Saved.' };
}

/**
 * Unpublish. Separate from the status dropdown so it is a deliberate act.
 *
 * Admin only, matching the blog: unpublishing removes something the public can
 * see, and doing that by accident is worse than being unable to do it quickly.
 */
export async function unpublishProduct(id: string): Promise<ProductResult> {
  const actor = await requireStaff('admin');
  if (!actor) return { ok: false, message: 'Only an administrator can unpublish a product.' };
  if (!z.string().uuid().safeParse(id).success) return { ok: false, message: 'Invalid product.' };

  const db = serviceClient();
  const { data: existing } = await db.from('products').select('slug').eq('id', id).single();

  const { error } = await db
    .from('products')
    .update({ status: 'draft', updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) return { ok: false, message: friendly(error.message) };

  await recordAudit({
    actorId: actor.id,
    action: 'product.unpublish',
    entity: 'product',
    entityId: id,
    diff: { slug: existing?.slug ?? null },
  });
  revalidateProductSurfaces(existing?.slug);
  return { ok: true, id, message: 'Unpublished. It is no longer public.' };
}

/**
 * Turn a database error into something a salesperson can act on.
 * `docs/CMS_ARCHITECTURE.md` §3 — never a raw database error.
 */
function friendly(message: string): string {
  if (message.includes('duplicate key') && message.includes('slug')) {
    return 'That slug is already used by another product. Choose a different one.';
  }
  if (message.includes('recurring_fee_needs_period')) {
    return 'A recurring fee needs a period — “year” or “month”.';
  }
  if (message.includes('violates foreign key')) {
    return 'The selected category no longer exists.';
  }
  if (message.includes('price_kes')) {
    return 'The price must be a whole number of shillings, or empty for “request price”.';
  }
  return 'That could not be saved. Try again, and tell us if it keeps happening.';
}
