'use server';

import { z } from 'zod';
import { serviceClient } from '@/lib/supabase/server';
import { whatsappUrl } from '@/lib/company';
import { ROUTES, VAT_RATE, VAT_LABEL } from '@/lib/constants';

/**
 * ORDER CREATION.
 *
 * Two rules govern this file, and both come from brief 10.2 by way of
 * SHOP_ARCHITECTURE §8:
 *
 * 1. THE ORDER ROW EXISTS BEFORE WHATSAPP OPENS.
 *    A dropped chat must still be a recorded lead. The row is written, the
 *    order number issued, and only then does the caller open wa.me. Killing the
 *    chat mid-flow loses the conversation and nothing else — which is the
 *    single most important detail in the whole shop, because a WhatsApp handoff
 *    that leaves no trace is a lead-generation system that silently loses
 *    leads.
 *
 * 2. THE SERVER TOTAL WINS, because the client never sends a price at all.
 *    This action accepts product IDs and quantities. Nothing else. There is no
 *    price field to tamper with, no total to compare against, and no branch of
 *    logic that trusts a number from a browser — every figure is read from
 *    `public_products` at the moment the order is created. "A tampered client
 *    price is rejected" is satisfied structurally rather than by validation.
 *
 * WHAT IS DELIBERATELY NOT STORED: nothing beyond the name, phone and town the
 * customer typed. No email, no address, no device information. PART 16 —
 * no PII in logs, analytics, URLs or error messages.
 */

const lineSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1).max(99),
});

const orderSchema = z.object({
  customerName: z.string().min(2, 'Please give a name we can use.').max(120),
  // Kenyan mobile numbers, loosely: +254…, 07…, 01…. Deliberately permissive —
  // rejecting a valid number is worse than accepting an odd one, because the
  // order is a lead and a human reads it.
  customerPhone: z
    .string()
    .min(9, 'A phone number is needed so we can reply.')
    .max(20)
    .regex(/^[0-9+\s()-]+$/, 'Use digits, spaces and + only.'),
  customerTown: z.string().max(80).optional().or(z.literal('')),
  fulfilmentType: z.enum(['installation', 'pickup']),
  lines: z.array(lineSchema).min(1, 'Your cart is empty.').max(50),
});

export type OrderResult =
  | { ok: true; orderNumber: string; whatsappUrl: string; orderPath: string }
  | { ok: false; message: string };

/**
 * NBS-YYMMDD-XXXX with a RANDOM suffix.
 *
 * `/orders/[orderNumber]` is reachable by anyone holding the number, so the
 * number is a bearer token. A sequential suffix would let anyone who placed one
 * order enumerate every other order placed that day.
 */
function generateOrderNumber(): string {
  const d = new Date();
  const yy = String(d.getUTCFullYear()).slice(2);
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // no I, L, O, 0, 1
  const bytes = new Uint32Array(4);
  crypto.getRandomValues(bytes);
  const suffix = Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('');
  return `NBS-${yy}${mm}${dd}-${suffix}`;
}

function formatKes(amount: number): string {
  return `KES ${amount.toLocaleString('en-KE')}`;
}

export async function createOrder(formData: FormData): Promise<OrderResult> {
  let lines: unknown;
  try {
    lines = JSON.parse(String(formData.get('lines') ?? '[]'));
  } catch {
    return { ok: false, message: 'Your cart could not be read. Try again.' };
  }

  const parsed = orderSchema.safeParse({
    customerName: formData.get('customerName'),
    customerPhone: formData.get('customerPhone'),
    customerTown: formData.get('customerTown'),
    fulfilmentType: formData.get('fulfilmentType'),
    lines,
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Please check the form.' };
  }

  const input = parsed.data;
  const db = serviceClient();

  // Prices come from the database, never from the request.
  const ids = input.lines.map((l) => l.productId);
  const { data: products, error: readError } = await db
    .from('public_products')
    .select('id, name, price_kes, recurring_fee_kes, recurring_fee_period')
    .in('id', ids);

  if (readError || !products) {
    return { ok: false, message: 'We could not price your order just now. Please try again.' };
  }

  const priced = input.lines.flatMap((line) => {
    const p = products.find((x) => x.id === line.productId);
    // A product that has since been unpublished, or that has no published
    // price, cannot be ordered. Dropping it is safer than guessing a price.
    if (!p || typeof p.price_kes !== 'number' || !p.name) return [];
    return [{ line, product: p, name: p.name, unit: p.price_kes }];
  });

  if (priced.length === 0) {
    return {
      ok: false,
      message:
        'None of the items in your cart has a published price. Send us a message and we will quote them.',
    };
  }

  const subtotal = priced.reduce((sum, i) => sum + i.unit * i.line.quantity, 0);
  const vat = Math.round(subtotal * VAT_RATE);
  const total = subtotal + vat;

  const orderNumber = generateOrderNumber();

  const { data: order, error: orderError } = await db
    .from('orders')
    .insert({
      order_number: orderNumber,
      status: 'new',
      customer_name: input.customerName,
      customer_phone: input.customerPhone,
      customer_town: input.customerTown || null,
      fulfilment_type: input.fulfilmentType,
      subtotal_kes: subtotal,
      vat_rate_snapshot: VAT_RATE,
    })
    .select('id')
    .single();

  if (orderError || !order) {
    return { ok: false, message: 'We could not record your order. Please try again.' };
  }

  // Snapshots: what the customer was SHOWN, not what the product says later.
  const { error: itemsError } = await db.from('order_items').insert(
    priced.map((i) => ({
      order_id: order.id,
      product_id: i.product.id,
      name_snapshot: i.name,
      unit_price_snapshot: i.unit,
      qty: i.line.quantity,
      recurring_fee_snapshot: i.product.recurring_fee_kes ?? null,
    })),
  );
  if (itemsError) {
    return { ok: false, message: 'We could not record your order items. Please try again.' };
  }

  // ── The WhatsApp message. Built AFTER the row exists. ──────────────────────
  // Carries the order number, every line, VAT stated explicitly, and every
  // recurring fee — SHOP_ARCHITECTURE §8 requires the fee in the message, not
  // only on the page, because the message is what both sides refer back to.
  const lineText = priced
    .map((i) => `• ${i.line.quantity} × ${i.name} — ${formatKes(i.unit * i.line.quantity)}`)
    .join('\n');

  const recurring = priced
    .filter((i) => i.product.recurring_fee_kes)
    .map(
      (i) =>
        `• ${i.name}: ${formatKes(i.product.recurring_fee_kes as number)} per ${i.product.recurring_fee_period ?? 'year'}, per device`,
    );

  const message = [
    `Order ${orderNumber}`,
    '',
    lineText,
    '',
    `Subtotal: ${formatKes(subtotal)} (${VAT_LABEL})`,
    `VAT at ${Math.round(VAT_RATE * 100)}%: ${formatKes(vat)}`,
    `Total: ${formatKes(total)}`,
    ...(recurring.length ? ['', 'Recurring costs:', ...recurring] : []),
    '',
    'Prices include installation by a Nebsam technician.',
    `Fulfilment: ${input.fulfilmentType === 'installation' ? 'Installation' : 'Collection from a branch'}`,
    '',
    `Name: ${input.customerName}`,
    ...(input.customerTown ? [`Town: ${input.customerTown}`] : []),
  ].join('\n');

  return {
    ok: true,
    orderNumber,
    whatsappUrl: whatsappUrl(message),
    orderPath: ROUTES.order(orderNumber),
  };
}
