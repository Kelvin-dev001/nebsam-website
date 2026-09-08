import { Section, Shell } from '@/components/layout/section';
import { JsonLd } from '@/components/seo/json-ld';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { EnquiryForm } from '@/components/forms/enquiry-form';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, jsonLdGraph } from '@/lib/seo/schema';
import { ROUTES } from '@/lib/constants';

/**
 * SUGGESTIONS — the one form on the site that can be sent anonymously.
 *
 * ── The anonymity is real, and the page says exactly what it means ──────────
 * `submissions.is_anonymous` exists because an anonymous option that merely
 * hides a name from an admin screen is not anonymity. The server DROPS the
 * contact fields before the row is written, so there is nothing to reveal later
 * — not to an administrator, not to a subpoena, not to whoever restores the
 * backup.
 *
 * The page states this plainly rather than saying "your privacy matters to us".
 * Someone deciding whether to report a technician's conduct needs to know what
 * is stored, not to be reassured.
 *
 * ── One honest limit, stated ────────────────────────────────────────────────
 * Anonymous means we cannot reply. Saying so up front is better than a person
 * choosing anonymity, waiting for an answer, and concluding they were ignored.
 */
export const dynamic = 'force-dynamic';

export const metadata = buildMetadata({
  title: 'Send a suggestion to Nebsam',
  description:
    'Tell Nebsam Digital Solutions what we could do better, or report something that went wrong. You can send it anonymously — we will not store your name or number with it.',
  path: ROUTES.suggestions,
});

export default function SuggestionsPage() {
  const trail = [
    { name: 'Home', path: ROUTES.home },
    { name: 'Support', path: ROUTES.support },
    { name: 'Suggestions', path: ROUTES.suggestions },
  ];

  return (
    <main id="main">
      <JsonLd json={jsonLdGraph([breadcrumbSchema(trail)])} />

      <Section tone="dark" bleed>
        <Shell className="pb-12 pt-10 md:pb-16 md:pt-14">
          <Breadcrumbs trail={trail} tone="dark" />
          <h1 className="mt-6 max-w-[22ch] font-display text-h1 text-text-inverse md:text-md-display">
            Send a suggestion
          </h1>
          <p className="mt-5 max-w-prose text-body-lg text-text-secondary-inverse">
            Something we could do better, something that went wrong, or something a technician did
            well. Nebsam Digital Solutions (K) Ltd reads all of it.
          </p>
        </Shell>
      </Section>

      <Section tone="light">
        <Shell>
          <div className="max-w-prose">
            <h2 className="font-display-tight text-h2 text-text-primary md:text-md-h2">
              What happens if you send it anonymously
            </h2>
            <p className="mt-4 text-body text-text-secondary">
              Tick the box and your name, phone number and email are not stored with the suggestion.
              They are not hidden from staff — they are never written down in the first place, so
              there is nothing to find later.
            </p>
            <p className="mt-4 text-body text-text-secondary">
              The trade is that we cannot reply, and we cannot ask a follow-up question. If you want
              an answer, leave a phone number.
            </p>
          </div>

          <div className="mt-10">
            <EnquiryForm
              kind="suggestion"
              whatsappMessage="Hello Nebsam — I have a suggestion."
            />
          </div>
        </Shell>
      </Section>
    </main>
  );
}
