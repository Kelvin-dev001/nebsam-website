import 'server-only';
import { UPLOAD_KINDS, MAX_IMAGE_BYTES, MAX_DOCUMENT_BYTES, type UploadKind } from './upload-limits';

/**
 * UPLOAD VALIDATION.
 *
 * `docs/SECURITY_REQUIREMENTS.md` §3: "extension allowlist AND MIME sniffing
 * (extension alone is not a check), size cap, private bucket, served only
 * through short-lived signed URLs".
 *
 * ── Why the extension is not a check ────────────────────────────────────────
 *
 * Because the uploader chooses it. `payload.php.jpg`, `payload.svg` renamed to
 * `.png`, an HTML file called `.pdf` — every one passes an extension check and
 * none is what it claims. The browser-supplied `Content-Type` is no better: it
 * also comes from the client, and on Windows it is frequently just a lookup of
 * the same extension.
 *
 * So the bytes are read. Every format on the allowlist has a fixed signature in
 * its first few bytes, and a file whose signature disagrees with its extension
 * is refused with that stated plainly — a mismatch is either a mistake worth
 * knowing about or an attack, and both deserve the same answer.
 *
 * ── Why SVG is not on the allowlist ─────────────────────────────────────────
 *
 * An SVG is a document, not an image: it can carry `<script>`, external
 * references and event handlers, and it is served with a MIME type browsers
 * execute. Allowing one into a media library is allowing stored cross-site
 * scripting with extra steps. Register item V37 wants an SVG logo, and that is
 * a repository asset reviewed in a pull request, not an upload.
 */

export type UploadCheck =
  | { ok: true; kind: UploadKind }
  | { ok: false; message: string };

function extensionOf(filename: string): string {
  const dot = filename.lastIndexOf('.');
  return dot === -1 ? '' : filename.slice(dot + 1).toLowerCase();
}

function matches(bytes: Uint8Array, kind: UploadKind): boolean {
  const offset = kind.offset ?? 0;
  if (bytes.length < offset + kind.signature.length) return false;
  return kind.signature.every((byte, index) => bytes[offset + index] === byte);
}

/**
 * Decide whether a file may be stored, from its NAME, its SIZE and its BYTES.
 *
 * Called with the first 32 bytes, which is enough for every signature on the
 * list and avoids reading a large file into memory to reject it.
 */
export function checkUpload(filename: string, size: number, head: Uint8Array): UploadCheck {
  const extension = extensionOf(filename);
  if (!extension) {
    return { ok: false, message: 'That file has no extension, so its type cannot be established.' };
  }

  const claimed = UPLOAD_KINDS.find((kind) => kind.extensions.includes(extension));
  if (!claimed) {
    const allowed = UPLOAD_KINDS.flatMap((kind) => kind.extensions).join(', ');
    return {
      ok: false,
      message: `${extension.toUpperCase()} files are not accepted. Allowed: ${allowed}. SVG is deliberately excluded — it can carry scripts.`,
    };
  }

  // The bytes decide, not the name. A file whose signature matches a DIFFERENT
  // allowed format is still refused: it means the extension is wrong, and
  // silently correcting it would store a PDF as an image or the reverse.
  const actual = UPLOAD_KINDS.find((kind) => matches(head, kind));
  if (!actual) {
    return {
      ok: false,
      message: `This does not look like a ${claimed.label} inside. The extension says ${extension} but the file's contents do not match any accepted format.`,
    };
  }
  if (actual.mime !== claimed.mime) {
    return {
      ok: false,
      message: `The extension says ${extension} but the file is actually a ${actual.label}. Rename it correctly and upload it again.`,
    };
  }

  const cap = actual.image ? MAX_IMAGE_BYTES : MAX_DOCUMENT_BYTES;
  if (size > cap) {
    const capKb = Math.round(cap / 1024);
    const actualKb = Math.round(size / 1024);
    return {
      ok: false,
      message: actual.image
        ? `That image is ${actualKb} KB. The ceiling is ${capKb} KB, because most visitors are on a mid-range Android paying for data by the megabyte. Resize or re-encode it and try again.`
        : `That document is ${actualKb} KB and the ceiling is ${capKb} KB.`,
    };
  }
  if (size === 0) return { ok: false, message: 'That file is empty.' };

  return { ok: true, kind: actual };
}

/**
 * A storage path that cannot be chosen by the uploader.
 *
 * The original filename is kept only as a suffix, sanitised, so a staff member
 * can recognise the file in a list — the identity of the object is the random
 * prefix. Letting a client name a stored object invites collisions, traversal
 * attempts with `../`, and one upload quietly replacing another's file.
 */
export function storagePath(filename: string, kind: UploadKind): string {
  const extension = kind.extensions[0];
  const stem = filename
    .slice(0, filename.lastIndexOf('.') === -1 ? undefined : filename.lastIndexOf('.'))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  const token = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  const stamp = new Date().toISOString().slice(0, 7); // YYYY-MM, so the bucket stays browsable
  return `${stamp}/${token}${stem ? `-${stem}` : ''}.${extension}`;
}

/**
 * PNG and JPEG dimensions from the header, without an image library.
 *
 * `media.width` and `media.height` exist so the delivered-size ceiling and the
 * `next/image` explicit-dimensions rule can be checked, and reading them here
 * means they are recorded rather than left null and hoped for. Returns nulls
 * for anything it cannot parse — WebP and AVIF headers are more involved and a
 * wrong number is worse than no number.
 */
export function imageDimensions(
  bytes: Uint8Array,
  mime: string,
): { width: number | null; height: number | null } {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

  if (mime === 'image/png' && bytes.length >= 24) {
    return { width: view.getUint32(16), height: view.getUint32(20) };
  }

  if (mime === 'image/jpeg') {
    // Walk the segment markers to the first Start-Of-Frame. JPEG dimensions are
    // not at a fixed offset, so there is no shortcut.
    let offset = 2;
    while (offset + 9 < bytes.length) {
      if (bytes[offset] !== 0xff) break;
      const marker = bytes[offset + 1];
      const length = view.getUint16(offset + 2);
      // SOF0, SOF1, SOF2 — the baseline and progressive frame headers.
      if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2) {
        return { height: view.getUint16(offset + 5), width: view.getUint16(offset + 7) };
      }
      offset += 2 + length;
    }
  }

  return { width: null, height: null };
}
