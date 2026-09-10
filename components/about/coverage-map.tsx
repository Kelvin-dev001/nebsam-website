import { KENYA_BOUNDS, KENYA_OUTLINE_PATH, coordinatesFor, project } from '@/lib/geo';

/**
 * THE COVERAGE MAP.
 *
 * Sprint 11 acceptance: "branches and coverage towns visually distinct and
 * legended; no invented addresses, no counts of agents."
 *
 * ── The distinction is the whole job ────────────────────────────────────────
 * Brief 3.4 forbids implying an office where there is none. Nebsam has THREE
 * offices — Nairobi, Mombasa, Nakuru — and everywhere else is agents and
 * technicians. A map is the easiest place on a website to blur that, because a
 * dot is a dot.
 *
 * So the two are drawn as different MARKS, not two colours of the same mark: a
 * branch is a filled square, a coverage town is a small hollow circle. Colour
 * reinforces it and carries none of it, which is WCAG 1.4.1 and also just true —
 * these render identifiably in greyscale, in forced-colours mode, and to a
 * reader who cannot distinguish blue from amber.
 *
 * ── It is an image with a text equivalent, not a replacement for one ────────
 * The SVG is `aria-hidden` and the page lists every branch and every town in
 * text beneath it. That is deliberate: an SVG full of `<title>` elements
 * announces as a stream of place names in no useful order, whereas a heading and
 * two lists are navigable, searchable, translatable, and readable by an assistant
 * that never renders the graphic. The map is the illustration; the list is the
 * content.
 *
 * ── No projection library ───────────────────────────────────────────────────
 * lib/geo.ts does the arithmetic in about ten lines. A mapping library would add
 * far more than the page weighs, for a static picture with nineteen fixed points
 * and nothing to pan.
 */

const MARGIN = 2;

export interface MapPlace {
  name: string;
  lat: number | null;
  lng: number | null;
}

export function CoverageMap({
  branches,
  towns,
}: {
  branches: MapPlace[];
  towns: MapPlace[];
}) {
  /**
   * Coordinates come from the database where they exist, and from lib/geo.ts
   * where they do not.
   *
   * The fallback is not defensive padding. `lat`/`lng` are CMS-editable, so a
   * staff member can clear one, and a town whose coordinate is missing would
   * otherwise vanish from the map while still being listed underneath — a map
   * that silently disagrees with the text beside it. A place with no coordinate
   * anywhere is dropped from the drawing and still appears in the list.
   */
  const place = (p: MapPlace) => {
    const fromDb = p.lat !== null && p.lng !== null ? { lat: Number(p.lat), lng: Number(p.lng) } : null;
    const coords = fromDb ?? coordinatesFor(p.name);
    return coords ? { name: p.name, ...project(coords) } : null;
  };

  const branchPoints = branches.map(place).filter((p): p is NonNullable<typeof p> => p !== null);
  const townPoints = towns.map(place).filter((p): p is NonNullable<typeof p> => p !== null);

  const viewBox = [
    KENYA_BOUNDS.minX - MARGIN,
    KENYA_BOUNDS.minY - MARGIN,
    KENYA_BOUNDS.maxX - KENYA_BOUNDS.minX + MARGIN * 2,
    KENYA_BOUNDS.maxY - KENYA_BOUNDS.minY + MARGIN * 2,
  ].join(' ');

  return (
    <figure className="m-0">
      <svg
        viewBox={viewBox}
        role="presentation"
        aria-hidden="true"
        className="h-auto w-full max-w-[34rem]"
      >
        <path
          d={KENYA_OUTLINE_PATH}
          className="fill-surface-raised stroke-border-strong"
          strokeWidth={0.4}
          strokeLinejoin="round"
        />

        {/* Coverage towns first, so a branch is never hidden under one. */}
        {townPoints.map((p) => (
          <circle
            key={p.name}
            cx={p.x}
            cy={p.y}
            r={1.15}
            className="fill-surface stroke-state-warn-ink"
            strokeWidth={0.55}
          />
        ))}

        {branchPoints.map((p) => (
          <rect
            key={p.name}
            x={p.x - 1.5}
            y={p.y - 1.5}
            width={3}
            height={3}
            className="fill-brand-signal-ink stroke-surface"
            strokeWidth={0.5}
          />
        ))}
      </svg>

      <figcaption className="mt-4 flex flex-col gap-2 text-body-sm text-text-secondary">
        <span className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="flex items-center gap-2">
            <svg width="14" height="14" aria-hidden="true" className="shrink-0">
              <rect x="2" y="2" width="10" height="10" className="fill-brand-signal-ink" />
            </svg>
            Branch — a Nebsam office
          </span>
          <span className="flex items-center gap-2">
            <svg width="14" height="14" aria-hidden="true" className="shrink-0">
              <circle cx="7" cy="7" r="4.5" className="fill-surface stroke-state-warn-ink" strokeWidth="1.4" />
            </svg>
            Served by agents and technicians
          </span>
        </span>
        {/*
          Two honest qualifications, and neither is boilerplate.
          The first: these are town positions, not office positions — the
          addresses are printed below and are what anyone navigates by.
          The second: coverage is not a boundary. A town on this map is one we
          serve; a town absent from it is not a refusal, and the map must not be
          read as a service-area polygon.
        */}
        <span>
          Towns are shown at town centre, not at street level. Branch addresses are listed below.
          Coverage is not a boundary — if your town is not marked, ask us.
        </span>
      </figcaption>
    </figure>
  );
}
