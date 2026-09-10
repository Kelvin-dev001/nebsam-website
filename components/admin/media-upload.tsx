'use client';

import { useActionState } from 'react';
import { uploadMedia, type MediaResult } from '@/app/(admin)/admin/media/actions';
import { Button } from '@/components/ui/button';
import { ActionStatus } from '@/components/admin/primitives';
import { MAX_IMAGE_BYTES, MAX_DOCUMENT_BYTES } from '@/lib/admin/upload-limits';

/**
 * THE UPLOAD FORM.
 *
 * Three fields, and two of them are the point.
 *
 * ── Alt text, and why it is not optional here either ────────────────────────
 *
 * `media.alt_text` is NOT NULL in the database and required by the Zod schema.
 * The form makes it required a third time, and puts it ABOVE the privacy
 * prompt rather than below the file input, so it reads as part of describing
 * the file rather than as a box to clear on the way out.
 *
 * ── The privacy prompt is a required choice, not a checkbox ─────────────────
 *
 * Brief 3.6 requires every supplied screenshot to be treated as suspect until
 * checked for plates, faces, names, coordinates and device IDs.
 * `docs/CMS_ARCHITECTURE.md` §5 says the upload moment is the only point where
 * that check reliably happens.
 *
 * A checkbox defaulting to unchecked is a checkbox that gets skipped. Two radio
 * buttons with no default cannot be skipped: the form will not submit until
 * somebody answers, and "not checked yet" is a legitimate answer that puts the
 * file on the dashboard until a human looks at it. What is not available is
 * saying nothing.
 *
 * ── No drag and drop ────────────────────────────────────────────────────────
 *
 * §5 asks for it and this is a plain file input. Drag-and-drop is a keyboard
 * and screen-reader liability unless it is built alongside a working file input
 * — which is what this is. Recorded in the Sprint 12 report; the input is the
 * accessible path and should stay even after a drop zone is added over it.
 */
export function MediaUpload() {
  const [result, action, pending] = useActionState<MediaResult | null, FormData>(uploadMedia, null);

  return (
    <form
      action={action}
      encType="multipart/form-data"
      className="mt-6 flex flex-col gap-5 rounded-panel border border-border-hairline bg-surface p-5"
    >
      <div>
        <h2 className="font-display-tight text-h3">Upload a file</h2>
        <p className="mt-1 text-body-sm text-text-secondary">
          JPEG, PNG, WebP, AVIF or PDF. Images up to {Math.round(MAX_IMAGE_BYTES / 1024)} KB,
          documents up to {Math.round(MAX_DOCUMENT_BYTES / 1024 / 1024)} MB. The file&rsquo;s actual
          contents are checked, not just its name.
        </p>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-body-sm font-medium">
          File <span className="font-normal text-text-secondary">(required)</span>
        </span>
        <input
          type="file"
          name="file"
          required
          accept=".jpg,.jpeg,.png,.webp,.avif,.pdf"
          className="min-h-11 rounded-control border border-border-strong bg-surface px-3 py-2 text-body"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-body-sm font-medium">
          Alt text <span className="font-normal text-text-secondary">(required)</span>
        </span>
        <input
          name="alt_text"
          required
          minLength={4}
          maxLength={300}
          className="min-h-11 rounded-control border border-border-strong bg-surface px-3 text-body"
        />
        <span className="text-body-sm text-text-secondary">
          Describe what is in the file for someone who cannot see it. Not &ldquo;image&rdquo; and not
          the filename — what it shows. For a PDF, what the document is.
        </span>
      </label>

      <fieldset className="rounded-data border border-border-hairline p-4">
        <legend className="px-2 text-body-sm font-medium">
          Privacy check <span className="font-normal text-text-secondary">(required)</span>
        </legend>
        <p className="text-body-sm text-text-secondary">
          Look at the file before answering. Does it show a vehicle registration plate, an
          identifiable face, a customer or staff name, GPS coordinates, a device ID, or a
          third party&rsquo;s branding?
        </p>
        <div className="mt-3 flex flex-col gap-2">
          <label className="flex min-h-11 items-center gap-3 text-body-sm">
            <input
              type="radio"
              name="privacy_checked"
              value="checked"
              required
              className="h-5 w-5 border border-border-strong"
            />
            I have looked, and it carries none of those — or consent is held and on file
          </label>
          <label className="flex min-h-11 items-center gap-3 text-body-sm">
            <input
              type="radio"
              name="privacy_checked"
              value="not_checked"
              required
              className="h-5 w-5 border border-border-strong"
            />
            Not checked yet — upload it and flag it for review
          </label>
        </div>

        <label className="mt-4 flex flex-col gap-1.5">
          <span className="text-body-sm font-medium">Note</span>
          <input
            name="privacy_check_note"
            maxLength={500}
            placeholder="Plate KCK 283C visible; written consent held 4 Sep 2026"
            className="min-h-11 rounded-control border border-border-strong bg-surface px-3 text-body"
          />
          <span className="text-body-sm text-text-secondary">
            If something IS visible and consent is held, say so here. It is the record if it is ever
            questioned.
          </span>
        </label>
      </fieldset>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? 'Uploading…' : 'Upload'}
        </Button>
        <ActionStatus result={result} />
      </div>
    </form>
  );
}
