import * as React from 'react';

/**
 * Badge — a factual marker (a permit number, a standard, a state), never
 * decoration. PART 6.6 prohibits decorative devices that carry no meaning, so
 * a badge here always states something verifiable.
 *
 * `tone` maps to the state tokens. Those are TELEMETRY colours: a badge is the
 * only non-telemetry place they appear, and only to report a real status.
 */
type Tone = 'neutral' | 'ok' | 'warn' | 'alert';

const tones: Record<Tone, string> = {
  neutral:
    'border-border-strong text-text-secondary ' +
    '[[data-section=dark]_&]:border-border-strong-inverse [[data-section=dark]_&]:text-text-secondary-inverse',
  ok: 'border-state-ok-ink text-state-ok-ink [[data-section=dark]_&]:border-state-ok [[data-section=dark]_&]:text-state-ok',
  warn: 'border-state-warn-ink text-state-warn-ink [[data-section=dark]_&]:border-state-warn [[data-section=dark]_&]:text-state-warn',
  alert:
    'border-state-alert-ink text-state-alert-ink [[data-section=dark]_&]:border-state-alert [[data-section=dark]_&]:text-state-alert',
};

export function Badge({
  tone = 'neutral',
  children,
  className = '',
}: {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 rounded-data border px-2 py-1',
        'font-mono text-label uppercase tracking-[0.08em]',
        tones[tone],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  );
}
