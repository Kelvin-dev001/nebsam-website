import * as React from 'react';
import Link from 'next/link';

/**
 * ADMIN PRIMITIVES.
 *
 * Grouped in one file for the same reason `components/ui/field.tsx` groups its
 * four controls: these are variants of one idea rather than four separate
 * components, and splitting them means the next person adds a fifth heading
 * style instead of using the one that exists.
 *
 * None of them is a new visual language. The admin uses the same tokens as the
 * public site — `docs/DESIGN_SYSTEM.md` — because an admin that looks like a
 * different product is an admin whose contrast and focus rules get re-derived
 * from scratch and get them wrong.
 */

export function PageHeader({
  title,
  lead,
  action,
}: {
  title: string;
  lead?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="font-display text-h1">{title}</h1>
        {lead ? <p className="mt-1 max-w-prose text-body-sm text-text-secondary">{lead}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/**
 * A state marker, carried by TEXT as well as by colour.
 *
 * PART 15 and WCAG 1.4.1: colour is never the only carrier of meaning. Each
 * pill therefore reads its own state — "New", "Answered" — rather than being a
 * green dot somebody has to learn. The tint is redundant reinforcement, which
 * is what a tint is for.
 */
type PillTone = 'neutral' | 'ok' | 'warn' | 'alert' | 'live';

const PILL_TONES: Record<PillTone, string> = {
  neutral: 'border-border-strong text-text-secondary',
  ok: 'border-state-ok-ink text-state-ok-ink',
  warn: 'border-state-warn-ink text-state-warn-ink',
  alert: 'border-state-alert-ink text-state-alert-ink',
  live: 'border-brand-signal-ink text-brand-signal-ink',
};

export function StatusPill({ tone = 'neutral', children }: { tone?: PillTone; children: React.ReactNode }) {
  return (
    <span
      className={[
        'inline-flex shrink-0 items-center rounded-data border px-2 py-0.5',
        'font-mono text-label uppercase tracking-[0.08em]',
        PILL_TONES[tone],
      ].join(' ')}
    >
      {children}
    </span>
  );
}

/**
 * The result of a server action, announced.
 *
 * The live region is present from FIRST PAINT with an empty child, never added
 * to the DOM alongside its content — a region and its text arriving in the same
 * commit is frequently not announced at all, and the failure is silent. Same
 * construction as the public forms, for the same reason.
 */
export function ActionStatus({ result }: { result: { ok: boolean; message: string } | null }) {
  return (
    <div role="status" aria-live="polite" className="min-h-[1.5rem]">
      {result ? (
        <p
          className={[
            'text-body-sm',
            result.ok ? 'text-state-ok-ink' : 'text-state-alert-ink',
          ].join(' ')}
        >
          {result.message}
        </p>
      ) : null}
    </div>
  );
}

/**
 * An empty state that says what to do next.
 *
 * "No results" is a dead end. Every empty state on this admin either names the
 * action that would create the first row or explains why there are none —
 * `docs/CMS_ARCHITECTURE.md` §3, on validation messages that help rather than
 * report.
 */
export function EmptyState({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-8 max-w-prose rounded-panel border border-border-hairline bg-surface p-6">
      <h2 className="font-display-tight text-h3">{title}</h2>
      <div className="mt-2 text-body text-text-secondary">{children}</div>
    </div>
  );
}

/**
 * A horizontally scrollable table wrapper.
 *
 * The admin has genuinely wide tables and the audience includes people
 * approving things on a phone. PART 15 forbids the page body scrolling
 * sideways, so the overflow is contained here — and the container is
 * focusable with a label, because a scrollable region that a keyboard cannot
 * reach is a region a keyboard user cannot read.
 */
export function ScrollTable({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      role="region"
      aria-label={label}
      tabIndex={0}
      className="mt-6 overflow-x-auto rounded-panel border border-border-hairline bg-surface"
    >
      <table className="w-full min-w-[42rem] border-collapse text-left">{children}</table>
    </div>
  );
}

export function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      scope="col"
      className={[
        'border-b border-border-hairline px-4 py-3',
        'font-mono text-label uppercase tracking-[0.08em] text-text-secondary',
        className,
      ].join(' ')}
    >
      {children}
    </th>
  );
}

/** `children` is optional so a spacer cell in a `tfoot` row is `<Td />`. */
export function Td({
  children,
  className = '',
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={['border-b border-border-hairline px-4 py-3 align-top', className].join(' ')}>
      {children}
    </td>
  );
}

/**
 * A filter bar built from LINKS, not a client-side select.
 *
 * Filters are in the URL, so a staff member can bookmark "unanswered quotes",
 * the back button behaves, and the whole screen stays a server component. It
 * also works with JavaScript off, which the rest of this project has already
 * paid for once.
 */
export function FilterLinks({
  label,
  options,
  current,
  hrefFor,
}: {
  label: string;
  options: { value: string; label: string }[];
  current: string;
  hrefFor: (value: string) => string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-mono text-label uppercase tracking-[0.08em] text-text-secondary">
        {label}
      </span>
      {options.map((option) => {
        const active = option.value === current;
        return (
          <Link
            key={option.value}
            href={hrefFor(option.value)}
            aria-current={active ? 'true' : undefined}
            className={[
              'inline-flex min-h-11 items-center rounded-control border px-3 text-body-sm',
              active
                ? 'border-brand-signal-ink bg-brand-signal-ink font-medium text-white'
                : 'border-border-strong text-text-primary hover:bg-surface',
            ].join(' ')}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}
