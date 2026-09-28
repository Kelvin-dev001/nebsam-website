'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
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
 *
 * SPRINT 12b T5. The button is the shared primary `Button`, sized like its
 * alternative on the same page ("Request price on WhatsApp"), so it has the
 * same hover, press and dark-ground boundary as every other primary action;
 * it used to be a bare <button> with none of them.
 *
 * The confirmation is ANNOUNCED (accessibility fix B): it renders inside a
 * role="status" region that is in the DOM from the start, because a live
 * region only announces changes to content it already contained. It also
 * fades in beside the button (`enter-fade`, micro-interactions.css).
 */
export function AddToCart({ productId }: { productId: string }) {
  const [added, setAdded] = React.useState(false);

  return (
    <div className="flex w-full flex-wrap items-center gap-4 sm:w-auto">
      <Button
        type="button"
        variant="primary"
        size="lg"
        className="w-full sm:w-auto"
        onClick={() => {
          addToCart(productId);
          setAdded(true);
        }}
      >
        Add to cart
      </Button>

      <span role="status">
        {added ? (
          <a
            href={ROUTES.cart}
            className="enter-fade inline-flex min-h-11 items-center text-body text-text-inverse underline underline-offset-4"
          >
            Added — view cart
          </a>
        ) : null}
      </span>
    </div>
  );
}
