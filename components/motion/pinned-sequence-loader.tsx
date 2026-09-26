'use client';

import * as React from 'react';
import { PIN_QUERY } from '@/lib/motion';
import { willPin } from './will-pin';

/**
 * The only pinned-stage code in a route's initial JavaScript, and it is small
 * on purpose: it decides, marks the page ready, and waits.
 *
 * 1. At hydration, before paint, it asks `willPin` and sets `data-pinned` to
 *    "on" or "off". CSS keys the whole pinned layout off that attribute, so the
 *    server HTML — stacked flow, every step visible — is what a crawler, a
 *    no-JS visitor and a reduced-motion visitor get.
 * 2. It adds `sc-ready` to <html> as soon as it has decided, pin or not. The
 *    scroll-craft harness waits for that class before it shoots.
 * 3. Only if the act pins, and only after load and idle, it watches for the act
 *    to come within about a viewport and then imports the enhancer. The
 *    enhancer is its own chunk and never touches LCP.
 *
 * If the pin conditions stop holding mid-visit — the window narrows, or the
 * reader turns on reduced motion — the act unpins and stays unpinned.
 */
export function PinnedSequenceLoader({ actId }: { actId: string }) {
  React.useLayoutEffect(() => {
    const html = document.documentElement;
    const act = document.getElementById(actId);
    const pin = willPin(act);
    if (act) act.dataset.pinned = pin ? 'on' : 'off';
    html.classList.add('sc-ready');
    if (!act || !pin) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;
    let io: IntersectionObserver | undefined;
    let idle: number | undefined;

    const arm = () => {
      io = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          io?.disconnect();
          import('./pinned-enhancer').then(({ enhance }) => {
            if (!cancelled && act.dataset.pinned === 'on') cleanup = enhance(act);
          });
        },
        { rootMargin: '100% 0px 100% 0px' },
      );
      io.observe(act);
    };
    const start = () => {
      if ('requestIdleCallback' in window)
        idle = window.requestIdleCallback(arm, { timeout: 2000 });
      else arm();
    };
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });

    const mq = window.matchMedia(PIN_QUERY);
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) return;
      act.dataset.pinned = 'off';
      cleanup?.();
      cleanup = undefined;
    };
    mq.addEventListener('change', onChange);

    return () => {
      cancelled = true;
      io?.disconnect();
      cleanup?.();
      mq.removeEventListener('change', onChange);
      window.removeEventListener('load', start);
      if (idle !== undefined && 'cancelIdleCallback' in window) window.cancelIdleCallback(idle);
    };
  }, [actId]);

  return null;
}
