import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/company';
import { LAUNCH_SOLUTIONS, PRODUCT_CATEGORIES, ROUTES } from '@/lib/constants';

/**
 * Generated sitemap. The old site's was hand-maintained and was proven
 * incomplete in Sprint 0 — it omitted a live route with its own canonical and
 * schema. Generating it from the route table removes that failure mode.
 *
 * EXCLUDED, deliberately:
 *  - /admin/*, /cart, /orders/[n], /support/verify-installation — noindex
 *  - the two DEFERRED solution slugs. A reserved slug that 404s is honest; a
 *    sitemap entry pointing at a 404 is a crawl error we would be authoring
 *    ourselves.
 *
 * Product and blog entries arrive with the content layer in Sprint 3+; the
 * category and index routes are listed now because they are real routes.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { path: ROUTES.home, priority: 1.0, changeFrequency: 'weekly' },
    { path: ROUTES.solutions, priority: 0.9, changeFrequency: 'monthly' },
    { path: ROUTES.products, priority: 0.9, changeFrequency: 'weekly' },
    { path: ROUTES.industries, priority: 0.7, changeFrequency: 'monthly' },
    { path: ROUTES.platform, priority: 0.7, changeFrequency: 'monthly' },
    { path: ROUTES.resources, priority: 0.6, changeFrequency: 'weekly' },
    { path: ROUTES.blog, priority: 0.7, changeFrequency: 'weekly' },
    { path: ROUTES.downloads, priority: 0.6, changeFrequency: 'monthly' },
    { path: ROUTES.faqs, priority: 0.6, changeFrequency: 'monthly' },
    { path: ROUTES.about, priority: 0.7, changeFrequency: 'monthly' },
    { path: ROUTES.certifications, priority: 0.7, changeFrequency: 'monthly' },
    { path: ROUTES.coverage, priority: 0.7, changeFrequency: 'monthly' },
    { path: ROUTES.team, priority: 0.5, changeFrequency: 'monthly' },
    { path: ROUTES.partners, priority: 0.5, changeFrequency: 'monthly' },
    { path: ROUTES.support, priority: 0.6, changeFrequency: 'monthly' },
    { path: ROUTES.bookInstallation, priority: 0.6, changeFrequency: 'monthly' },
    { path: ROUTES.suggestions, priority: 0.4, changeFrequency: 'yearly' },
    { path: ROUTES.contact, priority: 0.8, changeFrequency: 'monthly' },
    { path: ROUTES.quote, priority: 0.8, changeFrequency: 'monthly' },
    { path: ROUTES.privacy, priority: 0.3, changeFrequency: 'yearly' },
    { path: ROUTES.terms, priority: 0.3, changeFrequency: 'yearly' },
    { path: ROUTES.cookies, priority: 0.3, changeFrequency: 'yearly' },
  ];

  const solutionRoutes = LAUNCH_SOLUTIONS.map((s) => ({
    path: ROUTES.solution(s.slug),
    priority: 0.9,
    changeFrequency: 'monthly' as const,
  }));

  const categoryRoutes = PRODUCT_CATEGORIES.map((c) => ({
    path: ROUTES.productCategory(c.slug),
    priority: 0.7,
    changeFrequency: 'weekly' as const,
  }));

  return [...staticRoutes, ...solutionRoutes, ...categoryRoutes].map((route) => ({
    url: `${SITE_URL}${route.path === '/' ? '' : route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
