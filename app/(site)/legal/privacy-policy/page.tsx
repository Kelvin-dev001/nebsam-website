import Link from 'next/link';
import { buildMetadata } from '@/lib/seo/metadata';
import { ROUTES } from '@/lib/constants';
import { COMPANY, DATA_PROTECTION_CONTACT, BRANCHES } from '@/lib/company';
import { LegalPage, LegalSectionBlock, LegalTable } from '@/components/legal/legal-page';

/**
 * PRIVACY NOTICE.
 *
 * ── The distinction this page is built around ───────────────────────────────
 *
 * A Nebsam privacy notice is NOT a website privacy notice. Nebsam tracks
 * vehicles, records driver-facing video, and for school buses may handle
 * children's attendance and biometric data. That processing is the substance of
 * its obligations under the Data Protection Act 2019 — and there is no source
 * for any of it in this repository. `content-source/` has no legal folder, and
 * the legacy site never had a privacy policy at all.
 *
 * What IS knowable with certainty is what this website does, because that is in
 * the code: `lib/submissions/types.ts` lists every field of every form,
 * `lib/verification/` shows that no plaintext plate is ever stored,
 * `app/(site)/cart/actions.ts` shows what an order records, and
 * `next.config.mjs` lists every third party the browser is allowed to contact.
 *
 * So this page documents the website in full and marks the service processing as
 * outstanding, LOUDLY, at the top. The failure mode on a privacy notice is not
 * being wrong — it is being incomplete while looking complete. A notice that
 * covers a contact form and says nothing about vehicle tracking reads, to
 * someone skimming, as though tracking were not happening.
 *
 * ── On lawful basis ────────────────────────────────────────────────────────
 *
 * Deliberately absent. Assigning a lawful basis under the DPA 2019 is a legal
 * judgement, not an observation about code, and getting it wrong is worse than
 * leaving it to the person qualified to make it. The page describes purpose —
 * what the data is for — which is verifiable, and leaves basis to review.
 *
 * V28a IS VISIBLE HERE. The ODPC registrations expired on 27 May 2026, and a
 * privacy notice is the one page where claiming a lapsed registration would be
 * a misrepresentation to a regulator rather than a marketing slip. So the
 * registration is described in the past tense with its dates, not asserted.
 */
export const revalidate = 3600;

export const metadata = buildMetadata({
  title: 'Privacy notice — Nebsam Digital Solutions',
  description:
    'What Nebsam does with the information you send through this website: the forms, certificate verification, orders and analytics. Your rights under the Data Protection Act 2019.',
  path: ROUTES.privacy,
});

export default function PrivacyPolicyPage() {
  const registeredOffice = BRANCHES[0];

  return (
    <LegalPage
      title="Privacy notice"
      lead="What we collect through this website, why, who else sees it, and what you can ask us to do about it."
      path={ROUTES.privacy}
      reviewedOn="2026-09-11"
      scope={
        <>
          <p>
            This notice covers <strong>this website</strong>,{' '}
            <code className="font-mono text-mono">nebsamdigital.com</code> — the enquiry forms,
            certificate verification, the shop, and analytics.
          </p>
          <p>
            <strong>
              It does not yet cover the tracking service itself: vehicle location data, in-vehicle
              and driver-facing video, or school bus attendance data.
            </strong>{' '}
            That processing is real, it is the larger part of what Nebsam does with personal data,
            and it is described in the contract and installation paperwork for each service rather
            than here. A separate service privacy notice is being prepared. Until it exists, ask{' '}
            {DATA_PROTECTION_CONTACT.name} directly — the contact details are at the bottom of this
            page — and you will get a straight answer.
          </p>
        </>
      }
      reviewStatus={
        <>
          <p>
            <strong>This notice has not yet been through legal review.</strong> It was written by
            reading what the website actually does, line by line, so the descriptions of collection
            and storage below are accurate. What it does not do is assign a lawful basis to each
            purpose, or state retention periods — both are legal judgements rather than technical
            facts, and both are with the company&rsquo;s adviser.
          </p>
          <p>
            It is published rather than withheld because a site that collects personal data and
            offers no privacy information at all is the worse of the two, and because everything
            stated here is checkable.
          </p>
        </>
      }
    >
      <LegalSectionBlock id="who-we-are" heading="Who we are">
        <p>
          {COMPANY.legalName} is the data controller for the information described in this notice.
          Our registered address is {registeredOffice.address}, {registeredOffice.town}.
        </p>
        <p>
          Nebsam registered with the Office of the Data Protection Commissioner as both a data
          controller and a data processor, with registrations effective from 27 May 2024 and valid
          to <strong>27 May 2026</strong>. Renewal is in progress. We state the dates rather than
          claim a current registration, because a privacy notice is the last place to be imprecise
          about that.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="what-we-collect" heading="What this website collects, exactly">
        <p>
          Every field below is a field you type. The site does not collect anything about you in the
          background beyond what is described under analytics and security.
        </p>

        <LegalTable
          caption="Information collected by each part of this website"
          columns={['Where', 'What it collects', 'What it is for']}
          rows={[
            [
              <>
                <Link href={ROUTES.contact} className="underline underline-offset-4">
                  Contact form
                </Link>
              </>,
              'Your name, phone number, optionally an email address, optionally a preferred branch, and your message',
              'Replying to you',
            ],
            [
              <>
                <Link href={ROUTES.quote} className="underline underline-offset-4">
                  Quote request
                </Link>
              </>,
              'Your name, phone number, optionally email, optionally your organisation, what you need, roughly how many vehicles, and your town',
              'Preparing a quote and saying who would carry out the work',
            ],
            [
              <>
                <Link href={ROUTES.bookInstallation} className="underline underline-offset-4">
                  Installation booking
                </Link>
              </>,
              'Your name, phone number, optionally email, what is being installed, optionally the vehicle, the town, and a preferred time',
              'Arranging the appointment. It is a request, not a confirmed booking, until we confirm it',
            ],
            [
              <>
                <Link href={ROUTES.suggestions} className="underline underline-offset-4">
                  Suggestions
                </Link>
              </>,
              <>
                Your suggestion. Name, phone and email are <strong>optional</strong>, and if you tick
                &ldquo;send anonymously&rdquo; they are <strong>discarded before the record is
                written</strong> — not stored and hidden
              </>,
              'Improving what we do',
            ],
            [
              <>
                <Link href={ROUTES.verifyInstallation} className="underline underline-offset-4">
                  Certificate verification
                </Link>
              </>,
              <>
                A vehicle registration and the last four digits of the phone number given at
                installation. <strong>Neither is stored.</strong> See below
              </>,
              'Confirming a certificate is genuine and current',
            ],
            [
              <>
                <Link href={ROUTES.cart} className="underline underline-offset-4">
                  Placing an order
                </Link>
              </>,
              'Your name, phone number, optionally your town, and what you ordered at the price shown',
              'Fulfilling the order, and having a record of it if the WhatsApp conversation is lost',
            ],
          ]}
        />
      </LegalSectionBlock>

      <LegalSectionBlock
        id="verification"
        heading="Certificate verification stores no registration number"
      >
        <p>
          This one is worth explaining, because it is unusual and it is deliberate.
        </p>
        <p>
          A number plate is public information — it is painted on the outside of the vehicle. If a
          lookup answered on the plate alone, anyone could work through registrations and find out
          which vehicles carry a tracker and which of those had lapsed. That is a list of vehicles
          worth stealing, and we are not willing to hold it.
        </p>
        <p>
          So the plate you type is converted, on our server, into a one-way keyed fingerprint and
          compared against fingerprints. <strong>The registration itself is never written down</strong>,
          and neither are the phone digits. Someone who obtained a complete copy of that table would
          get no usable list of registrations from it.
        </p>
        <p>
          We do keep a record that <em>an attempt happened</em> — the time, the outcome, and
          fingerprints of the plate and the network address — so that we can tell ordinary use from
          somebody working through a list. Those records cannot be turned back into a registration
          or an address.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="security-data" heading="Information collected for security">
        <p>
          To stop a form being flooded automatically, we count how many submissions come from one
          network connection in an hour. Your network address is <strong>not stored in readable
          form</strong> — it is converted to a keyed fingerprint that exists only to make that count
          possible.
        </p>
        <p>
          An anonymous suggestion stores <strong>no fingerprint at all</strong>. That is a deliberate
          trade: it means anonymous suggestions cannot be linked to each other or to a named enquiry
          from the same person, which is what the anonymous option promises.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="who-else" heading="Who else handles this information">
        <p>We do not sell information about you, and we do not share it for advertising.</p>
        <LegalTable
          caption="Processors and third parties"
          columns={['Who', 'What they handle', 'Where']}
          rows={[
            [
              'Supabase',
              'The database and file storage behind this website — enquiries, orders and certificate fingerprints',
              <>
                Hosted outside Kenya.{' '}
                <span className="text-state-warn-ink">
                  [[NEEDS_VERIFICATION: confirm the Supabase project region and the transfer basis
                  relied on under DPA 2019 Part VI]]
                </span>
              </>,
            ],
            [
              'Cloudflare',
              'The check that a form is submitted by a person rather than a script',
              'Global network',
            ],
            [
              'Google',
              'Analytics — only if you accept them',
              'Global network',
            ],
            [
              'Meta (WhatsApp)',
              'The chat itself, once you choose to message us. Anything you send in that conversation is governed by WhatsApp’s own terms as well as ours',
              'Global network',
            ],
          ]}
        />
      </LegalSectionBlock>

      <LegalSectionBlock id="retention" heading="How long we keep it">
        <p>
          The security counts described above are deleted automatically after{' '}
          <strong>24 hours</strong>, because that is longer than any limit they enforce and there is
          no reason to keep them.
        </p>
        <p className="text-state-warn-ink">
          [[NEEDS_VERIFICATION: retention periods for enquiries, quotes, installation bookings,
          orders and certificate records — each needs a stated period and a reason, confirmed with
          the company&rsquo;s legal adviser]]
        </p>
        <p>
          Until those periods are settled, we keep enquiry and order records for as long as needed
          to deal with the enquiry and to meet our record-keeping obligations, and no longer than
          that. If you want yours deleted sooner, ask — see below.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="your-rights" heading="Your rights">
        <p>Under the Data Protection Act 2019 you have the right to:</p>
        <ul className="ml-5 flex list-disc flex-col gap-1.5">
          <li>be told what personal data we hold about you, and get a copy of it;</li>
          <li>have inaccurate data corrected;</li>
          <li>have data deleted, where we have no continuing reason to keep it;</li>
          <li>object to processing, and to ask us to restrict it while an objection is considered;</li>
          <li>withdraw consent where processing relies on it — declining analytics is one example;</li>
          <li>complain to the Office of the Data Protection Commissioner.</li>
        </ul>
        <p>
          Ask {DATA_PROTECTION_CONTACT.name} using the details below. We will not charge you for a
          request and we will not ask why you are making it. If you are not satisfied with how we
          respond, you can complain to the Office of the Data Protection Commissioner directly — you
          do not need our permission or involvement to do that.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="contact" heading="Contacting us about your data">
        <p>
          <strong>{DATA_PROTECTION_CONTACT.name}</strong>
          <br />
          <a
            href={`mailto:${DATA_PROTECTION_CONTACT.email}`}
            className="underline underline-offset-4"
          >
            {DATA_PROTECTION_CONTACT.email}
          </a>
          <br />
          <a
            href={`tel:${DATA_PROTECTION_CONTACT.phone.e164}`}
            className="underline underline-offset-4"
          >
            {DATA_PROTECTION_CONTACT.phone.display}
          </a>
          <br />
          {registeredOffice.address}, {registeredOffice.town}
        </p>
        <p>
          Cookies and analytics are covered separately in the{' '}
          <Link href={ROUTES.cookies} className="underline underline-offset-4">
            cookie notice
          </Link>
          .
        </p>
      </LegalSectionBlock>
    </LegalPage>
  );
}
