import { redirect } from 'next/navigation';
import { requireStaff } from '@/lib/admin/actor';
import { serviceClient } from '@/lib/supabase/server';
import { formatFileSize, formatDate } from '@/lib/format';
import { ROUTES } from '@/lib/constants';
import { PageHeader, StatusPill, EmptyState } from '@/components/admin/primitives';
import {
  AttachFileControl,
  ClearanceControl,
  WithdrawControl,
} from '@/components/admin/download-controls';

/**
 * DOWNLOADS — and the human clearance that publishes one.
 *
 * `docs/CMS_ARCHITECTURE.md` §6.3: `cleared_for_publication` defaults false and
 * can only be set by a human, with `cleared_by` and `cleared_at` recorded.
 * "Uploading a file does not make it downloadable." The admin's job here is to
 * make that state VISIBLE rather than letting an uploaded file quietly appear
 * on the site.
 *
 * ── Why each row states why it is blocked ───────────────────────────────────
 *
 * All four prepared PDFs are uncleared on content grounds, and the grounds are
 * specific per document. A screen that showed only "not cleared" would leave
 * whoever eventually clears them guessing what to look for — so the reason is
 * carried in the row's own description and shown here, where the decision is
 * made.
 */
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Downloads',
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminDownloadsPage() {
  const actor = await requireStaff('editor');
  if (!actor) redirect('/admin/login?reason=forbidden');

  const [{ data: rows, error }, { data: staff }] = await Promise.all([
    serviceClient()
      .from('downloads')
      .select(
        'id, slug, title, description, category, file_path, file_size, file_type, document_date, version, download_count, cleared_for_publication, cleared_by, cleared_at, status, updated_at',
      )
      .order('cleared_for_publication', { ascending: true })
      .order('title', { ascending: true }),
    serviceClient().from('profiles').select('id, full_name, email'),
  ]);

  const staffById = new Map(
    (staff ?? []).map((row) => [row.id, row.full_name || row.email || 'a former account']),
  );

  const uncleared = (rows ?? []).filter((row) => !row.cleared_for_publication).length;

  return (
    <>
      <PageHeader
        title="Downloads"
        lead="Uploading a file does not publish it. An administrator reads the document and clears it, and that decision is recorded against their name."
      />

      {uncleared > 0 ? (
        <p
          role="status"
          className="mt-6 max-w-prose rounded-panel border border-state-warn-ink/40 bg-surface p-4 text-body-sm"
        >
          <strong>
            {uncleared} document{uncleared === 1 ? '' : 's'} not cleared for publication.
          </strong>{' '}
          Each one is blocked for a specific reason recorded below. None of them is downloadable
          from the public site while it stays that way.
        </p>
      ) : null}

      {actor.role !== 'admin' ? (
        <p className="mt-6 max-w-prose rounded-panel border border-border-hairline bg-surface p-4 text-body-sm text-text-secondary">
          Your account is <strong>{actor.role}</strong>. You can attach and detach files here;
          clearing a document for publication needs an administrator. That boundary is a database
          policy, not a hidden button.
        </p>
      ) : null}

      {error ? (
        <EmptyState title="Downloads could not be read">
          <p>The database refused the query. That is a fault to fix.</p>
        </EmptyState>
      ) : !rows || rows.length === 0 ? (
        <EmptyState title="No documents yet">
          <p>
            Nothing has been prepared for the download centre. Documents are created by a migration
            or seeded, then have a file attached and a clearance recorded here.
          </p>
        </EmptyState>
      ) : (
        <ul className="mt-8 flex flex-col gap-6">
          {rows.map((row) => {
            const live = row.cleared_for_publication && row.status === 'published';
            return (
              <li
                key={row.id}
                className={[
                  'rounded-panel border bg-surface p-5',
                  row.cleared_for_publication
                    ? 'border-border-hairline'
                    : 'border-state-warn-ink/50',
                ].join(' ')}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-display-tight text-h3">{row.title}</h2>
                    <p className="mt-1 font-mono text-mono text-text-secondary">{row.slug}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <StatusPill tone={row.cleared_for_publication ? 'ok' : 'warn'}>
                      {row.cleared_for_publication ? 'Cleared' : 'Not cleared'}
                    </StatusPill>
                    <StatusPill tone={row.status === 'published' ? 'ok' : 'neutral'}>
                      {row.status.replace('_', ' ')}
                    </StatusPill>
                    {live ? <StatusPill tone="live">Downloadable</StatusPill> : null}
                  </div>
                </div>

                {row.description ? (
                  <p className="mt-3 max-w-prose whitespace-pre-wrap text-body-sm text-text-secondary">
                    {row.description}
                  </p>
                ) : null}

                <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 font-mono text-label text-text-secondary">
                  {row.file_size ? (
                    <div>
                      <dt className="sr-only">File size</dt>
                      <dd>{formatFileSize(row.file_size)}</dd>
                    </div>
                  ) : null}
                  {row.document_date ? (
                    <div>
                      <dt className="sr-only">Document date</dt>
                      <dd>{formatDate(row.document_date)}</dd>
                    </div>
                  ) : null}
                  {row.version ? (
                    <div>
                      <dt className="sr-only">Version</dt>
                      <dd>v{row.version}</dd>
                    </div>
                  ) : null}
                  <div>
                    <dt className="sr-only">Downloads</dt>
                    <dd>{row.download_count} downloaded</dd>
                  </div>
                </dl>

                {row.cleared_for_publication && row.cleared_by ? (
                  <p className="mt-3 text-body-sm text-text-secondary">
                    Cleared by <strong>{staffById.get(row.cleared_by) ?? 'a former account'}</strong>{' '}
                    on {row.cleared_at ? new Date(row.cleared_at).toLocaleString('en-GB') : 'an unrecorded date'}.
                  </p>
                ) : null}

                <div className="mt-5 grid gap-6 md:grid-cols-2">
                  <AttachFileControl id={row.id} current={row.file_path} />

                  <div className="flex flex-col gap-4">
                    {row.cleared_for_publication ? (
                      actor.role === 'admin' ? (
                        <WithdrawControl id={row.id} />
                      ) : (
                        <p className="text-body-sm text-text-secondary">
                          Withdrawing a cleared document needs an administrator.
                        </p>
                      )
                    ) : actor.role === 'admin' ? (
                      <ClearanceControl id={row.id} title={row.title} />
                    ) : (
                      <p className="text-body-sm text-text-secondary">
                        Clearing this document needs an administrator.
                      </p>
                    )}
                  </div>
                </div>

                {live ? (
                  <p className="mt-4 text-body-sm text-text-secondary">
                    Visitors reach it from{' '}
                    <code className="font-mono text-mono">{ROUTES.downloads}</code>, and the file
                    itself is served through a link that expires in five minutes rather than from a
                    public path.
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
