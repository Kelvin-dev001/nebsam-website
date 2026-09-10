import { type NextRequest } from 'next/server';
import { requireStaff } from '@/lib/admin/actor';
import { serviceClient } from '@/lib/supabase/server';
import { recordAudit } from '@/lib/admin/audit';
import { SUBMISSION_STATUSES } from '@/lib/constants';
import { SUBMISSION_FIELDS, type SubmissionKind } from '@/lib/submissions/types';

/**
 * INBOX EXPORT.
 *
 * `docs/CMS_ARCHITECTURE.md` §7 asks for export for follow-up. This is that,
 * and it is the single place on this project where customer PII leaves the
 * database in bulk, so it is worth being explicit about what that means.
 *
 * ── Four things this does that a naive export would not ─────────────────────
 *
 * 1. It requires `sales`, checked here and not merely by the middleware. The
 *    route runs under the service role, which bypasses RLS entirely, so this
 *    call is the only thing standing between a `viewer` session and every
 *    enquiry the company has received.
 *
 * 2. It writes an audit entry with the ROW COUNT. A bulk PII export that leaves
 *    no trace is the one admin action most worth being able to reconstruct
 *    later, and "who took a copy of the inbox, and when" is a question that gets
 *    asked after something has already gone wrong.
 *
 * 3. It never exports an anonymous suggestion's contact columns, because there
 *    are none — but it also does not export the anonymous MESSAGE alongside
 *    named rows in a way that would let the two be correlated by position. The
 *    anonymous rows carry a blank name and phone and are ordered with
 *    everything else by date, which is all the CSV can honestly say about them.
 *
 * 4. `Content-Disposition: attachment` and `text/csv`. Served inline, a browser
 *    renders the PII in a tab that stays in history.
 *
 * ── The formula-injection guard ─────────────────────────────────────────────
 *
 * A CSV cell beginning `=`, `+`, `-` or `@` is executed as a formula when the
 * file is opened in Excel or Sheets. An enquirer who types
 * `=HYPERLINK("http://…"&A1)` into a message field has written a payload that
 * runs on a salesperson's machine. Prefixing with an apostrophe is the standard
 * mitigation and costs nothing to anybody reading the file normally.
 */
export const dynamic = 'force-dynamic';

/** Quote for RFC 4180, and defuse anything Excel would execute. */
function cell(value: unknown): string {
  let text = value === null || value === undefined ? '' : String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET(request: NextRequest) {
  const actor = await requireStaff('sales');
  if (!actor) {
    return new Response('Not permitted.', { status: 403 });
  }

  const requested = request.nextUrl.searchParams.get('status');
  const status = (SUBMISSION_STATUSES as readonly string[]).includes(requested ?? '')
    ? requested!
    : null;

  let query = serviceClient()
    .from('submissions')
    .select('id, type, status, is_anonymous, notes, payload, created_at')
    .order('created_at', { ascending: true })
    .limit(5000);

  if (status) query = query.eq('status', status);

  const { data: rows, error } = await query;
  if (error) return new Response('The export could not be produced.', { status: 500 });

  // A fixed, union-of-all-forms column set, so one CSV holds every enquiry type
  // without a column meaning different things in different rows.
  const columns = [
    'received',
    'type',
    'status',
    'anonymous',
    'reference',
    'name',
    'phone',
    'email',
    'organisation',
    'town',
    'interest',
    'product',
    'vehicle',
    'vehicles',
    'preferred',
    'branch',
    'message',
    'internal_notes',
  ];

  const lines = [columns.map(cell).join(',')];

  for (const row of rows ?? []) {
    const payload = (row.payload ?? {}) as Record<string, unknown>;
    // Only keys the form actually asked for. `meta` — which holds nothing but a
    // rate-limit artefact — is excluded by not appearing in any field spec.
    const known = new Set(
      (SUBMISSION_FIELDS[row.type as SubmissionKind] ?? []).map((field) => field.name),
    );
    const value = (key: string) =>
      known.has(key) && typeof payload[key] === 'string' ? (payload[key] as string) : '';

    lines.push(
      [
        new Date(row.created_at).toISOString(),
        row.type,
        row.status,
        row.is_anonymous ? 'yes' : 'no',
        typeof payload.reference === 'string' ? payload.reference : '',
        value('name'),
        value('phone'),
        value('email'),
        value('organisation'),
        value('town'),
        value('interest'),
        value('product'),
        value('vehicle'),
        value('vehicles'),
        value('preferred'),
        value('branch'),
        value('message'),
        row.notes ?? '',
      ]
        .map(cell)
        .join(','),
    );
  }

  await recordAudit({
    actorId: actor.id,
    action: 'submission.export',
    entity: 'submission',
    diff: { rows: rows?.length ?? 0, status: status ?? 'all' },
  });

  const stamp = new Date().toISOString().slice(0, 10);
  return new Response(
    // The BOM is what makes Excel read UTF-8 rather than guessing a code page,
    // which otherwise mangles any name with an accent in it.
    `﻿${lines.join('\r\n')}\r\n`,
    {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="nebsam-enquiries-${status ?? 'all'}-${stamp}.csv"`,
        // Never cached, anywhere. This response is PII.
        'Cache-Control': 'no-store, max-age=0',
      },
    },
  );
}
