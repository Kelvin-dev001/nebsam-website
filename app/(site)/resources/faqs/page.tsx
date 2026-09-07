import { Section, Shell } from '@/components/layout/section';
import { JsonLd } from '@/components/seo/json-ld';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { ButtonLink } from '@/components/ui/button';
import { getFaqs } from '@/lib/content';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, faqSchema, jsonLdGraph } from '@/lib/seo/schema';
import { ROUTES } from '@/lib/constants';
import { SHORT_DESCRIPTION, whatsappUrl } from '@/lib/company';

/**
 * GLOBAL FAQ PAGE.
 *
 * Reads `scope = 'global'` from `public_faqs`. The same table serves the FAQ
 * blocks on solutions, products and industries under their own scopes, so a
 * question answered here is answered once for the whole site — which is what
 * the "zero contradictions" rule in the SEO plan is actually asking for.
 *
 * ── Rendered as headings and paragraphs, never an accordion ─────────────────
 * Collapsed content is the crawlability failure this rebuild exists to fix, and
 * it hides the answer from the reader who is scanning, which on an FAQ page is
 * every reader. `SolutionFaqs` made the same decision for the same reason.
 *
 * ── One source for the schema and the page ──────────────────────────────────
 * `FAQPage` JSON-LD is generated from the same rows that render, so the markup
 * cannot describe a question the page does not show.
 */
export const revalidate = 3600;

export const metadata = buildMetadata({
  title: 'Vehicle tracking FAQs — Kenya, answered plainly',
  description:
    'Straight answers on vehicle tracking in Kenya: where we install, what prices include, VAT, ongoing costs, KEBS, and what a tracker can and cannot do.',
  path: ROUTES.faqs,
});

export default async function FaqsPage() {
  const { data: faqs } = await getFaqs('global');

  const trail = [
    { name: 'Home', path: ROUTES.home },
    { name: 'Resources', path: ROUTES.resources },
    { name: 'FAQs', path: ROUTES.faqs },
  ];

  const answerable = faqs.flatMap((f) =>
    f.question && f.answer ? [{ question: f.question, answer: f.answer }] : [],
  );

  return (
    <main id="main">
      <JsonLd
        json={jsonLdGraph(
          answerable.length > 0
            ? [breadcrumbSchema(trail), faqSchema(answerable)]
            : [breadcrumbSchema(trail)],
        )}
      />

      <Section tone="dark" bleed>
        <Shell className="pb-12 pt-10 md:pb-16 md:pt-14">
          <Breadcrumbs trail={trail} />

          <h1 className="mt-6 max-w-[26ch] font-display text-h1 text-text-inverse md:text-md-display">
            Questions we are asked before an installation
          </h1>
          <p className="mt-5 max-w-prose text-body-lg text-text-secondary-inverse">
            {SHORT_DESCRIPTION} These are the questions that come up most often on WhatsApp and at
            the counter, answered directly.
          </p>
        </Shell>
      </Section>

      <Section tone="light">
        <Shell>
          {faqs.length === 0 ? (
            <div className="max-w-prose">
              <p className="text-body-lg text-text-primary">
                The general questions are being written up.
              </p>
              <p className="mt-4 text-body text-text-secondary">
                Every solution page already carries its own questions and answers — what a speed
                limiter has to report, how an anti-jamming tracker behaves when the network drops,
                what fuel monitoring measures. If yours is not answered there, ask us on WhatsApp and
                we will answer it and add it here.
              </p>
            </div>
          ) : (
            <dl className="border-t border-border-hairline">
              {faqs.map((faq) => (
                <div key={faq.id} className="border-b border-border-hairline py-7">
                  <dt>
                    <h2 className="max-w-prose font-display-tight text-h3 text-text-primary">
                      {faq.question}
                    </h2>
                  </dt>
                  <dd className="mt-3 max-w-prose text-body text-text-secondary">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          )}
        </Shell>
      </Section>

      <Section tone="dark">
        <Shell>
          <div className="max-w-prose">
            <h2 className="font-display text-h2 text-text-inverse md:text-md-h2">
              Not answered here?
            </h2>
            <p className="mt-5 text-body text-text-secondary-inverse">
              Ask us directly. A question that reaches us twice usually ends up on this page.
            </p>
            <div className="mt-8">
              <ButtonLink
                href={whatsappUrl(
                  'Hello Nebsam, I have a question about vehicle tracking that is not answered on your FAQ page.',
                )}
                variant="primary"
                size="lg"
              >
                Ask on WhatsApp
              </ButtonLink>
            </div>
          </div>
        </Shell>
      </Section>
    </main>
  );
}
