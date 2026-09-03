import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/company';
import { ROUTES } from '@/lib/constants';
import { getProducts, getSolutions } from '@/lib/content';

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
 *  - any solution that is not PUBLISHED. Solutions are read from the published
 *    view rather than from the static LAUNCH_SOLUTIONS list, because the static
 *    list contains all ten and one of them is a draft. Mapping it listed
 *    /solutions/school-bus-management in the sitemap while the route returned
 *    404 — the exact self-authored crawl error this comment warns about, and it
 *    also advertised the existence of an unpublished page about children's
 *    data. Reading the view cannot make that mistake: school bus appears the
 *    day it is published and not before.
 *
 * Product and blog entries arrive with the content layer in Sprint 3+; the
 * category and index routes are listed now because they are real routes.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  /**
   * ONLY ROUTES THAT EXIST TODAY.
   *
   * This list previously named every route the site will eventually have, and
   * 19 of them returned 404 — industries, platform, resources, about, support,
   * contact and legal are all built by later sprints. A sitemap is a set of
   * assertions that these URLs are real and worth crawling, so listing an
   * unbuilt page is not optimism, it is 19 crawl errors we authored ourselves.
   * Production is still pinned to `main`, so nothing has crawled it yet; this
   * had to be fixed well before Sprint 15 regardless.
   *
   * ADD A ROUTE HERE IN THE SPRINT THAT BUILDS IT — the entry is part of
   * shipping the page, not a separate task. Pending, with the sprint that owns
   * each: industries (8) · platform (8, blocked on V13) · resources, blog,
   * downloads, faqs (9) · about, certifications, coverage, team, partners (11)
   * · support, book-installation, suggestions (11) · contact, quote (8) ·
   * privacy, terms, cookies (11).
   */
  const staticRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { path: ROUTES.home, priority: 1.0, changeFrequency: 'weekly' },
    { path: ROUTES.solutions, priority: 0.9, changeFrequency: 'monthly' },
    { path: ROUTES.products, priority: 0.9, changeFrequency: 'weekly' },
  ];

  const { data: solutions } = await getSolutions();
  const solutionRoutes = solutions.flatMap((s) =>
    s.slug
      ? [{ path: ROUTES.solution(s.slug), priority: 0.9, changeFrequency: 'monthly' as const }]
      : [],
  );

  /**
   * PUBLISHED PRODUCTS, read from the view for the same reason solutions are:
   * four products are held as drafts pending open audit items A01-A07, and a
   * static list would have to remember that.
   */
  const { data: products } = await getProducts();
  const productRoutes = products.flatMap((p) =>
    p.slug
      ? [{ path: ROUTES.product(p.slug), priority: 0.8, changeFrequency: 'weekly' as const }]
      : [],
  );

  /**
   * CATEGORY ROUTES ARE NOT LISTED. They were added here in Sprint 2 in
   * anticipation of pages that do not exist yet — /products/category/* returns
   * 404 for all five, so the sitemap was advertising five crawl errors of its
   * own making. That is the same mistake the school bus solution caused in
   * Sprint 5, and the same rule applies: a sitemap entry pointing at a 404 is a
   * crawl error we would be authoring ourselves. Restore them in Sprint 7, when
   * the routes exist.
   */

  return [...staticRoutes, ...solutionRoutes, ...productRoutes].map((route) => ({
    url: `${SITE_URL}${route.path === '/' ? '' : route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
