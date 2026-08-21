import type { Metadata } from 'next';

/**
 * Admin route group.
 *
 * This layout REPLACES the public chrome — no marketing header, no footer, no
 * floating WhatsApp, no cookie bar. Admin is a different product with a
 * different job, and staff should not have to scroll past a sales CTA to reach
 * the inbox.
 *
 * `noindex, nofollow` here, `X-Robots-Tag` on the response in next.config.mjs,
 * and a Disallow in robots.ts. Three layers because being indexed is
 * embarrassing and cheap to prevent; none of them is a security control — that
 * is middleware plus RLS.
 */
export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-section="light" className="min-h-screen bg-surface-raised">
      {children}
    </div>
  );
}
