'use client';

import { useActionState } from 'react';
import { ActionStatus } from '@/components/admin/primitives';
import { Button } from '@/components/ui/button';
import { TextareaField, SelectField } from '@/components/ui/field';
import {
  setSubmissionStatus,
  saveSubmissionNote,
  assignSubmission,
  type InboxResult,
} from '@/app/(admin)/admin/inbox/actions';
import { SUBMISSION_STATUSES, type SubmissionStatus } from '@/lib/constants';

/**
 * The three things a salesperson does to an enquiry: move it along, own it,
 * write down what happened.
 *
 * Three separate forms rather than one "save everything" form, because they are
 * three separate decisions and a combined form makes changing a status require
 * re-submitting a note somebody else wrote thirty seconds ago.
 *
 * Every action is UNBOUND and carries its id as a hidden field — register item
 * V59: a bound server action hangs the production server outright on the
 * no-JavaScript path under Next 15.5.23. The id is untrusted and every action
 * validates it as a uuid, but note what it actually controls: which row a
 * signed-in salesperson updates in a table they may already read and write in
 * full. There is no privilege attached to it.
 */

const STATUS_LABEL: Record<SubmissionStatus, string> = {
  new: 'New',
  in_progress: 'In progress',
  answered: 'Answered',
  spam: 'Spam',
};

export function StatusControl({ id, current }: { id: string; current: SubmissionStatus }) {
  const [result, action, pending] = useActionState<InboxResult | null, FormData>(
    setSubmissionStatus,
    null,
  );

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="id" value={id} />
      <SelectField
        label="Status"
        name="status"
        defaultValue={current}
        options={SUBMISSION_STATUSES.map((value) => ({ value, label: STATUS_LABEL[value] }))}
      />
      <Button type="submit" variant="secondary" disabled={pending}>
        {pending ? 'Saving…' : 'Update status'}
      </Button>
      <ActionStatus result={result} />
    </form>
  );
}

export function AssignControl({
  id,
  current,
  staff,
}: {
  id: string;
  current: string | null;
  staff: { id: string; label: string }[];
}) {
  const [result, action, pending] = useActionState<InboxResult | null, FormData>(
    assignSubmission,
    null,
  );

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="id" value={id} />
      <SelectField
        label="Assigned to"
        name="assigned_to"
        defaultValue={current ?? ''}
        options={[
          { value: '', label: 'Nobody' },
          ...staff.map((person) => ({ value: person.id, label: person.label })),
        ]}
      />
      <Button type="submit" variant="secondary" disabled={pending}>
        {pending ? 'Saving…' : 'Save assignment'}
      </Button>
      <ActionStatus result={result} />
    </form>
  );
}

export function NoteControl({ id, current }: { id: string; current: string | null }) {
  const [result, action, pending] = useActionState<InboxResult | null, FormData>(
    saveSubmissionNote,
    null,
  );

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="id" value={id} />
      <TextareaField
        label="Internal note"
        name="notes"
        defaultValue={current ?? ''}
        rows={5}
        hint="Only staff see this. It is never shown to the enquirer and never sent anywhere."
      />
      <Button type="submit" variant="secondary" disabled={pending}>
        {pending ? 'Saving…' : 'Save note'}
      </Button>
      <ActionStatus result={result} />
    </form>
  );
}
