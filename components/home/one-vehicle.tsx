import { Eyebrow, Section, Shell } from '@/components/layout/section';
import { ButtonLink } from '@/components/ui/button';
import { PinnedSequence } from '@/components/motion/pinned-sequence';
import { whatsappUrl } from '@/lib/company';
import { CLOSE, INTRO, SPANS, STAGE_CAPTION, STEPS, type SetPieceStep } from './one-vehicle-copy';
import { FRAMES } from './one-vehicle-frames';

/**
 * "ONE VEHICLE, INSTRUMENTED" — the homepage's signature set piece (Sprint 12b
 * T4; memo D3 = H1; ADR-0006). Brief: docs/design/sets/home-BRIEF.md.
 *
 * Replaces the Thesis section and is brief 9.1 §3 and §4 in one: what Nebsam
 * does, told as five beats of one vehicle's telemetry, peaking at the jamming
 * readout that used to sit in the hero (D3b = b).
 *
 * On the DARK ground, always: the pinned stage dims inactive steps to 0.6, and
 * that dim only clears 4.5:1 on navy (DESIGN_SYSTEM.md §3.5).
 *
 * Server-rendered and complete: the intro, all five steps with their links and
 * the close are in the HTML a crawler receives, whatever the motion does.
 */
function Step({ step, index }: { step: SetPieceStep; index: number }) {
  return (
    <div>
      <p className="font-mono text-label uppercase tracking-[0.08em] text-text-secondary-inverse">
        {String(index + 1).padStart(2, '0')} · {step.label}
      </p>
      <h3 className="mt-3 font-display-tight text-h3 text-text-inverse md:text-md-h3">
        {step.heading}
      </h3>
      <p className="mt-3 max-w-prose text-body text-text-secondary-inverse">{step.body}</p>
      {/* White, not signal blue: a dimmed step is still content, and
          #3D8BFF at the stage's 0.6 is 2.78:1 on navy, where white is 7.07.
          The underline carries the link (DESIGN_SYSTEM.md §3.5, Sprint 14). */}
      <a
        href={step.link.href}
        className="mt-4 inline-flex min-h-[44px] items-center text-body-sm text-text-inverse underline decoration-1 underline-offset-4 hover:decoration-2"
      >
        {step.link.text}
      </a>
    </div>
  );
}

export function OneVehicle() {
  return (
    <Section tone="dark" aria-labelledby="one-vehicle-heading">
      <Shell>
        <div className="max-w-prose">
          <Eyebrow>{INTRO.eyebrow}</Eyebrow>
          <h2
            id="one-vehicle-heading"
            className="mt-4 font-display text-h2 text-text-inverse md:text-md-h2"
          >
            {INTRO.heading}
          </h2>
          <p className="mt-5 text-body-lg text-text-secondary-inverse">{INTRO.body}</p>
        </div>

        <div className="mt-12 md:mt-16">
          <PinnedSequence
            id="home-one-vehicle"
            steps={STEPS.map((step, i) => (
              <Step key={step.label} step={step} index={i} />
            ))}
            frames={FRAMES}
            spans={SPANS}
            caption={STAGE_CAPTION}
          />
        </div>

        <div className="mt-12 max-w-prose md:mt-16">
          <p className="text-body-lg text-text-inverse">{CLOSE.body}</p>
          <ButtonLink
            href={whatsappUrl(CLOSE.message)}
            variant="primary"
            size="lg"
            className="mt-6 w-full sm:w-auto"
          >
            {CLOSE.action}
          </ButtonLink>
        </div>
      </Shell>
    </Section>
  );
}
