import { Section, Shell } from '@/components/layout/section';
import { JsonLd } from '@/components/seo/json-ld';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { EnquiryForm } from '@/components/forms/enquiry-form';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, jsonLdGraph, localBusinessSchemas } from '@/lib/seo/schema';
import { ROUTES } from '@/lib/constants';
import { BRANCHES, CANONICAL_DESCRIPTION, COMPANY, CONTACT, SITE_URL, whatsappUrl } from '@/lib/company';

/**
 * CONTACT.
 *
 * The most important page on the site for local SEO and for LLM entity
 * resolution, because it is where the name, address and phone number appear
 * together in one place. Every value comes from lib/company.ts — nothing here is
 * typed twice, because NAP drift across a site is what makes a search engine
 * distrust all of it.
 *
 * ── Three branches. Only three ──────────────────────────────────────────────
 * Brief 3.4 and PART 1.5 #6/#7. Existing Nebsam sales collateral contradicts
 * this and must never be used as an address source. The page also says, in
 * words, that everywhere else is agents and technicians — an omission would let
 * a reader infer offices that do not exist, and an inference is as damaging as a
 * claim.
 *
 * ── ContactPage + LocalBusiness x3 ──────────────────────────────────────────
 * Emitted from the same constants the page renders, so the markup cannot
 * contradict the visible page. No `geo` on any of them: migration 0038 stores
 * TOWN coordinates and a LocalBusiness `geo` is read as the premises.
 */
export const revalidate = 3600;

export const metadata = buildMetadata({
  title: 'Contact Nebsam — Nairobi, Mombasa & Nakuru',
  description:
    'Contact Nebsam Digital Solutions (K) Ltd for vehicle tracking, fleet telematics and vehicle security in Kenya. WhatsApp, phone and email, and our three branch addresses.',
  path: ROUTES.contact,
});

export default function ContactPage() {
  const trail = [
    { name: 'Home', path: ROUTES.home },
    { name: 'Contact', path: ROUTES.contact },
  ];

  const contactPage = {
    '@type': 'ContactPage',
    '@id': `${SITE_URL}${ROUTES.contact}#page`,
    url: `${SITE_URL}${ROUTES.contact}`,
    name: `Contact ${COMPANY.tradingName}`,
    description: CANONICAL_DESCRIPTION,
  };

  return (
    <main id="main">
      <JsonLd json={jsonLdGraph([contactPage, breadcrumbSchema(trail), ...localBusinessSchemas()])} />

      <Section tone="dark" bleed>
        <Shell className="pb-12 pt-10 md:pb-16 md:pt-14">
          <Breadcrumbs trail={trail} tone="dark" />
          <h1 className="mt-6 max-w-[20ch] font-display text-h1 text-text-inverse md:text-md-display">
            Contact Nebsam
          </h1>
          <p className="mt-5 max-w-prose text-body-lg text-text-secondary-inverse">
            {CANONICAL_DESCRIPTION}
          </p>

          <p className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-body">
            <a
              className="text-brand-signal underline underline-offset-4"
              href={whatsappUrl('Hello Nebsam — I have an enquiry.')}
            >
              WhatsApp {CONTACT.whatsapp.display}
            </a>
            <a className="text-brand-signal underline underline-offset-4" href={`mailto:${CONTACT.generalEmail}`}>
              {CONTACT.generalEmail}
            </a>
            <a className="text-brand-signal underline underline-offset-4" href={`mailto:${CONTACT.salesEmail}`}>
              {CONTACT.salesEmail}
            </a>
          </p>
          <p className="mt-3 font-mono text-label uppercase tracking-[0.08em] text-text-secondary-inverse">
            {CONTACT.hours}
          </p>
        </Shell>
      </Section>

      <Section tone="light">
        <Shell>
          <h2 className="font-display-tight text-h2 text-text-primary md:text-md-h2">
            Our three branches
          </h2>
          <p className="mt-4 max-w-prose text-body text-text-secondary">
            These are the offices. Everywhere else in Kenya is served by agents and technicians
            working from them — see{' '}
            <a className="text-brand-signal-ink underline underline-offset-4" href={ROUTES.coverage}>
              coverage
            </a>
            .
          </p>

          <ul className="mt-8 grid gap-x-10 gap-y-8 border-t border-border-hairline pt-8 md:grid-cols-3">
            {BRANCHES.map((branch) => (
              <li key={branch.slug} id={branch.slug}>
                <h3 className="font-display-tight text-h3 text-text-primary">{branch.name}</h3>
                <address className="mt-3 not-italic text-body text-text-secondary">
                  {branch.address}
                  <br />
                  {branch.town}, {branch.county} County
                </address>
                <ul className="mt-4 flex flex-col gap-1 font-mono text-body-sm">
                  {branch.phones.map((phone) => (
                    <li key={phone.e164}>
                      <a className="text-brand-signal-ink underline underline-offset-4" href={`tel:${phone.e164}`}>
                        {phone.display}
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-body-sm">
                  <a
                    className="text-brand-signal-ink underline underline-offset-4"
                    href={branch.mapsUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Open in Maps
                  </a>
                </p>
              </li>
            ))}
          </ul>
        </Shell>
      </Section>

      <Section tone="paper">
        <Shell>
          <h2 className="font-display-tight text-h2 text-text-primary md:text-md-h2">
            Send us a message
          </h2>
          <p className="mt-4 max-w-prose text-body text-text-secondary">
            For a price, use{' '}
            <a className="text-brand-signal-ink underline underline-offset-4" href={ROUTES.quote}>
              request a quote
            </a>{' '}
            instead — it asks the questions we would otherwise have to come back and ask.
          </p>

          <div className="mt-8">
            <EnquiryForm kind="contact" whatsappMessage="Hello Nebsam — I have an enquiry." />
          </div>
        </Shell>
      </Section>
    </main>
  );
}
