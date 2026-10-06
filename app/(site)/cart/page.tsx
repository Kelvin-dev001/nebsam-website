import { Section, Shell } from '@/components/layout/section';
import { CartView, type CatalogueItem } from '@/components/cart/cart-view';
import { getProducts } from '@/lib/content';
import { buildMetadata } from '@/lib/seo/metadata';
import { ROUTES } from '@/lib/constants';

/**
 * CART.
 *
 * `noindex`. A cart is per-visitor and has nothing to offer a search engine;
 * indexing it would also put a URL in results that shows an empty cart to
 * everyone who clicks it.
 *
 * The catalogue it prices against must be current: a cart quoting a price
 * from a build last week is exactly the surprise that turns into a dispute at
 * handover. Until Sprint 14 that was met by rendering per request
 * (`force-dynamic`). It is ISR now (Kelvin, 6 Oct 2026, V102), and still
 * current, for two reasons:
 *
 *   1. The catalogue is read through the `public_products` cache tag, and the
 *      product admin invalidates that tag, and this path, on every save
 *      (revalidateProductSurfaces). An edit reaches the cart on the next visit,
 *      not in an hour.
 *   2. The price that counts is never this page's. `createOrder` reprices
 *      every line from the database at the moment of ordering, and the
 *      WhatsApp message carries those prices. At worst this page shows a
 *      superseded price for a moment; it cannot charge one.
 *
 * Per-request rendering made every visit wait on a round trip to the database
 * before the first byte, which put the cart's LCP on the 2.5 s line.
 *
 * The catalogue is passed from the server so the browser never holds prices.
 * Storage keeps product IDs and quantities only; see lib/cart.ts.
 */
export const revalidate = 3600;

export const metadata = {
  ...buildMetadata({
    title: 'Your cart',
    description: 'Review the equipment you have selected and send your order on WhatsApp.',
    path: ROUTES.cart,
    noindex: true,
  }),
};

export default async function CartPage() {
  const { data } = await getProducts();

  const catalogue: CatalogueItem[] = data.flatMap((p) =>
    p.id && p.slug && p.name
      ? [
          {
            id: p.id,
            name: p.name,
            slug: p.slug,
            price_kes: p.price_kes,
            recurring_fee_kes: p.recurring_fee_kes,
            recurring_fee_period: p.recurring_fee_period,
          },
        ]
      : [],
  );

  return (
    <main id="main">
      <Section tone="dark" bleed>
        <Shell className="pb-10 pt-10 md:pb-12 md:pt-14">
          <h1 className="font-display text-h1 text-text-inverse md:text-md-display">Your cart</h1>
          <p className="mt-4 max-w-prose text-body-lg text-text-secondary-inverse">
            Check the items and quantities, then send the order. We reply on WhatsApp.
          </p>
        </Shell>
      </Section>

      <Section tone="light">
        <Shell>
          <CartView catalogue={catalogue} />
        </Shell>
      </Section>
    </main>
  );
}
