import { Archivo, IBM_Plex_Mono } from 'next/font/google';
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
 * TWO families, TWO files delivered — against a PART 14 budget of three.
 *
 * Display and body are the same superfamily separated by OPTICAL WIDTH.
 * Archivo carries a `wdth` axis, so one variable file gives both cuts.
 *
 * `preload: true` is explicit rather than left to the default (register V41),
 * though note it does not currently emit a preload link — see that item.
 */
const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  display: 'swap',
  preload: true,
  variable: '--font-archivo',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: '500',
  display: 'swap',
  preload: true,
  variable: '--font-plex-mono',
});

export const metadata = rootMetadata;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-KE" className={`${archivo.variable} ${plexMono.variable}`}>
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
