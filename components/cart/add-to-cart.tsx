'use client';

import * as React from 'react';
import { addToCart } from '@/lib/cart';
import { ROUTES } from '@/lib/constants';

/**
 * ADD TO CART.
 *
 * Rendered only where a product has a published price. A product without one
 * shows "Request price" and a WhatsApp CTA instead (SHOP_ARCHITECTURE §8),
 * because a cart line with no price is a line the server has to drop at
 * checkout anyway.
 *
 * Only the product ID crosses into storage. See lib/cart.ts for why.
 */
export function AddToCart({ productId }: { productId: string }) {
  const [added, setAdded] = React.useState(false);

  return (
    <div className="flex flex-wrap items-center gap-4">
      <button
        type="button"
        onClick={() => {
          addToCart(productId);
          setAdded(true);
        }}
        className="inline-flex min-h-11 items-center rounded-control bg-brand-signal-ink px-5 text-white"
      >
        Add to cart
      </button>

      {added ? (
        <a
          href={ROUTES.cart}
          className="inline-flex min-h-11 items-center text-body text-text-inverse underline underline-offset-4"
        >
          Added — view cart
        </a>
      ) : null}
    </div>
  );
}
