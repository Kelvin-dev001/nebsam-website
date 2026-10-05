import { LINKED_SOLUTIONS, ROUTES } from '@/lib/constants';

/**
 * Navigation, derived from the route table rather than hand-listed, so a
 * renamed route cannot leave a stale nav entry behind.
 *
 * The two deferred solutions are absent because they are absent from
 * LINKED_SOLUTIONS — reserved slugs are not navigable and not in the sitemap.
 *
 * ── Sprint 13 removed four groups of links to routes that do not exist ──────
 *
 * Register item V95. Deriving the nav from the route table stops a RENAMED
 * route leaving a stale entry; it does nothing about an entry for a route that
 * was never built, and four of those had accumulated:
 *
 *   /platform                    never built — blocked on V13, cleared screenshots
 *   /about/team                  never built
 *   /about/partners              never built
 *   /products/category/<5 slugs> never built — the products index groups by
 *                                FAMILY and there is no category route at all
 *
 * `/platform` was in the server-rendered header, so a crawler followed it into
 * a 404 from every page. The other seven were only in the mobile drawer, which
 * renders on open and so never reached a crawler — a dead end for a person on a
 * phone that no audit would have caught.
 *
 * They are removed rather than pointed somewhere plausible. A nav entry is a
 * promise the route exists, and `/platform` reappears the day V13 clears the
 * screenshots it needs.
 */
export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

export const PRIMARY_NAV: NavItem[] = [
  {
    label: 'Solutions',
    href: ROUTES.solutions,
    children: LINKED_SOLUTIONS.map((s) => ({
      label: s.name,
      href: ROUTES.solution(s.slug),
    })),
  },
  // No children: there is no category route, and the products index groups by
  // family. Linking five category URLs that 404 is worse than one that works.
  { label: 'Products', href: ROUTES.products },
  { label: 'Industries', href: ROUTES.industries },
  {
    label: 'Resources',
    href: ROUTES.resources,
    children: [
      { label: 'Blog', href: ROUTES.blog },
      { label: 'Downloads', href: ROUTES.downloads },
      { label: 'FAQs', href: ROUTES.faqs },
    ],
  },
  {
    label: 'About',
    href: ROUTES.about,
    children: [
      { label: 'Certifications', href: ROUTES.certifications },
      { label: 'Coverage', href: ROUTES.coverage },
    ],
  },
];

export const FOOTER_SUPPORT = [
  { label: 'Support', href: ROUTES.support },
  { label: 'Book installation', href: ROUTES.bookInstallation },
  { label: 'Suggestions', href: ROUTES.suggestions },
  { label: 'Request a quote', href: ROUTES.quote },
  { label: 'Contact', href: ROUTES.contact },
];

export const FOOTER_LEGAL = [
  { label: 'Privacy policy', href: ROUTES.privacy },
  { label: 'Terms', href: ROUTES.terms },
  { label: 'Cookie notice', href: ROUTES.cookies },
];
