import * as React from 'react';

/**
 * A static instrument face for the set piece's stage frames 1-4, drawn to match
 * the signal readout (components/telemetry/signal-readout.tsx): the same panel,
 * the same mono field rows, the same illustrative plate. Type and CSS only —
 * zero image weight (memo D5).
 *
 * ILLUSTRATIVE (brief 6.5). The stage carries the visible caption "Illustration
 * — not live customer data"; nothing here is a real vehicle or a real reading.
 * No state-warn (amber) is used: the only amber in the sequence belongs to the
 * peak (docs/design/S12B_T1_TOKEN_PROPOSAL.md §4).
 */
export const PLATE = 'KXX 000X'; // not a valid Kenyan registration

export interface PanelRow {
  label: string;
  value: string;
  /** state-ok, for a genuine pass such as "Complies" */
  ok?: boolean;
}

export function TelemetryPanel({
  context,
  rows,
  status,
  children,
}: {
  context: string;
  rows: PanelRow[];
  status?: { text: string; ok?: boolean };
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-data border border-border-hairline-inverse bg-brand-navy-raised/70 p-3 font-mono text-mono tabular sm:p-4">
      <p className="flex flex-wrap items-baseline gap-x-3 text-text-secondary-inverse">
        <span className="text-text-inverse">{PLATE}</span>
        <span className="uppercase tracking-[0.06em] opacity-70">{context}</span>
      </p>

      {children ? <div className="mt-3">{children}</div> : null}

      <hr className="my-3 border-t border-border-hairline-inverse" />

      <dl className="grid gap-y-1.5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-4">
            <dt className="uppercase tracking-[0.06em] text-text-secondary-inverse opacity-70">
              {row.label}
            </dt>
            <dd className={row.ok ? 'text-state-ok' : 'text-text-inverse'}>{row.value}</dd>
          </div>
        ))}
      </dl>

      {status ? (
        <p
          className={`mt-3 inline-flex items-center gap-2 ${status.ok ? 'text-state-ok' : 'text-text-inverse'}`}
        >
          <span aria-hidden="true" className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
          {status.text}
        </p>
      ) : null}
    </div>
  );
}
