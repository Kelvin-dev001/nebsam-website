'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { serviceClient } from '@/lib/supabase/server';
import { requireStaff } from '@/lib/admin/actor';
import { recordAudit } from '@/lib/admin/audit';
import { ORDER_STATUSES } from '@/lib/constants';

/**
 * ORDER PIPELINE ACTIONS.
 *
 * new → contacted → confirmed → installed → closed, with cancelled as the exit
 * at any point. Brief 11.1.
 *
 * ── What cannot be changed from here, and why ───────────────────────────────
 *
 * Not the customer's name or phone. Not the town. Not a line item. Not a price.
 * Not the VAT rate.
 *
 * `order_items` holds SNAPSHOTS — what the customer was actually shown at the
 * moment they ordered — and `orders.vat_rate_snapshot` holds the rate that
 * applied then. `DATABASE_ARCHITECTURE.md` §3 is explicit that a price change
 * six months later must not rewrite history. An admin screen that let staff
 * edit a snapshot would destroy the one property those columns exist to hold,
 * and it would do it silently, in the record both sides refer back to in a
 * dispute.
 *
 * So the pipeline moves the status and records notes. A wrong order is
 * cancelled and replaced, which leaves both facts in the log. Correcting a
 * quantity is a conversation, not a database edit.
 */

export type OrderResult = { ok: true; message: string } | { ok: false; message: string };

const statusInput = z.object({
  id: z.string().uuid(),
  status: z.enum(ORDER_STATUSES),
});

export async function setOrderStatus(
  _previous: OrderResult | null,
  formData: FormData,
): Promise<OrderResult> {
  const actor = await requireStaff('sales');
  if (!actor) return { ok: false, message: 'You do not have permission to change this.' };

  const parsed = statusInput.safeParse({
    id: formData.get('id'),
    status: formData.get('status'),
  });
  if (!parsed.success) return { ok: false, message: 'That is not a status this pipeline uses.' };

  // Read the previous value so the audit entry records a transition rather than
  // just a destination. "confirmed" tells you nothing; "contacted → confirmed"
  // tells you what happened.
  const { data: before } = await serviceClient()
    .from('orders')
    .select('status, order_number')
    .eq('id', parsed.data.id)
    .maybeSingle();

  if (!before) return { ok: false, message: 'That order no longer exists.' };

  const { error } = await serviceClient()
    .from('orders')
    .update({ status: parsed.data.status })
    .eq('id', parsed.data.id);

  if (error) return { ok: false, message: 'The change could not be saved. Try again.' };

  await recordAudit({
    actorId: actor.id,
    action: 'order.status',
    entity: 'order',
    entityId: parsed.data.id,
    // The order number is safe to log — it identifies an order, not a person,
    // and it is the handle staff actually use. The customer's name and phone
    // are stripped by `recordAudit` whether or not a caller passes them.
    diff: { order_number: before.order_number, from: before.status, to: parsed.data.status },
  });

  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${parsed.data.id}`);
  revalidatePath('/admin');
  return { ok: true, message: `Moved to ${parsed.data.status}.` };
}

const noteInput = z.object({
  id: z.string().uuid(),
  notes: z.string().max(4000, 'Keep internal notes under 4,000 characters.'),
});

export async function saveOrderNote(
  _previous: OrderResult | null,
  formData: FormData,
): Promise<OrderResult> {
  const actor = await requireStaff('sales');
  if (!actor) return { ok: false, message: 'You do not have permission to change this.' };

  const parsed = noteInput.safeParse({
    id: formData.get('id'),
    notes: formData.get('notes'),
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'That note could not be saved.' };
  }

  const { error } = await serviceClient()
    .from('orders')
    .update({ notes: parsed.data.notes })
    .eq('id', parsed.data.id);

  if (error) return { ok: false, message: 'The note could not be saved. Try again.' };

  await recordAudit({
    actorId: actor.id,
    action: 'order.note',
    entity: 'order',
    entityId: parsed.data.id,
    diff: { note_length: parsed.data.notes.length },
  });

  revalidatePath(`/admin/orders/${parsed.data.id}`);
  return { ok: true, message: 'Note saved.' };
}
