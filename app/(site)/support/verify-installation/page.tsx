import { Eyebrow, Section, Shell } from '@/components/layout/section';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { StripTokenFromUrl } from '@/components/support/strip-token-from-url';
import { VerifyForm } from '@/components/support/verify-form';
import { buildMetadata } from '@/lib/seo/metadata';
import { lookupByToken } from '@/lib/verification/lookup';
import { ROUTES } from '@/lib/constants';
import { CONTACT, whatsappUrl } from '@/lib/company';

/**
 * CERTIFICATE VERIFICATION.
 *
 * Brief PART 9.2 · docs/SECURITY_REQUIREMENTS.md §1. The single most sensitive
 * page on the site, and the one where the obvious design is the dangerous one.
 *
 * ── Why this page asks for two things ───────────────────────────────────────
 * A number plate is painted on the outside of the vehicle. A lookup keyed on it
 * alone, returning valid or expired, is a target list: it says which vehicles
 * carry a tracker and — far worse — which owners believe they are protected and
 * are not. So the page asks for the plate AND the last four digits of the phone
 * number registered at installation.
 *
 * The page SAYS SO, in as many words, above the form. That is not an apology for
 * friction. A visitor told why a security product asks for a second detail
 * understands the product better than one who is simply asked; and the page is
 * `noindex`, so this paragraph is written for the customer standing at a
 * roadside, not for a crawler.
 *
 * ── noindex, and why the sitemap is not enough ──────────────────────────────
 * ROUTE_MAP §1 marks this route noindex, and it stays out of the sitemap. Both
 * are needed: a sitemap omission is a hint, and a robots directive is an
 * instruction. Nothing here should ever appear in a search result, because a
 * search result is a durable public record of a private lookup.
 *
 * ── Dynamic, deliberately ───────────────────────────────────────────────────
 * `force-dynamic` because the answer depends on the request and must never be
 * cached — not by Next, not by a CDN, not by the browser's back button. The QR
 * path reads a token from the query string, and a cached response to a token is
 * a cached answer about somebody's vehicle.
 */
export const dynamic = 'force-dynamic';

export const metadata = buildMetadata({
  title: 'Verify a Nebsam installation certificate',
  description:
    'Confirm that a Nebsam vehicle tracking installation certificate is genuine and current, using the vehicle registration and the phone number registered at installation.',
  path: ROUTES.verifyInstallation,
  noindex: true,
});

export default async function VerifyInstallationPage({
  searchParams,
}: {
  searchParams: Promise<{ t?: string }>;
}) {
  const { t } = await searchParams;

  /**
   * The QR path. Resolved on the server before anything renders, so the token is
   * never handed to client JavaScript — the browser receives an answer, not a
   * credential.
   */
  const scanned = t ? await lookupByToken(t) : null;

  const trail = [
    { name: 'Home', path: ROUTES.home },
    { name: 'Support', path: ROUTES.support },
    { name: 'Verify an installation', path: ROUTES.verifyInstallation },
  ];

  return (
    <main id="main">
      {/* No BreadcrumbList schema on a noindex page. Structured data exists to
          feed a search result this page must never produce. */}
      {t ? <StripTokenFromUrl /> : null}

      <Section tone="dark" bleed>
        <Shell className="pb-12 pt-10 md:pb-16 md:pt-14">
          <Breadcrumbs trail={trail} tone="dark" />
          <h1 className="mt-6 max-w-[22ch] font-display text-h1 text-text-inverse md:text-md-display">
            Verify an installation
          </h1>
          <p className="mt-5 max-w-prose text-body-lg text-text-secondary-inverse">
            Confirm that a Nebsam installation certificate is genuine and still current. Useful
            before buying a used vehicle, when an insurer asks for proof, and when a certificate has
            been sitting in the glovebox for a year.
          </p>
        </Shell>
      </Section>

      {scanned ? (
        <Section tone="paper">
          <Shell>
            <Eyebrow>Scanned certificate</Eyebrow>
            <div className="mt-5 max-w-prose">
              <ScannedAnswer status={scanned.status} installedOn={scanned.installedOn} expiresOn={scanned.expiresOn} />
            </div>
          </Shell>
        </Section>
      ) : null}

      <Section tone="light">
        <Shell>
          <div className="max-w-prose">
            <h2 className="font-display-tight text-h2 text-text-primary md:text-md-h2">
              Why we ask for two details
            </h2>
            <p className="mt-4 text-body text-text-secondary">
              A number plate is public — it is painted on the outside of the vehicle. If this page
              answered on the plate alone, anyone could work through plate numbers and find out
              which vehicles carry a tracker, and which of those have lapsed. That is a list we are
              not willing to publish, so we ask for something only the owner would know: the last
              four digits of the phone number given to us at installation.
            </p>
            <p className="mt-4 text-body text-text-secondary">
              If you are holding the certificate itself, scan the QR code printed on it instead. It
              takes you straight to the answer with nothing else to type.
            </p>
          </div>

          <div className="mt-10">
            <VerifyForm />
          </div>
        </Shell>
      </Section>

      <Section tone="paper">
        <Shell>
          <div className="max-w-prose">
            <h2 className="font-display-tight text-h3 text-text-primary">
              If it will not verify
            </h2>
            <p className="mt-4 text-body text-text-secondary">
              The phone number on file may be an older one, or the vehicle may have changed hands
              since the installation. We can confirm it directly — we will need to establish that
              you are the owner before we discuss a specific vehicle, for the same reason this page
              asks for two details.
            </p>
            <p className="mt-5 text-body">
              <a
                className="text-brand-signal-ink underline underline-offset-4"
                href={whatsappUrl('Hello Nebsam — I would like to confirm an installation certificate.')}
              >
                Message us on WhatsApp
              </a>
              <span className="text-text-secondary"> · </span>
              <a
                className="text-brand-signal-ink underline underline-offset-4"
                href={`mailto:${CONTACT.generalEmail}`}
              >
                {CONTACT.generalEmail}
              </a>
            </p>
          </div>
        </Shell>
      </Section>
    </main>
  );
}

function formatDate(value: string | null | undefined): string {
  if (!value) return 'Not recorded';
  return new Date(`${value}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/**
 * The answer to a scanned QR code.
 *
 * No plate is shown here, and that is not an omission. The scan path identifies
 * a certificate by a signed token, so the page never learns a plate — and a page
 * that does not know a value cannot leak it. The holder is looking at the
 * certificate; it has the registration printed on it.
 */
function ScannedAnswer({
  status,
  installedOn,
  expiresOn,
}: {
  status: string;
  installedOn?: string | null;
  expiresOn?: string | null;
}) {
  if (status === 'valid' || status === 'expired') {
    const valid = status === 'valid';
    return (
      <div data-verification-result className={`border-l-2 ${valid ? 'border-state-ok-ink' : 'border-state-warn-ink'} bg-surface p-5 md:p-6`}>
        <h2 className="font-display-tight text-h3 text-text-primary">
          {valid ? 'Installation confirmed' : 'This installation has expired'}
        </h2>
        <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 font-mono text-body-sm">
          <dt className="text-text-secondary">Installed</dt>
          <dd>{formatDate(installedOn)}</dd>
          <dt className="text-text-secondary">Expires</dt>
          <dd>{formatDate(expiresOn)}</dd>
        </dl>
      </div>
    );
  }

  // Forged token, expired token and unknown certificate all land here with the
  // same words, for the same reason the typed form has one failure message.
  return (
    <div data-verification-result className="border-l-2 border-border-strong bg-surface p-5 md:p-6">
      <h2 className="font-display-tight text-h3 text-text-primary">
        This link could not be confirmed
      </h2>
      <p className="mt-3 text-body text-text-secondary">
        The QR code may have expired, or the link may be incomplete. Enter the vehicle registration
        below instead, or contact us and we will confirm it for you.
      </p>
    </div>
  );
}
