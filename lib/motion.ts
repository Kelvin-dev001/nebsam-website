/**
 * Motion tokens — brief PART 17, implemented.
 * Durations and easings live here so docs/ANIMATION_SYSTEM.md documents what
 * the code actually does rather than what it was meant to do.
 */

export const EASE = {
  /** entrances, reveals — decisive arrival */
  outQuart: 'cubic-bezier(0.25, 1, 0.5, 1)',
  /** cinematic, large travel */
  outExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
  /** state changes both ways */
  inOutQuad: 'cubic-bezier(0.45, 0, 0.55, 1)',
  /**
   * Data motion is LINEAR on purpose. A counter or a signal tick that eases
   * looks performed; instrumentation is uniform. That contrast is the point.
   */
  linear: 'linear',
} as const;

export const DURATION = {
  /**
   * Level 1 — press feedback. Faster than `micro` because a press answers the
   * hand directly; 120ms is the floor of PART 17's Level 1 range. Only matters
   * where a component transitions `transform`: `transition-colors` alone makes
   * the press instant. Mirrored as `--dur-press` in app/globals.css.
   */
  press: 120,
  /** Level 1 — Micro: hover, press, focus, icon response */
  micro: 160,
  /** Level 2 — Reveal: scroll-triggered entrance, fires once */
  reveal: 420,
  /** Level 3 — Data: telemetry ticks, signal pulses, counters */
  data: 900,
} as const;

/** Level 2 stagger, capped at 6 siblings — beyond that the last arrives late
 *  enough to feel broken. */
export const STAGGER_MS = 70;
export const STAGGER_CAP = 6;

/** Level 2 travel. More than ~24px reads as a slide show. */
export const REVEAL_TRAVEL_PX = 20;

/**
 * Level 4 — the pinned stage (ADR-0006).
 *
 * Inactive steps are dimmed with OPACITY ONLY, and a dimmed step is still
 * content, so it must still clear 4.5:1. 0.6 is the lowest round value that
 * does on the dark ground: #C3CEEA body text 4.86:1, #FFFFFF 7.07:1 on
 * brand-navy. It does NOT hold on paper (text-secondary would need 0.86), which
 * is why the stage sits on the dark ground and state colours appear only in the
 * active step (state-warn dimmed is 3.71:1). Table: docs/DESIGN_SYSTEM.md §3.5.
 * Mirrored as `--stage-inactive` in app/globals.css.
 */
export const STAGE = {
  inactiveOpacity: 0.6,
} as const;

/**
 * When the pinned stage may pin (memo D2). Below 768px, on a coarse pointer, or
 * under reduced motion the same markup renders as stacked flow. The enhancer
 * evaluates this ONE query; CSS keys off the `data-pinned` attribute it sets,
 * never off a media query of its own, so the two can never disagree.
 */
export const PIN_QUERY =
  '(min-width: 768px) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

/**
 * The signature sequence (Level 3).
 *
 * 4s was chosen over 6s after building both — see docs/ANIMATION_SYSTEM.md §3.
 * At 6s a visitor who scrolls away at second two has seen nothing happen yet;
 * at 4s they have already reached the JAMMED beat, which is the dramatic peak.
 */
export const JAM_SEQUENCE = {
  /** healthy state holds */
  hold: 700,
  /** signal degrades */
  degrade: 900,
  /** JAMMED state holds — the peak */
  jammed: 1100,
  /** resolve to ARMED */
  resolve: 700,
  /** settle — sequence has already resolved by this point */
  settle: 600,
} as const;

export const JAM_TOTAL_MS =
  JAM_SEQUENCE.hold +
  JAM_SEQUENCE.degrade +
  JAM_SEQUENCE.jammed +
  JAM_SEQUENCE.resolve +
  JAM_SEQUENCE.settle;
