import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**
 * Admin auth gate.
 *
 * Brief PART 16: "Admin routes protected by middleware AND RLS. No
 * client-side-only guards." This is the middleware half. It is NOT the security
 * boundary on its own — the boundary is RLS in migration 0008, which denies a
 * non-staff session at the database regardless of what any route does.
 *
 * Middleware exists to give an unauthenticated visitor a sensible redirect
 * instead of an empty page full of failed queries. Treat it as UX, and treat
 * RLS as security. If this file were deleted tomorrow, no data would leak.
 *
 * Role checks deliberately do NOT happen here. A JWT claim can be stale;
 * `profiles.role` read under RLS cannot. Per-role authorisation is enforced by
 * `is_staff()` in the policies.
 */
export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Supabase not configured yet (register V46). Fail CLOSED: send admin traffic
  // to the login page rather than letting an unauthenticated request through to
  // a route that assumes a session.
  if (!url || !key) {
    return NextResponse.redirect(new URL('/admin/login?reason=unconfigured', request.url));
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookies) => {
        cookies.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // getUser() revalidates against the auth server. getSession() reads the
  // cookie and would trust a forged one.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const login = new URL('/admin/login', request.url);
    login.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }

  return response;
}

export const config = {
  /**
   * /admin and everything under it EXCEPT /admin/login.
   *
   * Excluding the login page is not cosmetic: if the matcher covered it, an
   * unauthenticated visitor would be redirected to /admin/login, which would
   * match, which would redirect again — forever.
   */
  matcher: ['/admin', '/admin/((?!login).*)'],
};
