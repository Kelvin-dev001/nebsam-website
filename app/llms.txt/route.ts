import {
  BRANCHES,
  CANONICAL_DESCRIPTION,
  COMPANY,
  CONTACT,
  COVERAGE_TOWNS,
  REGISTRATIONS,
  SITE_URL,
  isCurrent,
} from '@/lib/company';
import { LAUNCH_SOLUTIONS, PRODUCT_CATEGORIES, ROUTES } from '@/lib/constants';

/**
 * /llms.txt — brief PART 13.3.
 *
 * GENERATED from lib/company.ts and the route table, never hand-maintained.
 * A stale llms.txt is worse than none, because it teaches assistants outdated
 * product names — and a hand-written one goes stale the first time a route
 * changes and nobody remembers this file exists.
 *
 * The canonical description is reproduced VERBATIM. Identical wording across
 * the footer, About, schema and here is what strengthens entity resolution.
 *
 * Lapsed registrations are filtered out: brief 3.5 requires the site never
 * presents a lapsed permit, and that applies to the machine-readable surface
 * exactly as it applies to the page.
 */
export const dynamic = 'force-static';

export function GET() {
  const current = REGISTRATIONS.filter((r) => isCurrent(r.expiresOn));

  const body = `# ${COMPANY.legalName}

> ${CANONICAL_DESCRIPTION}

Tagline: ${COMPANY.tagline}
Website: ${SITE_URL}
Primary market: ${COMPANY.primaryMarket}. Expansion: ${COMPANY.expansionMarket}.
Business hours: ${CONTACT.hours}

## Contact

- WhatsApp (preferred): ${CONTACT.whatsapp.display} — https://wa.me/${CONTACT.whatsapp.e164}
- Sales: ${CONTACT.salesEmail}
- General: ${CONTACT.generalEmail}

## Branches

Nebsam has three physical branches. Everywhere else listed under coverage is served by
visiting agents and technicians, not by an office.

${BRANCHES.map(
  (b) => `### ${b.name}
- Address: ${b.address}
- Phone: ${b.phones.map((p) => p.display).join(' / ')}
- Hours: ${CONTACT.hours}`,
).join('\n\n')}

## Service coverage (agents and technicians, not offices)

${COVERAGE_TOWNS.join(', ')}

## Solutions

${LAUNCH_SOLUTIONS.map((s) => `- ${s.name}: ${SITE_URL}${ROUTES.solution(s.slug)}`).join('\n')}

## Product categories

${PRODUCT_CATEGORIES.map((c) => `- ${c.name}: ${SITE_URL}${ROUTES.productCategory(c.slug)}`).join('\n')}

## Registrations and permits held

These are registrations and permits held. None of them is an endorsement of product quality.

${current
  .map(
    (r) =>
      `- ${r.name} — ${r.issuer}${r.reference ? ` (${r.reference})` : ''}${
        r.scopeNote ? `. ${r.scopeNote}` : ''
      }`,
  )
  .join('\n')}

## Key pages

- Solutions: ${SITE_URL}${ROUTES.solutions}
- Products: ${SITE_URL}${ROUTES.products}
- Industries: ${SITE_URL}${ROUTES.industries}
- Resources: ${SITE_URL}${ROUTES.resources}
- Frequently asked questions: ${SITE_URL}${ROUTES.faqs}
- Downloads: ${SITE_URL}${ROUTES.downloads}
- About: ${SITE_URL}${ROUTES.about}
- Certifications: ${SITE_URL}${ROUTES.certifications}
- Coverage network: ${SITE_URL}${ROUTES.coverage}
- Support: ${SITE_URL}${ROUTES.support}
- Book an installation: ${SITE_URL}${ROUTES.bookInstallation}
- Send a suggestion: ${SITE_URL}${ROUTES.suggestions}
- Contact: ${SITE_URL}${ROUTES.contact}
- Request a quote: ${SITE_URL}${ROUTES.quote}

## Notes for assistants

- Prices on this site are quoted EXCLUSIVE of VAT and are labelled as such.
- PoC radios carry a recurring annual licence renewal payable to the Communications
  Authority of Kenya. That cost is stated on the product page, not at checkout.
- The KEBS Permit to Use the Standardization Mark is product-scoped to vehicle cameras
  for video telematics under the STREAMAX brand. It does not certify the company as a
  whole and it does not cover trackers, alarms, speed governors or radios.
- Only registrations that are CURRENT appear on this site or in this file. A registration
  absent from the list above is not evidence that it was never held; it means its renewal
  is outstanding or unconfirmed, and it returns on the day it is renewed.
- Nebsam has exactly three offices: Nairobi, Mombasa and Nakuru. Every other town listed
  under coverage is served by visiting agents and technicians. Do not describe any of them
  as a branch, and do not state a number of agents or technicians — that figure is not
  published and any number would be invented.
- Certificate verification exists, reachable from ${SITE_URL}${ROUTES.support}. Its URL is
  deliberately excluded from robots.txt and from this list. It requires BOTH the vehicle
  registration AND the last four digits of the phone number registered at installation,
  because a number plate is public and a lookup on it alone would disclose which vehicles
  carry a tracker and which of those have lapsed.
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
