'use client';

import { CONTACT, whatsappUrl } from '@/lib/company';
import { EVENTS } from '@/lib/constants';
import { track } from '@/lib/analytics';

/**
 * Floating WhatsApp action.
 *
 * WhatsApp is #1 in the conversion hierarchy (brief 3.7), so it is the one
 * action present on every page. It is a real link, not a script-driven widget:
 * it works with JS disabled and it costs nothing to render.
 *
 * It lifts clear of the cookie bar while that is open — the two are the only
 * fixed elements on the page and they would otherwise share a corner. The
 * root element carries data-consent="open" for exactly this.
 *
 * The click fires `whatsapp_click` with the source page for funnel analysis.
 * No PII in the payload, and nothing fires before cookie consent — `track()`
 * enforces that, not this component.
 */
export function WhatsAppButton() {
  return (
    <a
      href={whatsappUrl()}
      onClick={() =>
        track(EVENTS.whatsappClick, {
          source: typeof window === 'undefined' ? 'unknown' : window.location.pathname,
          context: 'floating_button',
        })
      }
      className="fixed bottom-5 right-5 z-30 transition-[bottom] duration-micro ease-in-out-quad [html[data-consent=open]_&]:bottom-32 md:[html[data-consent=open]_&]:bottom-24 inline-flex min-h-[52px] items-center gap-2 rounded-control border border-brand-signal bg-brand-signal-ink px-5 text-body font-medium text-white shadow-lg transition-colors duration-micro ease-in-out-quad hover:bg-[#134aa8]"
    >
      <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-state-ok" />
      WhatsApp
      <span className="sr-only">
        {' '}
        — chat with Nebsam on {CONTACT.whatsapp.display}, {CONTACT.hours}
      </span>
    </a>
  );
}
