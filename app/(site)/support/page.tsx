import { Section, Shell } from '@/components/layout/section';
import { JsonLd } from '@/components/seo/json-ld';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, jsonLdGraph } from '@/lib/seo/schema';
import { ROUTES } from '@/lib/constants';
import { CONTACT, whatsappUrl } from '@/lib/company';

/**
 * SUPPORT HUB — the parent level for verification, booking and suggestions.
 *
 * The same shape as the Resources hub from Sprint 10, and for the same reasons:
 * brief 6.6 prohibits uniform rounded-card grids and three-column feature blocks
 * as the default answer, and a hub with three children is where that reflex is
 * strongest. Rows in an index, each saying what it actually does.
 *
 * ── WhatsApp is above the list, not in it ───────────────────────────────────
 * The first commercial objective is qualified enquiries, WhatsApp first. Most
 * people arriving at "support" want a person, not a form, and burying that among
 * three equal-weight links would be optimising the page for tidiness over the
 * thing it is for.
 */
export const revalidate = 3600;

export const metadata = buildMetadata({
  title: 'Support — Nebsam vehicle tracking',
  description:
    'Get help with a Nebsam installation: verify a certificate, book an installation, or send us a suggestion. WhatsApp, phone and email, seven days a week.',
  path: ROUTES.support,
});

export default function SupportPage() {
  const trail = [
    { name: 'Home', path: ROUTES.home },
    { name: 'Support', path: ROUTES.support },
  ];

  const entries = [
    {
      href: ROUTES.verifyInstallation,
      name: 'Verify an installation',
      lede: 'Confirm a certificate is genuine and still current',
      description:
        'For buying a used vehicle, for an insurer, or for a certificate that has been in the glovebox a while. You will need the registration and the last four digits of the phone number given at installation — a plate on its own is public, so we do not answer on it alone.',
    },
    {
      href: ROUTES.bookInstallation,
      name: 'Book an installation',
      lede: 'Tell us what, where and when',
      description:
        'A request, not a confirmed slot. We come back to you with a time and confirm before anyone travels.',
    },
    {
      href: ROUTES.suggestions,
      name: 'Send a suggestion',
      lede: 'Anonymously, if you prefer',
      description:
        'Something we could do better, or something that went wrong. If you tick the anonymous box we do not store your name, phone number or email with it.',
    },
  ];

  return (
    <main id="main">
      <JsonLd json={jsonLdGraph([breadcrumbSchema(trail)])} />

      <Section tone="dark" bleed>
        <Shell className="pb-12 pt-10 md:pb-16 md:pt-14">
          <Breadcrumbs trail={trail} tone="dark" />
          <h1 className="mt-6 max-w-[20ch] font-display text-h1 text-text-inverse md:text-md-display">
            Support
          </h1>
          <p className="mt-5 max-w-prose text-body-lg text-text-secondary-inverse">
            Nebsam Digital Solutions (K) Ltd installs and supports vehicle tracking and security
            systems across Kenya, from branches in Nairobi, Mombasa and Nakuru. If something needs
            attention, this is where to start.
          </p>

          <p className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-body">
            <a
              className="text-brand-signal underline underline-offset-4"
              href={whatsappUrl('Hello Nebsam — I need help with an installation.')}
            >
              Message us on WhatsApp
            </a>
            <a
              className="text-brand-signal underline underline-offset-4"
              href={`tel:${CONTACT.whatsapp.e164.startsWith('+') ? CONTACT.whatsapp.e164 : `+${CONTACT.whatsapp.e164}`}`}
            >
              Call {CONTACT.whatsapp.display}
            </a>
            <a className="text-brand-signal underline underline-offset-4" href={`mailto:${CONTACT.generalEmail}`}>
              {CONTACT.generalEmail}
            </a>
          </p>
          <p className="mt-3 font-mono text-label uppercase tracking-[0.08em] text-text-secondary-inverse">
            {CONTACT.hours}
          </p>
        </Shell>
      </Section>

      <Section tone="light">
        <Shell>
          <ul className="border-t border-border-hairline">
            {entries.map((entry) => (
              <li key={entry.href} className="border-b border-border-hairline">
                <a href={entry.href} className="group grid gap-x-10 gap-y-2 py-7 md:grid-cols-[22rem_1fr]">
                  <div>
                    <h2 className="font-display-tight text-h3 text-text-primary underline-offset-4 group-hover:underline">
                      {entry.name}
                    </h2>
                    <p className="mt-2 font-mono text-label uppercase tracking-[0.08em] text-text-secondary">
                      {entry.lede}
                    </p>
                  </div>
                  <p className="max-w-prose text-body text-text-secondary">{entry.description}</p>
                </a>
              </li>
            ))}
          </ul>
        </Shell>
      </Section>

      <Section tone="paper">
        <Shell>
          <div className="max-w-prose">
            <h2 className="font-display-tight text-h2 text-text-primary md:text-md-h2">
              Looking for something else?
            </h2>
            <p className="mt-4 text-body text-text-secondary">
              Pricing and product questions go to{' '}
              <a className="text-brand-signal-ink underline underline-offset-4" href={ROUTES.quote}>
                a quote request
              </a>
              . General questions are answered on the{' '}
              <a className="text-brand-signal-ink underline underline-offset-4" href={ROUTES.faqs}>
                FAQ page
              </a>
              , and anything else can go through{' '}
              <a className="text-brand-signal-ink underline underline-offset-4" href={ROUTES.contact}>
                contact
              </a>
              .
            </p>
          </div>
        </Shell>
      </Section>
    </main>
  );
}
