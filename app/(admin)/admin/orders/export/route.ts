import { type NextRequest } from 'next/server';
import { requireStaff } from '@/lib/admin/actor';
import { serviceClient } from '@/lib/supabase/server';
import { recordAudit } from '@/lib/admin/audit';
import { ORDER_STATUSES } from '@/lib/constants';

/**
 * ORDER EXPORT.
 *
 * Brief 11.1 asks for it. Same four properties as the inbox export — role
 * checked here rather than trusted from the middleware, the row count audited,
 * `attachment` and `no-store`, and the formula-injection guard.
 *
 * ── One row per LINE, not per order ─────────────────────────────────────────
 *
 * An order with three items becomes three rows carrying the same order number.
 * The alternative is one row per order with the items crammed into a single
 * cell, which is a spreadsheet nobody can sum, filter or pivot — and the reason
 * to export at all is to do arithmetic outside the admin.
 *
 * Every money column is the SNAPSHOT. Nothing here is joined to `products`, for
 * the reason the order detail page gives at length: today's price against a
 * six-month-old order is wrong in exactly the conversation that matters.
 */
export const dynamic = 'force-dynamic';

function cell(value: unknown): string {
  let text = value === null || value === undefined ? '' : String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET(request: NextRequest) {
  const actor = await requireStaff('sales');
  if (!actor) return new Response('Not permitted.', { status: 403 });

  const requested = request.nextUrl.searchParams.get('status');
  const status = ORDER_STATUSES.find((value) => value === requested) ?? null;

  let query = serviceClient()
    .from('orders')
    .select(
      `id, order_number, status, customer_name, customer_phone, customer_town,
       fulfilment_type, subtotal_kes, vat_rate_snapshot, whatsapp_sent_at, notes, created_at,
       order_items ( name_snapshot, unit_price_snapshot, qty, recurring_fee_snapshot, recurring_fee_period_snapshot )`,
    )
    .order('created_at', { ascending: false })
    .limit(2000);

  if (status) query = query.eq('status', status);

  const { data: orders, error } = await query;
  if (error) return new Response('The export could not be produced.', { status: 500 });

  const columns = [
    'order_number',
    'placed',
    'status',
    'customer_name',
    'customer_phone',
    'town',
    'fulfilment',
    'whatsapp_opened',
    'item',
    'qty',
    'unit_price_excl_vat',
    'line_total_excl_vat',
    'recurring_fee',
    'recurring_period',
    'order_subtotal_excl_vat',
    'order_vat_rate',
    'internal_notes',
  ];

  const lines = [columns.map(cell).join(',')];
  let rowCount = 0;

  for (const order of orders ?? []) {
    const items = order.order_items ?? [];
    // An order with no items still gets a row. A zero-item order is an anomaly
    // worth seeing in the export, and dropping it would make the spreadsheet
    // disagree with the admin about how many orders exist.
    const entries = items.length > 0 ? items : [null];

    for (const item of entries) {
      rowCount += 1;
      lines.push(
        [
          order.order_number,
          new Date(order.created_at).toISOString(),
          order.status,
          order.customer_name ?? '',
          order.customer_phone ?? '',
          order.customer_town ?? '',
          order.fulfilment_type ?? '',
          order.whatsapp_sent_at ? 'yes' : 'no',
          item?.name_snapshot ?? '',
          item?.qty ?? '',
          item?.unit_price_snapshot ?? '',
          item ? item.unit_price_snapshot * item.qty : '',
          item?.recurring_fee_snapshot ?? '',
          item?.recurring_fee_period_snapshot ?? '',
          order.subtotal_kes,
          order.vat_rate_snapshot ?? '',
          order.notes ?? '',
        ]
          .map(cell)
          .join(','),
      );
    }
  }

  await recordAudit({
    actorId: actor.id,
    action: 'order.export',
    entity: 'order',
    diff: { orders: orders?.length ?? 0, rows: rowCount, status: status ?? 'all' },
  });

  const stamp = new Date().toISOString().slice(0, 10);
  return new Response(`﻿${lines.join('\r\n')}\r\n`, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="nebsam-orders-${status ?? 'all'}-${stamp}.csv"`,
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
