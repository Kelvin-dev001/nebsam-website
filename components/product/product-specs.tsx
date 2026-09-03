import { Section, Shell } from '@/components/layout/section';
import type { PublicProduct } from '@/types/content';

/**
 * SPECIFICATIONS — server-rendered, and that is the whole point of this file.
 *
 * The Sprint 6 criterion reads "Specifications server-rendered, never in a
 * client-only tab", and CONTENT_ARCHITECTURE §1.2 calls a client-only spec tab
 * "the crawlability failure this rebuild exists to fix". The old site put its
 * specifications behind a tab that only existed after hydration, so a crawler
 * — and an assistant answering "what does the Nebsam anti-jammer tracker
 * support" — saw a page with no specifications on it at all.
 *
 * So: a real <table> in the server component. No tabs, no accordion, no
 * disclosure widget. A reader scans it, a crawler reads it, and an assistant
 * can quote it. If it ever needs to be condensed on mobile, that is a CSS
 * problem and must stay a CSS problem.
 *
 * `specs` is a jsonb object of label -> value. Rendering is order-preserving:
 * Postgres jsonb does not preserve insertion order, so the seed writes the keys
 * in the order they should appear and this component sorts by nothing —
 * whatever order the object arrives in is what shows. Where a specific order
 * matters, the seed encodes it in the labels themselves.
 */

function specEntries(value: PublicProduct['specs']): [string, string][] {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return [];
  return Object.entries(value as Record<string, unknown>)
    .filter(([, v]) => v !== null && v !== undefined && String(v).trim() !== '')
    .map(([k, v]) => [k, String(v)]);
}

export function ProductSpecs({ specs }: { specs: PublicProduct['specs'] }) {
  const entries = specEntries(specs);
  if (entries.length === 0) return null;

  return (
    <Section tone="paper">
      <Shell>
        <div className="max-w-prose">
          <h2 className="font-mono text-label uppercase tracking-[0.08em] text-text-secondary">
            Specifications
          </h2>
        </div>

        {/* Scrolls inside its own container rather than pushing the page wide. */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">Product specifications</caption>
            <tbody>
              {entries.map(([label, value]) => (
                <tr key={label} className="border-b border-border-hairline align-baseline">
                  <th
                    scope="row"
                    className="w-[18rem] py-3.5 pr-8 text-body font-medium text-text-primary"
                  >
                    {label}
                  </th>
                  <td className="py-3.5 font-mono text-mono text-text-secondary">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Shell>
    </Section>
  );
}
