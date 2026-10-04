import { Eyebrow, Section, Shell } from '@/components/layout/section';
import { ZoomImage } from '@/components/ui/zoom-image';
import { ROUTES, VAT_LABEL } from '@/lib/constants';
import { formatKes } from '@/lib/format';
import { PRODUCT_PHOTOS } from '@/lib/media/products';
import type { PublicProduct, PublicProductCategory } from '@/types/content';

/**
 * SHOP — homepage section 7 (brief 9.1: "featured products, real photography,
 * direct path to buy"), added in Sprint 12n.
 *
 * WHICH FOUR. Products staff mark as featured, and of those only ones with a
 * photograph, because a shop shelf with a blank where the product should be
 * sells nothing (plan D3). Taken one per category in turn (trackers, alarms,
 * radios, then trackers again) so the four show the range rather than four
 * trackers. Category order is the admin's own sort order.
 *
 * Four photographs in a row is the one place the page repeats a shape, and it
 * is earned: these are goods to pick up, not text to compare. No card chrome:
 * the photo on white is the tile (ADR-0008 keeps cards for single surfaces).
 */
const SHELF = 4;

function pickShelf(products: PublicProduct[], categories: PublicProductCategory[]) {
  const order = new Map(categories.map((c) => [c.slug, c.sort_order ?? 99]));
  const byCategory = new Map<string, PublicProduct[]>();
  for (const p of products) {
    if (!p.slug || !PRODUCT_PHOTOS[p.slug]) continue;
    const key = p.category_slug ?? '';
    byCategory.set(key, [...(byCategory.get(key) ?? []), p]);
  }
  const queues = [...byCategory.entries()]
    .sort(([a], [b]) => (order.get(a) ?? 99) - (order.get(b) ?? 99))
    .map(([, items]) => items);
  const shelf: PublicProduct[] = [];
  while (shelf.length < SHELF && queues.some((q) => q.length > 0)) {
    for (const q of queues) {
      const next = q.shift();
      if (next && shelf.length < SHELF) shelf.push(next);
    }
  }
  return shelf;
}

export function ShopPreview({
  featured,
  categories,
}: {
  featured: PublicProduct[];
  categories: PublicProductCategory[];
}) {
  const shelf = pickShelf(featured, categories);
  if (shelf.length === 0) return null;

  return (
    <Section tone="dark">
      <Shell>
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <div className="max-w-prose">
            <Eyebrow>Shop</Eyebrow>
            <h2 className="mt-4 font-display text-h2 text-text-inverse md:text-md-h2">
              The hardware, ready to order.
            </h2>
            <p className="mt-4 text-body text-text-secondary-inverse">
              Order on WhatsApp. Prices are {VAT_LABEL}; where the price depends on your vehicle, we
              quote it.
            </p>
          </div>
          <a
            href={ROUTES.products}
            className="text-body text-brand-signal underline underline-offset-4"
          >
            All products
          </a>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4">
          {shelf.map((p) => {
            const photo = PRODUCT_PHOTOS[p.slug as string];
            return (
              <li key={p.slug}>
                <a href={ROUTES.product(p.slug as string)} className="zoom-group group block">
                  <ZoomImage
                    src={photo.src}
                    alt={photo.alt}
                    sizes="(min-width: 1024px) 18rem, 50vw"
                    frameClassName="aspect-square rounded-panel bg-surface"
                  />
                  {p.category_name ? (
                    <p className="mt-4 font-mono text-label uppercase tracking-[0.08em] text-text-secondary-inverse">
                      {p.category_name}
                    </p>
                  ) : null}
                  <h3 className="mt-1 font-display-tight text-body-lg text-text-inverse underline-offset-4 group-hover:underline">
                    {p.name}
                  </h3>
                  <p className="mt-1 font-mono text-mono text-text-secondary-inverse">
                    {formatKes(p.price_kes) ?? 'Request price'}
                  </p>
                </a>
              </li>
            );
          })}
        </ul>
      </Shell>
    </Section>
  );
}
