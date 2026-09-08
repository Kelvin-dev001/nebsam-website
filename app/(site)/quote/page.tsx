import { Section, Shell } from '@/components/layout/section';
import { JsonLd } from '@/components/seo/json-ld';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { EnquiryForm } from '@/components/forms/enquiry-form';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, jsonLdGraph } from '@/lib/seo/schema';
import { ROUTES, VAT_LABEL } from '@/lib/constants';

/**
 * REQUEST A QUOTE.
 *
 * The primary conversion route for anything that is not a single item bought
 * from the shop: fleets, multi-vehicle installs, and the products whose price is
 * not published.
 *
 * ── Why the form asks what it asks ──────────────────────────────────────────
 * Vehicle count and town, because both change the answer and both are otherwise
 * a phone call. `interest` is free text rather than a product dropdown: the
 * catalogue changes, a select goes stale, and "fourteen lorries and two pickups"
 * tells sales more than any list of options could.
 *
 * ── What this page does NOT say ─────────────────────────────────────────────
 * No response time. Not "within 24 hours", not "same day". CLAUDE.md §5 forbids
 * inventing one, and a promise nobody in operations has agreed to is a promise
 * the business gets held to. It says what is true — that VAT and recurring fees
 * are stated in writing — and stops.
 */
export const dynamic = 'force-dynamic';

export const metadata = buildMetadata({
  title: 'Request a vehicle tracking quote in Kenya',
  description:
    'Get a written quote from Nebsam for vehicle tracking, fuel monitoring or video telematics in Kenya. VAT and any recurring fees stated clearly.',
  path: ROUTES.quote,
});

export default function QuotePage() {
  const trail = [
    { name: 'Home', path: ROUTES.home },
    { name: 'Request a quote', path: ROUTES.quote },
  ];

  return (
    <main id="main">
      <JsonLd json={jsonLdGraph([breadcrumbSchema(trail)])} />

      <Section tone="dark" bleed>
        <Shell className="pb-12 pt-10 md:pb-16 md:pt-14">
          <Breadcrumbs trail={trail} tone="dark" />
          <h1 className="mt-6 max-w-[22ch] font-display text-h1 text-text-inverse md:text-md-display">
            Request a quote
          </h1>
          <p className="mt-5 max-w-prose text-body-lg text-text-secondary-inverse">
            For a fleet, for several vehicles, or for anything whose price is not published on the
            site. Nebsam Digital Solutions (K) Ltd quotes across Kenya, from branches in Nairobi,
            Mombasa and Nakuru.
          </p>
        </Shell>
      </Section>

      <Section tone="light">
        <Shell>
          <div className="max-w-prose">
            <h2 className="font-display-tight text-h2 text-text-primary md:text-md-h2">
              What a quote from us includes
            </h2>
            <p className="mt-4 text-body text-text-secondary">
              The hardware, the installation, and any recurring fee stated separately with the period
              it covers. Published prices on this site are {VAT_LABEL}, and a written quote states
              VAT as its own line rather than folding it in.
            </p>
            <p className="mt-4 text-body text-text-secondary">
              If you already know exactly what you want and it has a published price, the{' '}
              <a className="text-brand-signal-ink underline underline-offset-4" href={ROUTES.products}>
                product pages
              </a>{' '}
              are faster — you can order straight through WhatsApp.
            </p>
          </div>

          <div className="mt-10">
            <EnquiryForm kind="quote" whatsappMessage="Hello Nebsam — I would like a quote." />
          </div>
        </Shell>
      </Section>
    </main>
  );
}
