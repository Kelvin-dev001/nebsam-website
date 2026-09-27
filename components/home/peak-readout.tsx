'use client';

import * as React from 'react';
import { SignalReadout } from '@/components/telemetry/signal-readout';

/**
 * The set piece's peak frame: the jamming readout (ADR-0002's signature),
 * moved here from the hero under memo D3b = (b).
 *
 * It plays the sequence ONCE, at the moment the reader is looking at it:
 *  - pinned: when this frame becomes the active one (the enhancer sets
 *    `data-active` on the frame);
 *  - stacked flow: when the readout itself scrolls well into view.
 * Before that it shows the resolved state — the default rendered DOM, which is
 * also all a no-JS or reduced-motion visitor ever gets (SignalReadout refuses
 * to run under reduced motion regardless).
 *
 * Replaying is a remount with autoplay on. The sequence never loops.
 */
export function PeakReadout() {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [played, setPlayed] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || played) return;
    const frame = el.closest('[data-pinned-frame]');
    const act = el.closest('[data-sc-act]');
    const pinned = () => act?.getAttribute('data-pinned') === 'on';

    const mo = new MutationObserver(() => {
      if (pinned() && frame?.hasAttribute('data-active')) setPlayed(true);
    });
    if (frame) mo.observe(frame, { attributes: true, attributeFilter: ['data-active'] });

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !pinned()) setPlayed(true);
      },
      { threshold: 0.6 },
    );
    io.observe(el);

    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, [played]);

  return (
    <div ref={ref}>
      <SignalReadout
        key={played ? 'play' : 'rest'}
        autoplay={played}
        showCaption={false}
        variant="stage"
      />
    </div>
  );
}
