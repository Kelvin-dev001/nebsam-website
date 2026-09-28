import 'server-only';
import { serviceClient } from '@/lib/supabase/server';

/**
 * THE DASHBOARD QUERIES.
 *
 * `docs/CMS_ARCHITECTURE.md` §1.1 is unusually blunt about this screen: "it
 * earns its place or it goes". So it shows things requiring ACTION and nothing
 * else — no traffic chart, no row counts, no welcome message. Every number here
 * is a number somebody has to do something about, and each one links to the
 * place it is done.
 *
 * ── Why counts and not lists, mostly ────────────────────────────────────────
 *
 * Seven lists on one screen is a screen nobody reads. Seven counts with one
 * list — the oldest unanswered enquiries, because that is the one with a clock
 * on it — is a screen somebody scans in four seconds before opening the inbox.
 *
 * ── Why every query is counted, never fetched ───────────────────────────────
 *
 * `{ head: true, count: 'exact' }` asks Postgres for the count and transfers no
 * rows. It matters more here than elsewhere: several of these tables hold
 * customer PII, and a dashboard that pulls submission payloads into a page it
 * only needs a number from is PII in a render tree for no reason.
 */

export interface DashboardSignal {
  /** What the number means, in the words a staff member would use. */
  label: string;
  count: number;
  href: string;
  /** Shown when the count is zero — "nothing to do" should say so plainly. */
  clear: string;
  /**
   * Whether a non-zero count is merely work, or a problem.
   * `alert` is reserved for the two that are compliance or security failures.
   */
  tone: 'neutral' | 'warn' | 'alert';
  /** One line of why it matters, for anyone who has not read the brief. */
  note?: string;
}

export interface OldestEnquiry {
  id: string;
  type: string;
  created_at: string;
  is_anonymous: boolean;
}

export interface Dashboard {
  signals: DashboardSignal[];
  oldest: OldestEnquiry[];
}

export async function getDashboard(): Promise<Dashboard> {
  const db = serviceClient();
  const now = Date.now();
  const in90Days = new Date(now + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const in7Days = new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString();

  // Issued together rather than in sequence. Seven sequential round trips to a
  // hosted Postgres is most of a second of staring at a blank dashboard, and
  // none of these queries depends on another's result.
  const [unanswered, liveOrders, expiring, inReview, scheduled, uncleared, unchecked, oldest] =
    await Promise.all([
      db.from('submissions').select('id', { head: true, count: 'exact' }).eq('status', 'new'),
      db
        .from('orders')
        .select('id', { head: true, count: 'exact' })
        .in('status', ['new', 'contacted']),
      // Already-expired rows count too. An instrument that lapsed last month is
      // more urgent than one lapsing next month, and a window that started today
      // would silently drop it off the dashboard the day it became a problem.
      db
        .from('certifications')
        .select('id', { head: true, count: 'exact' })
        .not('expires_on', 'is', null)
        .lte('expires_on', in90Days),
      db.from('blog_posts').select('id', { head: true, count: 'exact' }).eq('status', 'in_review'),
      db
        .from('blog_posts')
        .select('id', { head: true, count: 'exact' })
        .eq('status', 'published')
        .gt('published_at', new Date(now).toISOString())
        .lte('published_at', in7Days),
      db
        .from('downloads')
        .select('id', { head: true, count: 'exact' })
        .eq('cleared_for_publication', false),
      db.from('media').select('id', { head: true, count: 'exact' }).eq('privacy_checked', false),
      db
        .from('submissions')
        .select('id, type, created_at, is_anonymous')
        .eq('status', 'new')
        .order('created_at', { ascending: true })
        .limit(5),
    ]);

  const signals: DashboardSignal[] = [
    {
      label: 'Enquiries awaiting a reply',
      count: unanswered.count ?? 0,
      href: '/admin/inbox',
      clear: 'Every enquiry has been picked up.',
      tone: 'warn',
      note: 'Oldest first. A lead that waits is a lead that goes elsewhere.',
    },
    {
      label: 'Orders not yet confirmed',
      count: liveOrders.count ?? 0,
      href: '/admin/orders',
      clear: 'No orders are waiting on a call.',
      tone: 'warn',
      note: 'New and contacted. An order exists before the WhatsApp chat opens, so a dropped chat is still here.',
    },
    {
      label: 'Registrations expired or expiring within 90 days',
      count: expiring.count ?? 0,
      // `/admin/certifications`, the COMPANY registrations (KEBS, CAK, ODPC, PSRA).
      href: '/admin/certifications',
      clear: 'No registration needs renewing in the next 90 days.',
      tone: 'alert',
      note: 'The public page cannot display a lapsed instrument, so a lapse shows up as a document quietly disappearing rather than as an error.',
    },
    {
      label: 'Content waiting for review',
      count: inReview.count ?? 0,
      href: '/admin/blog',
      clear: 'Nothing is waiting for a reviewer.',
      tone: 'neutral',
    },
    {
      label: 'Posts scheduled in the next 7 days',
      count: scheduled.count ?? 0,
      href: '/admin/blog',
      clear: 'Nothing is scheduled this week.',
      tone: 'neutral',
    },
    {
      label: 'Downloads uploaded but not cleared',
      count: uncleared.count ?? 0,
      href: '/admin/downloads',
      clear: 'Every uploaded file has been cleared or removed.',
      tone: 'warn',
      note: 'Uploading a file does not publish it. A human clears it, and the clearance is recorded against their name.',
    },
    {
      label: 'Media awaiting a privacy check',
      count: unchecked.count ?? 0,
      href: '/admin/media',
      clear: 'Every uploaded image has been checked.',
      tone: 'warn',
      note: 'Plates, faces, names, coordinates and device IDs. The upload moment is the only point where this reliably happens.',
    },
  ];

  return {
    signals,
    oldest: oldest.data ?? [],
  };
}
