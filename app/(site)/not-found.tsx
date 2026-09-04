import { Section, Shell } from '@/components/layout/section';
import { ButtonLink } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';

/**
 * NOT FOUND, inside the public site group.
 *
 * Exists for two reasons. The visible one: a 404 reached from the site should
 * keep the header, footer and a way onward, rather than dropping the reader on
 * the bare root not-found page.
 *
 * The other: `notFound()` called from a dynamic route in this group was
 * rendering the ROOT not-found and answering HTTP 200 — a soft 404. A boundary
 * inside the group is the documented place for Next to resolve that.
 */
export default function SiteNotFound() {
  return (
    <main id="main">
      <Section tone="dark" bleed>
        <Shell className="pb-12 pt-14 md:pb-16 md:pt-20">
          <p className="font-mono text-label uppercase tracking-[0.08em] text-text-secondary-inverse">
            404
          </p>
          <h1 className="mt-4 max-w-[20ch] font-display text-h1 text-text-inverse md:text-md-display">
            That page is not here.
          </h1>
          <p className="mt-5 max-w-prose text-body-lg text-text-secondary-inverse">
            The link may be old, or the page may have moved. The solutions and products are the
            best place to start.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <ButtonLink href={ROUTES.solutions} variant="primary" size="lg">
              Browse solutions
            </ButtonLink>
            <ButtonLink href={ROUTES.products} variant="secondary" size="lg">
              Browse products
            </ButtonLink>
          </div>
        </Shell>
      </Section>
    </main>
  );
}
