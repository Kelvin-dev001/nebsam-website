import { redirect } from 'next/navigation';
import { requireStaff } from '@/lib/admin/actor';
import { serviceClient } from '@/lib/supabase/server';
import { SPIKE_THRESHOLD_PER_HOUR } from '@/lib/admin/dashboard';
import { fromBytea } from '@/lib/verification/hashing';
import { PageHeader, StatusPill, EmptyState, ScrollTable, Th, Td } from '@/components/admin/primitives';

/**
 * THE VERIFICATION ATTEMPT LOG.
 *
 * `docs/SECURITY_REQUIREMENTS.md` §1.5 and brief 9.2: log every attempt and
 * surface a spike alert in admin, because "an enumeration attack looks like
 * ordinary traffic; you only see it if you are counting".
 *
 * Sprint 11 built the counting. This is the looking.
 *
 * ── What an administrator can and cannot see here ───────────────────────────
 *
 * Not one plate. `verification_attempts` stores `plate_hash` and `ip_hash`,
 * both keyed digests, and neither is reversible without the server secret —
 * "the log itself must not become the leak" (migration 0006). So this screen
 * shows SHAPES: how many attempts, in what pattern, from how many distinct
 * sources, against how many distinct plates, and how they ended.
 *
 * The first eight hex characters of a digest are shown as a correlation handle
 * so an analyst can say "these nineteen attempts are the same source". Eight
 * characters of a keyed HMAC identify nothing on their own and cannot be
 * reversed to an address or a registration.
 *
 * ── Reading the outcomes ────────────────────────────────────────────────────
 *
 * `not_found` in volume is the signature of enumeration: somebody working
 * through plates that do not have installations. `factor_failed` in volume
 * against FEW distinct plates is somebody who has a real plate and is guessing
 * the phone. `rate_limited` means the limiter is doing its job — and migration
 * 0039 exists precisely so a refusal is logged rather than vanishing, which is
 * what makes the count keep climbing while an attacker keeps trying.
 */
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Security',
  robots: { index: false, follow: false, nocache: true },
};

const OUTCOME_LABEL: Record<string, string> = {
  valid: 'Valid',
  expired: 'Expired',
  not_found: 'No such certificate',
  factor_failed: 'Wrong second factor',
  rate_limited: 'Refused — rate limited',
};

const OUTCOME_TONE: Record<string, 'ok' | 'warn' | 'alert' | 'neutral'> = {
  valid: 'ok',
  expired: 'neutral',
  not_found: 'warn',
  factor_failed: 'alert',
  rate_limited: 'alert',
};

/** Eight hex characters of a keyed digest. A handle for correlation, not an identity. */
function handle(value: unknown): string {
  const buffer = fromBytea(value);
  return buffer.length === 0 ? '—' : buffer.toString('hex').slice(0, 8);
}

export default async function AdminSecurityPage() {
  const actor = await requireStaff('admin');
  if (!actor) redirect('/admin/login?reason=forbidden');

  const db = serviceClient();
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  const [{ data: recent, error }, { count: lastHour }] = await Promise.all([
    db
      .from('verification_attempts')
      .select('id, ip_hash, plate_hash, outcome, created_at')
      .gt('created_at', since)
      .order('created_at', { ascending: false })
      .limit(300),
    db
      .from('verification_attempts')
      .select('id', { head: true, count: 'exact' })
      .gt('created_at', hourAgo),
  ]);

  const rows = recent ?? [];

  // Shapes, computed here rather than in six separate count queries. The rows
  // are already loaded and the arithmetic is cheaper than the round trips.
  const byOutcome = new Map<string, number>();
  const sources = new Set<string>();
  const plates = new Set<string>();
  const perSource = new Map<string, number>();

  for (const row of rows) {
    byOutcome.set(row.outcome, (byOutcome.get(row.outcome) ?? 0) + 1);
    const source = handle(row.ip_hash);
    const plate = handle(row.plate_hash);
    if (source !== '—') {
      sources.add(source);
      perSource.set(source, (perSource.get(source) ?? 0) + 1);
    }
    if (plate !== '—') plates.add(plate);
  }

  const busiest = [...perSource.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const spiking = (lastHour ?? 0) >= SPIKE_THRESHOLD_PER_HOUR;

  /**
   * The ratio that means enumeration.
   *
   * One person checking their own certificate produces roughly one attempt per
   * plate. Somebody working through a list produces many plates from few
   * sources. So attempts-per-distinct-plate near 1 with MANY distinct plates
   * from ONE source is the shape to worry about, and it is stated in words
   * rather than left as three numbers to interpret.
   */
  const concentrated = sources.size > 0 && plates.size / sources.size >= 10;

  return (
    <>
      <PageHeader
        title="Security"
        lead="Every certificate lookup attempted in the last 24 hours. No plate and no address is stored in readable form — these are shapes, not identities."
      />

      {spiking ? (
        <div
          role="alert"
          className="mt-6 max-w-prose rounded-panel border-2 border-state-alert-ink bg-surface p-5"
        >
          <h2 className="font-display-tight text-h3 text-state-alert-ink">
            {lastHour} attempts in the last hour
          </h2>
          <p className="mt-2 text-body">
            The normal band is well under {SPIKE_THRESHOLD_PER_HOUR}. Look at the source column
            below: a single handle repeating is one client, and many handles at once means the load
            is spread across addresses deliberately.
          </p>
        </div>
      ) : null}

      {concentrated ? (
        <div
          role="alert"
          className="mt-6 max-w-prose rounded-panel border border-state-alert-ink/50 bg-surface p-5"
        >
          <h2 className="font-display-tight text-h3">This looks like enumeration</h2>
          <p className="mt-2 text-body">
            {plates.size} distinct plates were tried from {sources.size} source
            {sources.size === 1 ? '' : 's'}. A customer checks their own vehicle; working through a
            list of registrations is what produces this ratio, and a plate is public information
            painted on the outside of every vehicle.
          </p>
        </div>
      ) : null}

      <ul className="mt-8 flex flex-wrap gap-3">
        <li className="rounded-panel border border-border-hairline bg-surface px-4 py-3">
          <span className="block font-display text-h3 tabular-nums">{rows.length}</span>
          <span className="text-body-sm text-text-secondary">attempts, 24 hours</span>
        </li>
        <li className="rounded-panel border border-border-hairline bg-surface px-4 py-3">
          <span className="block font-display text-h3 tabular-nums">{sources.size}</span>
          <span className="text-body-sm text-text-secondary">distinct sources</span>
        </li>
        <li className="rounded-panel border border-border-hairline bg-surface px-4 py-3">
          <span className="block font-display text-h3 tabular-nums">{plates.size}</span>
          <span className="text-body-sm text-text-secondary">distinct plates tried</span>
        </li>
        {[...byOutcome.entries()].map(([outcome, count]) => (
          <li
            key={outcome}
            className="rounded-panel border border-border-hairline bg-surface px-4 py-3"
          >
            <span className="block font-display text-h3 tabular-nums">{count}</span>
            <span className="text-body-sm text-text-secondary">
              {OUTCOME_LABEL[outcome] ?? outcome}
            </span>
          </li>
        ))}
      </ul>

      {busiest.length > 0 ? (
        <section className="mt-10">
          <h2 className="font-display-tight text-h3">Busiest sources</h2>
          <ul className="mt-3 flex flex-col gap-1">
            {busiest.map(([source, count]) => (
              <li key={source} className="font-mono text-mono text-text-secondary">
                {source} — {count} attempt{count === 1 ? '' : 's'}
                {count >= 10 ? (
                  <span className="ml-2 text-state-warn-ink">at or over the hourly limit</span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {error ? (
        <EmptyState title="The attempt log could not be read">
          <p>The database refused the query. That is a fault to fix.</p>
        </EmptyState>
      ) : rows.length === 0 ? (
        <EmptyState title="No lookups in the last 24 hours">
          <p>
            Nobody has tried to verify a certificate. That is the expected state on a site whose
            verification page is disallowed in <code className="font-mono text-mono">robots.txt</code>{' '}
            and reached mostly from a printed QR code.
          </p>
        </EmptyState>
      ) : (
        <ScrollTable label="Verification attempts">
          <thead>
            <tr>
              <Th>When</Th>
              <Th>Source</Th>
              <Th>Plate</Th>
              <Th>Outcome</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <Td className="font-mono text-mono text-text-secondary">
                  {new Date(row.created_at).toLocaleString('en-GB')}
                </Td>
                <Td className="font-mono text-mono">{handle(row.ip_hash)}</Td>
                <Td className="font-mono text-mono">{handle(row.plate_hash)}</Td>
                <Td>
                  <StatusPill tone={OUTCOME_TONE[row.outcome] ?? 'neutral'}>
                    {OUTCOME_LABEL[row.outcome] ?? row.outcome}
                  </StatusPill>
                </Td>
              </tr>
            ))}
          </tbody>
        </ScrollTable>
      )}

      <p className="mt-8 max-w-prose text-body-sm text-text-secondary">
        The source and plate columns are the first eight characters of a keyed HMAC. They exist so
        repeated activity can be recognised as the same client or the same vehicle, and they cannot
        be turned back into an address or a registration without the server secret. Refused attempts
        are logged too — that is what makes the lockout run from a client&rsquo;s last attempt
        rather than its tenth.
      </p>
    </>
  );
}
