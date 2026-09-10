import { NextResponse } from 'next/server';
import { requireStaff } from '@/lib/admin/actor';
import { serviceClient } from '@/lib/supabase/server';

/**
 * VIEW AN UPLOADED FILE, as an admin.
 *
 * `docs/SECURITY_REQUIREMENTS.md` §3: uploads are "served only through
 * short-lived signed URLs to admins. Never from a public path."
 *
 * ── Why the URL is signed here rather than stored ───────────────────────────
 *
 * A signed URL could be generated once and written into `media`. It would then
 * be a permanent public link to a private object, sitting in a table, defeating
 * the private bucket entirely — and it would be the kind of defeat that looks
 * like it is working.
 *
 * So the URL is minted per request, after the role check, and expires in sixty
 * seconds. The link a staff member copies out of their address bar stops working
 * within the minute, which is the point.
 *
 * ── Sixty seconds, and what that costs ──────────────────────────────────────
 *
 * Long enough for a browser to follow the redirect and render the file. Not
 * long enough to be pasted into a group chat usefully. It does mean a PDF left
 * open cannot be reloaded — the reader has to click through again — and that is
 * the correct side of the trade for a bucket that may hold an uncleared
 * document with a retired address on it.
 */
export const dynamic = 'force-dynamic';

const BUCKET = 'uploads';
const EXPIRES_SECONDS = 60;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  // `viewer` is enough to LOOK at a file. Uploading needs `editor` and deleting
  // needs `admin`; reading is the one operation everyone with an account may do,
  // and a viewer who cannot open an image cannot review anything.
  const actor = await requireStaff('viewer');
  if (!actor) return new NextResponse('Not permitted.', { status: 403 });

  const { id } = await params;

  const { data: row } = await serviceClient()
    .from('media')
    .select('path')
    .eq('id', id)
    .maybeSingle();

  if (!row) return new NextResponse('No such file.', { status: 404 });

  const { data: signed, error } = await serviceClient()
    .storage.from(BUCKET)
    .createSignedUrl(row.path, EXPIRES_SECONDS);

  if (error || !signed) {
    return new NextResponse('That file could not be opened.', { status: 500 });
  }

  // 307 rather than 302: the method is preserved, and nothing caches it.
  const response = NextResponse.redirect(signed.signedUrl, 307);
  response.headers.set('Cache-Control', 'no-store, max-age=0');
  return response;
}
