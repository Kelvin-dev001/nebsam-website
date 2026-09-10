import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Eyebrow, Section, Shell } from '@/components/layout/section';
import { ButtonLink } from '@/components/ui/button';
import { JsonLd } from '@/components/seo/json-ld';
import {
  getIndustries,
  getIndustryBySlug,
  getProductsForIndustry,
  getSolutionsForIndustry,
} from '@/lib/content';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, jsonLdGraph } from '@/lib/seo/schema';
import { BRANCHES, whatsappUrl } from '@/lib/company';
import { ROUTES, VAT_LABEL } from '@/lib/constants';

/**
 * INDUSTRY PAGE — the sector entry point.
 *
 * An industry page is the easiest page on a site to fabricate, and the most
 * common place a telematics company lists twenty sectors it has never worked
 * in. CONTENT_ARCHITECTURE §2.7 sets the rule this template is built around:
 * a page "earns its place only if it says something specific about that
 * sector's operations; otherwise it is a link hub and should be honest about
 * it". Six of the thirteen have genuinely sector-specific content; the other
 * seven say plainly that they are a starting point.
 *
 * The solutions and products come from the join tables rather than being
 * written per page, so an industry cannot claim a capability that does not
 * exist, and a draft on either end cannot produce a link to a 404.
 *
 * `WebPage` rather than `Service` schema. An industry is not a service Nebsam
 * offers — it is a description of who its services are for — and marking it up
 * as a Service would assert something the page does not say.
 */
export const revalidate = 3600;
/**
 * `dynamicParams = true`. CHANGED IN SPRINT 12 — register item V54c.
 *
 * This route set `false` until Sprint 12, for a good reason that stopped being
 * true. The reasoning was that solutions, products and industries are "finite
 * published sets that change only at deploy time", so an unknown slug should be
 * a hard 404 rather than a soft 200. The first half of that is what broke:
 * Sprint 12 gives staff a product editor, so products now change BETWEEN
 * deploys, exactly like the blog.
 *
 * WHAT WAS MEASURED, on a production build, before and after one price edit:
 *
 *     fresh build, no admin action   -> every route 200
 *     save one product in the admin  -> /products/[slug]   404  (all 14)
 *                                       /solutions/[slug]  404  (all 9)
 *                                       /industries/[slug] 404  (all 13)
 *                                       /resources/blog/[slug] 200
 *
 * Twenty-nine pages offline until the next full build, from editing one price.
 * The blog survived because Sprint 10 had already fixed it — this is register
 * item V54a on three more routes.
 *
 * SOLUTIONS AND INDUSTRIES ARE INCLUDED even though nothing edits them yet,
 * because they were taken down too. They read products through the shared
 * `public_products` cache tag (a solution lists its hardware, an industry its
 * products), so invalidating that tag forces them to regenerate, and
 * `dynamicParams = false` forbids it. Fixing only products would leave the
 * other twenty-two pages failing for a reason nobody would think to look for.
 *
 * THE SOFT-404 WORRY WAS RE-TESTED RATHER THAN ASSUMED AWAY, on these routes:
 *
 *     /products/does-not-exist    -> HTTP 404
 *     /solutions/does-not-exist   -> HTTP 404
 *     /industries/does-not-exist  -> HTTP 404
 *
 * `notFound()` in the page produces a genuine 404, and `generateStaticParams`
 * still prerenders every published slug at build time, so nothing is given up
 * on the common path. The draft gate also still holds: a draft is absent from
 * the published set the page queries, so it 404s rather than rendering.
 */
export const dynamicParams = true;

export async function generateStaticParams() {
  const { data } = await getIndustries();
  return data.flatMap((i) => (i.slug ? [{ slug: i.slug }] : []));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { data: industry } = await getIndustryBySlug(slug);
  const title = industry?.seo_title ?? industry?.name;
  if (!industry || !title) return {};
  return buildMetadata({
    title,
    description: industry.seo_description ?? industry.summary ?? '',
    path: ROUTES.industry(slug),
  });
}

function formatKes(amount: number): string {
  return `KES ${amount.toLocaleString('en-KE')}`;
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: industry } = await getIndustryBySlug(slug);
  if (!industry || !industry.name || !industry.id) notFound();
  const name = industry.name;

  const [solutions, products] = await Promise.all([
    getSolutionsForIndustry(industry.id),
    getProductsForIndustry(industry.id),
  ]);

  // Paragraphs are stored as one text column separated by blank lines. Split
  // rather than render as a block, so the measure and rhythm hold.
  const paragraphs = (industry.body ?? '').split(/\n{2,}/).filter((p) => p.trim() !== '');

  const trail = [
    { name: 'Home', path: ROUTES.home },
    { name: 'Industries', path: ROUTES.industries },
    { name, path: ROUTES.industry(slug) },
  ];

  return (
    <main id="main">
      <JsonLd json={jsonLdGraph([breadcrumbSchema(trail)])} />

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
          {industry.summary ? (
            <p className="mt-5 max-w-prose text-body-lg text-text-secondary-inverse">
              {industry.summary}
            </p>
          ) : null}
        </Shell>
      </Section>

      {paragraphs.length > 0 ? (
        <Section tone="light">
          <Shell>
            <div className="max-w-prose">
              {paragraphs.map((para, i) => (
                <p
                  key={i}
                  className={
                    i === 0 ? 'text-body-lg text-text-primary' : 'mt-4 text-body text-text-secondary'
                  }
                >
                  {para}
                </p>
              ))}
            </div>
          </Shell>
        </Section>
      ) : null}

      {solutions.data.length > 0 ? (
        <Section tone="paper">
          <Shell>
            <div className="max-w-prose">
              <Eyebrow>Solutions</Eyebrow>
              <h2 className="mt-4 font-display text-h2 text-text-primary md:text-md-h2">
                What applies to this sector.
              </h2>
            </div>
            <ul className="mt-10 border-t border-border-hairline">
              {solutions.data.flatMap((s) =>
                s.slug && s.name
                  ? [
                      <li key={s.id} className="border-b border-border-hairline">
                        <a
                          href={ROUTES.solution(s.slug)}
                          className="group grid gap-x-10 gap-y-2 py-6 md:grid-cols-[22rem_1fr]"
                        >
                          <h3 className="font-display-tight text-h3 text-text-primary underline-offset-4 group-hover:underline">
                            {s.name}
                          </h3>
                          <p className="max-w-prose text-body-sm text-text-secondary">
                            {s.summary}
                          </p>
                        </a>
                      </li>,
                    ]
                  : [],
              )}
            </ul>
          </Shell>
        </Section>
      ) : null}

      {products.data.length > 0 ? (
        <Section tone="light">
          <Shell>
            <div className="max-w-prose">
              <Eyebrow>Hardware</Eyebrow>
              <h2 className="mt-4 font-display text-h2 text-text-primary md:text-md-h2">
                Equipment used in this sector.
              </h2>
              <p className="mt-4 text-body text-text-secondary">Prices shown are {VAT_LABEL}.</p>
            </div>
            <ul className="mt-8 border-t border-border-hairline">
              {products.data.flatMap((p) =>
                p.slug && p.name
                  ? [
                      <li key={p.id} className="border-b border-border-hairline">
                        <a
                          href={ROUTES.product(p.slug)}
                          className="group grid gap-x-8 gap-y-2 py-5 md:grid-cols-[20rem_1fr_10rem]"
                        >
                          <h3 className="font-display-tight text-h3 text-text-primary underline-offset-4 group-hover:underline">
                            {p.name}
                          </h3>
                          <p className="max-w-prose text-body-sm text-text-secondary">
                            {p.summary}
                          </p>
                          <p className="font-mono text-mono text-text-primary md:text-right">
                            {typeof p.price_kes === 'number'
                              ? formatKes(p.price_kes)
                              : 'Request price'}
                          </p>
                        </a>
                      </li>,
                    ]
                  : [],
              )}
            </ul>
          </Shell>
        </Section>
      ) : null}

      <Section tone="dark">
        <Shell>
          <div className="max-w-prose">
            <h2 className="font-display text-h2 text-text-inverse md:text-md-h2">
              Tell us how you operate.
            </h2>
            <p className="mt-5 text-body-lg text-text-secondary-inverse">
              Sectors differ less than operations within them. Tell us the vehicles, the routes and
              what has gone wrong before, and we will tell you what is worth fitting.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <ButtonLink
              href={whatsappUrl(`Hello Nebsam, I am asking about telematics for ${name}.`)}
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
