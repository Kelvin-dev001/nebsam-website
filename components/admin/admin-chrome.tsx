'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { AdminNavGroup } from '@/lib/admin/nav';
import type { UserRole } from '@/types/content';

/**
 * ADMIN CHROME — the persistent navigation.
 *
 * A client component for exactly two reasons: it needs `usePathname` to mark
 * the current page, and the mobile drawer needs state. Everything else in the
 * admin stays a server component.
 *
 * ── Why the mobile drawer is not optional ───────────────────────────────────
 *
 * Brief 11.2 requires the admin to be "mobile-usable for approvals", and
 * `docs/CMS_ARCHITECTURE.md` §3 names the failure it prevents: approvals
 * blocked on someone being at a desk. A nav that only appears at 1024px turns
 * every approval into a trip to the office.
 *
 * The pattern is the one already proven in `components/layout/mobile-nav.tsx`:
 * Escape closes, focus returns to the trigger, `aria-expanded` and
 * `aria-controls` are wired, and the panel is a landmark rather than a div.
 */
export function AdminChrome({
  groups,
  role,
  email,
  children,
}: {
  groups: AdminNavGroup[];
  role: UserRole;
  email: string | null;
  /**
   * The page itself, rendered on the SERVER and passed through this client
   * component as a slot. Taking children this way is what keeps every admin
   * page a server component while the chrome around it holds state.
   */
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  // The drawer closes on navigation. Without this a staff member taps a link,
  // the page changes underneath, and the drawer is still covering it.
  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <header className="border-b border-border-hairline bg-surface">
        <div className="mx-auto flex w-full max-w-shell items-center justify-between gap-4 px-5 py-3 md:px-8">
          <div className="flex items-center gap-3">
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="admin-nav"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-control border border-border-strong lg:hidden"
            >
              <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
              <span aria-hidden="true" className="font-mono text-mono">
                {open ? '✕' : '≡'}
              </span>
            </button>
            <Link href="/admin" className="font-display-tight text-h4">
              Nebsam admin
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden font-mono text-mono uppercase tracking-[0.06em] text-text-secondary sm:inline">
              {email ?? 'signed in'} &middot; {role}
            </span>
            {/*
              A real form POST, not a fetch. Sign-out must work on the
              no-JavaScript path for the same reason the public forms do — and
              this one matters more, because a staff member on a borrowed phone
              needs the session gone.
            */}
            <form action="/admin/signout" method="post">
              <button
                type="submit"
                className="inline-flex min-h-11 items-center rounded-control border border-border-strong px-4 text-body-sm"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-shell gap-8 px-5 md:px-8">
        <nav
          id="admin-nav"
          aria-label="Admin sections"
          className={[
            'shrink-0 py-6 lg:block lg:w-56',
            open ? 'block w-full' : 'hidden',
          ].join(' ')}
        >
          {groups.map((group) => (
            <div key={group.heading} className="mb-6">
              <h2 className="font-mono text-label uppercase tracking-[0.08em] text-text-secondary">
                {group.heading}
              </h2>
              <ul className="mt-2">
                {group.items.map((item) => {
                  // Exact match for the dashboard, prefix match for the rest —
                  // otherwise `/admin` is marked current on every page.
                  const current =
                    item.href === '/admin'
                      ? pathname === '/admin'
                      : pathname.startsWith(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={current ? 'page' : undefined}
                        className={[
                          'flex min-h-11 items-center rounded-control px-3 text-body',
                          current
                            ? 'bg-brand-signal-ink font-medium text-white'
                            : 'text-text-primary hover:bg-surface',
                        ].join(' ')}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/*
          Hidden rather than unmounted while the mobile drawer is open. The page
          keeps its scroll position and any in-progress form state, so closing
          the drawer returns the staff member to exactly what they were doing —
          losing a half-typed reply to a menu tap is how a CMS earns distrust.
        */}
        <main
          id="main"
          className={['min-w-0 flex-1 py-6', open ? 'hidden lg:block' : 'block'].join(' ')}
        >
          {children}
        </main>
      </div>
    </>
  );
}
