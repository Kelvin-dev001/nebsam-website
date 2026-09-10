import type { Metadata } from 'next';
import { adminActor } from '@/lib/admin/actor';
import { navForRole } from '@/lib/admin/nav';
import { AdminChrome } from '@/components/admin/admin-chrome';

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
 *
 * ── Why the layout reads the actor ──────────────────────────────────────────
 *
 * Sprint 12 gives the admin a navigation, and a navigation has to know which
 * role is looking at it. `adminActor()` rather than `requireStaff()`: the login
 * page lives inside this group too, and a layout that refused an unauthenticated
 * request would refuse the one page an unauthenticated visitor is supposed to
 * reach. No actor means no chrome, which is exactly right for a login screen.
 *
 * This is presentation only. The page beneath still calls `requireStaff()` with
 * its own minimum — see `lib/admin/nav.ts` on why a hidden link is not a
 * permission.
 */
export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const actor = await adminActor();

  return (
    <div data-section="light" className="min-h-screen bg-surface-raised">
      {/*
        Skip link, on the admin as well as the public site (PART 15). Staff use
        this software all day; a keyboard user should not tab through eleven nav
        entries on every page load to reach the table they came for.
      */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-control focus:bg-brand-signal-ink focus:px-4 focus:py-3 focus:text-white"
      >
        Skip to content
      </a>

      {actor ? (
        <AdminChrome groups={navForRole(actor.role)} role={actor.role} email={actor.email}>
          {children}
        </AdminChrome>
      ) : (
        <main id="main">{children}</main>
      )}
    </div>
  );
}
