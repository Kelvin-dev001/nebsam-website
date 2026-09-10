/**
 * Display formatters. Nothing here touches the database or the network.
 */

/**
 * A file size a person on metered data can act on.
 *
 * Brief PART 9.4 and the download-centre notes in
 * `content-source/06-downloads/README.md` both require the size to be visible
 * BEFORE the click, because three of the four prepared documents exceed the
 * 1.0 MB page budget on their own. A visitor paying for data by the megabyte
 * decides on this number, so it is rendered as a real value rather than a
 * vague "large file" label.
 *
 * Decimal MB, not binary MiB: the manifest, the operating system's file
 * properties dialogue and the visitor's data bundle all count in decimal, and
 * a download centre that disagrees with the file the visitor receives looks
 * wrong even when it is technically defensible.
 *
 * Returns null for an unknown size rather than "0 B", so a caller can omit the
 * label entirely. Claiming a file is zero bytes is worse than saying nothing.
 */
export function formatFileSize(bytes: number | null | undefined): string | null {
  if (bytes == null || !Number.isFinite(bytes) || bytes < 0) return null;
  if (bytes === 0) return null;

  if (bytes < 1000) return `${bytes} B`;
  if (bytes < 1_000_000) return `${Math.round(bytes / 1000)} KB`;

  const mb = bytes / 1_000_000;
  // One decimal below 10 MB, none above: 0.52 MB is a useful distinction,
  // 38.7 MB against 39 MB is not.
  return mb < 10 ? `${mb.toFixed(2)} MB` : `${Math.round(mb)} MB`;
}

/**
 * A file type badge. `file_type` holds a MIME type or an extension depending on
 * how the row was created, and neither reads well in a listing.
 */
export function formatFileType(fileType: string | null | undefined): string | null {
  if (!fileType) return null;
  const t = fileType.trim().toLowerCase();
  if (!t) return null;
  const known: Record<string, string> = {
    'application/pdf': 'PDF',
    pdf: 'PDF',
    'application/zip': 'ZIP',
    zip: 'ZIP',
    'image/jpeg': 'JPG',
    'image/png': 'PNG',
  };
  if (known[t]) return known[t];
  // Fall back to the subtype or the bare extension, upper-cased.
  const tail = t.includes('/') ? t.split('/').pop() ?? t : t;
  return tail.replace(/^[.]/, '').slice(0, 8).toUpperCase();
}

/** A date a reader can scan. Returns null for a missing or unparseable date. */
export function formatDate(value: string | null | undefined): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

/**
 * Kenyan shillings, as a whole number of shillings.
 *
 * ── Why this is here rather than inline ─────────────────────────────────────
 *
 * Seven copies of `KES ${n.toLocaleString('en-KE')}` already exist across the
 * cart, the product price, the solution hardware list, the order confirmation,
 * two index pages and the order server action. Sprint 12 would have added two
 * more in the admin. The existing seven are deliberately left alone — they
 * work, and rewriting seven files across five sprints' worth of verified pages
 * is not the smallest coherent change — but nothing new should add to the
 * count. Recorded in the Sprint 12 report as a tidy-up for Sprint 14.
 *
 * Prices are stored as whole shillings, VAT-EXCLUSIVE (brief PART 1.5 #10).
 * This function does NOT append the `excl. VAT` label: that label belongs next
 * to the number in the layout, where it can be given its own emphasis, and
 * baking it in here would put it inside table cells and totals where it reads
 * as noise. `VAT_LABEL` in `lib/constants.ts` is the single source for the
 * wording.
 */
export function formatKes(amount: number | null | undefined): string | null {
  if (amount == null || !Number.isFinite(amount)) return null;
  return `KES ${amount.toLocaleString('en-KE')}`;
}
