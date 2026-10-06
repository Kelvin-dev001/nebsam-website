import { ButtonLink } from '@/components/ui/button';
import { AddToCart } from '@/components/cart/add-to-cart';
import { whatsappUrl } from '@/lib/company';
import { VAT_LABEL } from '@/lib/constants';
import type { PublicProduct } from '@/types/content';
import { formatKes } from '@/lib/format';

/**
 * PRICE AND RECURRING COST.
 *
 * NULL PRICE IS NOT AN ERROR STATE. It means "Request price", and it is the
 * correct state for most of this catalogue: only four products have a confirmed
 * price at launch. The schema has no way to store a placeholder number, because
 * brief 10.2 forbids inventing one, and a page with no price shows a WhatsApp
 * CTA in place of add-to-cart and emits Product schema WITHOUT an Offer.
 *
 * THE RECURRING FEE SITS NEXT TO THE PRICE, not at checkout. The PoC radios
 * carry a KES 3,000 per device per year licence renewal, and brief 10.2 requires
 * a recurring cost to appear on the product page. A buyer comparing a
 * KES 30,000 radio against an alternative is comparing the wrong number if the
 * annual fee only appears after they have decided.
 *
 * EVERY PRICE CARRIES `excl. VAT` VISIBLY. Stored prices are VAT-exclusive, and
 * a price displayed without that label is a price that will be disputed.
 *
 * ADD TO CART APPEARS ONLY WHERE THERE IS A PRICE. SHOP_ARCHITECTURE §8: a
 * product with no price shows "Request price", no add-to-cart, and emits no
 * Offer schema. All three follow from the same null, so they cannot drift apart.
 */

/** The WhatsApp message for an unpriced product: the buy box and the sticky bar send the same. */
export function priceRequestUrl(name: string | null): string {
  return whatsappUrl(`Hello Nebsam, please send me a price for the ${name}.`);
}

export function ProductPrice({ product }: { product: PublicProduct }) {
  const hasPrice = typeof product.price_kes === 'number';
  // The sentence below ends with its own full stop, and staff write notes that
  // end with one too ("…Reviewed annually."), which rendered as "..".
  const feeNote = product.recurring_fee_note?.trim().replace(/\.+$/, '');

  // No outer margin: the product page places this inside the buy-box card
  // (ADR-0008), whose padding does the spacing.
  return (
    <div>
      {hasPrice ? (
        <>
          <p className="font-display text-h2 text-text-inverse">
            {formatKes(product.price_kes as number)}{' '}
            <span className="font-sans text-body-sm font-normal text-text-secondary-inverse">
              {VAT_LABEL}
            </span>
          </p>

          {product.recurring_fee_kes ? (
            <p className="mt-2 max-w-prose text-body-sm text-text-secondary-inverse">
              Plus {formatKes(product.recurring_fee_kes)}
              {product.recurring_fee_period ? ` per ${product.recurring_fee_period}` : ''}
              {feeNote ? ` — ${feeNote}` : ''}.
            </p>
          ) : null}
        </>
      ) : (
        <>
          <p className="font-display text-h2 text-text-inverse">Request price</p>
          <p className="mt-2 max-w-prose text-body-sm text-text-secondary-inverse">
            Pricing for this product depends on the vehicle and the configuration, so we quote it
            rather than list it. Ask on WhatsApp and you will get a real number.
          </p>
        </>
      )}

      {/*
        INSTALLATION TERMS come from the product row. V05 was answered on 4 Sep
        2026 — prices include installation by a Nebsam technician — and
        migration 0032 wrote that sentence into `installation_terms` on every
        product, where staff can change it per product in the admin. This page
        went on printing the pre-answer placeholder until Sprint 12b.

        Only where a product has no terms recorded does the page fall back to
        saying where the answer comes from, rather than inventing a commercial
        term in either direction.
      */}
      <p className="mt-3 max-w-prose text-body-sm text-text-secondary-inverse">
        {product.installation_terms?.trim() ||
          'Installation and delivery terms are confirmed when you order.'}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
        {hasPrice && product.id ? (
          <AddToCart productId={product.id} />
        ) : (
          <ButtonLink
            href={priceRequestUrl(product.name)}
            variant="primary"
            size="lg"
            className="w-full sm:w-auto"
          >
            Request price on WhatsApp
          </ButtonLink>
        )}
      </div>
    </div>
  );
}
