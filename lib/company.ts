/**
 * THE single source of truth for company data.
 *
 * Brief PART 3 and 13.3. Never hard-code a phone number, address, email or the
 * company name in a component — NAP consistency drives local SEO and LLM entity
 * resolution, and drift is what makes a model distrust the source.
 *
 * This file is compiled in rather than stored in the database on purpose: it
 * must never be editable by accident, and it is needed at build time for schema,
 * the sitemap and llms.txt.
 *
 * NOT IN THIS FILE, DELIBERATELY: the unpublished phone number, the
 * administrative email, and the retired Nairobi and Mombasa addresses. They are
 * listed in brief PART 3.2 and quarantined in the SOURCE NOTES blocks in
 * content-source/. The build-time check in scripts/check-retired-strings.mjs
 * fails the build if any of them reaches rendered output.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://nebsamdigital.com';

export const COMPANY = {
  /** Plural "Solutions" site-wide — brief PART 1.5 #5. */
  legalName: 'Nebsam Digital Solutions (K) Ltd',
  tradingName: 'Nebsam Digital Solutions',
  shortName: 'Nebsam',
  tagline: 'We are the solution.',
  domain: 'nebsamdigital.com',
  primaryMarket: 'Kenya',
  expansionMarket: 'East Africa',
} as const;

/**
 * The canonical company description.
 *
 * Reused VERBATIM in the footer, the About page, llms.txt and Organization
 * schema. Identical wording everywhere strengthens entity resolution; drift
 * weakens it. Never reword it per page.
 *
 * ⚠️ REGISTER ITEM V28a — the ODPC registration sentence.
 * Both ODPC registrations expired 27 May 2026. The client confirmed on
 * 18 Aug 2026 that renewal is in hand and instructed that the sentence ships.
 * It lives here, in exactly one constant, so that if renewal slips the
 * correction is a one-line change rather than a rewrite across the footer,
 * About, llms.txt and every page's schema.
 *
 * If renewal has NOT landed: delete the second sentence. Nothing else changes.
 */
export const CANONICAL_DESCRIPTION =
  'Nebsam Digital Solutions (K) Ltd installs and supports vehicle tracking, fleet telematics, ' +
  'vehicle security, fuel monitoring, video telematics and radio communication systems across ' +
  'Kenya, from branches in Nairobi, Mombasa and Nakuru. The company is a registered Data ' +
  'Controller and Data Processor with the Office of the Data Protection Commissioner, and holds ' +
  'a KEBS Permit to Use the Standardization Mark for vehicle cameras for video telematics.';

/** Shorter form for meta descriptions, which cap around 155 characters. */
export const SHORT_DESCRIPTION =
  'Vehicle tracking, fleet telematics and vehicle security installed and supported across Kenya, ' +
  'from branches in Nairobi, Mombasa and Nakuru.';

export interface Branch {
  slug: string;
  name: string;
  address: string;
  town: string;
  county: string;
  /** E.164 for links, display form for humans. */
  phones: { display: string; e164: string }[];
  mapsUrl: string;
}

/**
 * The three physical offices. ONLY these three.
 *
 * Confirmed in brief PART 1.5 #6 and #7. Existing sales collateral contradicts
 * this and must never be used as an address source.
 */
export const BRANCHES: Branch[] = [
  {
    slug: 'nairobi',
    name: 'Nairobi',
    address: 'Kiambu Road, Ridgeways — next to Impact Motors',
    town: 'Nairobi',
    county: 'Nairobi',
    phones: [
      { display: '+254 140 999399', e164: '+254140999399' },
      { display: '+254 726 221122', e164: '+254726221122' },
    ],
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kiambu+Road+Ridgeways+Nairobi',
  },
  {
    slug: 'mombasa',
    name: 'Mombasa',
    address: 'Makupa Roundabout — next to Mass Petrol Station',
    town: 'Mombasa',
    county: 'Mombasa',
    phones: [
      { display: '+254 769 063333', e164: '+254769063333' },
      { display: '+254 711 895555', e164: '+254711895555' },
      { display: '+254 759 000111', e164: '+254759000111' },
    ],
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Makupa+Roundabout+Mombasa',
  },
  {
    slug: 'nakuru',
    name: 'Nakuru',
    address: 'Lower Bedi Road',
    town: 'Nakuru',
    county: 'Nakuru',
    phones: [{ display: '+254 725 221122', e164: '+254725221122' }],
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Lower+Bedi+Road+Nakuru',
  },
];

export const CONTACT = {
  /** All shop orders route here — brief PART 1.5 #12. No per-branch routing. */
  whatsapp: { display: '+254 759 000111', e164: '254759000111' },
  salesEmail: 'onlinesales@nebsamdigital.com',
  /**
   * V07 — ANSWERED 4 Sep 2026: live and monitored.
   *
   * This is the ONLY published address. V35 found `info@nebsam.com` and
   * `support@nebsam.com` live on the old site, on a domain Nebsam does not
   * appear to control and collecting nothing. Neither exists in this codebase
   * and neither is to be reintroduced; they disappear when Sprint 15 replaces
   * the CRA site.
   */
  generalEmail: 'info@nebsamdigital.com',
  hours: '24/7, Monday–Sunday',
  /** schema.org openingHours form */
  hoursSchema: 'Mo-Su 00:00-23:59',
} as const;

export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${CONTACT.whatsapp.e164}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/**
 * Agents and technicians — NOT branches.
 *
 * Brief 3.4: the UI must visually distinguish a branch from service coverage.
 * Never imply an office where there is none, and never state a count of agents
 * or technicians.
 */
export const COVERAGE_TOWNS = [
  'Kisii',
  'Kisumu',
  'Homa Bay',
  'Eldoret',
  'Malindi',
  'Kilifi',
  'Kericho',
  'Thika',
  'Isiolo',
  'Meru',
  'Marsabit',
  'Lodwar',
  'Busia',
  'Garissa',
  'Nanyuki',
  'Embu',
] as const;

/**
 * Social profiles for footer links and schema `sameAs`.
 *
 * V08 — ANSWERED 4 Sep 2026. Emitted as `sameAs` on the Organization schema,
 * which is how a search engine and an assistant tie this site to those
 * accounts as one entity. An absent sameAs is better than a wrong one, so the
 * array stays exactly these three until another is confirmed.
 */
export const SOCIAL_PROFILES: string[] = [
  'https://www.facebook.com/nebsam1',
  'https://www.instagram.com/nebsam_digital/',
  'https://www.tiktok.com/@nebsamdigitalkenya',
];

/**
 * V36 — ANSWERED 4 Sep 2026: founded 2010.
 *
 * Kept as a number rather than baked into a sentence so "over 10 years" and any
 * future "over 15 years" derive from one fact instead of drifting apart. The
 * approved copy stays "over 10 years", which remains true and is deliberately
 * conservative against the 2010 date.
 */
export const FOUNDED_YEAR = 2010;

/**
 * V11 — data protection contact, published in the privacy policy because
 * Nebsam is a registered data controller and processor under the DPA 2019.
 *
 * A named person and an email are given alongside the phone. A phone number on
 * its own is hard to action a formal data request against, and a subject access
 * request needs somewhere it can be sent in writing.
 */
export const DATA_PROTECTION_CONTACT = {
  name: 'Kelvin Oyugi',
  email: 'info@nebsamdigital.com',
  phone: { display: '+254 759 000111', e164: '254759000111' },
} as const;

/**
 * Registrations held. Described as permits/registrations HELD, never as an
 * endorsement of product quality and never with invented scope (brief 3.5).
 *
 * `expiresOn` drives both the admin reminder and public filtering, because
 * three of these have already lapsed (V27–V30). Nothing lapsed is displayed.
 */
export const REGISTRATIONS = [
  {
    name: 'Permit to Use the Standardization Mark',
    issuer: 'Kenya Bureau of Standards (KEBS)',
    reference: 'SM#84618',
    effectiveOn: '2025-02-26',
    expiresOn: '2027-02-26',
    /** The permit is PRODUCT-scoped, not company-scoped. Stated on the page. */
    scopeNote:
      'Covers vehicle cameras for video telematics under the STREAMAX brand. It is a permit to use the standardization mark, not a company-wide certification.',
  },
  {
    name: 'Data Controller registration',
    issuer: 'Office of the Data Protection Commissioner, Kenya',
    reference: null,
    effectiveOn: '2024-05-27',
    expiresOn: '2026-05-27',
    scopeNote: null,
  },
  {
    name: 'Data Processor registration',
    issuer: 'Office of the Data Protection Commissioner, Kenya',
    reference: null,
    effectiveOn: '2024-05-27',
    expiresOn: '2026-05-27',
    scopeNote: null,
  },
  {
    name: 'Private Security Provider registration',
    issuer:
      'Private Security Regulatory Authority, Ministry of Interior and National Administration',
    reference: 'PSRA/NDSKL/19/00',
    effectiveOn: '2024-06-28',
    /**
     * NULL, not '2029-06-28'.
     *
     * The certificate states a five-year term to 2029 but is expressly
     * "subject to annual license renewal", and that annual renewal is
     * unconfirmed (register V30). content-source/05-certifications/README.md
     * §4A is explicit: publish only once the annual renewal is confirmed.
     *
     * The 2029 date was being read as current, so `llms.txt` was publishing
     * this registration as live to every crawler and assistant that reads it.
     * A five-year term conditional on a yearly renewal is not evidence of a
     * current registration, and the safe reading of an unknown is "do not
     * publish" — the same rule 0004 applies in the database.
     */
    expiresOn: null,
    scopeNote: 'Five-year term, subject to annual licence renewal.',
  },
] as const;

/**
 * True when a registration may be displayed. Brief 3.5: never show a lapsed
 * permit.
 *
 * A null expiry means no confirmed expiry is on record, which is NOT evidence
 * that the instrument is current — so it fails closed. This mirrors
 * `public_certifications` in migration 0009, which requires
 * `expires_on is not null and expires_on > current_date`.
 */
export function isCurrent(expiresOn: string | null, now: Date = new Date()): boolean {
  if (!expiresOn) return false;
  return new Date(expiresOn).getTime() > now.getTime();
}
