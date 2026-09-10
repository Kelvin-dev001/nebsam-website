import { redirect } from 'next/navigation';
import { requireStaff } from '@/lib/admin/actor';
import { serviceClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/format';
import { ROUTES } from '@/lib/constants';
import { PageHeader, StatusPill, EmptyState } from '@/components/admin/primitives';

/**
 * COMPANY REGISTRATIONS — the expiry board.
 *
 * `docs/CMS_ARCHITECTURE.md` §6.2: "Expiry drives both the dashboard reminder
 * and public filtering, so the site cannot display a lapsed permit even if
 * someone forgets."
 *
 * ── Why this screen exists at all ───────────────────────────────────────────
 *
 * Three of six registrations had already expired before a line of this rebuild
 * was written — CAK on 30 June 2025, both ODPC registrations on 27 May 2026 —
 * and PSRA's annual renewal is unconfirmed. Register items V27 to V30. The
 * public page contains the damage: `public_certifications` filters on
 * `expires_on > current_date` and treats a null expiry as not displayable, so a
 * lapsed instrument cannot be rendered.
 *
 * Containment is not resolution. A registration that quietly disappears from
 * the certifications page is a registration nobody notices has lapsed — the
 * failure just moves from "we showed an expired permit" to "we stopped
 * mentioning one". This screen is where it stays visible.
 *
 * ── What it deliberately does not do ────────────────────────────────────────
 *
 * It does not let anyone edit an expiry date. Renewing a registration is an
 * operations act with a document behind it, and a screen where a date can be
 * typed forward is a screen where a lapsed permit can be made to look current
 * in four keystrokes. Dates change by migration, reviewed in a pull request,
 * against the renewed instrument.
 */
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Certifications',
  robots: { index: false, follow: false, nocache: true },
};

const DAY = 86_400_000;

function standing(expiresOn: string | null): {
  tone: 'ok' | 'warn' | 'alert' | 'neutral';
  label: string;
  note: string;
} {
  if (!expiresOn) {
    return {
      tone: 'neutral',
      label: 'No expiry recorded',
      note: 'Not displayable. A null expiry fails closed — an unknown date on a regulatory instrument is not evidence that it is current.',
    };
  }

  const days = Math.floor((new Date(`${expiresOn}T00:00:00Z`).getTime() - Date.now()) / DAY);

  if (days < 0) {
    return {
      tone: 'alert',
      label: `Expired ${Math.abs(days)} days ago`,
      note: 'Hidden from the public certifications page. Renewal is an operations task — no code change brings it back, and none is needed once the new date is recorded.',
    };
  }
  if (days <= 90) {
    return {
      tone: 'warn',
      label: `Expires in ${days} days`,
      note: 'Still displayed. Start the renewal now — it disappears from the public page the day it lapses.',
    };
  }
  return { tone: 'ok', label: `Expires in ${days} days`, note: 'Displayed on the public page.' };
}

export default async function AdminCertificationsPage() {
  const actor = await requireStaff('viewer');
  if (!actor) redirect('/admin/login?reason=forbidden');

  const { data: rows, error } = await serviceClient()
    .from('certifications')
    .select('id, name, issuer, reference_number, effective_on, expires_on, scope_note, image, sort_order')
    // Nulls last, then soonest expiry first — the order somebody chasing
    // renewals wants to read.
    .order('expires_on', { ascending: true, nullsFirst: false })
    .order('sort_order', { ascending: true });

  return (
    <>
      <PageHeader
        title="Certifications"
        lead="Every regulatory instrument, and how long it has left. The public page cannot render a lapsed one; this is where a lapse stays visible."
      />

      {error ? (
        <EmptyState title="Certifications could not be read">
          <p>The database refused the query. That is a fault to fix.</p>
        </EmptyState>
      ) : !rows || rows.length === 0 ? (
        <EmptyState title="No registrations recorded">
          <p>Nothing is stored, so the public certifications page has nothing to show.</p>
        </EmptyState>
      ) : (
        <ul className="mt-8 flex flex-col gap-4">
          {rows.map((row) => {
            const state = standing(row.expires_on);
            return (
              <li
                key={row.id}
                className={[
                  'rounded-panel border bg-surface p-5',
                  state.tone === 'alert'
                    ? 'border-state-alert-ink/50'
                    : state.tone === 'warn'
                      ? 'border-state-warn-ink/40'
                      : 'border-border-hairline',
                ].join(' ')}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-display-tight text-h3">{row.name}</h2>
                    <p className="mt-1 text-body-sm text-text-secondary">{row.issuer}</p>
                  </div>
                  <StatusPill tone={state.tone}>{state.label}</StatusPill>
                </div>

                <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 font-mono text-label text-text-secondary">
                  {row.reference_number ? (
                    <div>
                      <dt className="sr-only">Reference</dt>
                      <dd>{row.reference_number}</dd>
                    </div>
                  ) : null}
                  {row.effective_on ? (
                    <div>
                      <dt className="sr-only">Effective from</dt>
                      <dd>from {formatDate(row.effective_on)}</dd>
                    </div>
                  ) : null}
                  {row.expires_on ? (
                    <div>
                      <dt className="sr-only">Expires</dt>
                      <dd>to {formatDate(row.expires_on)}</dd>
                    </div>
                  ) : null}
                </dl>

                <p className="mt-3 max-w-prose text-body-sm text-text-secondary">{state.note}</p>

                {/*
                  The scope note is surfaced because getting it wrong is one of
                  three accuracy traps the brief names by hand: the KEBS
                  instrument is a Permit to Use the Standardization Mark,
                  product-scoped to STREAMAX video telematics cameras, and
                  presenting it as company-wide accreditation is a
                  misrepresentation of a national standards body's decision.
                */}
                {row.scope_note ? (
                  <p className="mt-3 max-w-prose rounded-data border border-border-hairline p-3 text-body-sm">
                    <span className="font-medium">Scope:</span> {row.scope_note}
                  </p>
                ) : (
                  <p className="mt-3 max-w-prose text-body-sm text-state-warn-ink">
                    No scope recorded. If this instrument is product-scoped rather than
                    company-scoped, the public page must say so on its face.
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <p className="mt-10 max-w-prose text-body-sm text-text-secondary">
        Dates are not editable here. Renewing a registration is an operations act with a document
        behind it, and a field where a date can be typed forward is a field where a lapsed permit is
        made to look current in four keystrokes. The public page is{' '}
        <code className="font-mono text-mono">{ROUTES.certifications}</code>.
      </p>
    </>
  );
}
