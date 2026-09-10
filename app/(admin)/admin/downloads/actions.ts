'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { z } from 'zod';
import { contentTag, serviceClient } from '@/lib/supabase/server';
import { requireStaff } from '@/lib/admin/actor';
import { recordAudit } from '@/lib/admin/audit';
import { ROUTES } from '@/lib/constants';

/**
 * DOWNLOAD ACTIONS — and the clearance, which is the one that matters.
 *
 * `docs/CMS_ARCHITECTURE.md` §6.3 and `DATABASE_ARCHITECTURE.md` §4:
 * `cleared_for_publication` defaults FALSE, can only be set by a human, and
 * records who and when. Migration 0004 backs this with a CHECK constraint —
 * `clearance_is_attributable` — so a cleared row without an actor and a
 * timestamp cannot exist.
 *
 * ── Why clearing is admin-only, and attaching a file is not ─────────────────
 *
 * The RLS policy in 0008 already draws this line:
 *
 *     create policy downloads_editor_write on downloads
 *       for update to authenticated
 *       using (is_staff('editor'))
 *       with check (is_staff('editor') and cleared_for_publication = false);
 *
 * An editor may change anything about a download so long as the row ends up
 * NOT cleared. Only an admin can set the flag. These actions mirror that
 * exactly, because the admin runs under the service role and bypasses RLS —
 * so the policy is the design and `requireStaff` is what actually enforces it
 * here. If the two ever disagree, this file has the bug.
 *
 * All four prepared PDFs are currently uncleared on content grounds: retired
 * addresses, the unpublished phone number, retired product names,
 * unsubstantiated claims, third-party branding, undated documents.
 */

export type DownloadResult = { ok: true; message: string } | { ok: false; message: string };

function revalidateDownloadSurfaces() {
  revalidateTag(contentTag('public_downloads'));
  revalidatePath(ROUTES.downloads);
  revalidatePath(ROUTES.resources);
  revalidatePath('/admin/downloads');
  revalidatePath('/admin');
}

const attachInput = z.object({
  id: z.string().uuid(),
  /**
   * A storage path from the media library, or empty to detach.
   *
   * Validated against the shape `storagePath()` produces AND checked to exist
   * in `media` below. Accepting a free-text path would let someone point a
   * download at any object in the bucket, including one belonging to a
   * suggestion attachment — which is a disclosure, not a typo.
   */
  file_path: z
    .string()
    .trim()
    .max(300)
    .regex(/^$|^\d{4}-\d{2}\/[0-9a-f]{16}(?:-[a-z0-9-]+)?\.[a-z0-9]+$/, 'That is not a media path.'),
});

export async function attachDownloadFile(
  _previous: DownloadResult | null,
  formData: FormData,
): Promise<DownloadResult> {
  const actor = await requireStaff('editor');
  if (!actor) return { ok: false, message: 'You do not have permission to change downloads.' };

  const parsed = attachInput.safeParse({
    id: formData.get('id'),
    file_path: formData.get('file_path') ?? '',
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'That could not be saved.' };
  }

  const db = serviceClient();
  const path = parsed.data.file_path || null;

  let bytes: number | null = null;
  let mime: string | null = null;

  if (path) {
    // It must be a file the media library actually knows about. The regex
    // constrains the shape; this constrains it to a real, recorded upload.
    const { data: media } = await db
      .from('media')
      .select('bytes, mime, privacy_checked')
      .eq('path', path)
      .maybeSingle();

    if (!media) {
      return { ok: false, message: 'No uploaded file has that path. Copy it from the Media screen.' };
    }
    if (!media.privacy_checked) {
      return {
        ok: false,
        message:
          'That file has not been through a privacy check yet. Check it on the Media screen first — a document that reaches the public site is the last place to discover a retired address in it.',
      };
    }
    bytes = media.bytes;
    mime = media.mime;
  }

  const { error } = await db
    .from('downloads')
    .update({
      file_path: path,
      // Size is copied from the upload rather than typed. Brief 9.4 requires
      // the size to be visible BEFORE the click, and a hand-entered figure is
      // one that goes stale the first time the file is replaced.
      file_size: bytes,
      file_type: mime,
      updated_at: new Date().toISOString(),
    })
    .eq('id', parsed.data.id);

  if (error) return { ok: false, message: 'That could not be saved. Try again.' };

  await recordAudit({
    actorId: actor.id,
    action: path ? 'download.attach' : 'download.detach',
    entity: 'download',
    entityId: parsed.data.id,
    diff: { file_path: path, file_size: bytes },
  });

  revalidateDownloadSurfaces();
  return { ok: true, message: path ? 'File attached.' : 'File detached.' };
}

const clearanceInput = z.object({
  id: z.string().uuid(),
  /**
   * Typed confirmation, not a checkbox.
   *
   * Clearing a document publishes it to anyone on the internet, and the four
   * prepared PDFs are blocked because of what is printed inside them. A
   * checkbox next to a "Save" button gets ticked while somebody is thinking
   * about something else. Typing the word is three seconds that cannot happen
   * by accident.
   */
  confirm: z.literal('CLEAR', {
    message: 'Type CLEAR to confirm you have read the document and it is fit to publish.',
  }),
});

export async function clearDownload(
  _previous: DownloadResult | null,
  formData: FormData,
): Promise<DownloadResult> {
  // ADMIN ONLY, matching the RLS policy's `cleared_for_publication = false`
  // check on the editor role.
  const actor = await requireStaff('admin');
  if (!actor) {
    return {
      ok: false,
      message: 'Only an administrator can clear a document for publication.',
    };
  }

  const parsed = clearanceInput.safeParse({
    id: formData.get('id'),
    confirm: formData.get('confirm'),
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'That could not be saved.' };
  }

  const db = serviceClient();
  const { data: row } = await db
    .from('downloads')
    .select('title, slug, file_path, status')
    .eq('id', parsed.data.id)
    .maybeSingle();

  if (!row) return { ok: false, message: 'That download no longer exists.' };
  if (!row.file_path) {
    return {
      ok: false,
      message: 'There is no file attached, so there is nothing to clear. Attach one first.',
    };
  }

  const { error } = await db
    .from('downloads')
    .update({
      cleared_for_publication: true,
      cleared_by: actor.id,
      cleared_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', parsed.data.id);

  if (error) {
    return {
      ok: false,
      message: error.message.includes('clearance_is_attributable')
        ? 'The database refused an unattributed clearance. That is the constraint working — report this.'
        : 'That could not be saved. Try again.',
    };
  }

  await recordAudit({
    actorId: actor.id,
    action: 'download.clear',
    entity: 'download',
    entityId: parsed.data.id,
    diff: { slug: row.slug, cleared_for_publication: true },
  });

  revalidateDownloadSurfaces();
  return {
    ok: true,
    message:
      row.status === 'published'
        ? 'Cleared. It is now downloadable from the public downloads page.'
        : 'Cleared. It still needs its status set to published before the public can see it.',
  };
}

/** Withdraw a clearance. Admin only, and it takes the file off the public site immediately. */
export async function withdrawDownload(
  _previous: DownloadResult | null,
  formData: FormData,
): Promise<DownloadResult> {
  const actor = await requireStaff('admin');
  if (!actor) return { ok: false, message: 'Only an administrator can withdraw a document.' };

  const id = formData.get('id');
  if (!z.string().uuid().safeParse(id).success) {
    return { ok: false, message: 'That download could not be found.' };
  }

  const { error } = await serviceClient()
    .from('downloads')
    .update({
      cleared_for_publication: false,
      // `cleared_by` and `cleared_at` are deliberately LEFT IN PLACE. The CHECK
      // constraint only requires them when the flag is true, and keeping them
      // preserves the record of who cleared it and when — which is exactly what
      // somebody investigating a withdrawal wants to know.
      updated_at: new Date().toISOString(),
    })
    .eq('id', id as string);

  if (error) return { ok: false, message: 'That could not be saved. Try again.' };

  await recordAudit({
    actorId: actor.id,
    action: 'download.withdraw',
    entity: 'download',
    entityId: id as string,
    diff: { cleared_for_publication: false },
  });

  revalidateDownloadSurfaces();
  return { ok: true, message: 'Withdrawn. It is no longer downloadable.' };
}
