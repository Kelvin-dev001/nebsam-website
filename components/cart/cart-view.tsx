'use client';

import * as React from 'react';
import { createOrder, type OrderResult } from '@/app/(site)/cart/actions';
import { clearCart, readCart, setQuantity, type CartLine } from '@/lib/cart';
import { ROUTES, VAT_LABEL, VAT_RATE } from '@/lib/constants';

/**
 * THE CART AND CHECKOUT.
 *
 * Prices come from the catalogue the server passed in, never from storage — so
 * a price change is reflected immediately, and there is nothing in the browser
 * worth forging.
 *
 * ON SUBMIT the server creates the order row FIRST and returns the WhatsApp
 * URL. Only then is WhatsApp opened. If the visitor closes the chat, or never
 * sends the message, the order still exists and is still a lead. That ordering
 * is the point of the whole flow — brief 10.2 calls a dropped chat losing an
 * order the single most important thing to prevent here.
 */

export interface CatalogueItem {
  id: string;
  name: string;
  slug: string;
  price_kes: number | null;
  recurring_fee_kes: number | null;
  recurring_fee_period: string | null;
}

function formatKes(n: number): string {
  return `KES ${n.toLocaleString('en-KE')}`;
}

export function CartView({ catalogue }: { catalogue: CatalogueItem[] }) {
  const [lines, setLines] = React.useState<CartLine[]>([]);
  const [ready, setReady] = React.useState(false);
  const [result, setResult] = React.useState<OrderResult | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  // Read after mount. localStorage does not exist during the server render, and
  // reading it in useState would produce a hydration mismatch.
  React.useEffect(() => {
    setLines(readCart());
    setReady(true);
    const sync = () => setLines(readCart());
    window.addEventListener('nebsam:cart', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('nebsam:cart', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const priced = lines.flatMap((l) => {
    const p = catalogue.find((c) => c.id === l.productId);
    return p && typeof p.price_kes === 'number' ? [{ line: l, product: p }] : [];
  });

  const subtotal = priced.reduce((s, i) => s + (i.product.price_kes as number) * i.line.quantity, 0);
  const vat = Math.round(subtotal * VAT_RATE);
  const total = subtotal + vat;
  const recurring = priced.filter((i) => i.product.recurring_fee_kes);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    const fd = new FormData(e.currentTarget);
    // Only IDs and quantities. No prices — see lib/cart.ts.
    fd.set(
      'lines',
      JSON.stringify(lines.map((l) => ({ productId: l.productId, quantity: l.quantity }))),
    );

    const r = await createOrder(fd);
    setResult(r);
    setSubmitting(false);

    if (r.ok) {
      // The order row already exists. Opening WhatsApp is the last step.
      clearCart();
      setLines([]);
      window.open(r.whatsappUrl, '_blank', 'noopener');
    }
  }

  if (!ready) return <p className="text-body text-text-secondary">Loading your cart…</p>;

  if (result?.ok) {
    return (
      <div className="max-w-prose" role="status">
        <h2 className="font-display text-h2 text-text-primary">
          Order {result.orderNumber} recorded
        </h2>
        <p className="mt-4 text-body text-text-secondary">
          WhatsApp should have opened in a new tab. If it did not, or you closed it, your order is
          still saved — we have it either way.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <a
            href={result.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center rounded-control bg-brand-signal-ink px-5 text-white"
          >
            Open WhatsApp
          </a>
          <a
            href={result.orderPath}
            className="inline-flex min-h-11 items-center text-body text-brand-signal-ink underline underline-offset-4"
          >
            View your order
          </a>
        </div>
        <p className="mt-6 text-body-sm text-text-secondary">
          Keep the order number. It is how you look this up later.
        </p>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <p className="max-w-prose text-body text-text-secondary">
        Your cart is empty. Browse the products and add what you need, or message us and we will
        recommend based on your vehicles.
      </p>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_22rem]">
      <div>
        <ul className="border-t border-border-hairline">
          {priced.map(({ line, product }) => (
            <li key={line.productId} className="border-b border-border-hairline py-5">
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <a
                  href={ROUTES.product(product.slug)}
                  className="text-body font-medium text-text-primary underline-offset-4 hover:underline"
                >
                  {product.name}
                </a>
                <span className="font-mono text-mono">
                  {formatKes((product.price_kes as number) * line.quantity)}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-body-sm text-text-secondary">
                  Quantity
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={line.quantity}
                    onChange={(e) => {
                      setQuantity(line.productId, Number(e.target.value));
                      setLines(readCart());
                    }}
                    className="min-h-11 w-20 rounded-control border border-border-strong bg-surface px-3 text-body"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setQuantity(line.productId, 0);
                    setLines(readCart());
                  }}
                  className="min-h-11 text-body-sm text-state-alert-ink underline underline-offset-4"
                >
                  Remove
                </button>
              </div>
              {product.recurring_fee_kes ? (
                <p className="mt-2 text-body-sm text-text-secondary">
                  Plus {formatKes(product.recurring_fee_kes)} per{' '}
                  {product.recurring_fee_period ?? 'year'}, per device.
                </p>
              ) : null}
            </li>
          ))}
        </ul>

        {lines.length > priced.length ? (
          <p className="mt-4 max-w-prose text-body-sm text-text-secondary">
            Some items in your cart have no published price and are not included in the total. Ask
            us for a quote on those.
          </p>
        ) : null}
      </div>

      <div>
        <div className="rounded-panel border border-border-hairline p-5">
          <dl className="flex flex-col gap-2">
            <div className="flex justify-between text-body">
              <dt>Subtotal ({VAT_LABEL})</dt>
              <dd className="font-mono text-mono">{formatKes(subtotal)}</dd>
            </div>
            <div className="flex justify-between text-body">
              <dt>VAT at {Math.round(VAT_RATE * 100)}%</dt>
              <dd className="font-mono text-mono">{formatKes(vat)}</dd>
            </div>
            <div className="mt-2 flex justify-between border-t border-border-hairline pt-3 text-body font-medium">
              <dt>Total</dt>
              <dd className="font-mono text-mono">{formatKes(total)}</dd>
            </div>
          </dl>

          {recurring.length > 0 ? (
            <div className="mt-4 border-t border-border-hairline pt-3">
              <p className="font-mono text-label uppercase tracking-[0.08em] text-text-secondary">
                Recurring, per device
              </p>
              <ul className="mt-2 flex flex-col gap-1">
                {recurring.map((i) => (
                  <li key={i.line.productId} className="text-body-sm text-text-secondary">
                    {i.product.name}: {formatKes(i.product.recurring_fee_kes as number)} per{' '}
                    {i.product.recurring_fee_period ?? 'year'}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <p className="mt-4 text-body-sm text-text-secondary">
            Prices include installation by a Nebsam technician.
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
          {result && !result.ok ? (
            <p role="alert" className="text-body-sm text-state-alert-ink">
              {result.message}
            </p>
          ) : null}

          <label className="flex flex-col gap-1.5">
            <span className="text-body-sm font-medium">Your name</span>
            <input
              name="customerName"
              required
              className="min-h-11 rounded-control border border-border-strong bg-surface px-3 text-body"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-body-sm font-medium">Phone</span>
            <input
              name="customerPhone"
              inputMode="tel"
              required
              placeholder="07…"
              className="min-h-11 rounded-control border border-border-strong bg-surface px-3 text-body"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-body-sm font-medium">Town</span>
            <input
              name="customerTown"
              className="min-h-11 rounded-control border border-border-strong bg-surface px-3 text-body"
            />
          </label>

          <fieldset className="flex flex-col gap-2">
            <legend className="text-body-sm font-medium">Fulfilment</legend>
            <label className="flex min-h-11 items-center gap-2 text-body">
              <input type="radio" name="fulfilmentType" value="installation" defaultChecked />
              Installation by our technician
            </label>
            <label className="flex min-h-11 items-center gap-2 text-body">
              <input type="radio" name="fulfilmentType" value="pickup" />
              Collection from a branch
            </label>
          </fieldset>

          <button
            type="submit"
            disabled={submitting || priced.length === 0}
            className="inline-flex min-h-11 items-center justify-center rounded-control bg-brand-signal-ink px-5 text-white disabled:opacity-50"
          >
            {submitting ? 'Recording your order…' : 'Send order on WhatsApp'}
          </button>

          <p className="text-body-sm text-text-secondary">
            Your order is saved before WhatsApp opens, so nothing is lost if the chat drops.
          </p>
        </form>
      </div>
    </div>
  );
}
