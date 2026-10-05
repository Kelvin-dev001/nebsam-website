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
 * Share image (V45, closed in Sprint 12p).
 *
 * The site default is the Home hero photograph cut to exactly 1200x630 with the
 * logo plaque, made by scripts/images/prepare-photos.py into public/og/ so the
 * URL is stable for crawlers. Articles pass their own (lib/media/articles.ts).
 * The dimensions declared are the file's real ones: declaring a size the file
 * does not have is metadata contradicting the asset.
 */
export const OG_IMAGE = {
  url: `${SITE_URL}/og/site.jpg`,
  width: 1200,
  height: 630,
  alt: `${COMPANY.legalName} — vehicle tracking and fleet telematics in Kenya`,
};

/** A large card needs at least 300x157; below that Twitter falls back anyway. */
function twitterCardFor(image: {
  width: number;
  height: number;
}): 'summary' | 'summary_large_image' {
  return image.width >= 300 && image.height >= 157 ? 'summary_large_image' : 'summary';
}

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
  /**
   * Do not append the brand twice.
   *
   * A title that already ends in "| Nebsam" gets used as-is. This is not
   * hypothetical tidiness: it happened here the moment a `seo_title` was seeded
   * from the database carrying the suffix, and it will happen again the moment
   * a staff member types one into the Sprint 11 SEO panel — which is exactly
   * the audience least likely to know the suffix is added automatically.
   *
   * The template-doubling bug this file already fixes (see `title: absolute`
   * below) had the same shape and shipped on every page. Guarding the input is
   * cheaper than finding it in a crawl report.
   */
  const suffix = ` | ${COMPANY.shortName}`;
  const fullTitle = title.trimEnd().toLowerCase().endsWith(suffix.trim().toLowerCase())
    ? title.trimEnd()
    : `${title}${suffix}`;
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
      card: twitterCardFor(ogImage),
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
  twitter: { card: twitterCardFor(OG_IMAGE), images: [OG_IMAGE.url] },
};
