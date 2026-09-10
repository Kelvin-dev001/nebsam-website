'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { serviceClient } from '@/lib/supabase/server';
import { requireStaff } from '@/lib/admin/actor';
import { recordAudit } from '@/lib/admin/audit';
import { checkUpload, storagePath, imageDimensions } from '@/lib/admin/uploads';

/**
 * MEDIA UPLOAD.
 *
 * `docs/CMS_ARCHITECTURE.md` §5 and `docs/SECURITY_REQUIREMENTS.md` §3.
 *
 * ── Order of operations, and why it is this order ───────────────────────────
 *
 *   1. Authorise. 2. Validate the metadata. 3. Read the first 32 bytes and
 *   decide from the BYTES whether the file may be stored. 4. Upload to the
 *   private bucket. 5. Insert the `media` row. 6. Audit.
 *
 * Step 3 before step 4 matters: nothing unvalidated ever reaches storage, so
 * there is no window in which a rejected file exists in the bucket waiting for
 * a cleanup that might not run.
 *
 * Step 4 before step 5 matters for the opposite reason. If the insert fails,
 * the object is deleted again — an orphaned OBJECT is invisible and permanent,
 * while an orphaned ROW would point at nothing and break every screen that
 * reads it. The compensating delete is the lesser evil and it is explicit
 * rather than left to chance.
 *
 * ── Alt text is required, and the database agrees ───────────────────────────
 *
 * `media.alt_text` is NOT NULL with a length check (migration 0007). §5: "a
 * nullable column with a 'required' form field is a rule that lasts until the
 * first hurried upload". The Zod schema is the friendly half of the same rule.
 */

const BUCKET = 'uploads';

export type MediaResult =
  | { ok: true; id: string; message: string }
  | { ok: false; message: string };

const metaSchema = z.object({
  alt_text: z
    .string()
    .trim()
    .min(4, 'Alt text is required. Describe what is in the image, for someone who cannot see it.')
    .max(300, 'Keep alt text under 300 characters.'),
  /**
   * The privacy check. Brief 3.6 requires every supplied screenshot to be
   * treated as suspect until checked for plates, faces, names, coordinates and
   * device IDs, and §5 says the upload moment is the only point where that
   * check reliably happens.
   *
   * It is a REQUIRED confirmation rather than an optional checkbox: the form
   * cannot be submitted without answering it either way, and answering "not
   * checked" is allowed and recorded. A prompt that can be ignored is not a
   * prompt.
   */
  privacy_checked: z.enum(['checked', 'not_checked']),
  privacy_check_note: z.string().trim().max(500).optional().or(z.literal('')),
});

export async function uploadMedia(
  _previous: MediaResult | null,
  formData: FormData,
): Promise<MediaResult> {
  const actor = await requireStaff('editor');
  if (!actor) return { ok: false, message: 'You do not have permission to upload files.' };

  const parsed = metaSchema.safeParse({
    alt_text: formData.get('alt_text'),
    privacy_checked: formData.get('privacy_checked'),
    privacy_check_note: formData.get('privacy_check_note') ?? '',
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Check the form.' };
  }

  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: 'Choose a file to upload.' };
  }

  // Only the head is read to make the decision. Reading a whole 8 MB file into
  // memory in order to reject it is a memory cost an attacker chooses.
  const head = new Uint8Array(await file.slice(0, 32).arrayBuffer());
  const check = checkUpload(file.name, file.size, head);
  if (!check.ok) return { ok: false, message: check.message };

  const path = storagePath(file.name, check.kind);
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error: uploadError } = await serviceClient()
    .storage.from(BUCKET)
    .upload(path, bytes, {
      // The SNIFFED type, never the browser's claim. Storing the client's
      // Content-Type would let an uploader control the type the file is later
      // served with, which is most of what makes a malicious upload work.
      contentType: check.kind.mime,
      upsert: false,
    });

  if (uploadError) {
    return { ok: false, message: `The file could not be stored: ${uploadError.message}` };
  }

  const { width, height } = check.kind.image
    ? imageDimensions(bytes, check.kind.mime)
    : { width: null, height: null };

  const { data: row, error: insertError } = await serviceClient()
    .from('media')
    .insert({
      path,
      alt_text: parsed.data.alt_text,
      width,
      height,
      bytes: file.size,
      mime: check.kind.mime,
      uploaded_by: actor.id,
      privacy_checked: parsed.data.privacy_checked === 'checked',
      privacy_check_note: parsed.data.privacy_check_note || null,
    })
    .select('id')
    .single();

  if (insertError || !row) {
    // Compensating delete. See the header: an orphaned object is invisible and
    // permanent; better to lose the upload than to keep a file nothing knows
    // about.
    await serviceClient().storage.from(BUCKET).remove([path]);
    return { ok: false, message: 'The file was rejected by the database and has been removed.' };
  }

  await recordAudit({
    actorId: actor.id,
    action: 'media.upload',
    entity: 'media',
    entityId: row.id,
    // The path, size and type. Not the alt text, which may name a person or a
    // place — `recordAudit` would strip it anyway, and it is not passed.
    diff: {
      path,
      mime: check.kind.mime,
      bytes: file.size,
      privacy_checked: parsed.data.privacy_checked === 'checked',
    },
  });

  revalidatePath('/admin/media');
  revalidatePath('/admin');
  return {
    ok: true,
    id: row.id,
    message:
      parsed.data.privacy_checked === 'checked'
        ? 'Uploaded.'
        : 'Uploaded, and flagged as not privacy-checked. It appears on the dashboard until someone checks it.',
  };
}

const privacyInput = z.object({
  id: z.string().uuid(),
  privacy_check_note: z.string().trim().max(500).optional().or(z.literal('')),
});

/** Record that a human has looked for plates, faces, names and coordinates. */
export async function confirmPrivacyCheck(
  _previous: MediaResult | null,
  formData: FormData,
): Promise<MediaResult> {
  const actor = await requireStaff('editor');
  if (!actor) return { ok: false, message: 'You do not have permission to do that.' };

  const parsed = privacyInput.safeParse({
    id: formData.get('id'),
    privacy_check_note: formData.get('privacy_check_note') ?? '',
  });
  if (!parsed.success) return { ok: false, message: 'That file could not be found.' };

  const { error } = await serviceClient()
    .from('media')
    .update({
      privacy_checked: true,
      privacy_check_note: parsed.data.privacy_check_note || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', parsed.data.id);

  if (error) return { ok: false, message: 'That could not be saved. Try again.' };

  await recordAudit({
    actorId: actor.id,
    action: 'media.privacy_checked',
    entity: 'media',
    entityId: parsed.data.id,
    diff: { privacy_checked: true },
  });

  revalidatePath('/admin/media');
  revalidatePath('/admin');
  return { ok: true, id: parsed.data.id, message: 'Recorded as checked.' };
}

/**
 * Delete a file.
 *
 * Admin only, and it checks for USAGE first. §5 asks for usage tracking "so
 * nothing is deleted out from under a page", and the check is the only thing
 * standing between a tidy-up and a product page with a missing hero image.
 *
 * The row goes before the object. If the object delete fails the row is already
 * gone, which leaves an orphaned object — the same trade the upload path makes,
 * and for the same reason.
 */
export async function deleteMedia(
  _previous: MediaResult | null,
  formData: FormData,
): Promise<MediaResult> {
  const actor = await requireStaff('admin');
  if (!actor) return { ok: false, message: 'Only an administrator can delete a file.' };

  const id = formData.get('id');
  if (!z.string().uuid().safeParse(id).success) {
    return { ok: false, message: 'That file could not be found.' };
  }

  const db = serviceClient();
  const { data: row } = await db.from('media').select('path').eq('id', id as string).maybeSingle();
  if (!row) return { ok: false, message: 'That file no longer exists.' };

  const usage = await findUsage(row.path);
  if (usage.length > 0) {
    return {
      ok: false,
      message: `This file is still in use by: ${usage.join(', ')}. Remove those references first — deleting it now would leave a broken image on a live page.`,
    };
  }

  const { error } = await db.from('media').delete().eq('id', id as string);
  if (error) return { ok: false, message: 'That could not be deleted. Try again.' };

  await db.storage.from(BUCKET).remove([row.path]);

  await recordAudit({
    actorId: actor.id,
    action: 'media.delete',
    entity: 'media',
    entityId: id as string,
    diff: { path: row.path },
  });

  revalidatePath('/admin/media');
  return { ok: true, id: id as string, message: 'Deleted.' };
}

/**
 * Where a stored path is referenced.
 *
 * Checks the columns that actually hold one: product, solution and industry
 * hero and SEO images, download files and thumbnails, blog featured images,
 * certification documents and images. Names rather than counts, so the message
 * tells someone where to go.
 */
export async function findUsage(path: string): Promise<string[]> {
  const db = serviceClient();
  const used: string[] = [];

  const [products, solutions, industries, posts, downloads, certifications] = await Promise.all([
    db.from('products').select('name').or(`seo_image.eq.${path},gallery.cs.["${path}"]`),
    db.from('solutions').select('name').or(`hero_image.eq.${path},seo_image.eq.${path}`),
    db.from('industries').select('name').or(`hero_image.eq.${path},seo_image.eq.${path}`),
    db.from('blog_posts').select('title').or(`featured_image.eq.${path},seo_image.eq.${path}`),
    db.from('downloads').select('title').or(`file_path.eq.${path},thumbnail.eq.${path}`),
    db.from('certifications').select('name').or(`document_path.eq.${path},image.eq.${path}`),
  ]);

  for (const row of products.data ?? []) used.push(`product “${row.name}”`);
  for (const row of solutions.data ?? []) used.push(`solution “${row.name}”`);
  for (const row of industries.data ?? []) used.push(`industry “${row.name}”`);
  for (const row of posts.data ?? []) used.push(`post “${row.title}”`);
  for (const row of downloads.data ?? []) used.push(`download “${row.title}”`);
  for (const row of certifications.data ?? []) used.push(`certification “${row.name}”`);

  return used;
}
