/**
 * The pinned-stage enhancer (ADR-0006). DYNAMICALLY IMPORTED by
 * `PinnedSequenceLoader` once the act is within about a viewport, after load
 * and idle — so it is never in a route's initial JavaScript and never competes
 * with LCP.
 *
 * It only ever sets ATTRIBUTES; every visual consequence is CSS keyed off them
 * (pinned-sequence.module.css). No scroll event handler exists anywhere in it:
 *
 *  - Which step is active comes from IntersectionObserver, with the root
 *    shrunk to a line across the middle of the viewport. Steps are contiguous,
 *    so exactly one crosses that line at a time.
 *  - The progress rail is CSS scroll-driven animation where supported. Where it
 *    is not, the rail steps with the active step through `--rail-p`, set on the
 *    fill element itself — not on the act, which would restyle every child.
 *  - Focus inside a step makes that step active, so a keyboard user is never
 *    working inside a dimmed step.
 */
export function enhance(act: HTMLElement): () => void {
  const steps = Array.from(act.querySelectorAll<HTMLElement>('[data-pinned-step]'));
  const frames = Array.from(act.querySelectorAll<HTMLElement>('[data-pinned-frame]'));
  const fill = act.querySelector<HTMLElement>('[data-pinned-rail-fill]');
  const stage = act.querySelector<HTMLElement>('[data-sc-stage]');
  if (!steps.length) return () => {};

  let active = -1;
  const setActive = (index: number) => {
    if (index < 0 || index === active) return;
    active = index;
    steps.forEach((el, i) => el.toggleAttribute('data-active', i === index));
    frames.forEach((el, i) => el.toggleAttribute('data-active', i === index));
    fill?.style.setProperty('--rail-p', String((index + 1) / steps.length));
    // Read by the scroll-craft harness: the visible state of the stage, so its
    // dead-scroll check sees a step change even though the stage never moves.
    stage?.setAttribute('data-sc-verify-state', `step-${index + 1}-of-${steps.length}`);
  };

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setActive(steps.indexOf(entry.target as HTMLElement));
      }
    },
    { rootMargin: '-50% 0px -50% 0px' },
  );
  steps.forEach((el) => io.observe(el));

  const onFocusIn = (event: FocusEvent) => {
    const step = (event.target as Element | null)?.closest<HTMLElement>('[data-pinned-step]');
    if (step) setActive(steps.indexOf(step));
  };
  act.addEventListener('focusin', onFocusIn);

  setActive(
    Math.max(
      0,
      steps.findIndex((el) => el.hasAttribute('data-active')),
    ),
  );

  return () => {
    io.disconnect();
    act.removeEventListener('focusin', onFocusIn);
  };
}
