import { Section, Shell } from '@/components/layout/section';
import { ButtonLink } from '@/components/ui/button';
import { BRANCHES, CONTACT, whatsappUrl } from '@/lib/company';

/**
 * CONVERSION CLOSE — homepage section 13 (brief 9.1). WhatsApp-led.
 *
 * The conversion order is fixed by the content skill §5: WhatsApp → call →
 * quote. It is not a stylistic preference. WhatsApp is how this market
 * actually makes first contact, it costs the enquirer nothing, and it leaves a
 * thread both sides can return to — a phone call that goes unanswered leaves
 * nothing at all.
 *
 * So there is exactly one primary control here. Giving three equal-weight
 * buttons would be the failure: "the primary action on a page is
 * unmistakable".
 *
 * Every number comes from `lib/company.ts`. Nothing here is hard-coded —
 * CLAUDE.md §4, because NAP consistency is what local SEO and LLM entity
 * resolution are built on, and a number that appears in two forms is a number
 * that will eventually disagree with itself.
 */

/** Pre-filled, so the first message is not an empty "Hi". */
const OPENING_MESSAGE =
  'Hello Nebsam, I would like to ask about vehicle tracking and fleet telematics.';

export function ConversionClose() {
  const nairobi = BRANCHES.find((b) => b.slug === 'nairobi') ?? BRANCHES[0];
  const callNumber = nairobi?.phones[0];

  return (
    <Section tone="dark">
      <Shell>
        <div className="max-w-prose">
          <h2 className="font-display text-h1 text-text-inverse md:text-md-h1">
            Tell us what you are trying to protect.
          </h2>
          <p className="mt-5 text-body-lg text-text-secondary-inverse">
            A short conversation establishes more than a brochure will. Tell us the vehicles, where
            they run and what has gone wrong before, and we will tell you what is worth fitting —
            including where the answer is less than you expected.
          </p>
        </div>

        <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
          <ButtonLink
            href={whatsappUrl(OPENING_MESSAGE)}
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
              Call {nairobi.name} — {callNumber.display}
            </ButtonLink>
          ) : null}

          {/*
            NO "Request a quote" link yet. It would point at /contact, which
            does not exist until Sprint 8, and a conversion CTA that lands on a
            404 is worse than one fewer CTA — this is the site's first
            commercial objective, not a nav convenience. Two controls that both
            work beats three where one is broken. Restore it with Sprint 8.
          */}
        </div>

        <p className="mt-8 max-w-prose text-body-sm text-text-secondary-inverse">
          Branches in {BRANCHES.map((b) => b.name).join(', ')}. Enquiries on{' '}
          {CONTACT.whatsapp.display}.
        </p>
      </Shell>
    </Section>
  );
}
