import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Eyebrow, Section, Shell } from '@/components/layout/section';
import { JsonLd } from '@/components/seo/json-ld';
import { ProductSpecs } from '@/components/product/product-specs';
import { ProductPrice } from '@/components/product/product-price';
import { getProductBySlug, getProducts } from '@/lib/content';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, jsonLdGraph, productSchema } from '@/lib/seo/schema';
import { ROUTES } from '@/lib/constants';
import { productFeatures } from '@/types/content';

/**
 * PRODUCT PAGE — the merged specification and commerce page.
 *
 * CONTENT_ARCHITECTURE §1.2: `/products/[slug]` is canonical and carries
 * everything. There is no separate commercial page, because the fleet manager
 * researching capability and the buyer ready to pay are often the same person a
 * week apart.
 *
 * The decision-useful summary and the price sit above the fold; the deep
 * specification sits below it, SERVER-RENDERED. See ProductSpecs for why that
 * is non-negotiable.
 *
 * Same routing discipline as solutions: `dynamicParams = false`, so any slug
 * outside the published set is a hard 404 rather than a soft 404 served with
 * HTTP 200. Products blocked by open audit items (A01–A07) are seeded as
 * drafts and are therefore unreachable, not merely unlinked.
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
  const { data } = await getProducts();
  return data.flatMap((p) => (p.slug ? [{ slug: p.slug }] : []));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { data: product } = await getProductBySlug(slug);
  const title = product?.seo_title ?? product?.name;
  if (!product || !title) return {};

  return buildMetadata({
    title,
    description: product.seo_description ?? product.summary ?? '',
    path: ROUTES.product(slug),
  });
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: product } = await getProductBySlug(slug);
  if (!product || !product.name) notFound();
  const name = product.name;

  const features = productFeatures(product.features);
  const trail = [
    { name: 'Home', path: ROUTES.home },
    { name: 'Products', path: ROUTES.products },
    { name, path: ROUTES.product(slug) },
  ];

  /**
   * Product schema carries an Offer ONLY where a real price is published.
   * CLAUDE.md §7 is explicit about that, and it is also simply true: an Offer
   * with no price is markup asserting something the page does not say.
   */
  const graph = jsonLdGraph([
    productSchema({
      name,
      description: product.summary ?? '',
      path: ROUTES.product(slug),
      ...(typeof product.price_kes === 'number' ? { priceKes: product.price_kes } : {}),
    }),
    breadcrumbSchema(trail),
  ]);

  return (
    <main id="main">
      <JsonLd json={graph} />

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

          <h1 className="mt-6 max-w-[26ch] font-display text-h1 text-text-inverse md:text-md-display">
            {name}
          </h1>

          {product.summary ? (
            <p className="mt-5 max-w-prose text-body-lg text-text-secondary-inverse">
              {product.summary}
            </p>
          ) : null}

          <ProductPrice product={product} />
        </Shell>
      </Section>

      {product.body ? (
        <Section tone="light">
          <Shell>
            <div className="max-w-prose">
              <Eyebrow>Overview</Eyebrow>
              <p className="mt-4 text-body-lg text-text-primary">{product.body}</p>
            </div>
          </Shell>
        </Section>
      ) : null}

      {features.length > 0 ? (
        <Section tone="light">
          <Shell>
            <div className="max-w-prose">
              <h2 className="font-mono text-label uppercase tracking-[0.08em] text-text-secondary">
                What it does
              </h2>
            </div>
            <dl className="mt-6 border-t border-border-hairline">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="grid gap-x-10 gap-y-1 border-b border-border-hairline py-5 md:grid-cols-[18rem_1fr]"
                >
                  <dt className="text-body font-medium text-text-primary">{f.title}</dt>
                  <dd className="max-w-prose text-body text-text-secondary">{f.detail}</dd>
                </div>
              ))}
            </dl>
          </Shell>
        </Section>
      ) : null}

      <ProductSpecs specs={product.specs} />
    </main>
  );
}
