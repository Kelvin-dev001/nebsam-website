'use client';

import * as React from 'react';
import { PRIMARY_NAV, FOOTER_SUPPORT } from './nav-data';
import { CONTACT, whatsappUrl } from '@/lib/company';

/**
 * Mobile navigation — closes register item V42.
 *
 * The Sprint 1 prototype hid the nav below `md` with nothing behind it, which
 * was survivable for a one-screen prototype and would have stranded a phone
 * user the moment real routes existed.
 *
 * Accessibility contract (brief PART 15, WCAG 2.2):
 *  - focus is trapped inside the panel while open, and restored to the trigger
 *    on close
 *  - Escape closes
 *  - the trigger carries aria-expanded and aria-controls
 *  - background scroll is locked so the page behind cannot be lost
 *  - the panel is a real <dialog>-like region with aria-modal and a label
 *  - every target is >= 44px
 *
 * It is a disclosure list rather than nested flyouts: on a phone, a
 * hover-dependent mega menu is unusable and a deep tree is worse than a long
 * scroll.
 */
export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);

  // Lock background scroll while open.
  React.useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Escape to close, and trap Tab inside the panel.
  React.useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== 'Tab') return;

      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  /**
   * Move focus into the panel on open, and back to the trigger on close.
   *
   * Two things this gets right that the obvious version does not:
   *
   *  - It focuses the PANEL itself (tabIndex -1) rather than hunting for a
   *    first focusable child. Querying for a child was verified failing here —
   *    focus stayed on the document body — and it is fragile besides, because
   *    it breaks the moment the panel's first element changes.
   *  - It only restores focus to the trigger if the panel was actually open.
   *    Without that guard the close-branch fires on first mount and steals
   *    focus to the Menu button as soon as the page loads.
   */
  const hasOpened = React.useRef(false);
  React.useEffect(() => {
    if (open) {
      hasOpened.current = true;
      panelRef.current?.focus({ preventScroll: true });
      return;
    }
    if (hasOpened.current) {
      triggerRef.current?.focus({ preventScroll: true });
    }
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-control border border-border-strong-inverse px-3 text-body-sm text-text-inverse transition-colors duration-micro ease-in-out-quad hover:bg-brand-navy-raised lg:hidden"
      >
        <span aria-hidden="true" className="flex flex-col gap-[3px]">
          <span className="block h-[2px] w-4 bg-current" />
          <span className="block h-[2px] w-4 bg-current" />
          <span className="block h-[2px] w-4 bg-current" />
        </span>
        Menu
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          data-section="dark"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
        >
          <button
            type="button"
            aria-label="Close navigation"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="absolute inset-0 h-full w-full cursor-default bg-black/60"
          />

          <div
            ref={panelRef}
            id="mobile-nav-panel"
            tabIndex={-1}
            className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col overflow-y-auto border-l border-border-hairline-inverse bg-brand-navy"
          >
            <div className="flex items-center justify-between border-b border-border-hairline-inverse px-5 py-3">
              <span className="font-mono text-label uppercase tracking-[0.08em] text-text-secondary-inverse">
                Menu
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="min-h-[44px] rounded-control px-3 text-body-sm text-text-inverse transition-colors duration-micro ease-in-out-quad hover:bg-brand-navy-raised"
              >
                Close
              </button>
            </div>

            <nav aria-label="Primary" className="flex-1 px-5 py-4">
              <ul className="flex flex-col gap-1">
                {PRIMARY_NAV.map((item) => (
                  <li key={item.label} className="border-b border-border-hairline-inverse py-1">
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex min-h-[44px] items-center text-body-lg text-text-inverse"
                    >
                      {item.label}
                    </a>
                    {item.children ? (
                      <ul className="mb-2 flex flex-col gap-0.5 pl-3">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <a
                              href={child.href}
                              onClick={() => setOpen(false)}
                              className="flex min-h-[44px] items-center text-body-sm text-text-secondary-inverse transition-colors duration-micro ease-in-out-quad hover:text-text-inverse"
                            >
                              {child.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
                {FOOTER_SUPPORT.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex min-h-[44px] items-center text-body text-text-secondary-inverse transition-colors duration-micro ease-in-out-quad hover:text-text-inverse"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="border-t border-border-hairline-inverse px-5 py-4">
              <a
                href={whatsappUrl()}
                className="flex min-h-[52px] items-center justify-center rounded-control border border-brand-signal bg-brand-signal-ink px-6 text-body-lg font-medium text-white"
              >
                Talk to us on WhatsApp
              </a>
              <p className="mt-3 text-center font-mono text-label uppercase tracking-[0.08em] text-text-secondary-inverse">
                {CONTACT.hours}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
