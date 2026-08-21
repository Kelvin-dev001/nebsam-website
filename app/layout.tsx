import type { Metadata } from 'next';
import { Archivo, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

/**
 * TWO families, TWO files — against a PART 14 budget of three.
 *
 * Display and body are the same superfamily separated by OPTICAL WIDTH, not by
 * a second family. Archivo carries a `wdth` axis, so one variable file gives
 * both the expanded display cut and the normal body cut.
 */
const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  display: 'swap',
  variable: '--font-archivo',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: '500',
  display: 'swap',
  variable: '--font-plex-mono',
});

export const metadata: Metadata = {
  title: 'Vehicle Tracking & Fleet Telematics in Kenya | Nebsam',
  description:
    'Nebsam Digital Solutions installs and supports anti-jamming vehicle tracking, fuel monitoring and video telematics across Kenya, from branches in Nairobi, Mombasa and Nakuru.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${plexMono.variable}`}>
      <body className="bg-surface font-sans text-body text-text-primary antialiased">
        {/*
          Skip link (WCAG 2.4.1).

          Deliberately NOT `sr-only` + `focus:not-sr-only`. That pairing relies
          on a specificity race between two utilities and was verified failing
          here — the link stayed clipped to 1x1 while focused, so it could never
          be perceived. This element is always laid out and simply sits above
          the viewport until focused, which has no race to lose.
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
