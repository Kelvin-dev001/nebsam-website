import { Section, Shell } from '@/components/layout/section';
import { JsonLd } from '@/components/seo/json-ld';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { EnquiryForm } from '@/components/forms/enquiry-form';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, jsonLdGraph } from '@/lib/seo/schema';
import { ROUTES } from '@/lib/constants';
import { BRANCHES, COVERAGE_TOWNS } from '@/lib/company';

/**
 * INSTALLATION BOOKING.
 *
 * ── It is a REQUEST, and the page never pretends otherwise ──────────────────
 * There is no calendar, no slot picker and no confirmation. Nothing in this
 * build knows a technician's diary, so a page that let someone choose "Tuesday
 * at 10" would be inventing an availability it cannot honour — and the person
 * who turns up expecting a fitter is the one who pays for that. The heading, the
 * field hint and the confirmation all say "request".
 *
 * ── What is deliberately absent ─────────────────────────────────────────────
 * No duration ("takes about two hours"), no price, no "same-day in Nairobi".
 * None of those are confirmed, and CLAUDE.md §5 forbids inventing a response
 * time or an installation term. V05 covers the installation terms; until it is
 * answered the page says what it knows and stops.
 */
export const dynamic = 'force-dynamic';

export const metadata = buildMetadata({
  title: 'Book a vehicle tracker installation in Kenya',
  description:
    'Request an installation from Nebsam Digital Solutions. Tell us the vehicle, the product and your town, and we will come back to you to confirm a time.',
  path: ROUTES.bookInstallation,
});

export default function BookInstallationPage() {
  const trail = [
    { name: 'Home', path: ROUTES.home },
    { name: 'Support', path: ROUTES.support },
    { name: 'Book an installation', path: ROUTES.bookInstallation },
  ];

  return (
    <main id="main">
      <JsonLd json={jsonLdGraph([breadcrumbSchema(trail)])} />

      <Section tone="dark" bleed>
        <Shell className="pb-12 pt-10 md:pb-16 md:pt-14">
          <Breadcrumbs trail={trail} tone="dark" />
          <h1 className="mt-6 max-w-[24ch] font-display text-h1 text-text-inverse md:text-md-display">
            Request an installation
          </h1>
          <p className="mt-5 max-w-prose text-body-lg text-text-secondary-inverse">
            Tell us what is being fitted, to which vehicle, and where it will be. We come back to you
            with a time — nothing is booked until we have confirmed it with you.
          </p>
        </Shell>
      </Section>

      <Section tone="light">
        <Shell>
          <div className="max-w-prose">
            <h2 className="font-display-tight text-h2 text-text-primary md:text-md-h2">
              Where we install
            </h2>
            <p className="mt-4 text-body text-text-secondary">
              Nebsam has three branches — {BRANCHES.map((b) => b.name).join(', ')} — and works
              through agents and technicians in {COVERAGE_TOWNS.slice(0, 6).join(', ')} and other
              towns. If your town is not on that list, ask anyway; the list is where we already are,
              not a limit on where we go.
            </p>
          </div>

          <div className="mt-10">
            <EnquiryForm
              kind="installation"
              whatsappMessage="Hello Nebsam — I would like to book an installation."
            />
          </div>
        </Shell>
      </Section>

      <Section tone="paper">
        <Shell>
          <div className="max-w-prose">
            <h2 className="font-display-tight text-h3 text-text-primary">Already have a certificate?</h2>
            <p className="mt-4 text-body text-text-secondary">
              If you are checking an installation that has already been done, use{' '}
              <a
                className="text-brand-signal-ink underline underline-offset-4"
                href={ROUTES.verifyInstallation}
              >
                verify an installation
              </a>{' '}
              instead.
            </p>
          </div>
        </Shell>
      </Section>
    </main>
  );
}
