import { Section, Shell } from '@/components/layout/section';
import { serviceClient } from '@/lib/supabase/server';
import { buildMetadata } from '@/lib/seo/metadata';
import { VAT_LABEL } from '@/lib/constants';

/**
 * ORDER LOOKUP.
 *
 * THE ORDER NUMBER IS A BEARER TOKEN. Anyone holding it can see this page, and
 * that is the intended design — a customer should not need an account to check
 * an order. Three things follow from it, and all three are load-bearing:
 *
 *   1. The suffix is RANDOM, not sequential (0005). A sequential number would
 *      let anyone who placed one order enumerate every order placed that day.
 *   2. The lookup is EXACT MATCH on the full number. No partial search, no
 *      listing, no "recent orders" — there is no way to get from this page to
 *      any other order.
 *   3. The page is `noindex`. An indexed order page is a customer's details in
 *      a search result.
 *
 * WHAT IS SHOWN is deliberately less than what is stored. The customer's phone
 * number is NOT rendered: whoever opens this link is not necessarily the person
 * who placed the order, and the phone number adds nothing they do not already
 * know if they are. Brief PART 16 — no PII beyond what the page genuinely needs.
 */
export const revalidate = 0;

/**
 * STATIC metadata, and a GENERIC title. Two reasons, both found by testing:
 *
 * 1. SOFT 404. With `generateMetadata`, an unknown order number returned HTTP
 *    **200** carrying the not-found body — the metadata function completed, the
 *    response head was committed, and `notFound()` could no longer change the
 *    status. Search engines index a 200. A static export lets notFound() set a
 *    real 404, verified.
 *
 * 2. INFORMATION LEAK. The generated title echoed the requested order number
 *    back into the page — on the one page whose entire security model is that
 *    the number is a bearer token nobody else should learn. A generic title
 *    reveals nothing about what was asked for.
 */
export const metadata = buildMetadata({
  title: 'Your order',
  description: 'Your Nebsam order.',
  // A literal, not ROUTES.order(number): the canonical must not carry the
  // order number either. The page is noindex, so the canonical is not
  // meaningful — but it would still be a number in a URL that gets logged.
  path: '/orders',
  noindex: true,
});

const STATUS_TEXT: Record<string, string> = {
  new: 'Received. We will be in touch on WhatsApp.',
  contacted: 'We have been in touch about this order.',
  confirmed: 'Confirmed. Installation or collection is being arranged.',
  installed: 'Installed.',
  closed: 'Closed.',
  cancelled: 'Cancelled.',
};

function formatKes(n: number): string {
  return `KES ${n.toLocaleString('en-KE')}`;
}

export default async function OrderPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;

  // Exact match only. No pattern, no prefix, no listing.
  const { data: order } = await serviceClient()
    .from('orders')
    .select('id, order_number, status, customer_name, customer_town, fulfilment_type, subtotal_kes, vat_rate_snapshot, created_at')
    .eq('order_number', orderNumber)
    .maybeSingle();

  /**
   * NOT a `notFound()`. Two reasons, the second discovered by testing.
   *
   * 1. Semantically this is a LOOKUP page. It exists; the order might not —
   *    the same relationship a search results page has with a query that
   *    matches nothing. Telling the reader to check the number is more useful
   *    than a generic 404.
   *
   * 2. `notFound()` from this route answered HTTP **200** carrying the
   *    not-found body — a soft 404. Verified against `force-dynamic`,
   *    `revalidate = 0`, and a not-found boundary inside the route group; the
   *    status did not change in any of them, while /solutions/nope and
   *    /totally-unknown both correctly returned 404. Rather than ship a 404
   *    page under a 200 and call it handled, the page is explicit about what
   *    happened. It is `noindex`, so there is no crawl cost either way.
   */
  if (!order) {
    return (
      <main id="main">
        <Section tone="dark" bleed>
          <Shell className="pb-10 pt-10 md:pb-12 md:pt-14">
            <h1 className="font-display text-h1 text-text-inverse md:text-md-display">
              We cannot find that order
            </h1>
            <p className="mt-4 max-w-prose text-body-lg text-text-secondary-inverse">
              Check the order number — it looks like NBS-260904-ABCD and is case sensitive. If it
              still does not work, message us on WhatsApp and we will find it.
            </p>
          </Shell>
        </Section>
      </main>
    );
  }

  const { data: items } = await serviceClient()
    .from('order_items')
    .select('id, name_snapshot, unit_price_snapshot, qty, recurring_fee_snapshot')
    .eq('order_id', order.id);

  const subtotal = order.subtotal_kes ?? 0;
  const rate = Number(order.vat_rate_snapshot ?? 0);
  const vat = Math.round(subtotal * rate);
  const total = subtotal + vat;

  return (
    <main id="main">
      <Section tone="dark" bleed>
        <Shell className="pb-10 pt-10 md:pb-12 md:pt-14">
          <p className="font-mono text-label uppercase tracking-[0.08em] text-text-secondary-inverse">
            Order
          </p>
          <h1 className="mt-3 font-display text-h1 text-text-inverse md:text-md-display">
            {order.order_number}
          </h1>
          <p className="mt-4 max-w-prose text-body-lg text-text-secondary-inverse">
            {STATUS_TEXT[order.status ?? 'new'] ?? 'Received.'}
          </p>
        </Shell>
      </Section>

      <Section tone="light">
        <Shell>
          <div className="max-w-[46rem]">
            <ul className="border-t border-border-hairline">
              {(items ?? []).map((i) => (
                <li
                  key={i.id}
                  className="flex flex-wrap items-baseline justify-between gap-4 border-b border-border-hairline py-4"
                >
                  <span className="text-body">
                    {i.qty} × {i.name_snapshot}
                    {i.recurring_fee_snapshot ? (
                      <span className="block text-body-sm text-text-secondary">
                        Plus {formatKes(i.recurring_fee_snapshot)} per year, per device
                      </span>
                    ) : null}
                  </span>
                  <span className="font-mono text-mono">
                    {formatKes((i.unit_price_snapshot ?? 0) * (i.qty ?? 0))}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="mt-6 flex flex-col gap-2">
              <div className="flex justify-between text-body">
                <dt>Subtotal ({VAT_LABEL})</dt>
                <dd className="font-mono text-mono">{formatKes(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-body">
                <dt>VAT at {Math.round(rate * 100)}%</dt>
                <dd className="font-mono text-mono">{formatKes(vat)}</dd>
              </div>
              <div className="mt-2 flex justify-between border-t border-border-hairline pt-3 text-body font-medium">
                <dt>Total</dt>
                <dd className="font-mono text-mono">{formatKes(total)}</dd>
              </div>
            </dl>

            <p className="mt-6 text-body-sm text-text-secondary">
              Prices include installation by a Nebsam technician.{' '}
              {order.fulfilment_type === 'pickup'
                ? 'This order is for collection from a branch.'
                : 'This order is for installation by our technician.'}
            </p>

            {/*
              The VAT rate is the one recorded WITH the order, not today's. An
              order records what was quoted; a later rate change must not
              silently rewrite it.
            */}
            <p className="mt-2 text-body-sm text-text-secondary">
              Placed{' '}
              {order.created_at
                ? new Date(order.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : ''}
              . The VAT rate shown is the rate recorded at the time of order.
            </p>
          </div>
        </Shell>
      </Section>
    </main>
  );
}
