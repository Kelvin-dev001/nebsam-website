import { DURATION, EASE } from '@/lib/motion';

/**
 * The signal readout's small parts, split out of signal-readout.tsx in Sprint
 * 12b T4 to keep that file a single component (CLAUDE.md §12).
 */

export function Status({
  text,
  toneClass,
  toneMs,
  large,
}: {
  text: string;
  toneClass: string;
  toneMs: number;
  large: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 ${toneClass} ${large ? 'lg:gap-3' : ''}`}
      style={{ transition: `color ${toneMs}ms ${EASE.linear}` }}
    >
      <span
        aria-hidden="true"
        className={`inline-block h-1.5 w-1.5 rounded-full bg-current ${large ? 'lg:h-2.5 lg:w-2.5' : ''}`}
      />
      {/*
        WIDTH IS RESERVED FOR THE LONGEST STATE, and this is a layout
        correctness fix rather than a cosmetic one.

        The four status strings run from "Link OK" (7 characters) to
        "Anti-jammer armed · Alert sent" (29). Sitting in a `flex-wrap` row,
        that swing changes where the row breaks, which changes the container
        height, which is cumulative layout shift — on a mobile viewport, where
        the row wraps at all. Lighthouse measured CLS 0.116 against a budget of
        0.05 and attributed it to no element, because the shifting thing is a
        wrap point rather than a box.

        30ch is exact here: the readout is set in IBM Plex Mono, so one `ch` is
        one glyph and the longest string fits precisely — at any size, since
        `ch` scales with the stage variant's larger type.
      */}
      <span className="inline-block min-w-[30ch]">{text}</span>
    </span>
  );
}

export function Bars({ value, max, label }: { value: number; max: number; label: string }) {
  return (
    <span
      className="inline-flex items-end gap-[2px]"
      role="img"
      aria-label={`${label}: ${value} of ${max}`}
    >
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="w-[3.5px] rounded-[1px] bg-current"
          style={{
            height: `${6 + i * 3.5}px`,
            opacity: i < value ? 1 : 0.22,
            transition: `opacity ${DURATION.micro}ms ${EASE.linear}`,
          }}
        />
      ))}
    </span>
  );
}

export function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <dt className="uppercase tracking-[0.06em] opacity-70">{label}</dt>
      <dd className="text-text-inverse">{value}</dd>
    </div>
  );
}
