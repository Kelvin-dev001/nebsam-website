'use client';

import * as React from 'react';
import { DURATION, EASE } from '@/lib/motion';
import { useJamSequence, type JamPhase } from './use-jam-sequence';
import { Bars, Field, Status } from './readout-parts';

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
 *
 * ── Variants (Sprint 12b T4) ────────────────────────────────────────────────
 * `inline` is the original strip. `stage` is the same instrument drawn as the
 * home set piece's PEAK frame: the plate row matches the other frames, and the
 * status gets its own line, set larger from `lg` — so the one change the
 * reader should watch is the largest thing on the stage.
 */

const PLATE = 'KXX 000X'; // illustrative — not a valid Kenyan registration

interface PhaseView {
  gsm: number; // 0-4 bars
  gps: number; // 0-3 bars
  fix: string;
  status: string;
  tone: 'ok' | 'warn';
}

const VIEW: Record<JamPhase, PhaseView> = {
  healthy: { gsm: 4, gps: 3, fix: '0:02', status: 'Link OK', tone: 'ok' },
  degrading: { gsm: 2, gps: 3, fix: '0:09', status: 'Signal degrading', tone: 'warn' },
  jammed: { gsm: 0, gps: 3, fix: '1:47', status: 'Signal jammed', tone: 'warn' },
  resolved: { gsm: 0, gps: 3, fix: '1:47', status: 'Anti-jammer armed · Alert sent', tone: 'ok' },
};

export function SignalReadout({
  autoplay = true,
  showCaption = true,
  variant = 'inline',
}: {
  /** False when a parent picks the moment (the home set piece's PeakReadout). */
  autoplay?: boolean;
  /** False ONLY where the parent shows the same caption itself (brief 6.5). */
  showCaption?: boolean;
  variant?: 'inline' | 'stage';
} = {}) {
  const phase = useJamSequence(autoplay);
  const v = VIEW[phase];
  const toneClass = v.tone === 'warn' ? 'text-state-warn' : 'text-state-ok';
  // ASYMMETRIC, from the T4 review-animations gate. The alarm is a system
  // response, so it snaps: into warn at micro. At 900ms the words "Signal
  // degrading" sat in the OK colour for half a second, which the stage
  // variant's larger type made plain. Relief settles: back to OK at data speed.
  // The new style's duration governs a transition, so each direction gets its own.
  const toneMs = v.tone === 'warn' ? DURATION.micro : DURATION.data;
  const stage = variant === 'stage';
  const status = <Status text={v.status} toneClass={toneClass} toneMs={toneMs} large={stage} />;

  return (
    <div className={stage ? undefined : 'max-w-[42rem]'}>
      <div
        className="rounded-data border border-border-hairline-inverse bg-brand-navy-raised/70 p-3 font-mono text-mono tabular sm:p-4"
        // The live region announces only the resolved status, not each tick —
        // a screen reader must not be narrated at by a decorative sequence.
        aria-live="off"
      >
        {stage ? (
          <p className="mb-3 flex flex-wrap items-baseline gap-x-3 text-text-secondary-inverse">
            <span className="text-text-inverse">{PLATE}</span>
            <span className="uppercase tracking-[0.06em] opacity-70">Signal</span>
          </p>
        ) : null}

        {/* Field row wraps rather than scrolls. A permanent scrollbar across an
            instrument panel reads as broken chrome, and it was the first thing
            wrong in the 1440px screenshot. */}
        <dl className="flex flex-wrap items-baseline gap-x-4 gap-y-1.5 text-text-secondary-inverse">
          {stage ? null : (
            <div className="flex items-baseline gap-1.5">
              <dt className="sr-only">Vehicle</dt>
              <dd className="text-text-inverse">{PLATE}</dd>
            </div>
          )}
          <Field label="Ign" value="On" />
          <Field label="Speed" value="62 km/h" />
          <Field label="Head" value="NNE" />
          <Field label="Fuel" value="71%" />
          <div className="flex items-baseline gap-1.5">
            <dt className="uppercase tracking-[0.06em] opacity-70">Fix</dt>
            <dd
              className={
                phase === 'jammed' || phase === 'resolved' ? 'text-state-warn' : 'text-text-inverse'
              }
              style={{ transition: `color ${DURATION.micro}ms ${EASE.linear}` }}
            >
              {v.fix}
            </dd>
          </div>
        </dl>

        <hr className="my-3 border-t border-border-hairline-inverse" />

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <span
            className={`inline-flex items-center gap-2 ${toneClass}`}
            style={{ transition: `color ${toneMs}ms ${EASE.linear}` }}
          >
            <span className="uppercase tracking-[0.06em] opacity-70">GSM</span>
            <Bars value={v.gsm} max={4} label="GSM signal" />
          </span>

          <span className="inline-flex items-center gap-2 text-state-ok">
            <span className="uppercase tracking-[0.06em] opacity-70">GPS</span>
            <Bars value={v.gps} max={3} label="GPS signal" />
          </span>

          {stage ? null : status}
        </div>

        {stage ? <p className="mt-4 lg:text-h3">{status}</p> : null}
      </div>

      {/* Required by brief 6.5. Not optional, not small print. Suppressed only
          where the surrounding component prints the same caption itself. */}
      {showCaption ? (
        <p className="mt-2 font-mono text-label uppercase tracking-[0.08em] text-text-secondary-inverse">
          Illustration — not live customer data
        </p>
      ) : null}
    </div>
  );
}
