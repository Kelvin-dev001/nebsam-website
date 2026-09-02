import { Eyebrow, Section, Shell } from '@/components/layout/section';
import type { PublicBranch, PublicCoverageLocation } from '@/types/content';

/**
 * COVERAGE — homepage section 10 (brief 9.1). The Kenya network.
 *
 * This is the one section on the page running entirely on live database
 * content today: three branches and sixteen coverage towns, seeded in
 * migration 0010 and read through `public_branches` and
 * `public_coverage_locations`.
 *
 * THE RULE THIS SECTION EXISTS TO NOT BREAK. Brief PART 3 and CLAUDE.md §4:
 * three branches only — Nairobi, Mombasa, Nakuru. Everywhere else is agents and
 * technicians, and the site must never imply an office where there is none, nor
 * state a count of agents or technicians. So branches and coverage towns are
 * rendered as two visibly different things, with different weight and different
 * markup, rather than as one undifferentiated list of places. A reader
 * skimming must not come away thinking there are nineteen offices.
 */

/** A branch phone as stored in the `phones` jsonb column. */
type BranchPhone = { display: string; e164: string };

function phonesOf(value: PublicBranch['phones']): BranchPhone[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (p): p is BranchPhone =>
      typeof p === 'object' && p !== null && 'display' in p && 'e164' in p,
  );
}

export function Coverage({
  branches,
  coverage,
}: {
  branches: PublicBranch[];
  coverage: PublicCoverageLocation[];
}) {
  if (branches.length === 0) return null;

  return (
    <Section tone="light">
      <Shell>
        <div className="max-w-prose">
          <Eyebrow>Coverage</Eyebrow>
          <h2 className="mt-4 font-display text-h2 text-text-primary md:text-md-h2">
            Where we install, and where we reach.
          </h2>
        </div>

        <h3 className="mt-12 font-mono text-label uppercase tracking-[0.08em] text-text-secondary">
          Branches
        </h3>

        <ul className="mt-4 grid gap-x-10 gap-y-8 border-t border-border-hairline pt-8 md:grid-cols-3">
          {branches.map((branch) => (
            <li key={branch.id}>
              <h4 className="font-display-tight text-h3 text-text-primary">{branch.name}</h4>
              {branch.address ? (
                <p className="mt-2 text-body text-text-secondary">{branch.address}</p>
              ) : null}
              {branch.hours ? (
                <p className="mt-2 font-mono text-mono text-text-secondary">{branch.hours}</p>
              ) : null}
              <ul className="mt-3 flex flex-col gap-1">
                {phonesOf(branch.phones).map((phone) => (
                  <li key={phone.e164}>
                    {/* min-height keeps the tap target at 44px (WCAG 2.5.8). */}
                    <a
                      href={`tel:+${phone.e164.replace(/^\+/, '')}`}
                      className="inline-flex min-h-11 items-center text-body text-brand-signal-ink underline underline-offset-4"
                    >
                      {phone.display}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        {coverage.length > 0 ? (
          <div className="mt-14 border-t border-border-hairline pt-8">
            <h3 className="font-mono text-label uppercase tracking-[0.08em] text-text-secondary">
              Served by agents and technicians
            </h3>
            {/*
              Stated plainly, because the alternative is a reader inferring
              offices that do not exist. No count of agents or technicians is
              given anywhere — that number is not established and inventing one
              is exactly what CLAUDE.md §5 forbids.
            */}
            <p className="mt-3 max-w-prose text-body text-text-secondary">
              Installation and support reach these towns through agents and technicians rather than
              through a branch office.
            </p>
            <ul className="mt-5 flex flex-wrap gap-x-2 gap-y-2">
              {coverage.map((place) => (
                <li
                  key={place.id}
                  className="rounded-data border border-border-hairline bg-surface-raised px-3 py-1.5 text-body-sm text-text-secondary"
                >
                  {place.town}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Shell>
    </Section>
  );
}
