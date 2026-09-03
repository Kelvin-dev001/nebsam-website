import { Eyebrow, Section, Shell } from '@/components/layout/section';
import { ROUTES, VAT_LABEL } from '@/lib/constants';
import type { PublicProduct } from '@/types/content';

/**
 * Section 6 — hardware options. The actual products that deliver the solution.
 *
 * This section shipped in Sprint 5 rendering nothing, because `product_solutions`
 * was empty until Sprint 6. It now fills itself from the join, which is why it
 * was written as a query rather than a hand-maintained list per solution.
 *
 * It is also what satisfies the relationship rule in CONTENT_ARCHITECTURE §1 —
 * "every solution links to its products" — and turns nine complete but
 * unconnected solution pages into a set with somewhere to go.
 *
 * Price or "Request price" is shown here rather than only on the product page.
 * A reader deciding between hardware options is asking what it costs, and
 * making them open three pages to find out is how a considered purchase turns
 * into a bounce.
 */

function formatKes(amount: number): string {
  return `KES ${amount.toLocaleString('en-KE')}`;
}

export function SolutionHardware({ products }: { products: PublicProduct[] }) {
  const items = products.flatMap((p) => (p.slug && p.name ? [{ ...p, slug: p.slug, name: p.name }] : []));
  if (items.length === 0) return null;

  return (
    <Section tone="paper">
      <Shell>
        <div className="max-w-prose">
          <Eyebrow>Hardware</Eyebrow>
          <h2 className="mt-4 font-display text-h2 text-text-primary md:text-md-h2">
            The equipment that delivers it.
          </h2>
          <p className="mt-4 text-body text-text-secondary">
            Supplied and fitted by our own technicians. Prices shown are {VAT_LABEL}.
          </p>
        </div>

        <ul className="mt-10 border-t border-border-hairline">
          {items.map((p) => (
            <li key={p.id} className="border-b border-border-hairline">
              <a
                href={ROUTES.product(p.slug)}
                className="group grid gap-x-8 gap-y-2 py-6 md:grid-cols-[20rem_1fr_10rem]"
              >
                <h3 className="font-display-tight text-h3 text-text-primary underline-offset-4 group-hover:underline">
                  {p.name}
                </h3>
                <p className="max-w-prose text-body-sm text-text-secondary">{p.summary}</p>
                <p className="font-mono text-mono text-text-primary md:text-right">
                  {typeof p.price_kes === 'number' ? formatKes(p.price_kes) : 'Request price'}
                </p>
              </a>
            </li>
          ))}
        </ul>
      </Shell>
    </Section>
  );
}
