import type { Metadata } from 'next';
import { COMPANY, SHORT_DESCRIPTION, SITE_URL } from '@/lib/company';

/**
 * Metadata builders. Every indexable page gets a unique title and description,
 * a self-referencing canonical, and real OG/Twitter images (brief PART 13.1).
 *
 * Limits are enforced in development rather than documented and forgotten:
 * titles truncate in the SERP past ~60 characters, descriptions past ~160.
 */

const TITLE_MAX = 60;
const DESCRIPTION_MIN = 110;
const DESCRIPTION_MAX = 155;

/**
 * Share image.
 *
 * ⚠️ The only asset available is 225x225 — verified, not assumed. The target is
 * 1200x630 (docs/ASSET_MAP.md shot list, register V45).
 *
 * The dimensions declared here are the ACTUAL ones. Declaring 1200x630 for a
 * 225x225 file would be metadata contradicting the asset, which is the same
 * class of error as schema contradicting the page.
 *
 * Because the image is below Twitter's 300x157 minimum for a large card, the
 * card type degrades to `summary` until a real one exists. Replace the file,
 * update these three values, and `twitterCard` flips back automatically.
 */
export const OG_IMAGE = {
  url: `${SITE_URL}/images/site-og-image.png`,
  width: 225,
  height: 225,
  alt: `${COMPANY.legalName} — vehicle tracking and fleet telematics in Kenya`,
};

/** A large card needs at least 300x157; below that Twitter falls back anyway. */
const twitterCard: 'summary' | 'summary_large_image' =
  OG_IMAGE.width >= 300 && OG_IMAGE.height >= 157 ? 'summary_large_image' : 'summary';

interface PageMetaInput {
  /** Without the brand suffix — the builder appends it. */
  title: string;
  description: string;
  /** Site-relative, e.g. "/solutions/fuel-monitoring". */
  path: string;
  /** Set for routes that must never be indexed. */
  noindex?: boolean;
  ogImage?: { url: string; width: number; height: number; alt: string };
}

function warnInDev(message: string) {
  if (process.env.NODE_ENV === 'development') {
    // Surfaced at build/dev time so a length problem is caught before it ships,
    // not months later in a crawl report.
    console.warn(`[seo] ${message}`);
  }
}

export function buildMetadata({
  title,
  description,
  path,
  noindex = false,
  ogImage = OG_IMAGE,
}: PageMetaInput): Metadata {
  const fullTitle = `${title} | ${COMPANY.shortName}`;
  const canonical = `${SITE_URL}${path === '/' ? '' : path}`;

  if (fullTitle.length > TITLE_MAX) {
    warnInDev(`title is ${fullTitle.length} chars (max ${TITLE_MAX}): "${fullTitle}"`);
  }
  if (description.length > DESCRIPTION_MAX || description.length < DESCRIPTION_MIN) {
    warnInDev(
      `description is ${description.length} chars (want ${DESCRIPTION_MIN}–${DESCRIPTION_MAX}) on ${path}`,
    );
  }

  return {
    // `absolute`, not a bare string: the root layout declares
    // `title.template = '%s | Nebsam'`, and Next.js applies a parent template to
    // any child that sets `title` as a plain string. Since fullTitle already
    // carries the suffix, a bare string rendered as "… | Nebsam | Nebsam" on
    // every page built through this helper.
    title: { absolute: fullTitle },
    description,
    alternates: { canonical },
    robots: noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: 'website',
      siteName: COMPANY.tradingName,
      title: fullTitle,
      description,
      url: canonical,
      locale: 'en_KE',
      images: [ogImage],
    },
    twitter: {
      card: twitterCard,
      title: fullTitle,
      description,
      images: [ogImage.url],
    },
  };
}

/** Root metadata. Individual routes override title/description/canonical. */
export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `Vehicle Tracking & Fleet Telematics in Kenya | ${COMPANY.shortName}`,
    template: `%s | ${COMPANY.shortName}`,
  },
  description: SHORT_DESCRIPTION,
  applicationName: COMPANY.tradingName,
  formatDetection: { telephone: false },
  icons: { icon: '/favicon.ico', apple: '/logo192.png' },
  // Sensible defaults so a route that forgets buildMetadata still ships a
  // canonical and a real share image rather than nothing.
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: 'website',
    siteName: COMPANY.tradingName,
    url: SITE_URL,
    locale: 'en_KE',
    images: [OG_IMAGE],
  },
  twitter: { card: twitterCard, images: [OG_IMAGE.url] },
};
