import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { requireStaff } from '@/lib/admin/actor';
import { serviceClient } from '@/lib/supabase/server';
import { SUBMISSION_STATUSES, type SubmissionStatus } from '@/lib/constants';
import { SUBMISSION_FIELDS, type SubmissionKind } from '@/lib/submissions/types';
import { PageHeader, StatusPill } from '@/components/admin/primitives';
import {
  StatusControl,
  AssignControl,
  NoteControl,
} from '@/components/admin/submission-controls';

/**
 * ONE ENQUIRY.
 *
 * ── Why the payload is rendered through the field spec ──────────────────────
 *
 * `submissions.payload` is jsonb. The obvious rendering is to iterate its keys,
 * and that is wrong in two ways at once: it prints internal keys — `meta`,
 * `reference`, the honeypot if one ever leaked in — as though they were things
 * the enquirer typed, and it labels every field with its column name, so a
 * salesperson reads "organisation" and "preferred" instead of "Company or
 * organisation" and "Preferred day or time".
 *
 * `SUBMISSION_FIELDS` already holds the label and the order for every form,
 * because the public forms render from it. Reading the payload THROUGH that
 * spec means the admin shows exactly what was asked, in the order it was asked,
 * under the words it was asked in — and anything not in the spec is not shown
 * at all, which is the safe default for a jsonb column.
 */
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Enquiry',
  robots: { index: false, follow: false, nocache: true },
};

const TYPE_LABEL: Record<string, string> = {
  contact: 'Contact enquiry',
  quote: 'Quote request',
  installation: 'Installation booking',
  suggestion: 'Suggestion',
  demo: 'Demo request',
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

function payloadValue(payload: unknown, key: string): string | null {
  if (!payload || typeof payload !== 'object') return null;
  const value = (payload as Record<string, unknown>)[key];
  if (typeof value === 'string' && value.trim()) return value.trim();
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return null;
}

export default async function AdminSubmissionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const actor = await requireStaff('sales');
  if (!actor) redirect('/admin/login?reason=forbidden');

  const { id } = await params;

  const [{ data: row }, { data: staff }] = await Promise.all([
    serviceClient()
      .from('submissions')
      .select('id, type, status, is_anonymous, assigned_to, notes, payload, created_at')
      .eq('id', id)
      .maybeSingle(),
    serviceClient().from('profiles').select('id, full_name, email'),
  ]);

  if (!row) notFound();

  const kind = row.type as SubmissionKind;
  const spec = SUBMISSION_FIELDS[kind] ?? [];
  const status = (
    (SUBMISSION_STATUSES as readonly string[]).includes(row.status) ? row.status : 'new'
  ) as SubmissionStatus;

  const reference = payloadValue(row.payload, 'reference');

  // The honeypot and the rate-limit hash are internal. They are excluded by
  // being absent from SUBMISSION_FIELDS rather than by a denylist here — one
  // less place for a new internal key to be forgotten.
  const answered = spec
    .filter((field) => field.name !== 'anonymous')
    .map((field) => ({ label: field.label, value: payloadValue(row.payload, field.name) }))
    .filter((entry) => entry.value !== null);

  return (
    <div className="max-w-[52rem]">
      <Link
        href="/admin/inbox"
        className="inline-flex min-h-11 items-center text-body-sm text-brand-signal-ink underline decoration-1 underline-offset-4"
      >
        ← Back to the inbox
      </Link>

      <div className="mt-2">
        <PageHeader
          title={TYPE_LABEL[row.type] ?? row.type}
          lead={`Received ${new Date(row.created_at).toLocaleString('en-GB')}${
            reference ? ` · reference ${reference}` : ''
          }`}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <StatusPill tone={STATUS_TONE[status]}>{STATUS_LABEL[status]}</StatusPill>
        {row.is_anonymous ? <StatusPill tone="neutral">Anonymous</StatusPill> : null}
      </div>

      {row.is_anonymous ? (
        <p className="mt-6 max-w-prose rounded-panel border border-border-hairline bg-surface p-4 text-body-sm text-text-secondary">
          This suggestion was sent anonymously. There is no name, phone number or email to show —
          the contact fields were dropped before the row was written, so there is nothing stored to
          reveal and no way to reply. That is what the sender was promised.
        </p>
      ) : null}

      <section className="mt-8">
        <h2 className="font-display-tight text-h3">What they sent</h2>
        {answered.length === 0 ? (
          <p className="mt-2 text-body text-text-secondary">
            This enquiry carries no readable fields. That is unusual and worth investigating rather
            than ignoring.
          </p>
        ) : (
          <dl className="mt-4 border-t border-border-hairline">
            {answered.map((entry) => (
              <div
                key={entry.label}
                className="grid gap-1 border-b border-border-hairline py-3 sm:grid-cols-[14rem_1fr] sm:gap-4"
              >
                <dt className="text-body-sm text-text-secondary">{entry.label}</dt>
                {/* `whitespace-pre-wrap` so a message typed with line breaks reads as it was typed. */}
                <dd className="whitespace-pre-wrap text-body">{entry.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </section>

      <section className="mt-10 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="font-display-tight text-h3">Move it along</h2>
          <div className="mt-4 flex flex-col gap-8">
            <StatusControl id={row.id} current={status} />
            <AssignControl
              id={row.id}
              current={row.assigned_to}
              staff={(staff ?? []).map((person) => ({
                id: person.id,
                label: person.full_name || person.email || 'Unnamed account',
              }))}
            />
          </div>
        </div>
        <div>
          <h2 className="font-display-tight text-h3">Notes</h2>
          <div className="mt-4">
            <NoteControl id={row.id} current={row.notes} />
          </div>
        </div>
      </section>
    </div>
  );
}
