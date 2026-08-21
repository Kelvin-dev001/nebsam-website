'use client';

import * as React from 'react';
import { useReducedMotion } from '@/components/motion/use-reduced-motion';
import { DURATION, EASE, JAM_SEQUENCE } from '@/lib/motion';

/**
 * THE SIGNATURE ELEMENT — "Jamming". Brief 6.4, direction B.
 *
 * ── The contract that matters ────────────────────────────────────────────────
 * The RESOLVED state ("anti-jammer armed") is the DEFAULT RENDERED DOM. It is
 * what the server sends, what a crawler reads, what renders with JS disabled,
 * what a reduced-motion visitor sees, and where the sequence ends. The
 * degradation is progressive enhancement layered on top — it is not the thing
 * that produces the resolved state.
 *
 * A visitor who scrolls away at second two has still been served correct,
 * complete markup. Nothing here is load-bearing for meaning.
 *
 * ── The rule from brief 6.5 ─────────────────────────────────────────────────
 * Demonstration telemetry must use an obviously illustrative plate, must be
 * labelled where it could be mistaken for live data, and must never be
 * described as real-time fleet status. KXX 000X is not a valid Kenyan
 * registration. The caption is not optional.
 *
 * ── Domain note ─────────────────────────────────────────────────────────────
 * A GSM jammer blocks the uplink, not GPS reception — so GPS stays healthy
 * while GSM collapses. That asymmetry is the honest picture and it is why the
 * device can still know where it is while it cannot report.
 */

type Phase = 'resolved' | 'healthy' | 'degrading' | 'jammed';

const PLATE = 'KXX 000X'; // illustrative — not a valid Kenyan registration

interface PhaseView {
  gsm: number; // 0-4 bars
  gps: number; // 0-3 bars
  fix: string;
  status: string;
  tone: 'ok' | 'warn';
}

const VIEW: Record<Phase, PhaseView> = {
  healthy: { gsm: 4, gps: 3, fix: '0:02', status: 'Link OK', tone: 'ok' },
  degrading: { gsm: 2, gps: 3, fix: '0:09', status: 'Signal degrading', tone: 'warn' },
  jammed: { gsm: 0, gps: 3, fix: '1:47', status: 'Signal jammed', tone: 'warn' },
  resolved: { gsm: 0, gps: 3, fix: '1:47', status: 'Anti-jammer armed · Alert sent', tone: 'ok' },
};

function Bars({ value, max, label }: { value: number; max: number; label: string }) {
  return (
    <span className="inline-flex items-end gap-[2px]" role="img" aria-label={`${label}: ${value} of ${max}`}>
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="w-[3.5px] rounded-[1px] bg-current"
          style={{
            height: `${6 + i * 3.5}px`,
            opacity: i < value ? 1 : 0.22,
            transition: `opacity ${DURATION.micro}ms ${EASE.linear}`,
          }}
        />
      ))}
    </span>
  );
}

export function SignalReadout() {
  const reduced = useReducedMotion();
  // Default = resolved. This is what SSR emits.
  const [phase, setPhase] = React.useState<Phase>('resolved');

  React.useEffect(() => {
    if (reduced) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, p: Phase) => timers.push(setTimeout(() => setPhase(p), ms));

    const t0 = 0;
    const t1 = JAM_SEQUENCE.hold;
    const t2 = t1 + JAM_SEQUENCE.degrade;
    const t3 = t2 + JAM_SEQUENCE.jammed;

    at(t0, 'healthy');
    at(t1, 'degrading');
    at(t2, 'jammed');
    at(t3, 'resolved'); // ends where it started — the DOM is never left altered

    return () => timers.forEach(clearTimeout);
  }, [reduced]);

  const v = VIEW[phase];
  const toneClass = v.tone === 'warn' ? 'text-state-warn' : 'text-state-ok';

  return (
    <div className="max-w-[42rem]">
      <div
        className="rounded-data border border-border-hairline-inverse bg-brand-navy-raised/70 p-3 font-mono text-mono tabular sm:p-4"
        // The live region announces only the resolved status, not each tick —
        // a screen reader must not be narrated at by a decorative sequence.
        aria-live="off"
      >
        {/* Field row wraps rather than scrolls. A permanent scrollbar across an
            instrument panel reads as broken chrome, and it was the first thing
            wrong in the 1440px screenshot. */}
        <div>
          <dl className="flex flex-wrap items-baseline gap-x-4 gap-y-1.5 text-text-secondary-inverse">
            <div className="flex items-baseline gap-1.5">
              <dt className="sr-only">Vehicle</dt>
              <dd className="text-text-inverse">{PLATE}</dd>
            </div>
            <Field label="Ign" value="On" />
            <Field label="Speed" value="62 km/h" />
            <Field label="Head" value="NNE" />
            <Field label="Fuel" value="71%" />
            <div className="flex items-baseline gap-1.5">
              <dt className="uppercase tracking-[0.06em] opacity-70">Fix</dt>
              <dd
                className={phase === 'jammed' || phase === 'resolved' ? 'text-state-warn' : 'text-text-inverse'}
                style={{ transition: `color ${DURATION.micro}ms ${EASE.linear}` }}
              >
                {v.fix}
              </dd>
            </div>
          </dl>
        </div>

        <hr className="my-3 border-t border-border-hairline-inverse" />

        {/* Status row */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className={`inline-flex items-center gap-2 ${toneClass}`}
            style={{ transition: `color ${DURATION.data}ms ${EASE.linear}` }}>
            <span className="uppercase tracking-[0.06em] opacity-70">GSM</span>
            <Bars value={v.gsm} max={4} label="GSM signal" />
          </span>

          <span className="inline-flex items-center gap-2 text-state-ok">
            <span className="uppercase tracking-[0.06em] opacity-70">GPS</span>
            <Bars value={v.gps} max={3} label="GPS signal" />
          </span>

          <span
            className={`inline-flex items-center gap-2 ${toneClass}`}
            style={{ transition: `color ${DURATION.data}ms ${EASE.linear}` }}
          >
            <span
              aria-hidden="true"
              className="inline-block h-1.5 w-1.5 rounded-full bg-current"
            />
            {v.status}
          </span>
        </div>
      </div>

      {/* Required by brief 6.5. Not optional, not small print. */}
      <p className="mt-2 font-mono text-label uppercase tracking-[0.08em] text-text-secondary-inverse">
        Illustration — not live customer data
      </p>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <dt className="uppercase tracking-[0.06em] opacity-70">{label}</dt>
      <dd className="text-text-inverse">{value}</dd>
    </div>
  );
}
