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
  { source: '/services/fuel-monitoring', destination: '/solutions/fuel-monitoring', permanent: true },
  { source: '/services/radio-calls', destination: '/solutions/radio-communication', permanent: true },
  {
    source: '/services/vehicle-video-telematics',
    destination: '/solutions/ai-video-telematics',
    permanent: true,
  },
  { source: '/services/speed-governors', destination: '/solutions/speed-governors', permanent: true },
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
  { source: '/team', destination: '/about/team', permanent: true },
  { source: '/clients', destination: '/about/partners', permanent: true },

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
 * CSP ships REPORT-ONLY in Sprint 2 and is enforced before Sprint 15, so we
 * find out what it breaks without breaking it. 'unsafe-inline' is present for
 * styles because Tailwind and next/font emit inline style, and for scripts
 * because Next's bootstrap is inline — both are removed when the policy is
 * enforced and nonces are wired in.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.google.com",
  "font-src 'self'",
  "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com",
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
      { key: 'Content-Security-Policy-Report-Only', value: csp },
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

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  redirects,
  headers,
};

export default nextConfig;
