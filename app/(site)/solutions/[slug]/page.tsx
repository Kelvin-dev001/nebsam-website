import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Eyebrow, Section, Shell } from '@/components/layout/section';
import { ButtonLink } from '@/components/ui/button';
import { JsonLd } from '@/components/seo/json-ld';
import { ProseSections } from '@/components/solution/prose-sections';
import { SolutionFaqs } from '@/components/solution/solution-faqs';
import { SolutionHardware } from '@/components/solution/solution-hardware';
import { SolutionIndustries } from '@/components/solution/solution-industries';
import { Coverage } from '@/components/home/coverage';
import {
  getBranches,
  getCoverageLocations,
  getFaqs,
  getIndustriesForSolution,
  getProductsForSolution,
  getSolutionBySlug,
  getSolutions,
} from '@/lib/content';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, faqSchema, jsonLdGraph, serviceSchema } from '@/lib/seo/schema';
import { BRANCHES, whatsappUrl } from '@/lib/company';
import { ROUTES } from '@/lib/constants';
import { solutionSections } from '@/types/content';

/**
 * SOLUTION PAGE — the reusable template behind all ten solutions.
 *
 * The eleven-section model (CONTENT_ARCHITECTURE §1.1) is assembled from four
 * sources, deliberately kept separate so no fact exists in two places:
 *
 *   1,2,3,4,5,7  `solutions.sections` jsonb        -> ProseSections
 *   6            product_solutions                 -> Sprint 6, renders when rows exist
 *   8            branches + coverage_locations     -> Coverage
 *   9            faqs where scope = 'solution'     -> SolutionFaqs + FAQPage schema
 *   10           the join tables                   -> related, with solutions today
 *   11           the template                      -> conversion block
 *
 * Hourly revalidation, for the same reason the homepage has it: the page is
 * prerendered, so without it every database read here — including the
 * publication gates inside the public views — would be frozen at build time.
 */
export const revalidate = 3600;

/**
 * ANY SLUG NOT RETURNED BY generateStaticParams IS A HARD 404.
 *
 * Without this, `dynamicParams` defaults to true: Next renders an unknown slug
 * on demand, `notFound()` produces the 404 *page*, and the response is cached
 * and served with HTTP **200**. That is a soft 404 — verified here, where
 * /solutions/does-not-exist returned 200 with the not-found body while
 * /totally-unknown correctly returned 404. Search engines treat a 200 as a real
 * page and will index it, which is how a site accumulates thousands of
 * indexable empty URLs.
 *
 * Solutions are a known, finite, published set, so there is no legitimate slug
 * outside that list. This also enforces the draft gate at the routing layer:
 * `school-bus-management` is held as a draft until V17–V24 and legal review are
 * resolved, and it must be unreachable rather than merely unlinked.
 */
export const dynamicParams = false;

/**
 * Only published solutions get a route. An unpublished one 404s rather than
 * rendering an empty shell, which matters for `school-bus-management`: it is
 * seeded but held as a draft until V17–V24 and legal review are resolved, and
 * it must not be reachable, indexable or linkable until then.
 */
export async function generateStaticParams() {
  const { data } = await getSolutions();
  // flatMap rather than map: `slug` is nullable through the view, and a param
  // of `null` would generate a route at /solutions/null.
  return data.flatMap((s) => (s.slug ? [{ slug: s.slug }] : []));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { data: solution } = await getSolutionBySlug(slug);
  // No name means nothing worth titling. Returning empty metadata lets the
  // root defaults apply rather than emitting a blank <title>.
  const title = solution?.seo_title ?? solution?.name;
  if (!solution || !title) return {};

  return buildMetadata({
    title,
    description: solution.seo_description ?? solution.summary ?? '',
    path: ROUTES.solution(slug),
  });
}

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: solution } = await getSolutionBySlug(slug);
  /**
   * `name` is checked alongside the row itself because a Postgres VIEW drops
   * the NOT NULL of its base table, so every column arrives as nullable in the
   * generated types even though `solutions.name` cannot be null. Narrowing once
   * here is honest — a row without a name is not renderable — and it keeps
   * non-null assertions out of the rest of the file.
   */
  if (!solution || !solution.name || !solution.id) notFound();
  const name = solution.name;
  const solutionId = solution.id;

  const [faqs, branches, coverage, hardware, industries] = await Promise.all([
    getFaqs('solution', solutionId),
    getBranches(),
    getCoverageLocations(),
    getProductsForSolution(solutionId),
    getIndustriesForSolution(solutionId),
  ]);

  const sections = solutionSections(solution.sections);
  const faqPairs = faqs.data.flatMap((f) =>
    f.question && f.answer ? [{ question: f.question, answer: f.answer }] : [],
  );
  const trail = [
    { name: 'Home', path: ROUTES.home },
    { name: 'Solutions', path: ROUTES.solutions },
    { name, path: ROUTES.solution(slug) },
  ];

  const graph = jsonLdGraph([
    serviceSchema({
      name,
      description: solution.summary ?? '',
      path: ROUTES.solution(slug),
    }),
    breadcrumbSchema(trail),
    // Emitted from the same rows the page renders. Schema that contradicts the
    // visible page is worse than none, so there is one source for both.
    // Only complete pairs reach the schema. A question with no answer would
    // emit invalid FAQPage markup, and markup that contradicts the page is
    // worse than none at all.
    ...(faqPairs.length ? [faqSchema(faqPairs)] : []),
  ]);

  return (
    <main id="main">
      <JsonLd json={graph} />

      {/* Breadcrumbs are visible AND marked up — the SEO checklist requires
          both, and a visible trail is how a reader who landed from search
          works out where they are. */}
      <Section tone="dark" bleed>
        <Shell className="pb-12 pt-10 md:pb-16 md:pt-14">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-x-2 font-mono text-label uppercase tracking-[0.08em] text-text-secondary-inverse">
              {trail.map((crumb, i) => (
                <li key={crumb.path} className="flex items-center gap-2">
                  {i > 0 ? <span aria-hidden="true">/</span> : null}
                  {i < trail.length - 1 ? (
                    <a href={crumb.path} className="underline underline-offset-4">
                      {crumb.name}
                    </a>
                  ) : (
                    <span aria-current="page">{crumb.name}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          <h1 className="mt-6 max-w-[24ch] font-display text-h1 text-text-inverse md:text-md-display">
            {name}
          </h1>

          {solution.summary ? (
            <p className="mt-5 max-w-prose text-body-lg text-text-secondary-inverse">
              {solution.summary}
            </p>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <ButtonLink
              href={whatsappUrl(`Hello Nebsam, I would like to ask about ${name}.`)}
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
            >
              Talk to us on WhatsApp
            </ButtonLink>
          </div>

          {/* Brief 13.3 requires a visible "last updated" on solution pages. */}
          {solution.last_reviewed_at ? (
            <p className="mt-8 font-mono text-label uppercase tracking-[0.08em] text-text-secondary-inverse">
              Last reviewed{' '}
              {new Date(solution.last_reviewed_at).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          ) : null}
        </Shell>
      </Section>

      <ProseSections sections={sections} />

      {/* 6 — Hardware options, from product_solutions. Renders nothing for a
          solution with no published products joined to it, which is still the
          case for six of the nine. */}
      <SolutionHardware products={hardware.data} />

      <SolutionFaqs faqs={faqs.data} />

      <Coverage branches={branches.data} coverage={coverage.data} />

      {/* 10 — Related. Closes the loop so industry pages are not orphans. */}
      <SolutionIndustries industries={industries.data} />

      {/* 11 — Conversion. WhatsApp first, then call, per the content skill. */}
      <Section tone="dark">
        <Shell>
          <div className="max-w-prose">
            <Eyebrow>Next step</Eyebrow>
            <h2 className="mt-4 font-display text-h2 text-text-inverse md:text-md-h2">
              Tell us about your vehicles.
            </h2>
            <p className="mt-5 text-body-lg text-text-secondary-inverse">
              Tell us what you run, where it operates and what has gone wrong before, and we will
              tell you what is worth fitting — including where the answer is less than you expected.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <ButtonLink
              href={whatsappUrl(`Hello Nebsam, I would like a quote for ${name}.`)}
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
            >
              Talk to us on WhatsApp
            </ButtonLink>
            {BRANCHES[0]?.phones[0] ? (
              <ButtonLink
                href={`tel:+${BRANCHES[0].phones[0].e164.replace(/^\+/, '')}`}
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
              >
                Call {BRANCHES[0].name}
              </ButtonLink>
            ) : null}
          </div>
        </Shell>
      </Section>
    </main>
  );
}
