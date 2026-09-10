import type { UserRole } from '@/types/content';

/**
 * ADMIN NAVIGATION — the information architecture of `docs/CMS_ARCHITECTURE.md`
 * §1, restricted to what actually exists.
 *
 * ── One rule, learned from the public site ──────────────────────────────────
 *
 * Sprint 11 found eight routes linked from the primary navigation that were all
 * 404s, and six more are still linked from the footer today. A nav entry is a
 * promise the route exists. So this list holds only built routes; the dashboard
 * states what is not built yet in prose, where an unmet expectation costs
 * nothing.
 *
 * ── `minRole` is presentation, not permission ───────────────────────────────
 *
 * Hiding a link is a courtesy to a salesperson who has no business in the
 * certificate importer. It is NOT the boundary — `docs/CMS_ARCHITECTURE.md` §2:
 * "a hidden button is not a permission". Every page calls `requireStaff()` with
 * its own minimum and every policy in migration 0008 enforces the same ranks at
 * the database. This file exists so the three agree; if they ever disagree, the
 * page and the policy win and this is the file with the bug.
 */

export interface AdminNavItem {
  label: string;
  href: string;
  /** The lowest role that may open it. Mirrors the page's own requireStaff call. */
  minRole: UserRole;
  /** One line, shown on the dashboard rather than in the nav. */
  detail: string;
}

export interface AdminNavGroup {
  heading: string;
  items: AdminNavItem[];
}

export const ADMIN_NAV: AdminNavGroup[] = [
  {
    heading: 'Today',
    items: [
      {
        label: 'Dashboard',
        href: '/admin',
        minRole: 'viewer',
        detail: 'What needs attention today, and nothing else',
      },
    ],
  },
  {
    heading: 'Enquiries',
    items: [
      {
        label: 'Inbox',
        href: '/admin/inbox',
        minRole: 'sales',
        detail: 'Contact, quote, installation and suggestion submissions',
      },
      {
        label: 'Orders',
        href: '/admin/orders',
        minRole: 'sales',
        detail: 'The status pipeline, internal notes and export',
      },
    ],
  },
  {
    heading: 'Content',
    items: [
      {
        label: 'Products',
        href: '/admin/products',
        minRole: 'editor',
        detail: 'Specifications, prices, availability — one record, two views',
      },
      {
        label: 'Blog',
        href: '/admin/blog',
        minRole: 'editor',
        detail: 'Posts, revisions, scheduling',
      },
      {
        label: 'Downloads',
        href: '/admin/downloads',
        minRole: 'editor',
        detail: 'Files, and the human clearance that publishes one',
      },
      {
        label: 'Media',
        href: '/admin/media',
        minRole: 'editor',
        detail: 'Uploads, alt text, the privacy check',
      },
    ],
  },
  {
    heading: 'Operations',
    items: [
      {
        label: 'Certificates',
        href: '/admin/certificates',
        minRole: 'admin',
        detail: 'Installation certificate import — plates hashed, never stored',
      },
      {
        label: 'Security',
        href: '/admin/security',
        minRole: 'admin',
        detail: 'Verification attempts, and the spike that means enumeration',
      },
      {
        label: 'Audit log',
        href: '/admin/audit',
        minRole: 'admin',
        detail: 'Append-only. Every admin create, update and delete',
      },
    ],
  },
];

/** Rank order. Higher outranks lower. Mirrors is_staff() in migration 0001. */
const RANK: Record<UserRole, number> = { viewer: 1, sales: 2, editor: 3, admin: 4 };

export function outranks(role: UserRole, minRole: UserRole): boolean {
  return RANK[role] >= RANK[minRole];
}

/** The nav as one role sees it. Groups with nothing visible are dropped entirely. */
export function navForRole(role: UserRole): AdminNavGroup[] {
  return ADMIN_NAV.map((group) => ({
    heading: group.heading,
    items: group.items.filter((item) => outranks(role, item.minRole)),
  })).filter((group) => group.items.length > 0);
}

/**
 * What this role can see but cannot open, so the dashboard can say so plainly.
 *
 * A staff member who cannot find the inbox does not conclude "I lack the sales
 * role", they conclude the software is broken and ask a developer. Naming the
 * boundary costs one line and prevents that call.
 */
export function hiddenForRole(role: UserRole): AdminNavItem[] {
  return ADMIN_NAV.flatMap((group) => group.items).filter(
    (item) => !outranks(role, item.minRole),
  );
}
