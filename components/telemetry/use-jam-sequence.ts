'use client';

import * as React from 'react';
import { useReducedMotion } from '@/components/motion/use-reduced-motion';
import { JAM_SEQUENCE } from '@/lib/motion';

export type JamPhase = 'resolved' | 'healthy' | 'degrading' | 'jammed';

/**
 * The phase clock behind the signal readout: healthy → degrading → jammed →
 * resolved, once. Split out of signal-readout.tsx in Sprint 12b T4 so that
 * component stays a component.
 *
 * Starts and ends on 'resolved', which is what the server renders — the DOM is
 * never left altered. Never runs under reduced motion, or when `enabled` is
 * false (a parent is choosing the moment).
 */
export function useJamSequence(enabled: boolean): JamPhase {
  const reduced = useReducedMotion();
  const [phase, setPhase] = React.useState<JamPhase>('resolved');

  React.useEffect(() => {
    if (reduced || !enabled) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    let idle: number | undefined;
    const at = (ms: number, p: JamPhase) => timers.push(setTimeout(() => setPhase(p), ms));

    const run = () => {
      const t1 = JAM_SEQUENCE.hold;
      const t2 = t1 + JAM_SEQUENCE.degrade;
      const t3 = t2 + JAM_SEQUENCE.jammed;

      at(0, 'healthy');
      at(t1, 'degrading');
      at(t2, 'jammed');
      at(t3, 'resolved'); // ends where it started
    };

    /**
     * THE SEQUENCE WAITS FOR THE PAGE TO SETTLE. This is a performance fix, and
     * a measured one.
     *
     * Started eagerly, the four phase changes land at 0, 700, 1600 and 2700ms,
     * and each is a React state update that re-renders on the main thread.
     * Lighthouse mobile reported time-to-interactive and LCP at 2.9s in every
     * run — the last beat at 2700ms plus its render. A decorative animation was
     * setting the page's interactivity metric.
     *
     * Brief PART 14 is blunt about the audience: a mid-range Android on mobile
     * data the reader pays for by the megabyte. An illustration must not
     * compete with first paint on that device. So the sequence starts once the
     * browser is idle after load, which costs it nothing — the resolved state is
     * the default rendered DOM, so a visitor who never reaches idle still sees
     * the finished, meaningful readout rather than a blank panel.
     */
    const start = () => {
      if ('requestIdleCallback' in window) {
        idle = window.requestIdleCallback(run, { timeout: 3000 });
      } else {
        timers.push(setTimeout(run, 200));
      }
    };

    if (document.readyState === 'complete') {
      start();
    } else {
      window.addEventListener('load', start, { once: true });
    }

    return () => {
      window.removeEventListener('load', start);
      if (idle !== undefined && 'cancelIdleCallback' in window) window.cancelIdleCallback(idle);
      timers.forEach(clearTimeout);
    };
  }, [reduced, enabled]);

  return phase;
}
