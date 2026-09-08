import { Section, Shell } from '@/components/layout/section';
import { JsonLd } from '@/components/seo/json-ld';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { CoverageMap } from '@/components/about/coverage-map';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, jsonLdGraph, localBusinessSchemas } from '@/lib/seo/schema';
import { getBranches, getCoverageLocations } from '@/lib/content';
import { ROUTES } from '@/lib/constants';
import { BRANCHES, COVERAGE_TOWNS, CONTACT, whatsappUrl } from '@/lib/company';

/**
 * COVERAGE NETWORK.
 *
 * Sprint 11 acceptance: "branches and coverage towns visually distinct and
 * legended; no invented addresses, no counts of agents."
 *
 * ── The distinction is structural, not a rendering convention ───────────────
 * `branches` and `coverage_locations` are two tables, not one table with a flag,
 * precisely so this page cannot blur them by accident (migration 0004). They are
 * drawn with different marks, listed under different headings, and described in
 * different words. An office is an office; everywhere else is people working
 * from one.
 *
 * ── Two things that must never appear ───────────────────────────────────────
 * A count of agents or technicians — brief 3.4 forbids it, and no column exists
 * to hold one. And an address for any town that is not one of the three
 * branches, because there is no office there to have an address.
 *
 * ── Database first, constants as the floor ──────────────────────────────────
 * The lists come from the CMS-editable tables so staff can add a town without a
 * deploy. lib/company.ts is the fallback, because it is the build-time source
 * that schema, llms.txt and the sitemap already read; a database hiccup should
 * cost freshness, not turn the coverage page blank.
 *
 * ── LocalBusiness x3, and no `geo` ──────────────────────────────────────────
 * One per real office, from lib/company.ts, matching the addresses printed on
 * the page. Migration 0038 stores TOWN centres, and a LocalBusiness `geo` reads
 * as the premises — so none is emitted. Coverage towns get no LocalBusiness at
 * all: there is no business located there.
 */
export const revalidate = 3600;

export const metadata = buildMetadata({
  title: 'Nebsam coverage across Kenya',
  description:
    'Where Nebsam Digital Solutions works: branches in Nairobi, Mombasa and Nakuru, and agents and technicians serving towns across Kenya from Lodwar to Malindi.',
  path: ROUTES.coverage,
});

export default async function CoveragePage() {
  const [{ data: dbBranches }, { data: dbTowns }] = await Promise.all([
    getBranches(),
    getCoverageLocations(),
  ]);

  const branches = dbBranches.length
    ? dbBranches.map((b) => ({
        slug: b.slug ?? b.town ?? '',
        name: b.name ?? '',
        town: b.town ?? '',
        county: b.county ?? '',
        address: b.address ?? '',
        hours: b.hours ?? CONTACT.hours,
        lat: b.lat,
        lng: b.lng,
        phones: Array.isArray(b.phones) ? (b.phones as { display: string; e164: string }[]) : [],
        mapsUrl: b.maps_url ?? '',
      }))
    : BRANCHES.map((b) => ({
        slug: b.slug,
        name: b.name,
        town: b.town,
        county: b.county,
        address: b.address,
        hours: CONTACT.hours,
        lat: null,
        lng: null,
        phones: b.phones,
        mapsUrl: b.mapsUrl,
      }));

  const towns = dbTowns.length
    ? dbTowns.map((t) => ({ name: t.town ?? '', county: t.county, lat: t.lat, lng: t.lng }))
    : COVERAGE_TOWNS.map((town) => ({ name: town, county: null, lat: null, lng: null }));

  const trail = [
    { name: 'Home', path: ROUTES.home },
    { name: 'About', path: ROUTES.about },
    { name: 'Coverage', path: ROUTES.coverage },
  ];

  return (
    <main id="main">
      <JsonLd json={jsonLdGraph([breadcrumbSchema(trail), ...localBusinessSchemas()])} />

      <Section tone="dark" bleed>
        <Shell className="pb-12 pt-10 md:pb-16 md:pt-14">
          <Breadcrumbs trail={trail} tone="dark" />
          <h1 className="mt-6 max-w-[24ch] font-display text-h1 text-text-inverse md:text-md-display">
            Where we work
          </h1>
          <p className="mt-5 max-w-prose text-body-lg text-text-secondary-inverse">
            Nebsam Digital Solutions (K) Ltd has three branches — Nairobi, Mombasa and Nakuru — and
            works across the rest of Kenya through agents and technicians based at them.
          </p>
        </Shell>
      </Section>

      <Section tone="light">
        <Shell>
          <div className="grid gap-12 md:grid-cols-[minmax(0,34rem)_minmax(0,1fr)] md:gap-16">
            <CoverageMap
              branches={branches.map((b) => ({ name: b.town || b.name, lat: b.lat, lng: b.lng }))}
              towns={towns.map((t) => ({ name: t.name, lat: t.lat, lng: t.lng }))}
            />

            <div className="max-w-prose">
              <h2 className="font-display-tight text-h2 text-text-primary md:text-md-h2">
                A branch and a covered town are not the same thing
              </h2>
              <p className="mt-4 text-body text-text-secondary">
                A branch is an office you can walk into, with an address and a phone number. A
                covered town is one where we have people — agents and technicians who install and
                support equipment, working from the nearest branch.
              </p>
              <p className="mt-4 text-body text-text-secondary">
                We draw the difference because it matters when you need someone. If your town is on
                the covered list, we come to you; there is no counter to visit.
              </p>
              <p className="mt-6 text-body">
                <a
                  className="text-brand-signal-ink underline underline-offset-4"
                  href={whatsappUrl('Hello Nebsam — do you cover my area?')}
                >
                  Ask whether we cover your area
                </a>
              </p>
            </div>
          </div>
        </Shell>
      </Section>

      <Section tone="paper">
        <Shell>
          <h2 className="font-display-tight text-h2 text-text-primary md:text-md-h2">Branches</h2>
          <p className="mt-4 max-w-prose text-body text-text-secondary">
            Three offices. These are the only Nebsam addresses.
          </p>

          <ul className="mt-8 grid gap-x-10 gap-y-8 border-t border-border-hairline pt-8 md:grid-cols-3">
            {branches.map((branch) => (
              <li key={branch.slug} id={branch.slug}>
                <h3 className="font-display-tight text-h3 text-text-primary">{branch.name}</h3>
                <address className="mt-3 not-italic text-body text-text-secondary">
                  {branch.address}
                  <br />
                  {branch.town}
                  {branch.county ? `, ${branch.county} County` : ''}
                </address>
                <ul className="mt-4 flex flex-col gap-1 font-mono text-body-sm">
                  {branch.phones.map((phone) => (
                    <li key={phone.e164}>
                      <a className="text-brand-signal-ink underline underline-offset-4" href={`tel:${phone.e164}`}>
                        {phone.display}
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 font-mono text-label uppercase tracking-[0.08em] text-text-secondary">
                  {branch.hours}
                </p>
                {branch.mapsUrl ? (
                  <p className="mt-3 text-body-sm">
                    <a
                      className="text-brand-signal-ink underline underline-offset-4"
                      href={branch.mapsUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Open in Maps
                    </a>
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </Shell>
      </Section>

      <Section tone="light">
        <Shell>
          <h2 className="font-display-tight text-h2 text-text-primary md:text-md-h2">
            Towns served by agents and technicians
          </h2>
          <p className="mt-4 max-w-prose text-body text-text-secondary">
            There is no Nebsam office in these towns. Installation and support are carried out by
            agents and technicians working from the nearest branch.
          </p>

          {/*
            A list of names and nothing else. No count of the people in each
            town, no "coming soon", no partial addresses. Brief 3.4 forbids
            stating a count of agents or technicians, and the schema has no
            column for one — so there is nothing here that could drift into
            implying an office.
          */}
          <ul className="mt-8 flex flex-wrap gap-x-3 gap-y-2 border-t border-border-hairline pt-8">
            {towns.map((town) => (
              <li
                key={town.name}
                className="rounded-data border border-border-hairline px-3 py-1.5 text-body-sm text-text-primary"
              >
                {town.name}
              </li>
            ))}
          </ul>

          <p className="mt-8 max-w-prose text-body text-text-secondary">
            Not listed? Ask. This is where we already work, not a limit on where we will go.
          </p>
        </Shell>
      </Section>
    </main>
  );
}
