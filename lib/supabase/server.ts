import 'server-only';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

/**
 * Server-side Supabase clients.
 *
 * `import 'server-only'` at the top is the enforcement, not the comment: if any
 * client component ever imports this module, the BUILD FAILS rather than
 * quietly shipping a service-role key to a browser. That is the single most
 * expensive mistake available in this file, so it is made impossible rather
 * than discouraged.
 *
 * Two clients, two jobs:
 *
 *   publicClient()  — anon key. Reads the public views from 0009 and nothing
 *                     else. Used for ordinary page data.
 *   serviceClient() — service-role key. BYPASSES RLS. Used only for writes and
 *                     for the certificate lookup, always inside a server action
 *                     that has already validated its input with Zod.
 */

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. See .env.example — every variable is documented there.`,
    );
  }
  return value;
}

/**
 * Cache handling for database reads. Register item V54.
 *
 * ── The bug, proven rather than assumed ─────────────────────────────────────
 * supabase-js reads go through `fetch`, so Next was storing every PostgREST
 * response in `.next/cache/fetch-cache`, inheriting the calling page's
 * `revalidate = 3600`. A cached entry was recovered and decoded during Sprint
 * 10 holding `"seo_title": "What is a container e-seal?"` while the database
 * held the corrected value — and carrying `tags: []`.
 *
 * Those empty tags were the whole problem. The CMS publish action already calls
 * `revalidatePath`, which correctly discards the rendered page; the page then
 * re-rendered and read the row straight back out of the data cache, unchanged,
 * for up to an hour. **The publish button could not publish.** Sprint 9 built
 * that CMS so non-technical staff could keep the blog alive, and CLAUDE.md §15
 * names an admin they quietly abandon as a way this project fails.
 *
 * ── Why tagging, and not `cache: 'no-store'` ────────────────────────────────
 * `no-store` was the first thing tried, because "the page cache is already the
 * cache" is a good argument. It was MEASURED and rejected: it opts a route out
 * of static generation, and the build moved the homepage, /solutions,
 * /products, /industries, all three resources routes and /sitemap.xml from
 * prerendered to server-rendered on demand. Only routes with
 * `generateStaticParams` survived. That trades a staleness bug for a
 * performance regression on every index page, on an audience specified as
 * mid-range Android on metered data.
 *
 * Tagging keeps the data cache and makes it invalidatable, which is what was
 * actually missing. Every read is tagged with the PostgREST resource it hit —
 * `sb:public_blog_posts`, `sb:public_faqs` — and a mutation invalidates the
 * tag for the thing it changed, so the next render reads fresh.
 *
 * ── The gap this leaves, stated plainly ─────────────────────────────────────
 * A change made DIRECTLY IN SQL — a migration, or an edit in the Supabase
 * dashboard — invalidates nothing, so it can still be served stale for up to an
 * hour. That is how V54 was found in the first place. It is acceptable because
 * it is a developer action with a developer remedy, and unacceptable to leave
 * undocumented, which is why it is written here and in the register rather than
 * discovered again in six months.
 */
const CONTENT_TAG_PREFIX = 'sb:';

/** The cache tag for a PostgREST resource. Mutations invalidate these. */
export function contentTag(resource: string): string {
  return `${CONTENT_TAG_PREFIX}${resource}`;
}

/**
 * Tags each read with the view it queried, so `revalidateTag` can reach it.
 *
 * The resource name is taken from the request URL rather than passed in by each
 * call site, because a tag that has to be remembered at fifty call sites is a
 * tag that will be forgotten at one — and the failure mode of forgetting is
 * silent staleness that looks exactly like the bug this fixes.
 */
const taggedFetch: typeof fetch = (input, init) => {
  const url =
    typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
  const match = /\/rest\/v1\/([A-Za-z0-9_]+)/.exec(url);
  const tags = match ? [contentTag(match[1])] : [];
  return fetch(input, { ...init, next: { tags } });
};

/**
 * Admin and write paths never read from the data cache at all. A cached answer
 * to "what does this row currently say" is a correctness bug in an editor, and
 * a cached answer to "does this certificate exist" is worse. These clients are
 * only used from `force-dynamic` admin routes and server actions, so this
 * cannot pull a public route out of static generation.
 */
const uncachedFetch: typeof fetch = (input, init) =>
  fetch(input, { ...init, cache: 'no-store' });

/**
 * Anon-key client. Cannot write anything: 0008 grants the anon role no policy
 * on any base table, and 0009 grants SELECT only on the public views.
 */
export function publicClient() {
  return createClient<Database>(
    required('NEXT_PUBLIC_SUPABASE_URL'),
    required('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    { auth: { persistSession: false }, global: { fetch: taggedFetch } },
  );
}

/**
 * Service-role client. RLS DOES NOT APPLY TO THIS CLIENT.
 *
 * Every call site is responsible for its own authorisation check, because the
 * database will not do it for you here. Use it for:
 *   - creating an order (the row must exist before WhatsApp opens)
 *   - the certificate lookup (never queried from a browser, brief 9.2)
 *   - writing audit_log and verification_attempts
 *
 * Never use it to serve ordinary page content — that is what publicClient is
 * for, and routing reads through it keeps the publication gates in 0009 doing
 * their job.
 */
export function serviceClient() {
  return createClient<Database>(
    required('NEXT_PUBLIC_SUPABASE_URL'),
    required('SUPABASE_SERVICE_ROLE_KEY'),
    {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: uncachedFetch },
    },
  );
}

/** True when Supabase is configured. Lets pages degrade rather than crash. */
export function isDatabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
