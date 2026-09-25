'use client';

import * as React from 'react';
import { PIN_QUERY } from '@/lib/motion';

/**
 * Live readout of the two media queries the motion system keys off, in THIS
 * browser: the reduced-motion preference and PIN_QUERY (ADR-0006). Both update
 * as the window is resized or the OS setting changes, so the playground can be
 * used to watch the pin policy switch at 768px.
 *
 * The server renders "not checked" rather than guessing: a media query is a
 * property of the browser, and a server-side answer would be a fabrication.
 */
type Reading = { reduced: boolean; pins: boolean } | null;

function useMediaQuery(query: string): boolean | null {
  const [matches, setMatches] = React.useState<boolean | null>(null);
  React.useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

export function MotionStatus() {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const pins = useMediaQuery(PIN_QUERY);
  const reading: Reading = reduced === null || pins === null ? null : { reduced, pins };

  return (
    <dl className="grid gap-4 rounded-data border border-border-strong-inverse bg-brand-navy-raised p-5 font-mono text-mono md:grid-cols-2">
      <div>
        <dt className="text-label uppercase tracking-[0.08em] text-text-secondary-inverse">
          prefers-reduced-motion
        </dt>
        <dd className="mt-2 text-text-inverse" data-testid="status-reduced">
          {reading === null
            ? 'not checked — needs JavaScript'
            : reading.reduced
              ? 'reduce'
              : 'no-preference'}
        </dd>
      </div>
      <div>
        <dt className="text-label uppercase tracking-[0.08em] text-text-secondary-inverse">
          PIN_QUERY in this browser
        </dt>
        <dd className="mt-2 text-text-inverse" data-testid="status-pin">
          {reading === null
            ? 'not checked — needs JavaScript'
            : reading.pins
              ? 'matches — a pinned stage would pin'
              : 'no match — stacked flow with reveals'}
        </dd>
      </div>
    </dl>
  );
}
