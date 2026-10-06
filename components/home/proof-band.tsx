import Image from 'next/image';
import { Section, Shell } from '@/components/layout/section';
import { BRANCHES, COVERAGE_TOWNS } from '@/lib/company';
import type { PublicClientLogo } from '@/types/content';

/**
 * PROOF BAND — homepage section 2 (brief 9.1).
 *
 * The brief asks for "registrations, branches, client logos (real only)".
 * Today none of those three arrives intact:
 *
 *   - Client logos are blocked by V12: none has written permission yet. The
 *     six old files left `public/` in Sprint 14 (source-assets/legacy-public).
 *     The logo row below (Sprint 16) is built and shows nothing until a client
 *     row has `permission_confirmed` (public_client_logos, 0009); see
 *     docs/CLIENT_PERMISSIONS.md for how one is added.
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

/**
 * A logo is shown only from `public/clients/`, where a cleared file is put by
 * hand (docs/CLIENT_PERMISSIONS.md). Anything else in `logo_path`, such as a
 * storage URL, is skipped rather than risked: it would be unoptimised, and
 * blocked by the CSP if it lived on another origin.
 */
const LOGO_DIR = '/clients/';

export function ProofBand({ logos = [] }: { logos?: PublicClientLogo[] }) {
  const shownLogos = logos.filter(
    (l): l is PublicClientLogo & { name: string; logo_path: string } =>
      Boolean(l.name && l.logo_path?.startsWith(LOGO_DIR) && !l.logo_path.includes('..')),
  );
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

        {/*
          THE LOGO ROW, only with written permission (V12). A static row of
          marks, not a moving strip: a marquee would loop in the reader's
          peripheral vision, which brief PART 17 forbids, and WCAG 2.2.2 would
          require a pause control. Not cards either: the band is an instrument
          panel. Absent, not placeholdered, while nobody has said yes.
        */}
        {shownLogos.length > 0 ? (
          <div className="mt-10 border-t border-border-hairline pt-8">
            <h3 className="font-mono text-label uppercase tracking-[0.08em] text-text-secondary">
              Some of the corporate clients we work with
            </h3>
            <ul className="mt-6 grid grid-cols-3 items-center gap-x-8 gap-y-6 sm:grid-cols-4 lg:grid-cols-6">
              {shownLogos.map((logo) => (
                <li key={logo.id ?? logo.name} className="relative h-12">
                  <Image
                    src={logo.logo_path}
                    alt={logo.name}
                    fill
                    sizes="(min-width: 1024px) 10rem, (min-width: 640px) 22vw, 30vw"
                    className="object-contain"
                    unoptimized={logo.logo_path.endsWith('.svg')}
                  />
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Shell>
    </Section>
  );
}
