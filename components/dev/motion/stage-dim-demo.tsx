import { STAGE } from '@/lib/motion';

/**
 * Level 4 preview: what STAGE.inactiveOpacity does to text, before the pinned
 * primitive exists (Sprint 12b T3). Static on purpose — this block shows the
 * dimmed STATE so its contrast can be checked in the browser, not the motion.
 *
 * Sits on the dark ground and uses only text-inverse and
 * text-secondary-inverse, because those are the pairings that stay AA at 0.6
 * (docs/DESIGN_SYSTEM.md §3.5). The rail is the instrument-scale treatment
 * ADR-0006 specifies: hairline track, text-secondary-inverse fill.
 *
 * The step copy is placeholder text, labelled as such. It makes no claim.
 */
const STEPS = [
  { n: 1, active: false },
  { n: 2, active: true },
  { n: 3, active: false },
] as const;

export function StageDimDemo() {
  return (
    <figure>
      <div className="grid gap-8 md:grid-cols-[2px_1fr]">
        <div
          className="relative hidden h-full min-h-[12rem] w-[2px] bg-border-hairline-inverse md:block"
          aria-hidden="true"
        >
          <span className="absolute inset-x-0 top-0 block h-1/2 bg-text-secondary-inverse" />
        </div>
        <ol className="space-y-6">
          {STEPS.map((s) => (
            <li
              key={s.n}
              data-stage-step={s.active ? 'active' : 'inactive'}
              className={s.active ? '' : 'opacity-stage-inactive'}
            >
              <p className="font-mono text-label uppercase tracking-[0.08em] text-text-secondary-inverse">
                Step {s.n} of 3 ·{' '}
                {s.active ? 'active' : `inactive, opacity ${STAGE.inactiveOpacity}`}
              </p>
              <p className="mt-2 font-display-tight text-h3 text-text-inverse md:text-md-h3">
                Sample step heading
              </p>
              <p className="mt-2 max-w-prose text-body text-text-secondary-inverse">
                Placeholder body copy, set in text-secondary-inverse, so the dimmed contrast can be
                measured on the ground the stage will use.
              </p>
            </li>
          ))}
        </ol>
      </div>
      <figcaption className="mt-6 text-body-sm text-text-secondary-inverse">
        Illustration — sample steps, not the pinned primitive. At {STAGE.inactiveOpacity}: body text
        4.86:1, headings 7.07:1 on brand-navy.
      </figcaption>
    </figure>
  );
}
