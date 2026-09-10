import { redirect } from 'next/navigation';
import Link from 'next/link';
import { requireStaff } from '@/lib/admin/actor';
import { serviceClient } from '@/lib/supabase/server';
import { SUBMISSION_STATUSES, type SubmissionStatus } from '@/lib/constants';
import {
  PageHeader,
  StatusPill,
  EmptyState,
  ScrollTable,
  Th,
  Td,
  FilterLinks,
} from '@/components/admin/primitives';

/**
 * THE ENQUIRY INBOX.
 *
 * Contact, quote, installation booking and suggestion in one queue —
 * `docs/CMS_ARCHITECTURE.md` §7. Four separate screens would mean four places
 * to forget to look, and the whole point of the queue is that nothing waits
 * unseen.
 *
 * ── What this list does NOT show ────────────────────────────────────────────
 *
 * No phone numbers, no email addresses, no message text. The list shows type,
 * status, who owns it and how long it has waited; the detail view shows the
 * rest. That is not squeamishness — a list view is the screen most likely to be
 * open on a shared monitor, and CLAUDE.md §10 puts the bar at "no PII where it
 * does not belong".
 *
 * The one exception is the enquirer's own name on a NAMED submission, because
 * an inbox where every row reads "Quote · 3 days" is an inbox nobody can
 * navigate. An anonymous row shows no name, because there is none stored.
 */
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Inbox',
  robots: { index: false, follow: false, nocache: true },
};

const TYPE_LABEL: Record<string, string> = {
  contact: 'Contact',
  quote: 'Quote',
  installation: 'Installation',
  suggestion: 'Suggestion',
  demo: 'Demo',
};

const STATUS_LABEL: Record<SubmissionStatus, string> = {
  new: 'New',
  in_progress: 'In progress',
  answered: 'Answered',
  spam: 'Spam',
};

const STATUS_TONE: Record<SubmissionStatus, 'live' | 'warn' | 'ok' | 'neutral'> = {
  new: 'live',
  in_progress: 'warn',
  answered: 'ok',
  spam: 'neutral',
};

function daysWaiting(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days === 0) return 'today';
  return days === 1 ? '1 day' : `${days} days`;
}

/**
 * The enquirer's own name, or nothing.
 *
 * Reads it out of the jsonb rather than trusting a shape: the payload is
 * whatever the form wrote, an anonymous suggestion has no `name` key at all,
 * and a row written before a field was renamed must not crash the list.
 */
function displayName(payload: unknown, anonymous: boolean): string | null {
  if (anonymous) return null;
  if (!payload || typeof payload !== 'object') return null;
  const value = (payload as Record<string, unknown>).name;
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

export default async function AdminInboxPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string; type?: string }>;
}) {
  const actor = await requireStaff('sales');
  if (!actor) redirect('/admin/login?reason=forbidden');

  const params = (await searchParams) ?? {};
  const status = (SUBMISSION_STATUSES as readonly string[]).includes(params.status ?? '')
    ? (params.status as SubmissionStatus)
    : 'all';
  /**
   * `as const` and a typed array, not a `string[]` and a cast.
   *
   * `submissions.type` is a Postgres enum and `types/database.ts` is generated
   * from it, so `.eq('type', …)` will only accept one of its five labels. That
   * is the generated types earning their keep — a filter read straight out of a
   * query string cannot reach the query without being narrowed first.
   */
  const TYPES = ['contact', 'quote', 'installation', 'suggestion'] as const;
  const type = TYPES.find((value) => value === params.type) ?? 'all';

  let query = serviceClient()
    .from('submissions')
    .select('id, type, status, is_anonymous, assigned_to, created_at, payload')
    // Oldest first. `docs/CMS_ARCHITECTURE.md` §1.1 asks for it and it is the
    // right default for a queue: newest-first quietly buries the enquiry that
    // has been waiting longest under the ones that just arrived.
    .order('created_at', { ascending: true })
    .limit(200);

  if (status !== 'all') query = query.eq('status', status);
  if (type !== 'all') query = query.eq('type', type);

  const [{ data: rows, error }, { data: staff }] = await Promise.all([
    query,
    serviceClient().from('profiles').select('id, full_name, email'),
  ]);

  const staffById = new Map((staff ?? []).map((row) => [row.id, row.full_name || row.email || '—']));

  const href = (next: { status?: string; type?: string }) => {
    const search = new URLSearchParams();
    const s = next.status ?? status;
    const t = next.type ?? type;
    if (s !== 'all') search.set('status', s);
    if (t !== 'all') search.set('type', t);
    const qs = search.toString();
    return qs ? `/admin/inbox?${qs}` : '/admin/inbox';
  };

  return (
    <>
      <PageHeader
        title="Inbox"
        lead="Contact, quote, installation and suggestion enquiries, oldest first."
        action={
          <a
            href={`/admin/inbox/export${status !== 'all' ? `?status=${status}` : ''}`}
            className="inline-flex min-h-11 items-center rounded-control border border-border-strong px-4 text-body-sm"
          >
            Export CSV
          </a>
        }
      />

      <div className="mt-6 flex flex-col gap-3">
        <FilterLinks
          label="Status"
          current={status}
          hrefFor={(value) => href({ status: value })}
          options={[
            { value: 'all', label: 'All' },
            ...SUBMISSION_STATUSES.map((value) => ({ value, label: STATUS_LABEL[value] })),
          ]}
        />
        <FilterLinks
          label="Type"
          current={type}
          hrefFor={(value) => href({ type: value })}
          options={[
            { value: 'all', label: 'All' },
            { value: 'contact', label: 'Contact' },
            { value: 'quote', label: 'Quote' },
            { value: 'installation', label: 'Installation' },
            { value: 'suggestion', label: 'Suggestion' },
          ]}
        />
      </div>

      {error ? (
        <EmptyState title="The inbox could not be read">
          <p>
            The database refused the query. That is a fault to fix rather than an empty inbox —
            nothing here means &ldquo;no enquiries&rdquo;.
          </p>
        </EmptyState>
      ) : !rows || rows.length === 0 ? (
        <EmptyState title="Nothing here">
          <p>
            {status === 'all' && type === 'all'
              ? 'No enquiries have arrived yet. The contact, quote, installation and suggestion forms all write here.'
              : 'No enquiries match this filter. Clear it to see the whole queue.'}
          </p>
        </EmptyState>
      ) : (
        <ScrollTable label="Enquiries">
          <thead>
            <tr>
              <Th>Enquiry</Th>
              <Th>Status</Th>
              <Th>Assigned</Th>
              <Th className="text-right">Waiting</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const name = displayName(row.payload, row.is_anonymous);
              const rowStatus = (
                (SUBMISSION_STATUSES as readonly string[]).includes(row.status)
                  ? row.status
                  : 'new'
              ) as SubmissionStatus;
              return (
                <tr key={row.id}>
                  <Td>
                    <Link
                      href={`/admin/inbox/${row.id}`}
                      className="text-body font-medium text-brand-signal-ink underline decoration-1 underline-offset-4"
                    >
                      {TYPE_LABEL[row.type] ?? row.type}
                      {name ? ` — ${name}` : ''}
                    </Link>
                    {row.is_anonymous ? (
                      <span className="ml-2 font-mono text-mono uppercase tracking-[0.06em] text-text-secondary">
                        anonymous
                      </span>
                    ) : null}
                  </Td>
                  <Td>
                    <StatusPill tone={STATUS_TONE[rowStatus]}>{STATUS_LABEL[rowStatus]}</StatusPill>
                  </Td>
                  <Td className="text-body-sm text-text-secondary">
                    {row.assigned_to ? (staffById.get(row.assigned_to) ?? 'Unknown') : '—'}
                  </Td>
                  <Td className="text-right font-mono text-mono text-text-secondary">
                    {daysWaiting(row.created_at)}
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </ScrollTable>
      )}

      <p className="mt-6 max-w-prose text-body-sm text-text-secondary">
        Anonymous suggestions carry no name, phone number or email — the contact fields are dropped
        before the row is written, not hidden on this screen. There is nothing to reveal.
      </p>
    </>
  );
}
