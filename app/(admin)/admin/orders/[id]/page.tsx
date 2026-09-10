import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { requireStaff } from '@/lib/admin/actor';
import { serviceClient } from '@/lib/supabase/server';
import { ORDER_STATUSES, VAT_LABEL, ROUTES } from '@/lib/constants';
import { formatKes } from '@/lib/format';
import { PageHeader, StatusPill, ScrollTable, Th, Td } from '@/components/admin/primitives';
import { OrderStatusControl, OrderNoteControl } from '@/components/admin/order-controls';

/**
 * ONE ORDER.
 *
 * ── The totals are recomputed from the SNAPSHOTS, not from the products ─────
 *
 * Every figure on this page comes from `order_items.unit_price_snapshot` and
 * `orders.vat_rate_snapshot`. Not one of them is read from `products`.
 *
 * That is the whole point of those columns. Joining to the live product record
 * to show a price would mean this page displayed today's price against a
 * six-month-old order — quietly, correctly-looking, and wrong in exactly the
 * conversation where it matters most. The customer-facing order page
 * (`/orders/[orderNumber]`) already works this way; the admin has to as well,
 * or the two disagree.
 *
 * `subtotal_kes` on the order is displayed as stored rather than recomputed
 * from the items, and then the items are shown beside it. If the two ever
 * disagree the page shows both, because a mismatch is something staff need to
 * SEE rather than something a reconciliation should hide.
 */
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Order',
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

export default async function AdminOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const actor = await requireStaff('sales');
  if (!actor) redirect('/admin/login?reason=forbidden');

  const { id } = await params;

  const { data: order } = await serviceClient()
    .from('orders')
    .select(
      'id, order_number, status, customer_name, customer_phone, customer_town, fulfilment_type, branch_id, subtotal_kes, vat_rate_snapshot, whatsapp_sent_at, notes, created_at',
    )
    .eq('id', id)
    .maybeSingle();

  if (!order) notFound();

  const [{ data: items }, { data: branch }] = await Promise.all([
    serviceClient()
      .from('order_items')
      .select(
        'id, name_snapshot, unit_price_snapshot, qty, recurring_fee_snapshot, recurring_fee_period_snapshot',
      )
      .eq('order_id', order.id),
    order.branch_id
      ? serviceClient().from('branches').select('name').eq('id', order.branch_id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const lines = items ?? [];
  const itemsSubtotal = lines.reduce(
    (sum, line) => sum + line.unit_price_snapshot * line.qty,
    0,
  );
  const rate = order.vat_rate_snapshot ?? 0;
  const vat = Math.round(order.subtotal_kes * rate);
  const total = order.subtotal_kes + vat;
  const mismatch = itemsSubtotal !== order.subtotal_kes;

  const recurring = lines.filter((line) => line.recurring_fee_snapshot);
  const status = (ORDER_STATUSES.find((v) => v === order.status) ?? 'new') as OrderStatus;

  return (
    <div className="max-w-[52rem]">
      <Link
        href="/admin/orders"
        className="inline-flex min-h-11 items-center text-body-sm text-brand-signal-ink underline decoration-1 underline-offset-4"
      >
        ← Back to orders
      </Link>

      <div className="mt-2">
        <PageHeader
          title={order.order_number}
          lead={`Placed ${new Date(order.created_at).toLocaleString('en-GB')}`}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <StatusPill tone="neutral">{STATUS_LABEL[status]}</StatusPill>
        {order.whatsapp_sent_at ? (
          <StatusPill tone="ok">WhatsApp opened</StatusPill>
        ) : (
          <StatusPill tone="warn">WhatsApp never opened</StatusPill>
        )}
      </div>

      {!order.whatsapp_sent_at ? (
        <p className="mt-4 max-w-prose rounded-panel border border-state-warn-ink/40 bg-surface p-4 text-body-sm">
          This order exists but the customer never reached the WhatsApp chat. The row was written
          first precisely so this case is visible — <strong>ring them</strong>. It is a real lead
          that would otherwise have vanished.
        </p>
      ) : null}

      <section className="mt-8">
        <h2 className="font-display-tight text-h3">Customer</h2>
        <dl className="mt-4 border-t border-border-hairline">
          {[
            { label: 'Name', value: order.customer_name },
            {
              label: 'Phone',
              // A tel: link, because the point of this screen is that somebody
              // rings the number.
              value: order.customer_phone,
              href: order.customer_phone ? `tel:${order.customer_phone}` : null,
            },
            { label: 'Town', value: order.customer_town },
            {
              label: 'Fulfilment',
              value:
                order.fulfilment_type === 'installation'
                  ? 'Installation by a Nebsam technician'
                  : order.fulfilment_type === 'pickup'
                    ? 'Collection from a branch'
                    : null,
            },
            { label: 'Branch', value: branch?.name ?? null },
          ]
            .filter((entry) => entry.value)
            .map((entry) => (
              <div
                key={entry.label}
                className="grid gap-1 border-b border-border-hairline py-3 sm:grid-cols-[10rem_1fr] sm:gap-4"
              >
                <dt className="text-body-sm text-text-secondary">{entry.label}</dt>
                <dd className="text-body">
                  {entry.href ? (
                    <a
                      href={entry.href}
                      className="text-brand-signal-ink underline decoration-1 underline-offset-4"
                    >
                      {entry.value}
                    </a>
                  ) : (
                    entry.value
                  )}
                </dd>
              </div>
            ))}
        </dl>
      </section>

      <section className="mt-10">
        <h2 className="font-display-tight text-h3">What was ordered</h2>
        <p className="mt-1 text-body-sm text-text-secondary">
          These are the prices the customer was shown at the time. They are not read from the
          product records and do not change when a price does.
        </p>

        <ScrollTable label="Order lines">
          <thead>
            <tr>
              <Th>Item</Th>
              <Th className="text-right">Qty</Th>
              <Th className="text-right">Unit ({VAT_LABEL})</Th>
              <Th className="text-right">Line ({VAT_LABEL})</Th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line) => (
              <tr key={line.id}>
                <Td>{line.name_snapshot}</Td>
                <Td className="text-right font-mono text-mono tabular-nums">{line.qty}</Td>
                <Td className="text-right font-mono text-mono tabular-nums">
                  {formatKes(line.unit_price_snapshot)}
                </Td>
                <Td className="text-right font-mono text-mono tabular-nums">
                  {formatKes(line.unit_price_snapshot * line.qty)}
                </Td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <Td className="text-body-sm text-text-secondary">Subtotal</Td>
              <Td />
              <Td />
              <Td className="text-right font-mono text-mono tabular-nums">
                {formatKes(order.subtotal_kes)}
              </Td>
            </tr>
            <tr>
              <Td className="text-body-sm text-text-secondary">
                VAT at {(rate * 100).toFixed(0)}% — the rate recorded on this order
              </Td>
              <Td />
              <Td />
              <Td className="text-right font-mono text-mono tabular-nums">{formatKes(vat)}</Td>
            </tr>
            <tr>
              <Td className="text-body font-medium">Total</Td>
              <Td />
              <Td />
              <Td className="text-right font-mono text-mono font-medium tabular-nums">
                {formatKes(total)}
              </Td>
            </tr>
          </tfoot>
        </ScrollTable>

        {mismatch ? (
          <p
            role="alert"
            className="mt-4 max-w-prose rounded-panel border border-state-alert-ink/50 bg-surface p-4 text-body-sm"
          >
            <strong>The stored subtotal and the line items disagree.</strong> The order records{' '}
            {formatKes(order.subtotal_kes)} and the lines add to {formatKes(itemsSubtotal)}. Both
            are shown rather than reconciled, because a mismatch here means either a line was
            written that should not have been or the total was computed from something else — and
            that needs looking at, not smoothing over.
          </p>
        ) : null}

        {recurring.length > 0 ? (
          <div className="mt-6 rounded-panel border border-border-hairline bg-surface p-4">
            <h3 className="text-body font-medium">Recurring fees agreed</h3>
            <ul className="mt-2 flex flex-col gap-1">
              {recurring.map((line) => (
                <li key={line.id} className="text-body-sm text-text-secondary">
                  {line.name_snapshot} — {formatKes(line.recurring_fee_snapshot)} per{' '}
                  {line.recurring_fee_period_snapshot ?? 'year'}, per device
                </li>
              ))}
            </ul>
            <p className="mt-2 text-body-sm text-text-secondary">
              These were disclosed on the product page and carried into the WhatsApp message. They
              are part of what was agreed.
            </p>
          </div>
        ) : null}
      </section>

      <section className="mt-10 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="font-display-tight text-h3">Move it along</h2>
          <div className="mt-4">
            <OrderStatusControl id={order.id} current={status} />
          </div>
        </div>
        <div>
          <h2 className="font-display-tight text-h3">Notes</h2>
          <div className="mt-4">
            <OrderNoteControl id={order.id} current={order.notes} />
          </div>
        </div>
      </section>

      <p className="mt-10 text-body-sm text-text-secondary">
        The customer sees this order at{' '}
        <code className="font-mono text-mono">{ROUTES.order(order.order_number)}</code>. That URL is
        a bearer token — anyone holding the number can open it — so it is never sent anywhere it was
        not already going.
      </p>
    </div>
  );
}
