import 'server-only';

/**
 * TRANSACTIONAL EMAIL — the single interface brief PART 7.1 asks for (Sprint 15).
 *
 * One job today: tell staff that something arrived. Without it, a new enquiry or
 * order reaches the business only if someone happens to open the admin, and an
 * enquiry nobody sees is, to the customer, the same as one the site lost.
 *
 * ── No personal data in the email, on purpose ──────────────────────────────
 * The message says WHAT arrived and WHERE to read it: the kind, the reference
 * and the admin link. Never the name, phone, email or message. Those stay in the
 * database, behind the admin login and RLS, so an inbox that is forwarded,
 * shared or breached leaks no customer data. Nebsam is a registered data
 * controller (Data Protection Act 2019), and the provider never becomes a
 * processor of anyone's details.
 *
 * ── Inert until configured ──────────────────────────────────────────────────
 * With no EMAIL_PROVIDER_API_KEY nothing is sent and nothing fails: the
 * enquiry is stored either way. The provider is Resend, over its HTTP API, so
 * there is no SDK dependency. EMAIL_FROM must be on a domain verified with the
 * provider.
 *
 * ── Never in the way ────────────────────────────────────────────────────────
 * Callers run this inside `after()`, once the response has gone, and it never
 * throws. A slow or failing provider can neither delay a form nor turn a stored
 * enquiry into an error. A failure is logged with its HTTP status only.
 */

const RESEND_URL = 'https://api.resend.com/emails';

export type StaffInbox = 'sales' | 'info';

export async function notifyStaff(
  inbox: StaffInbox,
  subject: string,
  text: string,
): Promise<boolean> {
  const key = process.env.EMAIL_PROVIDER_API_KEY;
  const from = process.env.EMAIL_FROM;
  const to = inbox === 'sales' ? process.env.EMAIL_SALES_INBOX : process.env.EMAIL_INFO_INBOX;
  if (!key || !from || !to) return false;

  try {
    const res = await fetch(RESEND_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to], subject, text }),
      signal: AbortSignal.timeout(8000),
      cache: 'no-store',
    });
    if (!res.ok) console.error(`[email] staff notification refused: HTTP ${res.status}`);
    return res.ok;
  } catch {
    console.error('[email] staff notification failed: provider unreachable');
    return false;
  }
}
