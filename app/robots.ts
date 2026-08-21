import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/company';

/**
 * Generated robots.txt. The existing one was permissive and correct; this
 * reproduces that and adds the routes that must never be indexed.
 *
 * Disallow is not a security control — /admin is protected by middleware and
 * RLS (brief PART 16). This only keeps it out of the index.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/', '/cart', '/orders/', '/support/verify-installation', '/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
