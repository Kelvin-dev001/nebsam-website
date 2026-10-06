/**
 * @type {import('next').NextConfig}
 *
 * THE 301 MAP LIVES HERE, and it ships in Sprint 2 rather than at launch.
 * `/services/*` holds whatever ranking equity the site has; losing it is the
 * one irreversible mistake available on this project. Shipping the redirects
 * now means they are exercised on every preview deployment for thirteen sprints
 * before they matter.
 *
 * Source of truth: docs/ROUTE_MAP.md §2.
 */

/**
 * Permanent redirects. `permanent: true` emits 308, which preserves the method
 * and is treated as a 301 equivalent by search engines.
 *
 * NOTE ON DESTINATIONS: several targets (/solutions/*, /products/*) are built
 * in Sprints 5–6. Until then a redirect correctly issues 308 to the right URL
 * and that URL 404s. That is the expected intermediate state — the redirect is
 * verified by status code and Location header, not by the destination existing.
 */
const redirects = async () => [
  // ─── From the live sitemap (docs/ROUTE_MAP.md §2.1) ──────────────────────
  { source: '/services', destination: '/solutions', permanent: true },
  { source: '/services/car-tracking', destination: '/solutions/vehicle-tracking', permanent: true },
  {
    source: '/services/fuel-monitoring',
    destination: '/solutions/fuel-monitoring',
    permanent: true,
  },
  {
    source: '/services/radio-calls',
    destination: '/solutions/radio-communication',
    permanent: true,
  },
  {
    source: '/services/vehicle-video-telematics',
    destination: '/solutions/ai-video-telematics',
    permanent: true,
  },
  {
    source: '/services/speed-governors',
    destination: '/solutions/speed-governors',
    permanent: true,
  },
  { source: '/services/car-alarms', destination: '/solutions/vehicle-security', permanent: true },

  // ─── Found in Sprint 0, absent from every existing inventory (§2.2) ──────
  // A live route with its own canonical, Service schema, OG image and ~20
  // images, missing from public/sitemap.xml, the captured URL list AND the
  // brief. The single most likely URL to have been lost at cutover.
  {
    source: '/services/electronic-cargo-tracking-system',
    destination: '/solutions/container-e-seal',
    permanent: true,
  },

  // ─── Dead navigation links on the old site (§2.3) ────────────────────────
  // Both were linked from the primary nav with no route behind them, so they
  // rendered a soft 404 at HTTP 200. If either was indexed, it was indexed as
  // a blank page.
  //
  // SPRINT 13 REPOINTED BOTH AT /about. Register item V95.
  //
  // They pointed at /about/team and /about/partners, neither of which has been
  // built — so each was a 301 into a 404, which the crawl audit's hop check
  // found. That is strictly worse than no redirect: it spends whatever
  // authority the old URL had on a dead end, and `check-redirects.mjs`
  // deliberately does not follow the hop (correct in Sprint 2, when several
  // targets were legitimately unbuilt), so nothing was watching.
  //
  // /about is the closest page that exists and genuinely answers "who are
  // these people", which is what both old URLs were for. When the two child
  // pages are built these can be repointed at them — a 301 changing its
  // destination costs nothing, whereas a 301 into a 404 costs the link.
  { source: '/team', destination: '/about', permanent: true },
  { source: '/clients', destination: '/about', permanent: true },

  // ─── Shop consolidation (§2.4) ───────────────────────────────────────────
  // Products and shop are ONE page type. Never let both resolve 200 — that is
  // the keyword-cannibalisation trap the merge exists to avoid.
  { source: '/shop', destination: '/products', permanent: true },
  { source: '/shop/:path*', destination: '/products/:path*', permanent: true },

  // ─── Catch-all for the old service namespace ─────────────────────────────
  // Anything under /services/* not mapped above lands on the solutions index
  // rather than a 404. Placed LAST so the specific rules win.
  { source: '/services/:path*', destination: '/solutions', permanent: true },
];

/**
 * Security headers (brief PART 16).
 *
 * CSP shipped REPORT-ONLY from Sprint 2, so we could find out what it would
 * break without breaking it. ENFORCED SINCE SPRINT 14.
 *
 * ── 'unsafe-inline' stays, and why ─────────────────────────────────────────
 *
 * The plan was to drop it for nonces at enforcement. In the App Router a nonce
 * must be minted per request, which makes every page dynamic: no static HTML,
 * no ISR, no CDN cache. That is an architecture change with a cost to LCP on
 * every route, so it is a decision for Kelvin (register V100), not a side
 * effect of enforcing. What enforcement already buys: no script, frame, image,
 * font or connection from an origin not listed here, no plugins, no <base>
 * rewrite, no form posting off-site, no framing.
 *
 * ── What each addition is for (checked in Sprint 14, not guessed) ──────────
 *
 * - img-src SUPABASE: the admin media library's thumbnails are <img> elements
 *   on a same-origin route that 307-redirects to a signed storage URL, and CSP
 *   checks the redirect target. Report-only never broke it, so nothing showed.
 * - Google Analytics 4, from Google's own CSP guidance: the loader script from
 *   *.googletagmanager.com, collection to *.google-analytics.com and
 *   *.analytics.google.com, and the image beacons. It loads only after
 *   consent, and only when NEXT_PUBLIC_GA4_MEASUREMENT_ID is set.
 * - 'unsafe-eval' in `next dev` ONLY: React Refresh evaluates code. A
 *   production build never carries it.
 * - upgrade-insecure-requests: back now that it takes effect. Browsers ignore
 *   it in a report-only policy and logged an error saying so on every page,
 *   which is why it was absent until now.
 *
 * Not needed, checked: the browser Supabase client is imported by nothing;
 * Turnstile is verified server-side and has no widget yet (V78); the WhatsApp
 * order opens a window rather than submitting a form, and downloads are links,
 * so `form-action 'self'` blocks no redirect. frame-src keeps google.com for a
 * maps embed, though none exists today.
 */
const SUPABASE_ORIGIN = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').origin;
  } catch {
    return '';
  }
})();
const IS_DEV = process.env.NODE_ENV === 'development';

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${IS_DEV ? " 'unsafe-eval'" : ''} https://*.googletagmanager.com`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https://www.google.com https://*.google-analytics.com https://*.googletagmanager.com${SUPABASE_ORIGIN ? ` ${SUPABASE_ORIGIN}` : ''}`,
  "font-src 'self'",
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
  "frame-src 'self' https://www.google.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ');

const headers = async () => [
  {
    source: '/:path*',
    headers: [
      { key: 'Content-Security-Policy', value: csp },
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-Frame-Options', value: 'DENY' },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
      },
    ],
  },
  {
    // Belt and braces alongside the robots rule and the route-level metadata.
    source: '/admin/:path*',
    headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
  },
  {
    /**
     * Fonts are served from `public/`, which Next does NOT strongly cache by
     * default — so without this a returning visitor re-downloads 100 KB of
     * woff2 on every navigation. On metered Kenyan mobile data that is the
     * whole point of the budget being spent twice.
     *
     * `immutable` is safe because these filenames are stable and their
     * contents never change in place: a font revision ships under a new
     * filename, exactly as the hashed `next/font` output used to.
     */
    source: '/fonts/:path*',
    headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
  },
];

/**
 * DEVELOPMENT-ONLY ROUTES are named `page.dev.tsx` and exist only in `next dev`
 * or in a build made with MOTION_PLAYGROUND=1.
 *
 * A runtime 404 was not enough. A route that is built still shapes the
 * bundles of every route it shares code with, and the /dev/motion playground
 * shares Reveal and the readout with the homepage. In Sprint 12b T3 that
 * split the homepage's code into a second chunk: one extra request, measured
 * at +74 ms LCP across nine paired Lighthouse runs, on a route already over
 * its LCP budget. Excluded from the build, the playground cannot touch a
 * public route at all.
 */
const includeDevRoutes =
  process.env.NODE_ENV !== 'production' || process.env.MOTION_PLAYGROUND === '1';

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  pageExtensions: ['tsx', 'ts', 'jsx', 'js', ...(includeDevRoutes ? ['dev.tsx'] : [])],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  redirects,
  headers,
};

export default nextConfig;
