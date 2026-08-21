import {
  BRANCHES,
  CANONICAL_DESCRIPTION,
  COMPANY,
  CONTACT,
  SITE_URL,
  SOCIAL_PROFILES,
} from '@/lib/company';

/**
 * JSON-LD builders. Brief PART 13.2.
 *
 * Two rules that outrank everything here:
 *  1. NEVER emit markup that contradicts the visible page.
 *  2. NEVER emit Review or AggregateRating — there are no genuine collected
 *     reviews, and the six real testimonials are not a review corpus.
 *
 * `Offer` is emitted ONLY where a real price is published. Most products have
 * no confirmed price and render "Request price"; emitting an Offer with a
 * placeholder number would be structured-data fraud.
 */

type Json = Record<string, unknown>;

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

export function organizationSchema(): Json {
  const org: Json = {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: COMPANY.legalName,
    alternateName: COMPANY.tradingName,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/logo512.png`,
    },
    description: CANONICAL_DESCRIPTION,
    areaServed: [
      { '@type': 'Country', name: 'Kenya' },
      { '@type': 'Place', name: 'East Africa' },
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        telephone: CONTACT.whatsapp.display,
        email: CONTACT.salesEmail,
        areaServed: 'KE',
        availableLanguage: ['en'],
      },
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: CONTACT.generalEmail,
        areaServed: 'KE',
        availableLanguage: ['en'],
      },
    ],
  };

  // sameAs is OMITTED while SOCIAL_PROFILES is empty (register V08).
  // A wrong or invented profile URL weakens entity resolution rather than
  // helping it, so the property is absent until the URLs are supplied.
  if (SOCIAL_PROFILES.length > 0) org.sameAs = SOCIAL_PROFILES;

  return org;
}

export function websiteSchema(): Json {
  return {
    '@type': 'WebSite',
    '@id': SITE_ID,
    url: SITE_URL,
    name: COMPANY.tradingName,
    description: CANONICAL_DESCRIPTION,
    inLanguage: 'en-KE',
    publisher: { '@id': ORG_ID },
  };
}

/** One LocalBusiness per physical office. Only the three real branches. */
export function localBusinessSchemas(): Json[] {
  return BRANCHES.map((branch) => ({
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/about/coverage#${branch.slug}`,
    name: `${COMPANY.tradingName} — ${branch.name}`,
    parentOrganization: { '@id': ORG_ID },
    url: `${SITE_URL}/about/coverage`,
    telephone: branch.phones[0].display,
    email: CONTACT.generalEmail,
    address: {
      '@type': 'PostalAddress',
      streetAddress: branch.address,
      addressLocality: branch.town,
      addressRegion: branch.county,
      addressCountry: 'KE',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '00:00',
        closes: '23:59',
      },
    ],
    hasMap: branch.mapsUrl,
  }));
}

export function breadcrumbSchema(trail: { name: string; path: string }[]): Json {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.path === '/' ? '' : crumb.path}`,
    })),
  };
}

export function serviceSchema(input: {
  name: string;
  description: string;
  path: string;
}): Json {
  return {
    '@type': 'Service',
    name: input.name,
    description: input.description,
    url: `${SITE_URL}${input.path}`,
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'Country', name: 'Kenya' },
  };
}

export function productSchema(input: {
  name: string;
  description: string;
  path: string;
  sku?: string;
  brand?: string;
  image?: string[];
  /** VAT-EXCLUSIVE, in KES. Omit entirely when no price is published. */
  priceKes?: number | null;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
}): Json {
  const product: Json = {
    '@type': 'Product',
    name: input.name,
    description: input.description,
    url: `${SITE_URL}${input.path}`,
    brand: { '@type': 'Brand', name: input.brand ?? COMPANY.tradingName },
  };
  if (input.sku) product.sku = input.sku;
  if (input.image?.length) product.image = input.image;

  // Offer ONLY where a real price exists. No price => no Offer, and the page
  // shows "Request price" instead of add-to-cart.
  if (typeof input.priceKes === 'number') {
    product.offers = {
      '@type': 'Offer',
      price: input.priceKes,
      priceCurrency: 'KES',
      availability: `https://schema.org/${input.availability ?? 'InStock'}`,
      url: `${SITE_URL}${input.path}`,
      seller: { '@id': ORG_ID },
      // The visible price carries "excl. VAT"; the schema must not contradict it.
      valueAddedTaxIncluded: false,
    };
  }
  return product;
}

export function faqSchema(items: { question: string; answer: string }[]): Json {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function articleSchema(input: {
  headline: string;
  description: string;
  path: string;
  authorName: string;
  datePublished: string;
  dateModified: string;
  image?: string;
}): Json {
  return {
    '@type': 'Article',
    headline: input.headline,
    description: input.description,
    url: `${SITE_URL}${input.path}`,
    author: { '@type': 'Person', name: input.authorName },
    publisher: { '@id': ORG_ID },
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    ...(input.image ? { image: input.image } : {}),
  };
}

/** Wraps one or more nodes into a single @graph document. */
export function jsonLdGraph(nodes: Json[]): string {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes });
}
