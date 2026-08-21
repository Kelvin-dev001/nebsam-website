'use client';

import * as React from 'react';
import { consentAnswered, denyConsent, grantConsent, hasConsent, loadGa4 } from '@/lib/analytics';
import { ROUTES } from '@/lib/constants';
import { Button } from '@/components/ui/button';

/**
 * Cookie notice with genuine consent gating (brief PART 16).
 *
 * "Genuine" means the analytics script is not loaded at all until Accept is
 * pressed — not loaded-then-suppressed. Decline is a real, equally weighted
 * choice, not a greyed-out link.
 *
 * ── Layout, and why it is a bar rather than a card ──────────────────────────
 * The first version was a bottom-LEFT card, and the 1440px screenshot showed it
 * sitting directly on top of the hero's primary WhatsApp CTA. That is a
 * conversion problem and a WCAG 2.2 2.4.11 problem (Focus Not Obscured) the
 * moment a keyboard user tabs to a button underneath it.
 *
 * A compact full-width bar occupies only the very bottom of the viewport, so it
 * covers no in-page action. It also sets `data-consent="open"` on the root
 * element, which the floating WhatsApp action reads to lift itself clear —
 * two fixed elements that would otherwise fight for the same corner.
 *
 * CLS: it is `fixed`, so it displaces nothing when it appears.
 */
export function CookieNotice() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (consentAnswered()) {
      if (hasConsent()) loadGa4();
      return;
    }
    setVisible(true);
  }, []);

  React.useEffect(() => {
    const root = document.documentElement;
    if (visible) root.setAttribute('data-consent', 'open');
    else root.removeAttribute('data-consent');
    return () => root.removeAttribute('data-consent');
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      data-section="dark"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border-strong-inverse bg-brand-navy text-text-inverse"
    >
      <div className="mx-auto flex w-full max-w-shell flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between md:gap-6 md:px-8">
        <p className="max-w-prose text-body-sm text-text-secondary-inverse">
          <span className="font-medium text-text-inverse">Cookies.</span> We use analytics cookies
          to understand which pages help people find what they need. Nothing loads until you
          choose, and we never put personal details in analytics.{' '}
          <a
            href={ROUTES.cookies}
            className="text-brand-signal underline decoration-1 underline-offset-4 transition-all duration-micro ease-in-out-quad hover:decoration-2"
          >
            Read the notice
          </a>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <Button
            variant="primary"
            onClick={() => {
              grantConsent();
              setVisible(false);
            }}
          >
            Accept analytics
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              denyConsent();
              setVisible(false);
            }}
          >
            Decline
          </Button>
        </div>
      </div>
    </div>
  );
}
