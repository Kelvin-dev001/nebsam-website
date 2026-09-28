'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { SignalReadout } from '@/components/telemetry/signal-readout';
import { JAM_TOTAL_MS } from '@/lib/motion';

/**
 * Level 3 with the real signature readout. Remounting it replays the sequence
 * — the component starts on mount once the page has loaded, so a new key is a
 * clean restart with no extra API on the shipped component.
 *
 * The readout carries its own "Illustration — not live customer data"
 * caption and its illustrative KXX 000X plate (brief 6.5).
 */
export function DataDemo() {
  const [run, setRun] = React.useState(0);

  return (
    <div>
      <div className="max-w-md">
        <SignalReadout key={run} />
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Button type="button" variant="secondary" onClick={() => setRun((n) => n + 1)}>
          Replay the sequence
        </Button>
        <p className="text-body-sm text-text-secondary-inverse">
          {JAM_TOTAL_MS}ms end to end. Under reduced motion it never starts, and the resolved state
          shown is complete.
        </p>
      </div>
    </div>
  );
}
