import { Eyebrow, Section, Shell } from '@/components/layout/section';

/**
 * HOW WE WORK — homepage section 9 (brief 9.1).
 *
 * enquiry → survey → installation → training → support.
 *
 * Numbered markers are used here on purpose. Brief 6.6 prohibits "01/02/03
 * markers where the content is not a sequence" — this genuinely is one, and
 * the order carries meaning: the survey determines what gets installed, and
 * training is what makes the support burden small. Numbering a set of parallel
 * features would be the violation; numbering these would be a loss.
 *
 * WHAT IS DELIBERATELY ABSENT: how long an installation takes, whether the
 * survey is chargeable, and any response-time commitment. None of those is
 * recorded anywhere in `content-source/`, and the content skill §1 forbids
 * inventing response times specifically. Rather than ship a
 * [[NEEDS_VERIFICATION]] token on a public page — which is itself forbidden —
 * each step is written to be true without the number. When the figures are
 * confirmed they slot in without the copy being rewritten.
 */

const STEPS = [
  {
    title: 'Enquiry',
    body: 'You tell us the vehicles, where they operate and what you are trying to prevent. A matatu sacco protecting takings has a different problem from a cold-chain fleet protecting cargo, and the right hardware differs accordingly.',
  },
  {
    title: 'Survey',
    body: 'We establish what each vehicle can actually support before anything is quoted. Immobilisation depends on the vehicle, and some older units will not take every feature — it is better to find that out before you have paid for it.',
  },
  {
    title: 'Installation',
    body: 'Fitting is done by our technicians, at a branch in Nairobi, Mombasa or Nakuru, or on site where that is more practical. Concealment matters as much as wiring: a tracker somebody can find in thirty seconds is a tracker somebody will remove.',
  },
  {
    title: 'Training',
    body: 'Whoever will use the platform daily is shown how, on your own vehicles rather than on a demo account. This is the step most often skipped elsewhere, and it is the reason many fleets end up with a system nobody opens.',
  },
  {
    title: 'Support',
    body: 'Faults, re-installations after a vehicle is sold or repaired, and questions from new staff. Vehicles change hands and drivers change jobs; the system has to survive both.',
  },
] as const;

export function HowWeWork() {
  return (
    <Section tone="dark">
      <Shell>
        <div className="max-w-prose">
          <Eyebrow>How we work</Eyebrow>
          <h2 className="mt-4 font-display text-h2 text-text-inverse md:text-md-h2">
            From first enquiry to a system your team actually uses.
          </h2>
        </div>

        <ol className="mt-12 border-t border-border-hairline-inverse">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="grid gap-x-10 gap-y-2 border-b border-border-hairline-inverse py-7 md:grid-cols-[3rem_14rem_1fr] md:py-8"
            >
              <span
                aria-hidden="true"
                className="font-mono text-mono text-brand-signal"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-display-tight text-h3 text-text-inverse">{step.title}</h3>
              <p className="max-w-prose text-body text-text-secondary-inverse">{step.body}</p>
            </li>
          ))}
        </ol>
      </Shell>
    </Section>
  );
}
