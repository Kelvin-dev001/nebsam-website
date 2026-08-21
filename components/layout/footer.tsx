import {
  BRANCHES,
  CANONICAL_DESCRIPTION,
  COMPANY,
  CONTACT,
  COVERAGE_TOWNS,
} from '@/lib/company';
import { LAUNCH_SOLUTIONS, ROUTES } from '@/lib/constants';
import { FOOTER_LEGAL, FOOTER_SUPPORT } from './nav-data';

/**
 * Footer.
 *
 * Carries the canonical company description VERBATIM (brief 13.3) and the full
 * NAP for all three branches. Every value comes from lib/company.ts — nothing
 * here is typed by hand.
 *
 * Brief 3.4: branches and coverage towns must be visually distinguishable, and
 * the copy must never imply an office where there is none or state a count of
 * agents. The two blocks are therefore separated and labelled differently.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      data-section="dark"
      className="border-t border-border-hairline-inverse bg-brand-navy text-text-inverse"
    >
      <div className="mx-auto w-full max-w-shell px-5 py-section md:px-8">
        {/* Description + branches */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-16">
          <div>
            <p className="max-w-prose text-body-sm text-text-secondary-inverse">
              {CANONICAL_DESCRIPTION}
            </p>
            <p className="mt-5 font-mono text-label uppercase tracking-[0.08em] text-text-secondary-inverse">
              {CONTACT.hours}
            </p>
          </div>

          <div>
            <h2 className="font-mono text-label uppercase tracking-[0.08em] text-text-secondary-inverse">
              Branches
            </h2>
            <ul className="mt-4 grid gap-6 sm:grid-cols-3">
              {BRANCHES.map((branch) => (
                <li key={branch.slug}>
                  <h3 className="font-display-tight text-h3">{branch.name}</h3>
                  <p className="mt-1 text-body-sm text-text-secondary-inverse">{branch.address}</p>
                  <ul className="mt-2 flex flex-col gap-0.5">
                    {branch.phones.map((phone) => (
                      <li key={phone.e164}>
                        <a
                          href={`tel:${phone.e164}`}
                          className="font-mono text-mono text-text-inverse transition-colors duration-micro ease-in-out-quad hover:text-brand-signal"
                        >
                          {phone.display}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="my-10 border-t border-border-hairline-inverse" />

        {/* Link architecture — every solution reachable from every page */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <nav aria-label="Solutions">
            <h2 className="font-mono text-label uppercase tracking-[0.08em] text-text-secondary-inverse">
              Solutions
            </h2>
            <ul className="mt-3 flex flex-col gap-2">
              {LAUNCH_SOLUTIONS.map((solution) => (
                <li key={solution.slug}>
                  <a
                    href={ROUTES.solution(solution.slug)}
                    className="text-body-sm text-text-secondary-inverse transition-colors duration-micro ease-in-out-quad hover:text-text-inverse"
                  >
                    {solution.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Support">
            <h2 className="font-mono text-label uppercase tracking-[0.08em] text-text-secondary-inverse">
              Support
            </h2>
            <ul className="mt-3 flex flex-col gap-2">
              {FOOTER_SUPPORT.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-body-sm text-text-secondary-inverse transition-colors duration-micro ease-in-out-quad hover:text-text-inverse"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-mono text-label uppercase tracking-[0.08em] text-text-secondary-inverse">
              Contact
            </h2>
            <ul className="mt-3 flex flex-col gap-2 text-body-sm">
              <li>
                <a
                  href={`mailto:${CONTACT.salesEmail}`}
                  className="text-text-secondary-inverse transition-colors duration-micro ease-in-out-quad hover:text-text-inverse"
                >
                  {CONTACT.salesEmail}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT.generalEmail}`}
                  className="text-text-secondary-inverse transition-colors duration-micro ease-in-out-quad hover:text-text-inverse"
                >
                  {CONTACT.generalEmail}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${CONTACT.whatsapp.e164}`}
                  className="font-mono text-mono text-text-inverse transition-colors duration-micro ease-in-out-quad hover:text-brand-signal"
                >
                  WhatsApp {CONTACT.whatsapp.display}
                </a>
              </li>
            </ul>
          </div>

          {/* Coverage is deliberately NOT styled like the branch list.
              Brief 3.4: never imply an office where there is none. */}
          <div>
            <h2 className="font-mono text-label uppercase tracking-[0.08em] text-text-secondary-inverse">
              Service coverage
            </h2>
            <p className="mt-3 text-body-sm text-text-secondary-inverse">
              Agents and technicians available in{' '}
              <span className="text-text-inverse">{COVERAGE_TOWNS.join(', ')}</span>. These are
              service locations, not offices.
            </p>
            <a
              href={ROUTES.coverage}
              className="mt-3 inline-block text-body-sm text-brand-signal underline decoration-1 underline-offset-4 transition-all duration-micro ease-in-out-quad hover:decoration-2"
            >
              See the coverage network
            </a>
          </div>
        </div>

        <hr className="my-10 border-t border-border-hairline-inverse" />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-body-sm text-text-secondary-inverse">
            © {year} {COMPANY.legalName}. {COMPANY.tagline}
          </p>
          <nav aria-label="Legal">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {FOOTER_LEGAL.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-body-sm text-text-secondary-inverse transition-colors duration-micro ease-in-out-quad hover:text-text-inverse"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
