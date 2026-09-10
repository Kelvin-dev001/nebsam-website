/**
 * UPLOAD ALLOWLIST AND SIZE CAPS.
 *
 * Split out of `uploads.ts` because that module carries `import 'server-only'`
 * and the upload FORM needs the caps in order to state them to the person
 * choosing a file. A client component importing a server-only module is a build
 * error, and stating a limit the form does not know is how a form ends up
 * claiming a limit that is not the one enforced.
 *
 * This file is pure data and pure predicates: no environment, no database, no
 * secrets. The enforcement lives in `uploads.ts` and in the server action, which
 * are the boundary; these values are what both sides agree on.
 */

export interface UploadKind {
  /** Canonical MIME type, written to `media.mime` — never the client's claim. */
  mime: string;
  /** Extensions a person may legitimately have on this file. */
  extensions: string[];
  /** Leading bytes that identify the format. */
  signature: number[];
  /** Where in the file the signature sits. WEBP and AVIF are not at zero. */
  offset?: number;
  label: string;
  /** Whether it is an image, which decides whether dimensions are expected. */
  image: boolean;
}

export const UPLOAD_KINDS: UploadKind[] = [
  { mime: 'image/jpeg', extensions: ['jpg', 'jpeg'], signature: [0xff, 0xd8, 0xff], label: 'JPEG image', image: true },
  {
    mime: 'image/png',
    extensions: ['png'],
    signature: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
    label: 'PNG image',
    image: true,
  },
  // "WEBP" at byte 8, inside the RIFF container.
  {
    mime: 'image/webp',
    extensions: ['webp'],
    signature: [0x57, 0x45, 0x42, 0x50],
    offset: 8,
    label: 'WebP image',
    image: true,
  },
  // "ftyp" at byte 4 of the ISO-BMFF box. The brand that follows varies
  // (avif, avis, mif1), so the check stops at ftyp and the extension
  // disambiguates — which is acceptable ONLY because every ftyp-based format
  // is inert as an image.
  {
    mime: 'image/avif',
    extensions: ['avif'],
    signature: [0x66, 0x74, 0x79, 0x70],
    offset: 4,
    label: 'AVIF image',
    image: true,
  },
  { mime: 'application/pdf', extensions: ['pdf'], signature: [0x25, 0x50, 0x44, 0x46], label: 'PDF document', image: false },
];

/**
 * Size caps, from `docs/PERFORMANCE_BUDGETS.md`.
 *
 * The image cap is the DELIVERED-SIZE ceiling of 250 KB, checked at upload
 * rather than at audit — `docs/CMS_ARCHITECTURE.md` §5 asks for exactly that,
 * and Sprint 11 found a 191 KB favicon costing 226 ms of LCP that had sat in
 * the repository since the CRA site. Catching it here is the difference between
 * a rule and a hope.
 *
 * It is checked against the file AS UPLOADED, and no re-encoding happens on the
 * way in. That is a real limitation and it is stated rather than hidden: a
 * staff member with a 3 MB phone photograph is refused and told to resize it,
 * where the kinder behaviour would be to accept it and convert. Automatic
 * optimisation needs an image pipeline in the upload path (sharp is present for
 * `next/image` but running it inside a server action on a 5 MB upload is a
 * memory decision, not a one-liner), and it is recorded in the Sprint 12 report
 * as the next thing this screen needs.
 *
 * The document cap is deliberately generous: the four prepared proposals are
 * 1–4 MB and they are not page weight, they are downloads whose size is shown
 * before the click.
 */
export const MAX_IMAGE_BYTES = 250 * 1024;
export const MAX_DOCUMENT_BYTES = 8 * 1024 * 1024;
