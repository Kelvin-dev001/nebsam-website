'use client';

import { useActionState } from 'react';
import {
  confirmPrivacyCheck,
  deleteMedia,
  type MediaResult,
} from '@/app/(admin)/admin/media/actions';
import { ActionStatus } from '@/components/admin/primitives';

/**
 * The two actions on a stored file.
 *
 * Both unbound with the id as a hidden field (V59), both working without
 * JavaScript.
 *
 * The delete button carries no `confirm()` dialogue. The browser-automation
 * guidance on this project is explicit that a native modal blocks everything,
 * and more importantly a confirm dialogue is not what protects this action:
 * `deleteMedia` refuses outright while any product, solution, industry, post,
 * download or certification still references the file, and it requires `admin`.
 * A dialogue asking "are you sure?" invites a reflex click; a refusal naming
 * the three pages still using the image tells somebody what to do instead.
 */

export function PrivacyCheckControl({ id }: { id: string }) {
  const [result, action, pending] = useActionState<MediaResult | null, FormData>(
    confirmPrivacyCheck,
    null,
  );

  return (
    <form action={action} className="flex flex-col gap-2">
      <input type="hidden" name="id" value={id} />
      <label className="flex flex-col gap-1">
        <span className="sr-only">Privacy note for this file</span>
        <input
          name="privacy_check_note"
          maxLength={500}
          placeholder="What you found, if anything"
          className="min-h-11 rounded-control border border-border-strong bg-surface px-3 text-body-sm"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 items-center justify-center rounded-control border border-border-strong px-4 text-body-sm disabled:opacity-50"
      >
        {pending ? 'Saving…' : 'I have checked this file'}
      </button>
      <ActionStatus result={result} />
    </form>
  );
}

export function DeleteMediaControl({ id }: { id: string }) {
  const [result, action, pending] = useActionState<MediaResult | null, FormData>(deleteMedia, null);

  return (
    <form action={action} className="flex flex-col gap-2">
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 items-center justify-center rounded-control border border-state-alert-ink/50 px-4 text-body-sm text-state-alert-ink disabled:opacity-50"
      >
        {pending ? 'Deleting…' : 'Delete'}
      </button>
      <ActionStatus result={result} />
    </form>
  );
}
