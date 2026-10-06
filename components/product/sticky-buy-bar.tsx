'use client';

import * as React from 'react';
import { Button, ButtonLink } from '@/components/ui/button';
import { addToCart } from '@/lib/cart';
import { ROUTES } from '@/lib/constants';

/**
 * STICKY BUY BAR — phones only (Sprint 16).
 *
 * A product page is long, and on a phone the buy box scrolls away with the
 * hero. Once it has gone above the top of the screen, this bar slides up from
 * the bottom with the product name, the price and the same main action the buy
 * box has. The reader never has to scroll back to act. It leaves again as soon
 * as the buy box is back in view, and it never appears before the reader has
 * reached it.
 *
 * ── Glass, because content passes behind it (ADR-0008) ─────────────────────
 * Navy at 96% and no blur (surfaces.css `.glass-bar`): the opacity an outlined
 * control needs over a WHITE backdrop, the same as the header below 1024px.
 *
 * ── Accessibility ───────────────────────────────────────────────────────────
 * - Hidden by `visibility`, so a closed bar is out of the tab order and the
 *   accessibility tree, not merely off-screen.
 * - While it is open, `scroll-padding-bottom` keeps a focused element from
 *   being covered by it (WCAG 2.4.11, micro-interactions.css).
 * - Adding to the cart is announced, and the button becomes "View cart".
 * - It duplicates the buy box, which stays the full, server-rendered version.
 *   With JavaScript off, the bar simply never opens.
 *
 * ── The floating WhatsApp button ────────────────────────────────────────────
 * The root carries `data-buy-bar` while the bar is open. When the bar's action
 * is WhatsApp, the floating button steps aside (it would be the same action
 * twice). When it is the cart, the floating button lifts above the bar.
 */

type Action = { kind: 'cart'; productId: string } | { kind: 'whatsapp'; href: string };

export function StickyBuyBar({
  name,
  price,
  action,
}: {
  name: string;
  price: string;
  action: Action;
}) {
  const [open, setOpen] = React.useState(false);
  const [added, setAdded] = React.useState(false);

  React.useEffect(() => {
    const target = document.getElementById('buy-box');
    if (!target || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) => {
      // Open only once the buy box has gone ABOVE the screen, not before it.
      setOpen(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    const root = document.documentElement;
    if (open) root.setAttribute('data-buy-bar', action.kind);
    else root.removeAttribute('data-buy-bar');
    return () => root.removeAttribute('data-buy-bar');
  }, [open, action.kind]);

  // WCAG 2.4.11. `scroll-padding-bottom` alone is not enough: Chrome does not
  // scroll an element that is already partly on screen, so Tab could stop on a
  // link with its lower half under the bar (the footer's phone numbers did,
  // measured). While the bar is open, a focused element it would cover is
  // scrolled clear. Instant, not smooth: this answers a key press.
  React.useEffect(() => {
    if (!open) return;
    const bar = document.querySelector<HTMLElement>('.buy-bar');
    const onFocus = (event: FocusEvent) => {
      const el = event.target as HTMLElement | null;
      if (!bar || !el || bar.contains(el) || typeof el.getBoundingClientRect !== 'function') return;
      // One frame later: after the browser's own scroll to the focused element,
      // and only if the bar is still open (focusing the buy box closes it).
      requestAnimationFrame(() => {
        if (bar.dataset.open !== 'true') return;
        const overlap = el.getBoundingClientRect().bottom - bar.getBoundingClientRect().top;
        if (overlap > 0) window.scrollBy({ top: overlap + 12, behavior: 'instant' });
      });
    };
    document.addEventListener('focusin', onFocus);
    return () => document.removeEventListener('focusin', onFocus);
  }, [open]);

  return (
    <div
      className="buy-bar glass-bar md:hidden"
      data-open={open ? 'true' : 'false'}
      data-section="dark"
      role="region"
      aria-label={`Order ${name}`}
    >
      <div className="mx-auto flex w-full max-w-shell items-center gap-4 px-5 py-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-body-sm font-medium text-text-inverse">{name}</p>
          <p className="truncate text-body-sm text-text-secondary-inverse">{price}</p>
        </div>
        {action.kind === 'whatsapp' ? (
          <ButtonLink href={action.href} variant="primary" size="md" className="shrink-0">
            Price on WhatsApp
          </ButtonLink>
        ) : added ? (
          <ButtonLink href={ROUTES.cart} variant="primary" size="md" className="shrink-0">
            View cart
          </ButtonLink>
        ) : (
          <Button
            type="button"
            variant="primary"
            size="md"
            className="shrink-0"
            onClick={() => {
              addToCart(action.productId);
              setAdded(true);
            }}
          >
            Add to cart
          </Button>
        )}
        <span className="sr-only" role="status">
          {added ? `${name} added to your cart.` : ''}
        </span>
      </div>
    </div>
  );
}
