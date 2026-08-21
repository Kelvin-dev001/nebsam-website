import { Archivo, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { WhatsAppButton } from '@/components/layout/whatsapp-button';
import { CookieNotice } from '@/components/consent/cookie-notice';
import { JsonLd } from '@/components/seo/json-ld';
import { rootMetadata } from '@/lib/seo/metadata';
import { jsonLdGraph, organizationSchema, websiteSchema } from '@/lib/seo/schema';

/**
 * TWO families, TWO files delivered — against a PART 14 budget of three.
 *
 * Display and body are the same superfamily separated by OPTICAL WIDTH, not by
 * a second family. Archivo carries a `wdth` axis, so one variable file gives
 * both the expanded display cut and the normal body cut.
 *
 * `preload: true` is explicit rather than relying on the default (register
 * V41): the display headline is the likely LCP element, and without a preload
 * the font is only discovered after CSS parses.
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
  // Organization and WebSite are global — every page carries them, server
  // rendered, in the HTML the crawler receives.
  const graph = jsonLdGraph([organizationSchema(), websiteSchema()]);

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

        <JsonLd json={graph} />

        <Header />
        {children}
        <Footer />

        <WhatsAppButton />
        <CookieNotice />
      </body>
    </html>
  );
}
