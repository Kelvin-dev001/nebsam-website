import { PIN_QUERY } from '@/lib/motion';

/**
 * THE pin decision for a pinned-stage act (ADR-0006). Browser-only.
 *
 * Two components ask this question at hydration — the sequence loader, which
 * sets `data-pinned`, and `Reveal`, which must stand aside when the act pins —
 * so it lives in one place and they cannot disagree.
 *
 * An act pins only when:
 *  1. PIN_QUERY matches: ≥ 768px, a fine pointer, no reduced-motion preference;
 *  2. the act is NOT on screen at the moment of deciding. Switching an act from
 *     stacked flow to the pinned layout changes its geometry, and doing that
 *     under the reader's eyes is a layout shift and content moving on its own.
 *     It is the same rule `Reveal` follows: never alter what is already shown.
 *     A reader who reloads mid-sequence gets the stacked flow, which is complete.
 */
export function willPin(act: Element | null): boolean {
  if (!act || typeof window === 'undefined') return false;
  if (!window.matchMedia(PIN_QUERY).matches) return false;
  const box = act.getBoundingClientRect();
  const onScreen = box.top < window.innerHeight && box.bottom > 0;
  return !onScreen;
}
