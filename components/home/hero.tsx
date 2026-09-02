import { Eyebrow, Section, Shell } from '@/components/layout/section';
import { ButtonLink } from '@/components/ui/button';
import { Reveal } from '@/components/motion/reveal';
import { SignalReadout } from '@/components/telemetry/signal-readout';
import { BRANCHES, SHORT_DESCRIPTION, whatsappUrl } from '@/lib/company';

/**
 * HERO — homepage section 1, carrying the signature element (section 4).
 *
 * The composition is Sprint 1's, approved at that gate: left-weighted and
 * asymmetric, with the readout as the dominant object rather than a
 * photograph. Photography does atmosphere in a narrow band, which inverts the
 * convention instead of joining it.
 *
 * WHAT CHANGED IN SPRINT 4. The prototype hard-coded a wa.me number, a tel:
 * number and the company description. CLAUDE.md §4 is explicit that a phone
 * number, address or company name is never hard-coded in a component: NAP
 * consistency is what local SEO and LLM entity resolution rest on, and a number
 * living in two places is a number that will eventually disagree with itself.
 * All three now come from `lib/company.ts`.
 *
 * The prototype also offered "Call Mombasa" as the secondary action on a
 * national homepage, which only makes sense to someone who already knows the
 * business. It now names the branch it dials.
 *
 * The signature element holds section 4 rather than getting its own band. It
 * is the argument the headline makes, and separating the claim from its
 * demonstration by a section boundary weakens both.
 */
export function Hero() {
  const nairobi = BRANCHES.find((b) => b.slug === 'nairobi') ?? BRANCHES[0];
  const callNumber = nairobi?.phones[0];

  return (
    <Section tone="dark" bleed className="relative overflow-hidden">
      <Shell className="relative z-10 pb-10 pt-14 md:pb-16 md:pt-24">
        <div className="max-w-[52rem]">
          <Reveal index={0}>
            <Eyebrow dot>{BRANCHES.map((b) => b.name).join(' · ')}</Eyebrow>
          </Reveal>

          <Reveal index={1}>
            <h1 className="mt-5 font-display text-display md:text-md-display">
              Losing signal is the alarm.
            </h1>
          </Reveal>

          <Reveal index={2}>
            <p className="mt-5 max-w-prose text-body-lg text-text-secondary-inverse">
              A GSM jammer cuts the uplink so a tracker cannot report. An anti-jamming tracker
              treats that silence as an event rather than a gap — alerting you and immobilising the
              vehicle according to the configured security logic.
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
                href={whatsappUrl(
                  'Hello Nebsam, I would like to ask about vehicle tracking for my vehicle or fleet.',
                )}
                variant="primary"
                size="lg"
                className="w-full sm:w-auto"
              >
                Talk to us on WhatsApp
              </ButtonLink>

              {callNumber ? (
                <ButtonLink
                  href={`tel:+${callNumber.e164.replace(/^\+/, '')}`}
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Call {nairobi.name}
                </ButtonLink>
              ) : null}
            </div>
          </Reveal>

          <Reveal index={5}>
            {/*
              Who Nebsam is and where it operates, stated plainly in the first
              screen. The SEO skill is explicit that LLMs quote what is
              explicit, and this string is the one written in lib/company.ts and
              reused verbatim in the footer, About, llms.txt and Organization
              schema — never reworded per page.
            */}
            <p className="mt-8 max-w-prose text-body-sm text-text-secondary-inverse">
              {SHORT_DESCRIPTION}
            </p>
          </Reveal>
        </div>
      </Shell>
    </Section>
  );
}
