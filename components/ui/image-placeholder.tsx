/**
 * IMAGE PLACEHOLDER — brief PART 18.
 *
 * Where a real Nebsam photograph is expected and has not been supplied. Never
 * a stock photo in its place: the brief forbids silently substituting one.
 *
 *   production   a neutral block on blueprint paper with a short caption, so
 *                a card without its photograph still reads as finished.
 *   development  the same block, plus the shot-list note, so whoever runs the
 *                site locally sees exactly what is missing.
 *
 * Every placeholder in use is listed in the shot list in docs/ASSET_MAP.md.
 * A Server Component; decorative, so it is hidden from assistive technology
 * and the caption is never the only place a fact appears.
 */
type Kind = 'hero' | 'product' | 'team' | 'platform' | 'certificate' | 'branch' | 'industry';

export function ImagePlaceholder({
  kind,
  ratio = '16 / 9',
  caption,
  note,
  className = '',
}: {
  kind: Kind;
  /** CSS aspect-ratio, matching the photograph it stands in for. */
  ratio?: string;
  /** Short and on-brand, shown in production. */
  caption?: string;
  /** The shot-list line: what is needed, at what size. Development only. */
  note: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      data-placeholder={kind}
      className={`image-placeholder flex flex-col items-center justify-center gap-2 px-4 text-center ${className}`.trim()}
      style={{ aspectRatio: ratio }}
    >
      {caption ? (
        <span className="font-mono text-label uppercase tracking-[0.08em] text-text-secondary">
          {caption}
        </span>
      ) : null}
      {process.env.NODE_ENV === 'development' ? (
        <span className="max-w-[28ch] text-body-sm text-state-warn-ink">Needed: {note}</span>
      ) : null}
    </div>
  );
}
