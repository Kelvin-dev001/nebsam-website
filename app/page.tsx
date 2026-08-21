import { Header } from '@/components/layout/header';
import { Eyebrow, Section, Shell } from '@/components/layout/section';
import { ButtonLink } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Reveal } from '@/components/motion/reveal';
import { SignalReadout } from '@/components/telemetry/signal-readout';

/**
 * SPRINT 1 PROTOTYPE — one homepage screen, to judge the visual language.
 * This is not the production homepage; that is Sprint 4.
 *
 * Everything here is hardcoded. No Supabase, no CMS, no real customer data.
 * The KEBS figures below are the genuine verified ones from brief PART 3.5 and
 * content-source/05-certifications/README.md.
 */

/** KEBS laboratory test report BS202445237, 5 February 2025. Verified. */
const KEBS_PARAMETERS = [
  'ADAS camera detection',
  'Driver alerts',
  'DSM camera detection',
  'G-sensor detection',
  'Power supply — in-built battery sustaining the system for a minimum of 30 minutes',
  'System tampering detection',
  'Ignition-triggered power-on',
] as const;

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main">
        {/* ── HERO ──────────────────────────────────────────────────────────
            Left-weighted and asymmetric. The dominant object is the readout,
            not the photograph — photography is a narrow band doing atmosphere,
            which inverts the convention rather than joining it. */}
        <Section tone="dark" bleed className="relative overflow-hidden">
          <Shell className="relative z-10 pb-10 pt-14 md:pb-16 md:pt-24">
            <div className="max-w-[52rem]">
              <Reveal index={0}>
                <Eyebrow dot>Nairobi · Mombasa · Nakuru</Eyebrow>
              </Reveal>

              <Reveal index={1}>
                <h1 className="mt-5 font-display text-display md:text-md-display">
                  Losing signal is the alarm.
                </h1>
              </Reveal>

              <Reveal index={2}>
                <p className="mt-5 max-w-prose text-body-lg text-text-secondary-inverse">
                  A GSM jammer cuts the uplink so a tracker cannot report. An anti-jamming tracker
                  treats that silence as an event rather than a gap — alerting you and immobilising
                  the vehicle according to the configured security logic.
                </p>
              </Reveal>

              <Reveal index={3}>
                <div className="mt-8">
                  <SignalReadout />
                </div>
              </Reveal>

              <Reveal index={4}>
                <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <ButtonLink
                    href="https://wa.me/254759000111"
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Talk to us on WhatsApp
                  </ButtonLink>
                  <ButtonLink href="tel:+254769063333" variant="secondary" size="lg" className="w-full sm:w-auto">
                    Call Mombasa
                  </ButtonLink>
                  <ButtonLink href="#" variant="ghost">
                    Request a quote
                  </ButtonLink>
                </div>
              </Reveal>

              <Reveal index={5}>
                <p className="mt-8 max-w-prose text-body-sm text-text-secondary-inverse">
                  Nebsam Digital Solutions (K) Ltd installs and supports vehicle tracking, fleet
                  telematics and vehicle security across Kenya, from branches in Nairobi, Mombasa
                  and Nakuru.
                </p>
              </Reveal>
            </div>
          </Shell>

        </Section>

        {/* ── "COMPLIES." ───────────────────────────────────────────────────
            No marketing heading. It opens with the word the laboratory wrote.
            Brief 3.5: do not paraphrase "Complies" into anything stronger. */}
        <Section tone="paper">
          <Shell>
            <div className="grid gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16">
              <div>
                <Reveal index={0}>
                  <Eyebrow>Third-party test result</Eyebrow>
                </Reveal>
                <Reveal index={1}>
                  <p className="mt-4 font-display text-display text-brand-blue md:text-md-display">
                    Complies.
                  </p>
                </Reveal>
                <Reveal index={2}>
                  <p className="mt-5 max-w-prose text-body text-text-secondary">
                    KEBS laboratory test report{' '}
                    <span className="font-mono text-mono text-text-primary">BS202445237</span>,
                    5&nbsp;February&nbsp;2025. Tested against KNWA&nbsp;3006:2024 — Video telematics
                    system for motor vehicle: Performance Requirements.
                  </p>
                </Reveal>
              </div>

              <Reveal index={3}>
                <dl className="border-t border-border-hairline">
                  {KEBS_PARAMETERS.map((parameter) => (
                    <div
                      key={parameter}
                      className="flex items-baseline justify-between gap-6 border-b border-border-hairline py-3.5"
                    >
                      <dt className="text-body">{parameter}</dt>
                      <dd className="shrink-0 font-mono text-mono uppercase tracking-[0.06em] text-state-ok-ink">
                        Complies
                      </dd>
                    </div>
                  ))}
                </dl>

                {/* Scope stated on the face of the page. Brief 3.5 names
                    presenting the permit as company-wide as an accuracy trap. */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Badge>Permit SM#84618</Badge>
                  <p className="text-body-sm text-text-secondary">
                    Covers vehicle cameras for video telematics under the STREAMAX brand. It is a
                    permit to use the standardization mark, not a company-wide certification.
                  </p>
                </div>
              </Reveal>
            </div>
          </Shell>
        </Section>
      </main>
    </>
  );
}
