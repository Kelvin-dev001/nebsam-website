import Link from 'next/link';
import { buildMetadata } from '@/lib/seo/metadata';
import { ROUTES, VAT_LABEL, VAT_RATE } from '@/lib/constants';
import { COMPANY, CONTACT } from '@/lib/company';
import { LegalPage, LegalSectionBlock } from '@/components/legal/legal-page';

/**
 * TERMS OF USE — for the WEBSITE, and deliberately not terms of sale.
 *
 * ── Why the scope is narrow, on purpose ─────────────────────────────────────
 *
 * The footer link says "Terms", and the reflex is to write a comprehensive
 * terms-and-conditions document: warranty, returns, installation liability,
 * limitation of liability, jurisdiction, indemnities. Every one of those is a
 * legal position rather than an observable fact, CLAUDE.md §5 forbids inventing
 * warranty terms outright, and there is no source document for any of it —
 * `content-source/` has no legal folder and the legacy site had no terms page.
 *
 * A confident-sounding invented warranty clause is worse than no page at all,
 * because a customer may rely on it and Nebsam would be held to it.
 *
 * So this page covers what can be stated truthfully from the code and from
 * confirmed facts: what the prices on this site mean, what a cart is and is not,
 * what certificate verification does and does not prove, and how to use the
 * site. Terms of SALE are marked as outstanding rather than drafted.
 *
 * ── The three statements that actually protect somebody ─────────────────────
 *
 * 1. Prices exclude VAT and are indicative until quoted. Brief 10.2 calls a
 *    VAT-exclusive price shown without a label the most common source of order
 *    disputes in Kenyan e-commerce.
 * 2. Adding to the cart and messaging on WhatsApp is not a concluded contract.
 * 3. A verification result is about a certificate record, not a promise that a
 *    device is currently working. That one matters most: somebody could
 *    reasonably read "installation confirmed" as "my tracker is working", and it
 *    is not the same claim.
 */
export const revalidate = 3600;

export const metadata = buildMetadata({
  title: 'Terms of use — Nebsam Digital Solutions',
  description:
    'The terms for using this website: what the prices mean, what a cart is, what certificate verification proves, and acceptable use.',
  path: ROUTES.terms,
});

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of use"
      lead="The rules for using this website, and what the information on it does and does not commit us to."
      path={ROUTES.terms}
      reviewedOn="2026-09-11"
      scope={
        <>
          <p>
            This page covers <strong>using this website</strong> — the information on it, the prices
            shown, the shop and certificate verification.
          </p>
          <p>
            <strong>
              It is not the terms of sale for a product or an installation, and it is not a warranty.
            </strong>{' '}
            Those are set out in the quotation, invoice and installation paperwork for each job. If
            something in this page appears to conflict with a signed quotation or contract, the
            signed document is the one that counts.
          </p>
        </>
      }
      reviewStatus={
        <>
          <p>
            <strong>These terms cover the website only and have not been through legal review.</strong>{' '}
            Terms of sale — warranty, returns, installation liability, limitation of liability and
            the governing-law clause — are deliberately <strong>not</strong> drafted here. Inventing
            a warranty term that a customer might rely on would be worse than saying nothing, so
            they are with the company&rsquo;s adviser.
          </p>
          <p className="text-state-warn-ink">
            [[NEEDS_VERIFICATION: terms of sale — warranty period and what it covers, returns and
            cancellation, installation liability, limitation of liability, and the governing law and
            dispute resolution clause. Drafted by a Kenyan legal adviser, not here]]
          </p>
        </>
      }
    >
      <LegalSectionBlock id="who" heading="Who these terms are with">
        <p>
          This website is operated by {COMPANY.legalName}. Using it means accepting the terms on this
          page. If you do not accept them, please do not use the site.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="prices" heading="What the prices on this site mean">
        <p>
          Every price shown on this site is <strong>exclusive of VAT</strong>, and each one is
          labelled &ldquo;{VAT_LABEL}&rdquo; where it appears. VAT is currently charged at{' '}
          {(VAT_RATE * 100).toFixed(0)}%, so the amount you pay is higher than the figure displayed.
        </p>
        <p>
          Where a product shows <strong>&ldquo;Request price&rdquo;</strong> instead of a figure, no
          price is published for it and you will be quoted. There is no hidden number.
        </p>
        <p>
          Some products carry a <strong>recurring annual fee</strong> in addition to the purchase
          price — a licence renewal, or a platform and SIM cost, depending on the product. Where one
          applies it is stated on the product page and carried into the order message, not revealed
          afterwards.
        </p>
        <p>
          Prices are indicative and can change. A price becomes fixed when we give you a written
          quotation for your job.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="orders" heading="Adding to the cart is not a contract">
        <p>
          This site has no online payment. Adding items to the cart and sending the order through
          WhatsApp is a <strong>request to buy</strong>. It records what you asked for and at what
          price, and it opens a conversation.
        </p>
        <p>
          A contract exists when we confirm your order — stock, delivery, installation date and
          final price included. Until then either side can change their mind at no cost.
        </p>
        <p>
          We keep a record of the order as soon as you place it, before the WhatsApp conversation
          starts, so that a dropped chat does not lose your request. You can see it again using your
          order number.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock
        id="verification"
        heading="What certificate verification does and does not prove"
      >
        <p>
          <Link href={ROUTES.verifyInstallation} className="underline underline-offset-4">
            Certificate verification
          </Link>{' '}
          tells you whether a Nebsam installation certificate matching the registration and phone
          digits you entered <strong>exists in our records</strong>, and whether it is within its
          validity dates.
        </p>
        <p>
          <strong>It is not a statement that a device is currently working</strong>, that it is still
          fitted to the vehicle, or that any subscription is paid up. A certificate can be valid on
          paper while a unit has been removed, damaged or disconnected. If you are buying a used
          vehicle and the tracker matters to you, ask us to check the device itself.
        </p>
        <p>
          A result of &ldquo;could not be confirmed&rdquo; does not prove a certificate is fake. It
          most often means a detail was mistyped. Contact us and a person will check.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="accuracy" heading="Accuracy of what is published here">
        <p>
          We take care that product descriptions, specifications and coverage information are
          accurate, and we would rather leave a specification out than guess at it — which is why
          some products list fewer details than others.
        </p>
        <p>
          Specifications can change when a manufacturer changes a product. Where a detail matters to
          your decision, confirm it with us in writing before ordering.
        </p>
        <p>
          Any illustration of a tracking screen or dashboard on this site uses{' '}
          <strong>example data with obviously illustrative registration numbers</strong>. It is not
          a real customer&rsquo;s vehicle and not live data.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="acceptable-use" heading="Using the site">
        <p>Please do not:</p>
        <ul className="ml-5 flex list-disc flex-col gap-1.5">
          <li>
            submit registration numbers to certificate verification other than for a vehicle you own
            or are genuinely considering buying — working through registrations to find out which
            vehicles carry trackers is the exact misuse the second factor exists to prevent;
          </li>
          <li>attempt to access the administration area, staff accounts, or any data that is not yours;</li>
          <li>
            submit automated traffic, scrape the site at a volume that affects other visitors, or
            attempt to bypass the rate limits and bot checks;
          </li>
          <li>use the enquiry forms to send unsolicited marketing or anything unlawful.</li>
        </ul>
        <p>
          We log verification attempts and form submissions in the way described in the{' '}
          <Link href={ROUTES.privacy} className="underline underline-offset-4">
            privacy notice
          </Link>
          , and we may block access that looks like misuse.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="content-ownership" heading="Content on this site">
        <p>
          The text, photographs, diagrams and design on this site belong to {COMPANY.legalName} or
          are used with permission. You are welcome to read, print and share pages, and to quote from
          them with attribution and a link.
        </p>
        <p>
          Republishing substantial parts as your own, or using our name, logo or content to imply an
          endorsement or a relationship that does not exist, is not permitted.
        </p>
        <p>
          Product names and trademarks belonging to manufacturers whose equipment we supply remain
          theirs.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="links" heading="Links to other sites">
        <p>
          Where we link out — to a manufacturer, a regulator, or WhatsApp — we do not control those
          sites and are not responsible for their content or their handling of your information.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="changes" heading="Changes to these terms">
        <p>
          We may update this page. The date at the top shows when it was last reviewed. Changes apply
          from the date they are published, and they do not change the terms of a contract already
          agreed with you.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="contact" heading="Questions">
        <p>
          Call or message us on{' '}
          <a href={`tel:${CONTACT.whatsapp.e164}`} className="underline underline-offset-4">
            {CONTACT.whatsapp.display}
          </a>
          , or use the{' '}
          <Link href={ROUTES.contact} className="underline underline-offset-4">
            contact form
          </Link>
          . For anything about your personal data, the{' '}
          <Link href={ROUTES.privacy} className="underline underline-offset-4">
            privacy notice
          </Link>{' '}
          names the person to write to.
        </p>
      </LegalSectionBlock>
    </LegalPage>
  );
}
