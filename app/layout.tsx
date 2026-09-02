import './globals.css';
import { rootMetadata } from '@/lib/seo/metadata';

/**
 * ROOT LAYOUT — deliberately minimal.
 *
 * It carries only what EVERY route needs regardless of audience: the document,
 * the fonts, and the skip link.
 *
 * The public marketing chrome (header, footer, WhatsApp action, cookie bar,
 * Organization/WebSite JSON-LD) lives in `app/(site)/layout.tsx`, not here.
 * That split is not stylistic — a route group nests INSIDE the root layout and
 * cannot replace it, so chrome placed here would render on `/admin` too. It
 * did, and the admin sign-in page shipped with a marketing nav and a floating
 * WhatsApp button over it until this was fixed.
 *
 * Structure now matches docs/PROJECT_ARCHITECTURE.md §2:
 *   app/(site)   public — chrome, schema, consent
 *   app/(admin)  staff  — its own chrome, noindex, auth-gated
 */

/**
 * FONTS ARE SELF-HOSTED, and declared in `app/globals.css` rather than loaded
 * through `next/font`.
 *
 * The switch was made in Sprint 4 to close register item V41. `next/font`
 * emits no `<link rel="preload" as="font">` — verified against both the
 * `variable` and `className` forms — and the missing preload was the
 * measurable cause of the homepage failing its LCP budget: the LCP element is
 * hero text, and it repainted only when the webfont arrived, which the browser
 * could not begin fetching until the stylesheet had been parsed.
 *
 * Self-hosting from `public/fonts/` gives stable paths, which is what makes
 * the two preload links below possible. Everything else about the type system
 * is unchanged: same two families, same two delivered files, same
 * metric-matched fallbacks.
 */

export const metadata = rootMetadata;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-KE">
      <head>
        {/*
          The reason this file changed. Only the two LATIN subsets are
          preloaded — they are the only faces a reader of English or Kiswahili
          actually downloads, and preloading a subset nobody fetches would cost
          bandwidth on exactly the connection this site is built for.

          `crossOrigin` is required even though these are same-origin: font
          requests are CORS-mode by specification, and a preload without it
          fetches the file a second time rather than priming the cache.
        */}
        <link
          rel="preload"
          href="/fonts/archivo-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/plex-mono-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-surface font-sans text-body text-text-primary antialiased">
        {/*
          Skip link (WCAG 2.4.1). Deliberately NOT `sr-only` +
          `focus:not-sr-only` — that pairing relies on a specificity race
          between two utilities and was verified failing here, leaving the link
          clipped to 1x1 while focused. This element is always laid out and
          sits above the viewport until focused, which has no race to lose.
        */}
        <a
          href="#main"
          className="absolute left-4 top-0 z-50 -translate-y-full rounded-control bg-brand-signal-ink px-4 py-3 text-white transition-transform duration-micro ease-in-out-quad focus:translate-y-4 motion-reduce:transition-none"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
