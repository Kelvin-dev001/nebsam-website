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
/**
 * CMS REDIRECTS, cached in module scope.
 *
 * A slug rename writes a row to `redirects` (migration 0030), and this is what
 * serves it. The static 301 map in next.config.mjs is compiled at build time
 * and cannot carry a redirect an editor creates at 3pm on a Tuesday.
 *
 * THE CACHE IS THE POINT. Querying the database on every request would put a
 * round trip in front of every page load, which is unaffordable on a 2.5s LCP
 * budget for an audience on mobile data. The map is fetched at most once a
 * minute per running instance; a rename is therefore live within a minute
 * rather than instantly, which is the right trade for a rare operation.
 *
 * Failure is silent by design: if the lookup errors, the request continues to
 * normal routing. A redirect table being unreachable must not take the site
 * down.
 */
let redirectCache: { map: Map<string, { to: string; code: number }>; at: number } | null = null;
const REDIRECT_TTL_MS = 60_000;

async function cmsRedirect(pathname: string): Promise<{ to: string; code: number } | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  const fresh = redirectCache && Date.now() - redirectCache.at < REDIRECT_TTL_MS;
  if (!fresh) {
    try {
      const res = await fetch(`${url}/rest/v1/redirects?select=from_path,to_path,status_code`, {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        cache: 'no-store',
      });
      if (!res.ok) return redirectCache?.map.get(pathname) ?? null;
      const rows: { from_path: string; to_path: string; status_code: number }[] = await res.json();
      redirectCache = {
        at: Date.now(),
        map: new Map(rows.map((r) => [r.from_path, { to: r.to_path, code: r.status_code }])),
      };
    } catch {
      return redirectCache?.map.get(pathname) ?? null;
    }
  }
  return redirectCache?.map.get(pathname) ?? null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /**
   * ANYTHING THAT IS NOT /admin IS HANDLED HERE AND RETURNS EARLY.
   *
   * This early return is load-bearing. The matcher below uses `:path*`, which
   * matches the bare index path as well as its children, so `/solutions` enters
   * this function too. Without returning, those requests fell through to the
   * admin auth gate underneath and were redirected to /admin/login — verified:
   * /solutions, /products and /industries all answered 307 until this was
   * added. A middleware that silently redirects three index pages to a login
   * screen is the kind of fault that reaches production looking like a routing
   * problem.
   */
  if (!pathname.startsWith('/admin')) {
    // Only a path that could have been renamed is worth a lookup.
    if (/^\/(solutions|products|industries|resources)\/.+/.test(pathname)) {
      const hit = await cmsRedirect(pathname);
      if (hit) return NextResponse.redirect(new URL(hit.to, request.url), hit.code);
    }
    return NextResponse.next();
  }

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
  matcher: [
    '/admin',
    '/admin/((?!login).*)',
    // Content paths, so a CMS slug rename keeps the old URL working.
    '/solutions/:path*',
    '/products/:path*',
    '/industries/:path*',
    '/resources/:path*',
  ],
};
