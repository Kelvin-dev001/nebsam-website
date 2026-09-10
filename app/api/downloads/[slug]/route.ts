import { NextResponse } from 'next/server';
import { serviceClient } from '@/lib/supabase/server';

/**
 * PUBLIC DOWNLOAD DELIVERY.
 *
 * The one route on this project that hands a file from the private bucket to
 * somebody who is not signed in, and the conditions are narrow.
 *
 * ── The gate ────────────────────────────────────────────────────────────────
 *
 * BOTH `status = 'published'` AND `cleared_for_publication = true`. The public
 * view `public_downloads` already requires both, so this route reads THROUGH
 * that view rather than the base table — which means the rule is enforced in
 * one place and this route cannot drift from the page that links to it.
 *
 * `DATABASE_ARCHITECTURE.md` §7: "Both conditions, always."
 *
 * ── Why the file is not proxied ─────────────────────────────────────────────
 *
 * A redirect to a signed URL, not a stream through the server. Streaming a 4 MB
 * PDF through a serverless function costs the function's whole memory and
 * duration for every download, and on Vercel it is billed. The signed URL is
 * served by Supabase's CDN.
 *
 * The expiry is 300 seconds rather than the admin route's 60. A visitor on a
 * slow mobile connection has to be able to START the download before the URL
 * expires — the signature is checked when the request begins, not throughout —
 * and five minutes is the difference between a working download and a
 * mysteriously failing one on the exact connection profile this audience has.
 *
 * The trade is stated: someone can share a working link for five minutes. The
 * file is one a human administrator deliberately cleared for publication, so
 * five minutes of shareability is not a disclosure.
 *
 * ── The download counter ────────────────────────────────────────────────────
 *
 * `downloads.download_count` exists so the admin can see which documents are
 * actually wanted (brief PART 9.4). It is incremented here, and NOT awaited
 * before the redirect: a counter that delays a download is a counter that
 * makes the product worse to measure it.
 *
 * The increment goes through the `increment_download_count` function in
 * migration 0042 rather than a read-then-write, because PostgREST cannot
 * express `count = count + 1` and two simultaneous downloads would otherwise
 * record one. A failure is LOGGED rather than swallowed: if the function is
 * missing the counter silently stops, and a metric that quietly reads zero is
 * worse than one that is obviously broken.
 */
export const dynamic = 'force-dynamic';

const BUCKET = 'uploads';
const EXPIRES_SECONDS = 300;

/**
 * Increment the counter, and say so in the log if it could not be done.
 *
 * ── The cast, and the exact condition for deleting it ───────────────────────
 *
 * `types/database.ts` is GENERATED from the live schema, and it does not list
 * `increment_download_count` because migration 0042 has not been applied — the
 * project's `SUPABASE_ACCESS_TOKEN` returns 401, so neither
 * `npm run db:apply` nor `npm run db:types` can run. The type system is right
 * to refuse the call; the function genuinely is not there yet.
 *
 * So the cast is isolated to this one function rather than spread through the
 * route, and the failure it papers over is made LOUD instead of silent: until
 * 0042 is applied, every download logs a line saying the counter did not move.
 * A metric that quietly reads zero is worse than one that is obviously broken.
 *
 * DELETE THIS WRAPPER once 0042 is applied and `npm run db:types` has been
 * re-run — at that point `db.rpc('increment_download_count', …)` type-checks on
 * its own and the cast is no longer telling the truth about anything.
 */
async function countDownload(id: string, slug: string): Promise<void> {
  const db = serviceClient();
  try {
    const rpc = db.rpc as unknown as (
      name: string,
      args: Record<string, unknown>,
    ) => Promise<{ error: { message: string } | null }>;
    const { error } = await rpc('increment_download_count', { p_id: id });
    if (error) console.error(`[downloads] count not incremented for ${slug}: ${error.message}`);
  } catch (cause) {
    console.error(`[downloads] count not incremented for ${slug}:`, cause);
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const db = serviceClient();

  // Read through the PUBLIC VIEW. Both the published and the cleared condition
  // live in its definition, so this route cannot accidentally serve a file the
  // downloads page would refuse to list.
  const { data: row } = await db
    .from('public_downloads')
    .select('id, slug, title, file_path')
    .eq('slug', slug)
    .maybeSingle();

  // Every column on a VIEW is typed nullable by the generator, because a view
  // carries no NOT NULL guarantees. All three are required here, so all three
  // are checked — and the 404 covers "no such download", "not published", "not
  // cleared" and "no file attached" identically. Distinguishing them would tell
  // someone probing the route which documents exist but are being withheld,
  // which is information about unpublished material.
  if (!row?.file_path || !row.id || !row.slug) {
    return new NextResponse('Not found.', { status: 404 });
  }

  // The real extension, taken from the stored path. Hard-coding `.pdf` would
  // hand somebody a mis-named file the moment a non-PDF is attached.
  const extension = row.file_path.slice(row.file_path.lastIndexOf('.') + 1) || 'bin';

  const { data: signed, error } = await db.storage
    .from(BUCKET)
    .createSignedUrl(row.file_path, EXPIRES_SECONDS, {
      // Forces a save rather than an in-tab render, under the document's real
      // slug instead of the random storage path.
      download: `${row.slug}.${extension}`,
    });

  if (error || !signed) {
    return new NextResponse('That file could not be served just now.', { status: 502 });
  }

  void countDownload(row.id, row.slug);

  const response = NextResponse.redirect(signed.signedUrl, 307);
  response.headers.set('Cache-Control', 'no-store, max-age=0');
  return response;
}
