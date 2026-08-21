import { LAUNCH_SOLUTIONS, PRODUCT_CATEGORIES, ROUTES } from '@/lib/constants';

/**
 * Navigation, derived from the route table rather than hand-listed, so a
 * renamed route cannot leave a stale nav entry behind.
 *
 * The two deferred solutions are absent because they are absent from
 * LAUNCH_SOLUTIONS — reserved slugs are not navigable and not in the sitemap.
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
    children: LAUNCH_SOLUTIONS.map((s) => ({
      label: s.name,
      href: ROUTES.solution(s.slug),
    })),
  },
  {
    label: 'Products',
    href: ROUTES.products,
    children: PRODUCT_CATEGORIES.map((c) => ({
      label: c.name,
      href: ROUTES.productCategory(c.slug),
    })),
  },
  { label: 'Industries', href: ROUTES.industries },
  { label: 'Platform', href: ROUTES.platform },
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
      { label: 'Team', href: ROUTES.team },
      { label: 'Partners', href: ROUTES.partners },
    ],
  },
];

export const FOOTER_SUPPORT = [
  { label: 'Support', href: ROUTES.support },
  { label: 'Verify installation', href: ROUTES.verifyInstallation },
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
