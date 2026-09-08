import Image from 'next/image';
import { Eyebrow, Section, Shell } from '@/components/layout/section';
import { JsonLd } from '@/components/seo/json-ld';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, jsonLdGraph } from '@/lib/seo/schema';
import { getCertifications } from '@/lib/content';
import { ROUTES } from '@/lib/constants';

/**
 * CERTIFICATIONS AND REGISTRATIONS.
 *
 * The highest-accuracy-risk content page on the site, and the one where being
 * dull is the whole value. Brief 3.5 and content-source/05-certifications.
 *
 * ── Nothing lapsed can appear here, and not because I remembered ────────────
 * The page reads `public_certifications`, which filters on
 * `expires_on > current_date` and treats a NULL expiry as not displayable
 * (migration 0009). Three of the five registrations have lapsed and one has an
 * unconfirmed renewal, so today exactly one row renders. That is enforced by the
 * DATABASE: this file could not display a lapsed permit if it tried, and when
 * operations renew one it appears with no deploy.
 *
 * The page says so out loud, in "What is not shown here". A trust page that
 * silently omits things is less trustworthy than one that explains its own
 * omissions, and a visitor who has seen a CAK certificate in a Nebsam proposal
 * deserves to know why it is absent rather than to conclude the site is stale.
 *
 * ── Three specific traps, all live ──────────────────────────────────────────
 *  1. The KEBS permit is PRODUCT-scoped — vehicle cameras for video telematics,
 *     STREAMAX brand. It certifies nothing about the company and does not cover
 *     trackers, alarms, speed governors or radios. `scope_note` is rendered
 *     immediately under the name, not in a footnote.
 *  2. "Accredited" is the wrong word and never appears. It is a permit to use a
 *     standardization mark.
 *  3. The CAK certificate states on its face that it is not a licence. Brief 3.5
 *     calls it an "Application Service Provider (AS) licence"; the document
 *     contradicts that, and the document wins (register V31).
 *
 * ── The image ───────────────────────────────────────────────────────────────
 * One scan is published, and it is CROPPED rather than redacted: the postal and
 * physical addresses, the telephone number, the email address, the QR code and
 * the Managing Director's signature are absent from the file. The six originals
 * are out of public/ entirely — source-assets/README.md.
 *
 * ── No schema markup for any of this ────────────────────────────────────────
 * Deliberate. There is no schema.org type that says "holds a product-scoped
 * permit from a national standards body", and the near-miss candidates all imply
 * an endorsement of the company. Markup that overstates a permit is exactly the
 * kind of structured-data claim brief 13.2 forbids. Breadcrumbs only.
 */
export const revalidate = 3600;

export const metadata = buildMetadata({
  title: 'Nebsam certifications and registrations',
  description:
    'The permits and registrations held by Nebsam Digital Solutions (K) Ltd, including the KEBS Permit to Use the Standardization Mark for video telematics cameras.',
  path: ROUTES.certifications,
});

function formatDate(value: string | null): string {
  if (!value) return '—';
  return new Date(`${value}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export default async function CertificationsPage() {
  const { data: certifications, configured } = await getCertifications();

  const trail = [
    { name: 'Home', path: ROUTES.home },
    { name: 'About', path: ROUTES.about },
    { name: 'Certifications', path: ROUTES.certifications },
  ];

  return (
    <main id="main">
      <JsonLd json={jsonLdGraph([breadcrumbSchema(trail)])} />

      <Section tone="dark" bleed>
        <Shell className="pb-12 pt-10 md:pb-16 md:pt-14">
          <Breadcrumbs trail={trail} tone="dark" />
          <h1 className="mt-6 max-w-[26ch] font-display text-h1 text-text-inverse md:text-md-display">
            Certifications and registrations
          </h1>
          <p className="mt-5 max-w-prose text-body-lg text-text-secondary-inverse">
            What Nebsam Digital Solutions (K) Ltd holds, described in the words the documents
            themselves use. Each one is a permit or registration held — none of them is an
            endorsement of product quality.
          </p>
        </Shell>
      </Section>

      <Section tone="light">
        <Shell>
          {certifications.length === 0 ? (
            <p className="max-w-prose text-body text-text-secondary">
              {configured
                ? 'Nothing current is on record to display. Registrations appear here only while they are in date.'
                : 'Certifications are not available at the moment.'}
            </p>
          ) : (
            <ul className="flex flex-col gap-14">
              {certifications.map((certification) => (
                <li key={certification.id} className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
                  <div>
                    <Eyebrow>{certification.issuer}</Eyebrow>
                    <h2 className="mt-3 font-display-tight text-h2 text-text-primary md:text-md-h2">
                      {certification.name}
                    </h2>

                    {/* The scope note sits directly under the name, before the
                        reader forms a view. Putting it lower would let the
                        headline read as company-wide certification for the
                        length of a paragraph, which is the exact
                        misunderstanding it exists to prevent. */}
                    {certification.scope_note ? (
                      <p className="mt-4 border-l-2 border-state-warn-ink pl-4 text-body text-text-primary">
                        <span className="font-medium">Scope. </span>
                        {certification.scope_note}
                      </p>
                    ) : null}

                    {certification.description ? (
                      <p className="mt-4 max-w-prose text-body text-text-secondary">
                        {certification.description}
                      </p>
                    ) : null}

                    <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 font-mono text-body-sm">
                      {certification.reference_number ? (
                        <>
                          <dt className="text-text-secondary">Reference</dt>
                          <dd className="text-text-primary">{certification.reference_number}</dd>
                        </>
                      ) : null}
                      <dt className="text-text-secondary">Effective</dt>
                      <dd className="text-text-primary">{formatDate(certification.effective_on)}</dd>
                      <dt className="text-text-secondary">Expires</dt>
                      <dd className="text-text-primary">{formatDate(certification.expires_on)}</dd>
                    </dl>
                  </div>

                  {certification.image ? (
                    <figure className="m-0">
                      <Image
                        src={certification.image}
                        alt={`Extract from the ${certification.name} issued to Nebsam by ${certification.issuer}, showing the mark number, the dates, and the commodity, brand and standard it covers.`}
                        width={1231}
                        height={1107}
                        sizes="(min-width: 768px) 22rem, 100vw"
                        className="h-auto w-full border border-border-hairline"
                      />
                      <figcaption className="mt-3 text-body-sm text-text-secondary">
                        An extract from the permit. The contact details, QR code and signature are
                        cropped out — not covered over — so the published file does not carry them.
                      </figcaption>
                    </figure>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </Shell>
      </Section>

      {/* ── The KEBS laboratory test report ──────────────────────────────────
          Not a certification, and kept in its own section so it is never read
          as one. It is confirmed quotable (brief PART 1.5 #17), and its value is
          that it is dry and verifiable: a named standard, a dated report, a
          one-word result. "Complies" is reproduced exactly and never paraphrased
          into anything stronger. */}
      <Section tone="paper">
        <Shell>
          <div className="max-w-prose">
            <Eyebrow>Kenya Bureau of Standards</Eyebrow>
            <h2 className="mt-3 font-display-tight text-h2 text-text-primary md:text-md-h2">
              Laboratory test report
            </h2>
            <p className="mt-4 text-body text-text-secondary">
              A third-party laboratory report on the video telematics system, tested against KNWA
              3006:2024. The result recorded is <span className="text-text-primary">Complies</span>.
            </p>

            <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 font-mono text-body-sm">
              <dt className="text-text-secondary">Report</dt>
              <dd className="text-text-primary">BS202445237</dd>
              <dt className="text-text-secondary">Date</dt>
              <dd className="text-text-primary">5 February 2025</dd>
              <dt className="text-text-secondary">Standard</dt>
              <dd className="text-text-primary">KNWA 3006:2024</dd>
              <dt className="text-text-secondary">Result</dt>
              <dd className="text-text-primary">Complies</dd>
            </dl>

            <p className="mt-6 text-body text-text-secondary">Parameters tested, all recorded as complying:</p>
            <ul className="mt-3 flex list-disc flex-col gap-1 pl-5 text-body text-text-secondary">
              <li>ADAS camera detection</li>
              <li>Driver alerts</li>
              <li>DSM camera detection</li>
              <li>G-sensor detection</li>
              <li>Power supply — in-built battery sustaining the system for a minimum of 30 minutes</li>
              <li>System tampering detection</li>
              <li>Ignition-triggered power-on</li>
            </ul>
          </div>
        </Shell>
      </Section>

      <Section tone="light">
        <Shell>
          <div className="max-w-prose">
            <h2 className="font-display-tight text-h2 text-text-primary md:text-md-h2">
              What is not shown here
            </h2>
            <p className="mt-4 text-body text-text-secondary">
              This page shows only registrations that are current. Nebsam holds others — including a
              Communications Authority of Kenya compliance certificate, registrations as a Data
              Controller and a Data Processor with the Office of the Data Protection Commissioner,
              and a Private Security Regulatory Authority registration — and they are not displayed
              here while their renewal is outstanding or unconfirmed.
            </p>
            <p className="mt-4 text-body text-text-secondary">
              That is a rule the site enforces rather than a policy it states: a registration
              appears on this page only while it is in date, and disappears on the day it lapses. We
              would rather show one current document than five of uncertain standing.
            </p>
            <p className="mt-4 text-body text-text-secondary">
              The Communications Authority certificate is worth one clarification, because it is
              often described wrongly: it states on its face that it is proof of compliance and not
              a licence.
            </p>
          </div>
        </Shell>
      </Section>
    </main>
  );
}
