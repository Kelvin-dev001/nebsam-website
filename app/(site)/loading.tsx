import { Section, Shell } from '@/components/layout/section';

/**
 * Route loading state.
 *
 * Deliberately NOT a spinner. A spinner conveys its meaning only through
 * motion, which a reduced-motion user cannot perceive — brief PART 17 §4
 * requires meaning to survive without movement. This is a static skeleton with
 * a real, announced text status.
 *
 * The block sizes approximate the hero so the swap costs no layout shift.
 */
export default function Loading() {
  return (
    <Section tone="dark">
      <Shell>
        <p role="status" className="font-mono text-label uppercase tracking-[0.08em] text-text-secondary-inverse">
          Loading…
        </p>
        <div aria-hidden="true" className="mt-6 flex flex-col gap-4">
          <div className="h-3 w-40 rounded-data bg-brand-navy-raised" />
          <div className="h-11 w-full max-w-[26ch] rounded-data bg-brand-navy-raised md:h-14" />
          <div className="h-11 w-full max-w-[18ch] rounded-data bg-brand-navy-raised md:h-14" />
          <div className="mt-3 h-4 w-full max-w-prose rounded-data bg-brand-navy-raised" />
          <div className="h-4 w-full max-w-[48ch] rounded-data bg-brand-navy-raised" />
          <div className="mt-5 h-24 w-full max-w-[42rem] rounded-data bg-brand-navy-raised" />
        </div>
      </Shell>
    </Section>
  );
}
