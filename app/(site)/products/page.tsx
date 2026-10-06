import { Section, Shell } from '@/components/layout/section';
import { ZoomImage } from '@/components/ui/zoom-image';
import { PRODUCT_PHOTOS } from '@/lib/media/products';
import { JsonLd } from '@/components/seo/json-ld';
import { getProducts } from '@/lib/content';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, jsonLdGraph } from '@/lib/seo/schema';
import { ROUTES, VAT_LABEL } from '@/lib/constants';
import { formatKes } from '@/lib/format';

/**
 * PRODUCTS INDEX, grouped by family.
 *
 * Reads the published view, so a product held as a draft — every product
 * blocked by an open audit item A01–A07 — is absent here without anyone
 * maintaining a list. The sitemap lesson from Sprint 5 applies: a hand-written
 * list has to remember, a query cannot forget.
 *
 * Price or "Request price" is shown in the listing rather than only on the
 * product page, because the first question a buyer has is whether this is a
 * KES 3,000 item or a KES 30,000 one, and making them open four pages to find
 * out is how a shop loses them.
 */
/**
 * Hourly revalidation, as elsewhere.
 *
 * A TRAP WORTH KNOWING ABOUT, because it will mislead the next person the way
 * it misled this build: Next reuses `.next/cache` across builds, so a
 * CONTENT-ONLY change — new rows, no code change — can leave a prerendered
 * page serving the old list even after a fresh `npm run build`. Four car alarms
 * were seeded and this index still rendered six products, while
 * `/products/[slug]` regenerated correctly because `generateStaticParams` re-ran.
 *
 * It is not a correctness bug in production: the page self-corrects within the
 * revalidate window, and Sprint 12's on-demand revalidation will make it
 * immediate. It IS a verification hazard — if you are checking whether seeded
 * content appears, confirm against the database or a cache-cleared build rather
 * than trusting a prerendered page.
 */
export const revalidate = 3600;

export const metadata = buildMetadata({
  title: 'Trackers, Alarms, Radios & Telematics Hardware',
  description:
    'Vehicle trackers, car alarms, PoC radios, dashcams and telematics hardware supplied and fitted across Kenya from Nairobi, Mombasa and Nakuru.',
  path: ROUTES.products,
});

export default async function ProductsIndexPage() {
  const { data: rows } = await getProducts();

  const products = rows.flatMap((p) =>
    p.slug && p.name ? [{ ...p, slug: p.slug, name: p.name }] : [],
  );

  // Group by the family the product declares, falling back to its category.
  const families = new Map<string, typeof products>();
  for (const p of products) {
    const key = p.family ?? p.category_name ?? 'Other';
    const list = families.get(key) ?? [];
    list.push(p);
    families.set(key, list);
  }

  const trail = [
    { name: 'Home', path: ROUTES.home },
    { name: 'Products', path: ROUTES.products },
  ];

  return (
    <main id="main">
      <JsonLd json={jsonLdGraph([breadcrumbSchema(trail)])} />

      <Section tone="dark" bleed>
        <Shell className="pb-12 pt-10 md:pb-16 md:pt-14">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-x-2 font-mono text-label uppercase tracking-[0.08em] text-text-secondary-inverse">
              <li>
                <a href={ROUTES.home} className="underline underline-offset-4">
                  Home
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden="true">/</span>
                <span aria-current="page">Products</span>
              </li>
            </ol>
          </nav>

          <h1 className="mt-6 max-w-[22ch] font-display text-h1 text-text-inverse md:text-md-display">
            Products
          </h1>
          <p className="mt-5 max-w-prose text-body-lg text-text-secondary-inverse">
            The hardware behind the solutions — trackers, alarms, radios and telematics equipment,
            supplied and fitted by our own technicians. Prices shown are {VAT_LABEL}.
          </p>
        </Shell>
      </Section>

      <Section tone="light">
        <Shell>
          {products.length === 0 ? (
            <p className="max-w-prose text-body text-text-secondary">
              Product pages are being published. In the meantime, tell us what you need on WhatsApp
              and we will answer directly.
            </p>
          ) : (
            <div className="flex flex-col gap-14">
              {[...families.entries()].map(([family, items]) => (
                <div key={family}>
                  <h2 className="font-mono text-label uppercase tracking-[0.08em] text-text-secondary">
                    {family}
                  </h2>
                  <ul className="mt-4 border-t border-border-hairline">
                    {items.map((p) => (
                      <li key={p.id} className="border-b border-border-hairline">
                        {/*
                          A ruled list with a small photo at the start of each
                          row (plan D3): still a list to compare, not a card
                          grid (ADR-0008). The photo's alt is empty because the
                          row's link already names the product; read aloud, it
                          would be the name twice. AfterLoad keeps the photos
                          out of the first-paint window.
                        */}
                        <a
                          href={ROUTES.product(p.slug)}
                          className="zoom-group group grid grid-cols-[4rem_minmax(0,1fr)] items-start gap-x-5 gap-y-2 py-6 md:grid-cols-[4rem_18rem_minmax(0,1fr)_9rem] md:gap-x-8"
                        >
                          <span className="row-span-3 md:row-span-1">
                            {PRODUCT_PHOTOS[p.slug] ? (
                              <ZoomImage
                                afterLoad
                                src={PRODUCT_PHOTOS[p.slug].src}
                                alt=""
                                sizes="4rem"
                                frameClassName="aspect-square rounded-control border border-border-hairline bg-surface"
                              />
                            ) : (
                              <span className="block aspect-square rounded-control bg-surface-raised" />
                            )}
                          </span>
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
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </Shell>
      </Section>
    </main>
  );
}
