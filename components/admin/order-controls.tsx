'use client';

import { useActionState } from 'react';
import { ActionStatus } from '@/components/admin/primitives';
import { Button } from '@/components/ui/button';
import { TextareaField, SelectField } from '@/components/ui/field';
import { setOrderStatus, saveOrderNote, type OrderResult } from '@/app/(admin)/admin/orders/actions';
import { ORDER_STATUSES } from '@/lib/constants';

/**
 * The two things a salesperson does to an order.
 *
 * Both actions are UNBOUND with the id as a hidden field — register item V59.
 * Both work with JavaScript off.
 *
 * Note what is NOT here: no way to edit a line, a quantity or a price. Those
 * are snapshots of what the customer was shown, and an admin that could rewrite
 * them would destroy the only property they exist to hold. See the header of
 * `app/(admin)/admin/orders/actions.ts`.
 */

const STATUS_LABEL: Record<(typeof ORDER_STATUSES)[number], string> = {
  new: 'New',
  contacted: 'Contacted',
  confirmed: 'Confirmed',
  installed: 'Installed',
  closed: 'Closed',
  cancelled: 'Cancelled',
};

export function OrderStatusControl({
  id,
  current,
}: {
  id: string;
  current: (typeof ORDER_STATUSES)[number];
}) {
  const [result, action, pending] = useActionState<OrderResult | null, FormData>(
    setOrderStatus,
    null,
  );

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="id" value={id} />
      <SelectField
        label="Status"
        name="status"
        defaultValue={current}
        options={ORDER_STATUSES.map((value) => ({ value, label: STATUS_LABEL[value] }))}
        hint="New and contacted both count as outstanding on the dashboard."
      />
      <Button type="submit" variant="secondary" disabled={pending}>
        {pending ? 'Saving…' : 'Update status'}
      </Button>
      <ActionStatus result={result} />
    </form>
  );
}

export function OrderNoteControl({ id, current }: { id: string; current: string | null }) {
  const [result, action, pending] = useActionState<OrderResult | null, FormData>(
    saveOrderNote,
    null,
  );

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="id" value={id} />
      <TextareaField
        label="Internal note"
        name="notes"
        defaultValue={current ?? ''}
        rows={6}
        hint="Only staff see this. The customer never does."
      />
      <Button type="submit" variant="secondary" disabled={pending}>
        {pending ? 'Saving…' : 'Save note'}
      </Button>
      <ActionStatus result={result} />
    </form>
  );
}
