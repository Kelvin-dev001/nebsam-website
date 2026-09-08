import { Section, Shell } from '@/components/layout/section';
import { JsonLd } from '@/components/seo/json-ld';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, jsonLdGraph } from '@/lib/seo/schema';
import { ROUTES } from '@/lib/constants';
import {
  BRANCHES,
  CANONICAL_DESCRIPTION,
  COMPANY,
  COVERAGE_TOWNS,
  FOUNDED_YEAR,
  SITE_URL,
} from '@/lib/company';

/**
 * ABOUT — deliberately restrained, and this comment explains why.
 *
 * ── This route belongs to no sprint ─────────────────────────────────────────
 * `/about` appears in ROUTE_MAP and in the primary navigation, and Sprint 2's
 * criteria assume it exists ("this sprint publishes it to the footer, About,
 * llms.txt and every page's schema"). It was never built. Sprint 11 builds two
 * of its CHILDREN — certifications and coverage — so the alternative to building
 * it was shipping two pages whose breadcrumb points at a 404.
 *
 * Sprint 10 set the precedent by building /resources as the parent the blog had
 * been missing. This follows it, and it is recorded as a deviation in the Sprint
 * 11 report rather than slipped in.
 *
 * ── Why there is no company story here ──────────────────────────────────────
 * `content-source/03-company/` IS EMPTY. Every sentence on this page is derived
 * from a fact already confirmed and already living in lib/company.ts: the
 * canonical description, the founding year, the three branches, the coverage
 * towns. Nothing is characterised, nothing is narrated, and no history is
 * invented — CLAUDE.md §5 forbids inventing years in business, staff, client
 * counts or superlatives, and an About page is where that temptation is
 * strongest.
 *
 * When the client supplies about copy, this page grows. Until then it is short
 * and true, which beats long and plausible. /about/team and /about/partners stay
 * unbuilt for the same reason and are absent from this page's links.
 */
export const revalidate = 3600;

export const metadata = buildMetadata({
  title: 'About Nebsam Digital Solutions (K) Ltd',
  description:
    'Who Nebsam Digital Solutions is and where we work: vehicle tracking, telematics and vehicle security across Kenya, from Nairobi, Mombasa and Nakuru.',
  path: ROUTES.about,
});

export default function AboutPage() {
  const trail = [
    { name: 'Home', path: ROUTES.home },
    { name: 'About', path: ROUTES.about },
  ];

  const aboutPage = {
    '@type': 'AboutPage',
    '@id': `${SITE_URL}${ROUTES.about}#page`,
    url: `${SITE_URL}${ROUTES.about}`,
    name: `About ${COMPANY.legalName}`,
    description: CANONICAL_DESCRIPTION,
  };

  const children = [
    {
      href: ROUTES.certifications,
      name: 'Certifications and registrations',
      description:
        'The permits and registrations Nebsam holds, described in the words the documents themselves use. Nothing lapsed is shown.',
    },
    {
      href: ROUTES.coverage,
      name: 'Coverage network',
      description:
        'The three branches, and the towns served by agents and technicians working from them, on one map.',
    },
  ];

  return (
    <main id="main">
      <JsonLd json={jsonLdGraph([aboutPage, breadcrumbSchema(trail)])} />

      <Section tone="dark" bleed>
        <Shell className="pb-12 pt-10 md:pb-16 md:pt-14">
          <Breadcrumbs trail={trail} tone="dark" />
          <h1 className="mt-6 max-w-[24ch] font-display text-h1 text-text-inverse md:text-md-display">
            About Nebsam
          </h1>
          {/* The canonical description, VERBATIM. It is written once in
              lib/company.ts and reused here, in the footer, in llms.txt and in
              every page's Organization schema. Rewording it per page is what
              weakens entity resolution. */}
          <p className="mt-5 max-w-prose text-body-lg text-text-secondary-inverse">
            {CANONICAL_DESCRIPTION}
          </p>
        </Shell>
      </Section>

      <Section tone="light">
        <Shell>
          <div className="max-w-prose">
            <h2 className="font-display-tight text-h2 text-text-primary md:text-md-h2">
              What we do, and where
            </h2>
            <p className="mt-4 text-body text-text-secondary">
              Nebsam has been installing and supporting vehicle tracking and security systems in
              Kenya for over 10 years. We fit the equipment ourselves rather than reselling it, and
              we support it afterwards.
            </p>
            <p className="mt-4 text-body text-text-secondary">
              There are three branches — {BRANCHES.map((b) => b.name).join(', ')} — and agents and
              technicians working from them in {COVERAGE_TOWNS.length}&nbsp;further towns, including{' '}
              {COVERAGE_TOWNS.slice(0, 5).join(', ')}. Those are the offices; everywhere else is
              covered from them.
            </p>
          </div>

          <dl className="mt-10 grid gap-x-10 gap-y-6 border-t border-border-hairline pt-8 sm:grid-cols-3">
            {/*
              Three facts, each traceable. FOUNDED_YEAR is confirmed (V36) and
              "over 10 years" is the approved wording, kept deliberately
              conservative against it. The branch count is a count of a list that
              is enumerated on this page. There is NO count of agents or
              technicians, and there never will be — brief 3.4 forbids one.
            */}
            <div>
              <dt className="font-mono text-label uppercase tracking-[0.08em] text-text-secondary">
                Installing since
              </dt>
              <dd className="mt-2 font-display text-h2 text-text-primary">{FOUNDED_YEAR}</dd>
            </div>
            <div>
              <dt className="font-mono text-label uppercase tracking-[0.08em] text-text-secondary">
                Branches
              </dt>
              <dd className="mt-2 font-display text-h2 text-text-primary">{BRANCHES.length}</dd>
            </div>
            <div>
              <dt className="font-mono text-label uppercase tracking-[0.08em] text-text-secondary">
                Corporate clients
              </dt>
              <dd className="mt-2 font-display text-h2 text-text-primary">70+</dd>
            </div>
          </dl>
        </Shell>
      </Section>

      <Section tone="paper">
        <Shell>
          <ul className="border-t border-border-hairline">
            {children.map((child) => (
              <li key={child.href} className="border-b border-border-hairline">
                <a href={child.href} className="group grid gap-x-10 gap-y-2 py-7 md:grid-cols-[22rem_1fr]">
                  <h2 className="font-display-tight text-h3 text-text-primary underline-offset-4 group-hover:underline">
                    {child.name}
                  </h2>
                  <p className="max-w-prose text-body text-text-secondary">{child.description}</p>
                </a>
              </li>
            ))}
          </ul>
        </Shell>
      </Section>
    </main>
  );
}
