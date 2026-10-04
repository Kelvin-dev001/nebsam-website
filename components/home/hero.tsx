import { HeroPhoto } from '@/components/home/hero-photo';
import { Eyebrow, Section, Shell } from '@/components/layout/section';
import { ButtonLink } from '@/components/ui/button';
import { Reveal } from '@/components/motion/reveal';
import { BRANCHES, SHORT_DESCRIPTION, whatsappUrl } from '@/lib/company';

/**
 * HERO — homepage section 1.
 *
 * SPRINT 12n (ADR-0009, amending ADR-0002): THE PHOTOGRAPH ARRIVES. Brief 9.1
 * asks for "real cinematic vehicle/fleet photography, telemetry overlay", and
 * Nebsam has now supplied the picture (Kelvin chose the dusk highway on
 * 4 Oct 2026). Still left-weighted and asymmetric: the text keeps the left
 * column on solid navy, and the photo fills the right from lg, or follows the
 * text below lg. Composition and the LCP reasoning are in hero-photo.tsx.
 *
 * Sprint 1's composition, kept here as the record: the readout was the
 * dominant object rather than a photograph, with photography as atmosphere in
 * a narrow band. That band was cut for weight (ADR-0002, "What was removed").
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
 * SPRINT 12b T4: THE READOUT MOVED OUT (memo D3b = b). The jamming readout
 * now peaks the "One vehicle, instrumented" set piece (components/home/
 * one-vehicle.tsx), where it arrives with context. A page with two jamming
 * moments has two peaks, and a page with two peaks has none.
 *
 * THE HEADLINE (register V75, approved by Kelvin 28 Sep 2026). It carries the
 * whole company, as ADR-0002 asked of the production hero, and each clause is
 * a beat of the set piece below it. The sub-line is where the claim is earned
 * and hedged, so it is traced sentence by sentence:
 *  - "Position, speed and ignition state, subject to network and GPS
 *    availability": 02-products/trackers/standard-tracker/write-up.md §01. The
 *    hedge is word for word and is a condition of the headline's approval.
 *  - abnormal fuel level drops: 01-solutions/fuel-monitoring/write-up.md §02.
 *  - geofence entries and exits: standard-tracker write-up §04.
 *  - jamming attempts, on an anti-jamming tracker only: anti-jammer-tracker
 *    write-up line 79, and the approved Sprint 1 hero copy ("alerting you").
 * The LCP element is server-rendered text either way: the headline on phones,
 * where it is now the largest block, and the paragraph where it is not.
 */
export function Hero() {
  const nairobi = BRANCHES.find((b) => b.slug === 'nairobi') ?? BRANCHES[0];
  const callNumber = nairobi?.phones[0];

  return (
    <Section
      tone="dark"
      bleed
      className="relative overflow-hidden lg:flex lg:min-h-[44rem] lg:items-center"
    >
      <Shell className="relative z-10 w-full pb-10 pt-14 md:pb-16 md:pt-24 lg:py-24">
        <div className="hero-copy">
          <Reveal index={0}>
            <Eyebrow dot>{BRANCHES.map((b) => b.name).join(' · ')}</Eyebrow>
          </Reveal>

          <Reveal index={1}>
            {/*
              Stepped down from the display sizes the old two-line headline
              used, because this one is thirteen words. At display size on a
              360px phone it ran to seven lines and pushed "Talk to us on
              WhatsApp" under the cookie bar on a first visit (measured 28 Sep
              2026). At h1 size it is five lines and the action clears the bar;
              from lg it returned to display size. Since 12n the text column
              ends where the hero's solid scrim ends (media.css .hero-copy),
              so display size waits for xl, where that column is wide enough.
            */}
            <h1 className="mt-5 font-display text-h1 md:text-md-h1 xl:text-md-display">
              {"Know where your vehicles are, what they're doing, and when something goes wrong."}
            </h1>
          </Reveal>

          <Reveal index={2}>
            <p className="mt-5 max-w-prose text-body-lg text-text-secondary-inverse">
              Position, speed and ignition state, subject to network and GPS availability — with
              alerts for abnormal fuel level drops, geofence entries and exits and, on an
              anti-jamming tracker, jamming attempts.
            </p>
          </Reveal>

          <Reveal index={3}>
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

          <Reveal index={4}>
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

      <HeroPhoto />
    </Section>
  );
}
