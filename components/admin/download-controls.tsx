'use client';

import { useActionState } from 'react';
import {
  attachDownloadFile,
  clearDownload,
  withdrawDownload,
  type DownloadResult,
} from '@/app/(admin)/admin/downloads/actions';
import { ActionStatus } from '@/components/admin/primitives';

/**
 * Attaching a file, clearing it, and withdrawing a clearance.
 *
 * All three unbound with the id as a hidden field (V59), all three working
 * without JavaScript.
 *
 * ── The clearance control asks you to type a word ───────────────────────────
 *
 * Not a checkbox. Clearing a document publishes it to anyone on the internet,
 * and every one of the four prepared PDFs is currently blocked because of what
 * is printed inside it — a retired office address, the unpublished phone
 * number, a retired product name, an unsubstantiated claim. A checkbox beside a
 * Save button gets ticked while somebody is thinking about something else.
 *
 * Typing CLEAR is three seconds that cannot happen by accident, and the label
 * says what is being confirmed rather than just asking for the word.
 */

export function AttachFileControl({ id, current }: { id: string; current: string | null }) {
  const [result, action, pending] = useActionState<DownloadResult | null, FormData>(
    attachDownloadFile,
    null,
  );

  return (
    <form action={action} className="flex flex-col gap-2">
      <input type="hidden" name="id" value={id} />
      <label className="flex flex-col gap-1.5">
        <span className="text-body-sm font-medium">Attached file</span>
        <input
          name="file_path"
          defaultValue={current ?? ''}
          placeholder="2026-09/a1b2c3d4e5f60718-brochure.pdf"
          className="min-h-11 rounded-control border border-border-strong bg-surface px-3 font-mono text-mono"
        />
        <span className="text-body-sm text-text-secondary">
          Upload the file on the Media screen first, then copy its path from the card there. Clear
          this box to detach. The size shown to visitors is read from the upload, never typed.
        </span>
      </label>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 items-center justify-center self-start rounded-control border border-border-strong px-4 text-body-sm disabled:opacity-50"
      >
        {pending ? 'Saving…' : 'Save file'}
      </button>
      <ActionStatus result={result} />
    </form>
  );
}

export function ClearanceControl({ id, title }: { id: string; title: string }) {
  const [result, action, pending] = useActionState<DownloadResult | null, FormData>(
    clearDownload,
    null,
  );

  return (
    <form action={action} className="flex flex-col gap-2">
      <input type="hidden" name="id" value={id} />
      <label className="flex flex-col gap-1.5">
        <span className="text-body-sm font-medium">
          Type <code className="font-mono">CLEAR</code> to publish this document
        </span>
        <input
          name="confirm"
          required
          autoComplete="off"
          placeholder="CLEAR"
          aria-describedby={`clear-${id}-warning`}
          className="min-h-11 rounded-control border border-border-strong bg-surface px-3 font-mono text-mono"
        />
        <span id={`clear-${id}-warning`} className="text-body-sm text-text-secondary">
          Confirming that you have opened <strong>{title}</strong> and read it: no retired office
          address, no unpublished phone number, no retired product name, no unsubstantiated claim,
          no third-party branding on a Nebsam document. Your name and the time are recorded against
          this decision.
        </span>
      </label>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 items-center justify-center self-start rounded-control bg-brand-signal-ink px-5 text-body-sm text-white disabled:opacity-50"
      >
        {pending ? 'Clearing…' : 'Clear for publication'}
      </button>
      <ActionStatus result={result} />
    </form>
  );
}

export function WithdrawControl({ id }: { id: string }) {
  const [result, action, pending] = useActionState<DownloadResult | null, FormData>(
    withdrawDownload,
    null,
  );

  return (
    <form action={action} className="flex flex-col gap-2">
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 items-center justify-center self-start rounded-control border border-state-alert-ink/50 px-4 text-body-sm text-state-alert-ink disabled:opacity-50"
      >
        {pending ? 'Withdrawing…' : 'Withdraw from publication'}
      </button>
      <ActionStatus result={result} />
    </form>
  );
}
