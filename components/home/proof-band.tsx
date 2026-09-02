import { Section, Shell } from '@/components/layout/section';
import { BRANCHES, COVERAGE_TOWNS } from '@/lib/company';

/**
 * PROOF BAND — homepage section 2 (brief 9.1).
 *
 * The brief asks for "registrations, branches, client logos (real only)".
 * Today none of those three arrives intact:
 *
 *   - Client logos are blocked by V12. Six exist in `public/clients/` and not
 *     one has written permission, so none may be shown.
 *   - Of six regulatory instruments exactly ONE is currently valid. CAK lapsed
 *     30 Jun 2025, both ODPC registrations lapsed 27 May 2026, and the PSRA
 *     annual renewal is unconfirmed.
 *
 * So the band carries facts that are approved and verifiable: the two figures
 * CLAUDE.md §5 explicitly approves, and the branch and coverage counts.
 *
 * THE PERMIT IS DELIBERATELY NOT HERE. It has its own section — `KebsResult`,
 * built around the word the laboratory actually wrote. Repeating SM#84618 and
 * its scope note in a band forty pixels above that section would weaken the
 * strongest piece of third-party evidence this business owns by making it look
 * like a logo strip. One place, stated properly.
 *
 * Deliberately not a card grid (brief 6.6). A measured band reads as an
 * instrument panel, which is the argument the whole site is making.
 */

/** Figures approved in CLAUDE.md §5. Neither changes without evidence. */
const APPROVED_FIGURES = [
  { value: 'Over 10 years', label: 'Installing and supporting telematics in Kenya' },
  { value: '70+', label: 'Corporate clients' },
] as const;

export function ProofBand() {
  const facts = [
    ...APPROVED_FIGURES.map((f) => ({ value: f.value, label: f.label })),
    {
      value: String(BRANCHES.length),
      label: `Branches — ${BRANCHES.map((b) => b.name).join(', ')}`,
    },
    {
      // "+" because the list is the towns we can name, not a ceiling. No count
      // of agents or technicians appears anywhere — that figure is not
      // established, and CLAUDE.md §4 forbids stating one.
      value: `${COVERAGE_TOWNS.length}+`,
      label: 'Towns reached through agents and technicians',
    },
  ];

  return (
    <Section tone="paper" className="py-10 md:py-12">
      <Shell>
        <h2 className="sr-only">Nebsam at a glance</h2>

        <dl className="grid grid-cols-2 gap-x-8 gap-y-8 md:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="font-display-tight text-h2 text-text-primary">{fact.value}</dt>
              <dd className="mt-1 max-w-[24ch] text-body-sm text-text-secondary">{fact.label}</dd>
            </div>
          ))}
        </dl>
      </Shell>
    </Section>
  );
}
