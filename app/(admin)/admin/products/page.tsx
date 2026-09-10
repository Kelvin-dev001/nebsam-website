import { redirect } from 'next/navigation';
import Link from 'next/link';
import { requireStaff } from '@/lib/admin/actor';
import { serviceClient } from '@/lib/supabase/server';
import { CONTENT_STATUSES, VAT_LABEL } from '@/lib/constants';
import { formatKes } from '@/lib/format';
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
 * PRODUCTS — the commercial view and the editorial view of one record.
 *
 * `docs/CMS_ARCHITECTURE.md` §1: "Products appear in two places and are one
 * record." The pages are merged and so is the data, so there is one list here
 * rather than a Content → Products and a Shop → Products that a staff member
 * has to guess between. A price and a specification are edited on the same
 * screen because they are columns on the same row.
 *
 * Every price on this screen carries the `excl. VAT` label. Brief 10.2 requires
 * it wherever a price appears, and a salesperson reading a subtotal off an
 * admin table as though it were the total is the dispute the label exists to
 * prevent.
 */
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Products',
  robots: { index: false, follow: false, nocache: true },
};

type ContentStatus = (typeof CONTENT_STATUSES)[number];

const STATUS_LABEL: Record<ContentStatus, string> = {
  draft: 'Draft',
  in_review: 'In review',
  published: 'Published',
};

const STATUS_TONE: Record<ContentStatus, 'neutral' | 'warn' | 'ok'> = {
  draft: 'neutral',
  in_review: 'warn',
  published: 'ok',
};

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string }>;
}) {
  const actor = await requireStaff('editor');
  if (!actor) redirect('/admin/login?reason=forbidden');

  const params = (await searchParams) ?? {};
  const status = CONTENT_STATUSES.find((value) => value === params.status) ?? 'all';

  let query = serviceClient()
    .from('products')
    .select(
      'id, name, slug, family, status, price_kes, price_visible, recurring_fee_kes, recurring_fee_period, availability, featured, updated_at',
    )
    .order('name', { ascending: true })
    .limit(300);

  if (status !== 'all') query = query.eq('status', status);

  const { data: rows, error } = await query;

  return (
    <>
      <PageHeader
        title="Products"
        lead={`Specifications and prices on one record. All prices are ${VAT_LABEL}.`}
        action={
          <Link
            href="/admin/products/new"
            className="inline-flex min-h-11 items-center rounded-control bg-brand-signal-ink px-5 text-white"
          >
            New product
          </Link>
        }
      />

      <div className="mt-6">
        <FilterLinks
          label="Status"
          current={status}
          hrefFor={(value) =>
            value === 'all' ? '/admin/products' : `/admin/products?status=${value}`
          }
          options={[
            { value: 'all', label: 'All' },
            ...CONTENT_STATUSES.map((value) => ({ value, label: STATUS_LABEL[value] })),
          ]}
        />
      </div>

      {error ? (
        <EmptyState title="Products could not be read">
          <p>The database refused the query. That is a fault to fix rather than an empty catalogue.</p>
        </EmptyState>
      ) : !rows || rows.length === 0 ? (
        <EmptyState title="No products match">
          <p>
            {status === 'all'
              ? 'Nothing in the catalogue yet. Start one with New product.'
              : 'No products have this status. Clear the filter to see the rest.'}
          </p>
        </EmptyState>
      ) : (
        <ScrollTable label="Products">
          <thead>
            <tr>
              <Th>Product</Th>
              <Th>Status</Th>
              <Th>Stock</Th>
              <Th className="text-right">Price ({VAT_LABEL})</Th>
              <Th className="text-right">Recurring</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const rowStatus = (CONTENT_STATUSES.find((v) => v === row.status) ??
                'draft') as ContentStatus;
              return (
                <tr key={row.id}>
                  <Td>
                    <Link
                      href={`/admin/products/${row.id}`}
                      className="text-body font-medium text-brand-signal-ink underline decoration-1 underline-offset-4"
                    >
                      {row.name}
                    </Link>
                    {row.family ? (
                      <span className="ml-2 text-body-sm text-text-secondary">{row.family}</span>
                    ) : null}
                    {row.featured ? (
                      <span className="ml-2 font-mono text-label uppercase tracking-[0.06em] text-text-secondary">
                        featured
                      </span>
                    ) : null}
                  </Td>
                  <Td>
                    <StatusPill tone={STATUS_TONE[rowStatus]}>{STATUS_LABEL[rowStatus]}</StatusPill>
                  </Td>
                  <Td className="font-mono text-mono text-text-secondary">
                    {row.availability.replace(/_/g, ' ')}
                  </Td>
                  <Td className="text-right font-mono text-mono tabular-nums">
                    {/*
                      "Request price" rather than an em dash. A null price is a
                      deliberate state with its own behaviour on the public page
                      — a WhatsApp CTA and Product schema with no Offer — and
                      showing it as a blank makes it look like missing data
                      somebody should go and fill in.
                    */}
                    {row.price_kes === null ? (
                      <span className="text-text-secondary">Request price</span>
                    ) : (
                      <>
                        {formatKes(row.price_kes)}
                        {!row.price_visible ? (
                          <span className="ml-2 text-state-warn-ink">hidden</span>
                        ) : null}
                      </>
                    )}
                  </Td>
                  <Td className="text-right font-mono text-mono tabular-nums text-text-secondary">
                    {row.recurring_fee_kes
                      ? `${formatKes(row.recurring_fee_kes)}/${row.recurring_fee_period ?? 'year'}`
                      : '—'}
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </ScrollTable>
      )}
    </>
  );
}
