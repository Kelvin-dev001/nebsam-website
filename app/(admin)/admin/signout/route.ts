import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import { sessionClient } from '@/lib/admin/session';

/**
 * SIGN OUT.
 *
 * ── Why a route handler and not a server action ─────────────────────────────
 *
 * Because it must work with JavaScript off, and the chrome posts a plain HTML
 * form at it. A server action would do the same job with JavaScript on, and
 * register item V59 records a bound server action hanging the production server
 * outright on the no-JavaScript path under Next 15.5.23. A route handler has
 * none of that history.
 *
 * ── Why POST only ──────────────────────────────────────────────────────────
 *
 * A GET that ends a session can be triggered by any page that embeds an image
 * pointing at it — a nuisance rather than a breach, but a nuisance that looks
 * exactly like the software being broken. There is no GET export here, so one
 * answers 405.
 *
 * The redirect is 303. A 302 after a POST leaves the method up to the client;
 * 303 says plainly "now GET this", which is what turns the sign-out into a page
 * the staff member can safely refresh.
 */
export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const supabase = sessionClient(cookieStore);

  // `signOut` revokes the refresh token server-side and clears the cookies
  // through the setAll writer. Clearing the cookie alone would leave a working
  // refresh token in anyone's hands who had copied it.
  if (supabase) await supabase.auth.signOut();

  return NextResponse.redirect(new URL('/admin/login', request.url), 303);
}
