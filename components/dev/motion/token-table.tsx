import * as React from 'react';
import {
  DURATION,
  EASE,
  PIN_QUERY,
  REVEAL_TRAVEL_PX,
  STAGE,
  STAGGER_CAP,
  STAGGER_MS,
} from '@/lib/motion';

/**
 * Every motion token, read from lib/motion.ts at render time — so this table
 * cannot drift from the code the way a hand-copied one would. The CSS variable
 * and Tailwind columns name where the same value is mirrored.
 */
const DURATIONS = [
  {
    name: 'DURATION.press',
    value: DURATION.press,
    css: '--dur-press',
    tw: 'duration-press',
    level: 'L1 press',
  },
  {
    name: 'DURATION.micro',
    value: DURATION.micro,
    css: '--dur-micro',
    tw: 'duration-micro',
    level: 'L1 micro',
  },
  {
    name: 'DURATION.reveal',
    value: DURATION.reveal,
    css: '--dur-reveal',
    tw: 'duration-reveal',
    level: 'L2 reveal; L4 step change',
  },
  { name: 'DURATION.data', value: DURATION.data, css: '--dur-data', tw: '—', level: 'L3 data' },
] as const;

const EASINGS = [
  {
    name: 'EASE.outQuart',
    value: EASE.outQuart,
    tw: 'ease-out-quart',
    use: 'entrances, reveals, step changes',
  },
  {
    name: 'EASE.outExpo',
    value: EASE.outExpo,
    tw: 'ease-out-expo',
    use: 'cinematic, large travel',
  },
  {
    name: 'EASE.inOutQuad',
    value: EASE.inOutQuad,
    tw: 'ease-in-out-quad',
    use: 'state changes both ways',
  },
  {
    name: 'EASE.linear',
    value: EASE.linear,
    tw: 'ease-linear',
    use: 'data motion — linear on purpose',
  },
] as const;

const OTHER = [
  { name: 'STAGGER_MS / STAGGER_CAP', value: `${STAGGER_MS}ms, capped at ${STAGGER_CAP} siblings` },
  { name: 'REVEAL_TRAVEL_PX', value: `${REVEAL_TRAVEL_PX}px` },
  {
    name: 'STAGE.inactiveOpacity',
    value: `${STAGE.inactiveOpacity} (--stage-inactive, opacity-stage-inactive)`,
  },
  { name: 'PIN_QUERY', value: PIN_QUERY },
] as const;

const th =
  'py-2 pr-4 text-left font-mono text-label uppercase tracking-[0.08em] text-text-secondary';
const td = 'border-t border-border-hairline py-2 pr-4 align-top';

/**
 * Tables this wide cannot fit 360px, so each scrolls inside its own frame
 * rather than pushing the page sideways. A scrollable region must be reachable
 * by keyboard (WCAG 2.1.1), hence tabIndex and a label.
 */
function Frame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div role="region" aria-label={label} tabIndex={0} className="overflow-x-auto">
      {children}
    </div>
  );
}

function Caption({ children }: { children: React.ReactNode }) {
  return (
    <caption className="mb-3 text-left font-display-tight text-h3 md:text-md-h3">
      {children}
    </caption>
  );
}

export function TokenTable() {
  return (
    <div className="space-y-10">
      <Frame label="Durations">
        <table className="w-full min-w-[40rem] text-body-sm">
          <Caption>Durations</Caption>
          <thead>
            <tr>
              <th className={th}>Token</th>
              <th className={th}>Value</th>
              <th className={th}>CSS</th>
              <th className={th}>Tailwind</th>
              <th className={th}>Level</th>
            </tr>
          </thead>
          <tbody className="font-mono text-mono">
            {DURATIONS.map((d) => (
              <tr key={d.name}>
                <td className={td}>{d.name}</td>
                <td className={`${td} tabular`}>{d.value}ms</td>
                <td className={td}>{d.css}</td>
                <td className={td}>{d.tw}</td>
                <td className={`${td} font-sans text-body-sm`}>{d.level}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Frame>

      <Frame label="Easings">
        <table className="w-full min-w-[40rem] text-body-sm">
          <Caption>Easings</Caption>
          <thead>
            <tr>
              <th className={th}>Token</th>
              <th className={th}>Curve</th>
              <th className={th}>Tailwind</th>
              <th className={th}>Use</th>
            </tr>
          </thead>
          <tbody className="font-mono text-mono">
            {EASINGS.map((e) => (
              <tr key={e.name}>
                <td className={td}>{e.name}</td>
                <td className={td}>{e.value}</td>
                <td className={td}>{e.tw}</td>
                <td className={`${td} font-sans text-body-sm`}>{e.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Frame>

      <Frame label="Stagger, travel and the pinned stage">
        <table className="w-full min-w-[40rem] text-body-sm">
          <Caption>Stagger, travel and the pinned stage</Caption>
          <thead>
            <tr>
              <th className={th}>Token</th>
              <th className={th}>Value</th>
            </tr>
          </thead>
          <tbody className="font-mono text-mono">
            {OTHER.map((o) => (
              <tr key={o.name}>
                <td className={`${td} whitespace-nowrap`}>{o.name}</td>
                <td className={td}>{o.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Frame>
    </div>
  );
}
