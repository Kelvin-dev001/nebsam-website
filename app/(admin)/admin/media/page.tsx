import { redirect } from 'next/navigation';
import { requireStaff } from '@/lib/admin/actor';
import { serviceClient } from '@/lib/supabase/server';
import { formatFileSize } from '@/lib/format';
import { PageHeader, StatusPill, EmptyState } from '@/components/admin/primitives';
import { MediaUpload } from '@/components/admin/media-upload';
import { PrivacyCheckControl, DeleteMediaControl } from '@/components/admin/media-controls';

/**
 * THE MEDIA LIBRARY.
 *
 * `docs/CMS_ARCHITECTURE.md` §5. Everything lands in the PRIVATE `uploads`
 * bucket and is viewed through a sixty-second signed URL — no file on this
 * screen has a public address.
 *
 * ── Why the thumbnails are plain <img> and not next/image ───────────────────
 *
 * Because the URL is minted per request and expires. `next/image` optimises a
 * remote source by fetching it at render time and caching the result, which
 * needs a stable URL and would cache a private object into a public
 * optimisation cache. So the admin renders the original through the signed
 * route, at a small size, with `loading="lazy"`.
 *
 * That is a deliberate cost paid ONLY in the admin: a staff member on a phone
 * pays full size for each thumbnail. It is capped by the 250 KB image ceiling
 * the upload path enforces, and the list is paged. The public site never does
 * this — see the sprint report on the one open question here.
 *
 * ── Unchecked files first ───────────────────────────────────────────────────
 *
 * The sort puts anything without a privacy check at the top. Brief 3.6 treats
 * every supplied image as suspect until checked, and a queue that buries the
 * unchecked ones under six months of cleared uploads is a queue nobody works.
 */
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Media',
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminMediaPage() {
  const actor = await requireStaff('editor');
  if (!actor) redirect('/admin/login?reason=forbidden');

  const { data: rows, error } = await serviceClient()
    .from('media')
    .select('id, path, alt_text, width, height, bytes, mime, privacy_checked, privacy_check_note, created_at')
    .order('privacy_checked', { ascending: true })
    .order('created_at', { ascending: false })
    .limit(120);

  const unchecked = (rows ?? []).filter((row) => !row.privacy_checked).length;

  return (
    <>
      <PageHeader
        title="Media"
        lead="Every uploaded file, in a private bucket. Nothing here has a public address — files open through a link that expires in a minute."
      />

      {unchecked > 0 ? (
        <p
          role="status"
          className="mt-6 max-w-prose rounded-panel border border-state-warn-ink/40 bg-surface p-4 text-body-sm"
        >
          <strong>
            {unchecked} file{unchecked === 1 ? '' : 's'} awaiting a privacy check.
          </strong>{' '}
          Open each one and look for a registration plate, an identifiable face, a customer or staff
          name, coordinates, a device ID or a third party&rsquo;s branding. Sprint 11 found the
          unpublished company phone number and an administrative email baked into a JPEG as pixels,
          where no text check could ever have seen them.
        </p>
      ) : null}

      <MediaUpload />

      {error ? (
        <EmptyState title="The library could not be read">
          <p>The database refused the query. That is a fault to fix rather than an empty library.</p>
        </EmptyState>
      ) : !rows || rows.length === 0 ? (
        <EmptyState title="Nothing uploaded yet">
          <p>
            Files uploaded here are stored privately. An image becomes usable on the site once it
            has been through a privacy check, and a document becomes downloadable only when an
            administrator clears it on the Downloads screen — uploading is not publishing.
          </p>
        </EmptyState>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((row) => {
            const isImage = (row.mime ?? '').startsWith('image/');
            return (
              <li
                key={row.id}
                className={[
                  'flex flex-col rounded-panel border bg-surface p-4',
                  row.privacy_checked ? 'border-border-hairline' : 'border-state-warn-ink/50',
                ].join(' ')}
              >
                <div className="flex items-start justify-between gap-2">
                  <StatusPill tone={row.privacy_checked ? 'ok' : 'warn'}>
                    {row.privacy_checked ? 'Checked' : 'Not checked'}
                  </StatusPill>
                  <span className="font-mono text-label uppercase tracking-[0.06em] text-text-secondary">
                    {(row.mime ?? '').replace(/^\w+\//, '')}
                  </span>
                </div>

                <a
                  href={`/admin/media/${row.id}/file`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 block"
                >
                  {isImage ? (
                    // eslint-disable-next-line @next/next/no-img-element -- signed URL expires; see the header
                    <img
                      src={`/admin/media/${row.id}/file`}
                      alt={row.alt_text}
                      width={row.width ?? undefined}
                      height={row.height ?? undefined}
                      loading="lazy"
                      className="max-h-40 w-full rounded-data border border-border-hairline object-contain"
                    />
                  ) : (
                    <span className="flex min-h-11 items-center rounded-data border border-border-hairline px-3 text-body-sm text-brand-signal-ink underline decoration-1 underline-offset-4">
                      Open the document
                    </span>
                  )}
                </a>

                <p className="mt-3 text-body-sm">{row.alt_text}</p>

                <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-label text-text-secondary">
                  <div>
                    <dt className="sr-only">Size</dt>
                    <dd>{formatFileSize(row.bytes) ?? 'unknown size'}</dd>
                  </div>
                  {row.width && row.height ? (
                    <div>
                      <dt className="sr-only">Dimensions</dt>
                      <dd>
                        {row.width}×{row.height}
                      </dd>
                    </div>
                  ) : null}
                  <div>
                    <dt className="sr-only">Uploaded</dt>
                    <dd>{new Date(row.created_at).toLocaleDateString('en-GB')}</dd>
                  </div>
                </dl>

                {/*
                  The stored path, shown so it can be copied into a hero-image or
                  file-path field elsewhere in the admin. It is not a URL and does
                  not resolve on its own — that is the private bucket working.
                */}
                <code className="mt-2 block break-all rounded-data bg-surface-raised px-2 py-1 font-mono text-label text-text-secondary">
                  {row.path}
                </code>

                {row.privacy_check_note ? (
                  <p className="mt-2 text-body-sm text-text-secondary">
                    <span className="font-medium">Note:</span> {row.privacy_check_note}
                  </p>
                ) : null}

                <div className="mt-4 flex flex-col gap-3">
                  {!row.privacy_checked ? <PrivacyCheckControl id={row.id} /> : null}
                  {actor.role === 'admin' ? <DeleteMediaControl id={row.id} /> : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
