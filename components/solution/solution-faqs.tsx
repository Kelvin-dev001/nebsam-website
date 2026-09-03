import { Eyebrow, Section, Shell } from '@/components/layout/section';
import type { PublicFaq } from '@/types/content';

/**
 * Section 9 — FAQs.
 *
 * ANSWER-SHAPED, and that is a requirement rather than a style. The SEO plan
 * asks for "a short direct answer paragraph immediately under each question
 * heading", because that is the shape an assistant lifts when it quotes a page.
 * A question followed by three paragraphs of preamble answers nobody and gets
 * quoted by nothing.
 *
 * Rendered as real headings and paragraphs, NOT as a `<details>` accordion.
 * Collapsed content is the crawlability failure this rebuild exists to fix, and
 * an accordion also hides the answer from the reader who is scanning — which is
 * every reader on an FAQ.
 *
 * The `FAQPage` JSON-LD is emitted by the page, from the same rows. Schema that
 * contradicts the visible page is worse than no schema, so there is exactly one
 * source for both.
 */
export function SolutionFaqs({ faqs }: { faqs: PublicFaq[] }) {
  if (faqs.length === 0) return null;

  return (
    <Section tone="light">
      <Shell>
        <div className="max-w-prose">
          <Eyebrow>Questions</Eyebrow>
          <h2 className="mt-4 font-display text-h2 text-text-primary md:text-md-h2">
            Common questions.
          </h2>
        </div>

        <dl className="mt-10 border-t border-border-hairline">
          {faqs.map((faq) => (
            <div key={faq.id} className="border-b border-border-hairline py-7">
              <dt>
                <h3 className="max-w-prose font-display-tight text-h3 text-text-primary">
                  {faq.question}
                </h3>
              </dt>
              <dd className="mt-3 max-w-prose text-body text-text-secondary">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </Shell>
    </Section>
  );
}
