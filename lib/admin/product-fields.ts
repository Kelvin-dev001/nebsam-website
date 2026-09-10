/**
 * SPECS AND FEATURES, AS TEXT A NON-TECHNICAL PERSON CAN EDIT.
 *
 * `products.specs` is a jsonb OBJECT of label → value. `products.features` is a
 * jsonb ARRAY of `{ title, detail }`. Both are the right shapes for rendering
 * and neither is a shape you can put in front of a salesperson.
 *
 * ── The three options, and why this is the one ──────────────────────────────
 *
 * A raw JSON textarea is out: `docs/CMS_ARCHITECTURE.md` §3 exists to prevent
 * exactly this, and one missing brace loses a page of typing to a parse error.
 *
 * A repeater UI with "add row" buttons is friendlier and is what this should
 * become. It is also a few hundred lines of client JavaScript with its own
 * keyboard, focus and reordering behaviour to get right, on a project with a
 * 180 KB route budget — and it would be the largest single piece of client code
 * on the site, added in the sprint whose gate is about staff being able to work
 * unaided rather than about polish.
 *
 * So: plain text with one obvious convention per field, parsed on the server,
 * and the PARSED RESULT SHOWN BACK on the edit screen. The last part is what
 * makes it honest — a staff member does not have to trust the convention, they
 * can see what the site received. Recorded in the Sprint 12 report as the thing
 * to replace with a repeater when there is a sprint for it.
 *
 * Both parsers are total: any input produces a valid structure, never an error.
 * A line that does not fit the convention is skipped rather than rejected,
 * because losing one malformed line is recoverable and losing the whole save is
 * how a CMS loses its user.
 */

/** `Label: value`, one per line. The first colon splits; later ones stay in the value. */
export function parseSpecs(text: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    const colon = line.indexOf(':');
    if (colon <= 0) continue;
    const label = line.slice(0, colon).trim();
    const value = line.slice(colon + 1).trim();
    if (!label || !value) continue;
    // Last one wins on a duplicate label, which is what a jsonb object does
    // anyway. Silently, because a staff member who pasted a label twice wants
    // the second one.
    out[label] = value;
  }
  return out;
}

export function specsToText(specs: unknown): string {
  if (!specs || typeof specs !== 'object' || Array.isArray(specs)) return '';
  return Object.entries(specs as Record<string, unknown>)
    .filter(([, value]) => value !== null && value !== undefined && String(value).trim() !== '')
    .map(([label, value]) => `${label}: ${String(value).trim()}`)
    .join('\n');
}

export interface ProductFeature {
  title: string;
  detail: string;
}

/**
 * Blocks separated by a BLANK LINE. First line is the title, the rest is the
 * detail.
 *
 * A blank line as the separator rather than a pipe or a delimiter, because a
 * feature detail is a sentence or two and typing prose separated by paragraphs
 * is what everybody already does. A block with no detail is kept — a feature
 * that is only a name is still a feature.
 */
export function parseFeatures(text: string): ProductFeature[] {
  return text
    .split(/\r?\n\s*\r?\n/)
    .map((block) => {
      const lines = block
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
      if (lines.length === 0) return null;
      return { title: lines[0], detail: lines.slice(1).join(' ') };
    })
    .filter((feature): feature is ProductFeature => feature !== null);
}

export function featuresToText(features: unknown): string {
  if (!Array.isArray(features)) return '';
  return features
    .flatMap((entry) => {
      if (!entry || typeof entry !== 'object') return [];
      const { title, detail } = entry as { title?: unknown; detail?: unknown };
      if (typeof title !== 'string' || !title.trim()) return [];
      const body = typeof detail === 'string' && detail.trim() ? `\n${detail.trim()}` : '';
      return [`${title.trim()}${body}`];
    })
    .join('\n\n');
}
