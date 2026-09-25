'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { DURATION, EASE } from '@/lib/motion';

/**
 * The four easings side by side. Every track runs over the SAME duration
 * (DURATION.data) so the curves are comparable: at their real durations
 * inOutQuad (160ms) would be over before the eye found it.
 *
 * Transform only. The runner is the track minus the marker's width, and it is
 * the runner that translates by 100% of itself — so the marker ends flush with
 * the right edge without animating `left` or `width`. The track CLIPS: the
 * translated runner's own box ends a full track-width past the edge, and a
 * transformed box still counts as scrollable overflow — unclipped, one run
 * gave the whole page a horizontal scrollbar (found in the T2 browser pass).
 *
 * Under reduced motion the globals.css backstop collapses the transition to
 * 0.01ms, so the markers jump. That is the correct behaviour and the reason
 * the result is stated in text below the tracks as well.
 */
const CURVES = [
  { key: 'outQuart', label: 'outQuart', value: EASE.outQuart },
  { key: 'outExpo', label: 'outExpo', value: EASE.outExpo },
  { key: 'inOutQuad', label: 'inOutQuad', value: EASE.inOutQuad },
  { key: 'linear', label: 'linear', value: EASE.linear },
] as const;

export function EasingDemo() {
  const [end, setEnd] = React.useState(false);

  return (
    <div>
      <ul className="space-y-4">
        {CURVES.map((c) => (
          <li key={c.key} className="grid grid-cols-[6.5rem_1fr] items-center gap-4">
            <span className="font-mono text-mono text-text-secondary">{c.label}</span>
            <span
              className="relative block h-6 overflow-hidden rounded-data border border-border-strong bg-surface"
              aria-hidden="true"
            >
              <span
                className="absolute inset-y-0 left-0 block w-[calc(100%-0.75rem)]"
                style={{
                  transform: end ? 'translateX(100%)' : 'translateX(0)',
                  transition: `transform ${DURATION.data}ms ${c.value}`,
                }}
              >
                <span className="absolute inset-y-1 left-0 block w-3 rounded-[1px] bg-brand-signal-ink" />
              </span>
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Button type="button" variant="secondary" onClick={() => setEnd((v) => !v)}>
          {end ? 'Run back' : 'Run all four'}
        </Button>
        <p className="text-body-sm text-text-secondary" aria-live="polite">
          {end ? 'Markers at the end.' : 'Markers at the start.'} Each run lasts {DURATION.data}ms.
        </p>
      </div>
    </div>
  );
}
