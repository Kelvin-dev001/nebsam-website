'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { serviceClient } from '@/lib/supabase/server';
import { requireStaff } from '@/lib/admin/actor';
import { recordAudit } from '@/lib/admin/audit';
import { SUBMISSION_STATUSES } from '@/lib/constants';

/**
 * INBOX SERVER ACTIONS.
 *
 * The same four steps as every other admin mutation on this project: establish
 * the actor from the SESSION, validate with Zod on the server, write with the
 * service role, then audit and revalidate.
 *
 * ── What is deliberately missing ────────────────────────────────────────────
 *
 * There is no delete. `docs/CMS_ARCHITECTURE.md` §7 wants junk handled, and the
 * pipeline handles it with a `spam` status instead — a deleted row cannot be
 * counted, and how much the honeypot actually stops is worth knowing. It also
 * means a salesperson cannot destroy an enquiry by misreading it.
 *
 * There is no edit-the-payload action either. What the enquirer wrote is what
 * they wrote; staff annotate it in `notes`. An inbox where the message can be
 * changed after the fact is an inbox whose contents cannot be relied on in a
 * dispute.
 */

export type InboxResult = { ok: true; message: string } | { ok: false; message: string };

const statusInput = z.object({
  id: z.string().uuid(),
  status: z.enum(SUBMISSION_STATUSES),
});

export async function setSubmissionStatus(
  _previous: InboxResult | null,
  formData: FormData,
): Promise<InboxResult> {
  const actor = await requireStaff('sales');
  if (!actor) return { ok: false, message: 'You do not have permission to change this.' };

  const parsed = statusInput.safeParse({
    id: formData.get('id'),
    status: formData.get('status'),
  });
  if (!parsed.success) return { ok: false, message: 'That is not a status this inbox uses.' };

  const { error } = await serviceClient()
    .from('submissions')
    .update({ status: parsed.data.status })
    .eq('id', parsed.data.id);

  if (error) return { ok: false, message: 'The change could not be saved. Try again.' };

  // The diff carries the id and the new status. It does NOT carry the payload —
  // `recordAudit` strips it, so an audit trail of who handled which enquiry
  // never becomes a second copy of everyone's phone number.
  await recordAudit({
    actorId: actor.id,
    action: 'submission.status',
    entity: 'submission',
    entityId: parsed.data.id,
    diff: { status: parsed.data.status },
  });

  revalidatePath('/admin/inbox');
  revalidatePath(`/admin/inbox/${parsed.data.id}`);
  revalidatePath('/admin');
  return { ok: true, message: `Marked ${parsed.data.status.replace('_', ' ')}.` };
}

const noteInput = z.object({
  id: z.string().uuid(),
  notes: z.string().max(4000, 'Keep internal notes under 4,000 characters.'),
});

export async function saveSubmissionNote(
  _previous: InboxResult | null,
  formData: FormData,
): Promise<InboxResult> {
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
    .from('submissions')
    .update({ notes: parsed.data.notes })
    .eq('id', parsed.data.id);

  if (error) return { ok: false, message: 'The note could not be saved. Try again.' };

  // Length, not content. An internal note may reasonably name the customer, and
  // the audit log is not the place for a second copy of that.
  await recordAudit({
    actorId: actor.id,
    action: 'submission.note',
    entity: 'submission',
    entityId: parsed.data.id,
    diff: { note_length: parsed.data.notes.length },
  });

  revalidatePath(`/admin/inbox/${parsed.data.id}`);
  return { ok: true, message: 'Note saved.' };
}

const assignInput = z.object({
  id: z.string().uuid(),
  /** Empty string means unassign. */
  assigned_to: z.string().uuid().or(z.literal('')),
});

export async function assignSubmission(
  _previous: InboxResult | null,
  formData: FormData,
): Promise<InboxResult> {
  const actor = await requireStaff('sales');
  if (!actor) return { ok: false, message: 'You do not have permission to change this.' };

  const parsed = assignInput.safeParse({
    id: formData.get('id'),
    assigned_to: formData.get('assigned_to') ?? '',
  });
  if (!parsed.success) return { ok: false, message: 'That is not a valid assignee.' };

  const assignee = parsed.data.assigned_to || null;

  // An assignee must be a real staff profile. Without this check the column is
  // a free-form uuid field on a public-facing table's admin surface, and a
  // foreign key violation would surface to a salesperson as a raw database
  // error — which `docs/CMS_ARCHITECTURE.md` §3 names as its own failure mode.
  if (assignee) {
    const { data: profile } = await serviceClient()
      .from('profiles')
      .select('id')
      .eq('id', assignee)
      .maybeSingle();
    if (!profile) return { ok: false, message: 'That person no longer has a staff account.' };
  }

  const { error } = await serviceClient()
    .from('submissions')
    .update({ assigned_to: assignee })
    .eq('id', parsed.data.id);

  if (error) return { ok: false, message: 'The assignment could not be saved. Try again.' };

  await recordAudit({
    actorId: actor.id,
    action: assignee ? 'submission.assign' : 'submission.unassign',
    entity: 'submission',
    entityId: parsed.data.id,
    diff: { assigned_to: assignee },
  });

  revalidatePath(`/admin/inbox/${parsed.data.id}`);
  revalidatePath('/admin/inbox');
  return { ok: true, message: assignee ? 'Assigned.' : 'Assignment cleared.' };
}
