import { redirect } from 'next/navigation';
import Link from 'next/link';
import { requireStaff } from '@/lib/admin/actor';
import { getDashboard, SPIKE_THRESHOLD_PER_HOUR } from '@/lib/admin/dashboard';
import { hiddenForRole } from '@/lib/admin/nav';
import { Badge } from '@/components/ui/badge';
import { isDatabaseConfigured } from '@/lib/content';

/**
 * ADMIN DASHBOARD — what needs attention today, and nothing else.
 *
 * Sprint 3 shipped a placeholder here listing which sprint would build each
 * section. Sprint 12 builds them, so the placeholder goes.
 *
 * `docs/CMS_ARCHITECTURE.md` §1.1: this screen earns its place or it goes.
 * Everything on it is a number somebody has to act on, and every number links
 * to the place the acting happens. There is no traffic chart and no row count,
 * because neither tells a staff member to do anything.
 */
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Dashboard',
  robots: { index: false, follow: false, nocache: true },
};

const TYPE_LABEL: Record<string, string> = {
  contact: 'Contact',
  quote: 'Quote',
  installation: 'Installation booking',
  suggestion: 'Suggestion',
  demo: 'Demo request',
};

/** Whole days, floored. "0 days" for something that arrived this morning is correct. */
function daysWaiting(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
}

export default async function AdminDashboard() {
  /**
   * Authorisation, not just authentication. The middleware only proves
   * somebody is signed in; the service role used below bypasses RLS, so
   * this is the check that decides whether they may be here at all.
   */
  const actor = await requireStaff('viewer');
  if (!actor) redirect('/admin/login?reason=forbidden');

  if (!isDatabaseConfigured()) {
    return (
      <>
        <h1 className="font-display text-h1 md:text-md-h1">Admin</h1>
        <div className="mt-6 max-w-prose rounded-panel border border-state-warn-ink/30 bg-surface p-5">
          <h2 className="font-display-tight text-h3">Supabase is not connected</h2>
          <p className="mt-2 text-body text-text-secondary">
            The schema exists as reviewed migrations in{' '}
            <code className="font-mono text-mono">supabase/migrations/</code>, but this deployment
            has no credentials for it. Nothing on this screen can be counted until it does.
          </p>
        </div>
      </>
    );
  }

  const { signals, oldest, verificationSpike } = await getDashboard();
  const outstanding = signals.filter((signal) => signal.count > 0);
  const hidden = hiddenForRole(actor.role);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-h1 md:text-md-h1">Dashboard</h1>
        <Badge tone="neutral">{actor.role}</Badge>
      </div>

      {/*
        The security signal goes ABOVE everything, and only exists when it is
        true. SECURITY_REQUIREMENTS §1.5 — an enumeration attack looks like
        traffic; you only see it if you are counting. A permanently-present
        "attacks: 0" panel is a panel people stop reading.
      */}
      {verificationSpike ? (
        <div
          role="alert"
          className="mt-6 rounded-panel border-2 border-state-alert-ink bg-surface p-5"
        >
          <h2 className="font-display-tight text-h3 text-state-alert-ink">
            Certificate verification is being hit hard
          </h2>
          <p className="mt-2 max-w-prose text-body">
            <strong>{verificationSpike.attempts} attempts</strong> in {verificationSpike.window},
            against a normal band of well under {SPIKE_THRESHOLD_PER_HOUR}.{' '}
            {verificationSpike.refused > 0 ? (
              <>
                <strong>{verificationSpike.refused}</strong> were refused by the rate limiter.
              </>
            ) : (
              <>None was refused by the rate limiter, which means the load is spread across many
              addresses.</>
            )}
          </p>
          <p className="mt-2 max-w-prose text-body-sm text-text-secondary">
            A plate is public information, so someone working through a list of them learns which
            vehicles carry a tracking installation. Look at the attempt log before assuming this is
            ordinary traffic.
          </p>
          <Link
            href="/admin/security"
            className="mt-4 inline-flex min-h-11 items-center rounded-control bg-brand-signal-ink px-5 text-white"
          >
            Open the attempt log
          </Link>
        </div>
      ) : null}

      {outstanding.length === 0 ? (
        <p className="mt-8 max-w-prose text-body text-text-secondary">
          Nothing is waiting. Every enquiry has a reply, every order has been picked up, no
          registration lapses in the next 90 days, and nothing is sitting unpublished or unchecked.
        </p>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {outstanding.map((signal) => (
            <li key={signal.label}>
              <Link
                href={signal.href}
                className={[
                  'flex h-full flex-col rounded-panel border bg-surface p-5',
                  'transition-colors duration-micro ease-in-out-quad hover:bg-surface-raised',
                  signal.tone === 'alert'
                    ? 'border-state-alert-ink/50'
                    : signal.tone === 'warn'
                      ? 'border-state-warn-ink/40'
                      : 'border-border-hairline',
                ].join(' ')}
              >
                {/*
                  The number is large, but the LABEL is what is read aloud
                  first — a screen reader announcing "14" before saying what
                  fourteen of is a screen reader announcing nothing. Source
                  order puts the label first and CSS puts the number on top.
                */}
                <span className="order-2 text-body font-medium">{signal.label}</span>
                <span className="order-1 font-display text-h2 tabular-nums">{signal.count}</span>
                {signal.note ? (
                  <span className="order-3 mt-2 text-body-sm text-text-secondary">
                    {signal.note}
                  </span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {oldest.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-display-tight text-h3">Waiting longest</h2>
          <p className="mt-1 text-body-sm text-text-secondary">
            The five oldest enquiries nobody has picked up.
          </p>
          <ul className="mt-4 border-t border-border-hairline">
            {oldest.map((row) => {
              const days = daysWaiting(row.created_at);
              return (
                <li key={row.id} className="border-b border-border-hairline">
                  <Link
                    href={`/admin/inbox/${row.id}`}
                    className="flex min-h-11 flex-wrap items-center justify-between gap-3 py-3"
                  >
                    <span className="text-body">
                      {TYPE_LABEL[row.type] ?? row.type}
                      {/*
                        The anonymous flag is surfaced here, not buried in the
                        detail view. An anonymous suggestion carries no contact
                        details BY DESIGN, and a salesperson who opens it
                        expecting a phone number concludes the record is broken.
                      */}
                      {row.is_anonymous ? (
                        <span className="ml-2 font-mono text-mono uppercase tracking-[0.06em] text-text-secondary">
                          anonymous
                        </span>
                      ) : null}
                    </span>
                    <span className="font-mono text-mono text-text-secondary">
                      {days === 0 ? 'today' : days === 1 ? '1 day' : `${days} days`}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {hidden.length > 0 ? (
        <section className="mt-12 max-w-prose">
          <h2 className="font-mono text-label uppercase tracking-[0.08em] text-text-secondary">
            Not available to your role
          </h2>
          {/*
            Named rather than silently absent. A staff member who cannot find
            the inbox does not conclude "I lack the sales role", they conclude
            the software is broken and ring a developer.
          */}
          <p className="mt-2 text-body-sm text-text-secondary">
            Your account is <strong>{actor.role}</strong>. These sections exist but need a higher
            role: {hidden.map((item) => item.label).join(', ')}. Permissions are enforced in the
            database, so raising your role is an administrator&rsquo;s job rather than a setting in
            this interface.
          </p>
        </section>
      ) : null}
    </>
  );
}
