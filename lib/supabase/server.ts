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
 * ── WHAT TAGGING ACTUALLY BUYS, having tested it rather than assumed ────────
 * Less than the first version of this comment claimed. The honest account
 * matters more than the tidy one.
 *
 * Tagging makes the data cache invalidatable — `revalidateTag` can reach these
 * entries, where previously nothing could. It is NOT, however, what makes the
 * CMS work. Measured against a running production build:
 *
 *   - after a direct database change, `revalidatePath` ALONE already produced
 *     fresh output, on both a dynamic article route and the statically
 *     generated blog index. Adding `revalidateTag` changed nothing observable.
 *   - a REBUILD is still stale. With the previous build cache present, a fresh
 *     build emitted the old value while the database held the new one. Tagging
 *     cannot fix that — nothing calls `revalidateTag` during a build.
 *
 * The tags are kept as correct hygiene and as the only handle that exists on
 * this cache: the ISR background-regeneration path could not be tested without
 * waiting out a full hour, and a tag costs nothing to carry. But they are not
 * load-bearing, and this comment should not pretend otherwise. What actually
 * broke publishing was `dynamicParams = false` on the article route, which
 * turned `revalidatePath` into a 404 — fixed where it belongs, in the route.
 *
 * ── Why not `cache: 'no-store'` ─────────────────────────────────────────────
 * Tried first, because "the page cache is already the cache" is a good
 * argument. MEASURED and rejected: it opts a route out of static generation,
 * and the build moved the homepage, /solutions, /products, /industries, all
 * three resources routes and /sitemap.xml from prerendered to server-rendered
 * on demand. Only routes with `generateStaticParams` survived. That trades a
 * staleness bug for a performance regression on every index page, for an
 * audience specified as a mid-range Android on metered data.
 *
 * ── The gap that remains, stated plainly ────────────────────────────────────
 * A rebuild within the revalidate window still serves the previous data-cache
 * entries. That is the ORIGINAL V54 symptom and it is NOT fixed here. It is
 * back in the register as an open item, because a deploy that does not reflect
 * the database is a launch-blocking property rather than a curiosity.
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
