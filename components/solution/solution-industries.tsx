import { Eyebrow, Section, Shell } from '@/components/layout/section';
import { ROUTES } from '@/lib/constants';
import type { PublicIndustry } from '@/types/content';

/**
 * Section 10 — related. The sectors this solution serves.
 *
 * This closes the loop the relationship rule requires: an industry page links
 * to its solutions, and a solution page links back to its industries. Without
 * the return link, industry pages would be reachable only from the index, which
 * is what CONTENT_ARCHITECTURE §1 means by an orphan.
 *
 * A compact list rather than a card grid. This is navigation at the end of a
 * long page, not a feature section, and it should not compete with the
 * conversion block that follows it.
 */
export function SolutionIndustries({ industries }: { industries: PublicIndustry[] }) {
  const items = industries.flatMap((i) => (i.slug && i.name ? [{ ...i, slug: i.slug, name: i.name }] : []));
  if (items.length === 0) return null;

  return (
    <Section tone="light" className="py-12 md:py-16">
      <Shell>
        <div className="max-w-prose">
          <Eyebrow>Who uses it</Eyebrow>
          <h2 className="mt-4 font-display-tight text-h3 text-text-primary">
            Sectors this is fitted for
          </h2>
        </div>
        <ul className="mt-6 flex flex-wrap gap-x-2 gap-y-2">
          {items.map((i) => (
            <li key={i.id}>
              <a
                href={ROUTES.industry(i.slug)}
                className="inline-flex min-h-11 items-center rounded-data border border-border-hairline bg-surface-raised px-4 text-body-sm text-brand-signal-ink underline-offset-4 hover:underline"
              >
                {i.name}
              </a>
            </li>
          ))}
        </ul>
      </Shell>
    </Section>
  );
}
