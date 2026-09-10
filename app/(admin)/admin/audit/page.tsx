import { redirect } from 'next/navigation';
import { requireStaff } from '@/lib/admin/actor';
import { serviceClient } from '@/lib/supabase/server';
import {
  PageHeader,
  EmptyState,
  ScrollTable,
  Th,
  Td,
  FilterLinks,
} from '@/components/admin/primitives';

/**
 * THE AUDIT LOG.
 *
 * `docs/CMS_ARCHITECTURE.md` §8: every admin create, update and delete —
 * actor, action, entity, entity id, diff, timestamp. Append-only. "A log an
 * administrator can edit is not a log."
 *
 * That is enforced three times over and none of them is this screen: there is
 * no INSERT policy (the write path is server-side under the service role, so a
 * staff session cannot forge an entry), no UPDATE or DELETE policy for anyone
 * including admin, and triggers in migration 0007 that reject both operations
 * even if a future migration adds a policy by mistake.
 *
 * So this page is read-only by construction rather than by omission, and there
 * is deliberately nothing on it that suggests otherwise — no delete control, no
 * "clear log", no export. An export would be the obvious next feature and it is
 * the wrong one: a log whose value is that it cannot be tampered with should not
 * grow a path that produces a detached, editable copy of itself.
 *
 * ── What a diff contains ────────────────────────────────────────────────────
 *
 * What changed, never the content that changed. `lib/admin/audit.ts` strips
 * names, phone numbers, email addresses, message bodies, plates and payloads
 * before writing, so an audit trail of who handled which enquiry cannot become
 * a second copy of everyone's contact details. A certificate import records row
 * counts; a note records its length.
 */
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Audit log',
  robots: { index: false, follow: false, nocache: true },
};

const ENTITIES = [
  'submission',
  'order',
  'product',
  'blog_post',
  'download',
  'media',
  'installation_certificate',
] as const;

const ENTITY_LABEL: Record<string, string> = {
  submission: 'Enquiries',
  order: 'Orders',
  product: 'Products',
  blog_post: 'Blog',
  download: 'Downloads',
  media: 'Media',
  installation_certificate: 'Certificates',
  certification: 'Certifications',
  profile: 'Accounts',
};

/**
 * Render a diff as readable pairs.
 *
 * The alternative is `JSON.stringify`, which produces
 * `{"slug":"anti-jammer-tracker","price_was":18000,"price_now":19500}` in a
 * table cell. It is not that an administrator cannot read JSON — it is that a
 * log nobody scans comfortably is a log nobody scans.
 */
function diffPairs(diff: unknown): [string, string][] {
  if (!diff || typeof diff !== 'object' || Array.isArray(diff)) return [];
  return Object.entries(diff as Record<string, unknown>).map(([key, value]) => [
    key.replace(/_/g, ' '),
    value === null ? '—' : String(value),
  ]);
}

export default async function AdminAuditPage({
  searchParams,
}: {
  searchParams?: Promise<{ entity?: string }>;
}) {
  const actor = await requireStaff('admin');
  if (!actor) redirect('/admin/login?reason=forbidden');

  const params = (await searchParams) ?? {};
  const entity = ENTITIES.find((value) => value === params.entity) ?? 'all';

  let query = serviceClient()
    .from('audit_log')
    .select('id, actor_id, action, entity, entity_id, diff, created_at')
    .order('created_at', { ascending: false })
    .limit(200);

  if (entity !== 'all') query = query.eq('entity', entity);

  const [{ data: rows, error }, { data: staff }] = await Promise.all([
    query,
    serviceClient().from('profiles').select('id, full_name, email'),
  ]);

  const staffById = new Map(
    (staff ?? []).map((row) => [row.id, row.full_name || row.email || 'a former account']),
  );

  return (
    <>
      <PageHeader
        title="Audit log"
        lead="Every change made through the admin. Append-only — no policy exists to edit or delete an entry, for anyone."
      />

      <div className="mt-6">
        <FilterLinks
          label="Area"
          current={entity}
          hrefFor={(value) => (value === 'all' ? '/admin/audit' : `/admin/audit?entity=${value}`)}
          options={[
            { value: 'all', label: 'All' },
            ...ENTITIES.map((value) => ({ value, label: ENTITY_LABEL[value] ?? value })),
          ]}
        />
      </div>

      {error ? (
        <EmptyState title="The audit log could not be read">
          <p>The database refused the query. That is a fault to fix.</p>
        </EmptyState>
      ) : !rows || rows.length === 0 ? (
        <EmptyState title="Nothing recorded yet">
          <p>
            {entity === 'all'
              ? 'No changes have been made through the admin. Entries appear here as staff create, update and delete things.'
              : 'Nothing has been changed in this area.'}
          </p>
        </EmptyState>
      ) : (
        <ScrollTable label="Audit entries">
          <thead>
            <tr>
              <Th>When</Th>
              <Th>Who</Th>
              <Th>What</Th>
              <Th>Details</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const pairs = diffPairs(row.diff);
              return (
                <tr key={row.id}>
                  <Td className="whitespace-nowrap font-mono text-mono text-text-secondary">
                    {new Date(row.created_at).toLocaleString('en-GB')}
                  </Td>
                  <Td className="text-body-sm">
                    {/*
                      `actor_id` is `on delete set null`, so an entry outlives
                      the account that made it. Saying "a deleted account" is
                      more useful than a blank cell, and it is also the truthful
                      answer — the entry is not anonymous, its actor is gone.
                    */}
                    {row.actor_id
                      ? (staffById.get(row.actor_id) ?? 'a deleted account')
                      : 'the system'}
                  </Td>
                  <Td className="font-mono text-mono">{row.action}</Td>
                  <Td>
                    {pairs.length === 0 ? (
                      <span className="text-text-secondary">—</span>
                    ) : (
                      <ul className="flex flex-col gap-0.5">
                        {pairs.map(([key, value]) => (
                          <li key={key} className="font-mono text-label text-text-secondary">
                            {key}: <span className="text-text-primary">{value}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </ScrollTable>
      )}

      <p className="mt-8 max-w-prose text-body-sm text-text-secondary">
        Entries record what changed, never the content that changed. A note is logged by its length,
        an enquiry by its status, a certificate import by its row count. That is deliberate: an
        audit trail of who handled which enquiry must not become a second copy of everyone&rsquo;s
        contact details.
      </p>
    </>
  );
}
