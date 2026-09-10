import { redirect } from 'next/navigation';
import Link from 'next/link';
import { requireStaff } from '@/lib/admin/actor';
import { serviceClient } from '@/lib/supabase/server';
import { ORDER_STATUSES, VAT_LABEL } from '@/lib/constants';
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
 * THE ORDER PIPELINE.
 *
 * Brief 11.1: new → contacted → confirmed → installed → closed / cancelled,
 * with internal notes and export.
 *
 * ── Why the list shows a subtotal and says so ───────────────────────────────
 *
 * `orders.subtotal_kes` is VAT-EXCLUSIVE, and brief 10.2 requires the `excl.
 * VAT` label everywhere a price appears — "the most common source of order
 * disputes in Kenyan e-commerce, and the fix costs one span". That applies
 * inside the admin as much as on the shop: a salesperson quoting the subtotal
 * down the phone as though it were the total creates exactly the dispute the
 * label exists to prevent.
 */
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Orders',
  robots: { index: false, follow: false, nocache: true },
};

type OrderStatus = (typeof ORDER_STATUSES)[number];

const STATUS_LABEL: Record<OrderStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  confirmed: 'Confirmed',
  installed: 'Installed',
  closed: 'Closed',
  cancelled: 'Cancelled',
};

const STATUS_TONE: Record<OrderStatus, 'live' | 'warn' | 'ok' | 'neutral' | 'alert'> = {
  new: 'live',
  contacted: 'warn',
  confirmed: 'warn',
  installed: 'ok',
  closed: 'neutral',
  cancelled: 'alert',
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string }>;
}) {
  const actor = await requireStaff('sales');
  if (!actor) redirect('/admin/login?reason=forbidden');

  const params = (await searchParams) ?? {};
  const status = ORDER_STATUSES.find((value) => value === params.status) ?? 'all';

  let query = serviceClient()
    .from('orders')
    .select(
      'id, order_number, status, customer_name, customer_town, subtotal_kes, whatsapp_sent_at, created_at',
    )
    // Newest first here, unlike the inbox. An order is a transaction with a
    // date, not a queue item with a clock — and the status filter is how staff
    // find the outstanding ones.
    .order('created_at', { ascending: false })
    .limit(200);

  if (status !== 'all') query = query.eq('status', status);

  const { data: rows, error } = await query;

  const href = (value: string) =>
    value === 'all' ? '/admin/orders' : `/admin/orders?status=${value}`;

  return (
    <>
      <PageHeader
        title="Orders"
        lead={`Every order, newest first. Subtotals are ${VAT_LABEL}.`}
        action={
          <a
            href={`/admin/orders/export${status !== 'all' ? `?status=${status}` : ''}`}
            className="inline-flex min-h-11 items-center rounded-control border border-border-strong px-4 text-body-sm"
          >
            Export CSV
          </a>
        }
      />

      <div className="mt-6">
        <FilterLinks
          label="Status"
          current={status}
          hrefFor={href}
          options={[
            { value: 'all', label: 'All' },
            ...ORDER_STATUSES.map((value) => ({ value, label: STATUS_LABEL[value] })),
          ]}
        />
      </div>

      {error ? (
        <EmptyState title="Orders could not be read">
          <p>
            The database refused the query. That is a fault to fix — it does not mean there are no
            orders.
          </p>
        </EmptyState>
      ) : !rows || rows.length === 0 ? (
        <EmptyState title="No orders yet">
          <p>
            An order row is written <strong>before</strong> the WhatsApp chat opens, so a customer
            who abandons the chat still appears here. An empty list means nobody has reached
            checkout, not that a conversation was lost.
          </p>
        </EmptyState>
      ) : (
        <ScrollTable label="Orders">
          <thead>
            <tr>
              <Th>Order</Th>
              <Th>Customer</Th>
              <Th>Status</Th>
              <Th>WhatsApp</Th>
              <Th className="text-right">Subtotal</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const rowStatus = (ORDER_STATUSES.find((v) => v === row.status) ??
                'new') as OrderStatus;
              return (
                <tr key={row.id}>
                  <Td>
                    <Link
                      href={`/admin/orders/${row.id}`}
                      className="font-mono text-mono text-brand-signal-ink underline decoration-1 underline-offset-4"
                    >
                      {row.order_number}
                    </Link>
                    <span className="ml-2 text-body-sm text-text-secondary">
                      {new Date(row.created_at).toLocaleDateString('en-GB')}
                    </span>
                  </Td>
                  <Td className="text-body-sm">
                    {row.customer_name ?? '—'}
                    {row.customer_town ? (
                      <span className="text-text-secondary"> · {row.customer_town}</span>
                    ) : null}
                  </Td>
                  <Td>
                    <StatusPill tone={STATUS_TONE[rowStatus]}>{STATUS_LABEL[rowStatus]}</StatusPill>
                  </Td>
                  {/*
                    Whether the chat was ever opened, which is the one signal
                    that distinguishes "abandoned before contact" from "we
                    talked and nothing came of it". A null here on a `new` order
                    is the strongest reason to ring the customer.
                  */}
                  <Td className="font-mono text-mono text-text-secondary">
                    {row.whatsapp_sent_at ? 'opened' : 'not opened'}
                  </Td>
                  <Td className="text-right font-mono text-mono tabular-nums">
                    {formatKes(row.subtotal_kes) ?? '—'}
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
