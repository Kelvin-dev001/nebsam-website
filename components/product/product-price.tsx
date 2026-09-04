import { ButtonLink } from '@/components/ui/button';
import { AddToCart } from '@/components/cart/add-to-cart';
import { whatsappUrl } from '@/lib/company';
import { VAT_LABEL } from '@/lib/constants';
import type { PublicProduct } from '@/types/content';

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

function formatKes(amount: number): string {
  return `KES ${amount.toLocaleString('en-KE')}`;
}

export function ProductPrice({ product }: { product: PublicProduct }) {
  const hasPrice = typeof product.price_kes === 'number';

  return (
    <div className="mt-8">
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
              {product.recurring_fee_note ? ` — ${product.recurring_fee_note}` : ''}.
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
        Installation and delivery terms are NOT stated. Whether a price includes
        installation, SIM provisioning or configuration is register item V05 and
        is unresolved for every category. Asserting either way would be
        inventing a commercial term, and the register is explicit that ambiguity
        here generates order disputes — so the page says where the answer comes
        from instead of guessing at it.
      */}
      <p className="mt-3 max-w-prose text-body-sm text-text-secondary-inverse">
        Installation and delivery terms are confirmed when you order.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
        {hasPrice && product.id ? (
          <AddToCart productId={product.id} />
        ) : (
          <ButtonLink
            href={whatsappUrl(`Hello Nebsam, please send me a price for the ${product.name}.`)}
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
