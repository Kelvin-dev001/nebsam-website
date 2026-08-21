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
