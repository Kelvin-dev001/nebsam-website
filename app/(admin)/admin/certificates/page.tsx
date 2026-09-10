import { redirect } from 'next/navigation';
import Link from 'next/link';
import { requireStaff } from '@/lib/admin/actor';
import { serviceClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/admin/primitives';
import { CertificateImporter } from '@/components/admin/certificate-import';

/**
 * INSTALLATION CERTIFICATES.
 *
 * Not the company's regulatory instruments — those are `certifications` and
 * live at `/admin/certifications`. These are the per-vehicle installation
 * records the public verification endpoint looks up, and they are the most
 * sensitive rows on the project.
 *
 * ── There is no list on this screen, and that is the design ─────────────────
 *
 * An admin table of installation certificates would be a list of customers'
 * vehicles. `installation_certificates` stores no plaintext plate to list, and
 * migration 0008 is pointed about it: there is no SELECT policy on that table
 * for `authenticated` at all — "not for admin, not for anyone". Building a
 * browsable index here would route around a decision made deliberately in the
 * schema.
 *
 * What an administrator gets instead is a count, an import path, and the
 * restricted store's own separate existence. If a specific certificate needs
 * looking at, that is a support conversation with the customer, using the
 * public verification endpoint the way a customer would.
 */
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Installation certificates',
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminCertificatesPage() {
  const actor = await requireStaff('admin');
  if (!actor) redirect('/admin/login?reason=forbidden');

  const db = serviceClient();
  const today = new Date().toISOString().slice(0, 10);

  const [total, expired, restricted, attempts] = await Promise.all([
    db.from('installation_certificates').select('id', { head: true, count: 'exact' }),
    db
      .from('installation_certificates')
      .select('id', { head: true, count: 'exact' })
      .not('expires_on', 'is', null)
      .lt('expires_on', today),
    db.from('installation_plates_restricted').select('certificate_id', { head: true, count: 'exact' }),
    db.from('verification_attempts').select('id', { head: true, count: 'exact' }),
  ]);

  const stored = total.count ?? 0;
  const backed = restricted.count ?? 0;

  return (
    <>
      <PageHeader
        title="Installation certificates"
        lead="The records the public verification page looks up. No plate is stored in readable form, so there is nothing here to browse — only to count and to import."
      />

      <ul className="mt-8 flex flex-wrap gap-3">
        <li className="rounded-panel border border-border-hairline bg-surface px-4 py-3">
          <span className="block font-display text-h3 tabular-nums">{stored}</span>
          <span className="text-body-sm text-text-secondary">certificates stored</span>
        </li>
        <li className="rounded-panel border border-state-warn-ink/40 bg-surface px-4 py-3">
          <span className="block font-display text-h3 tabular-nums">{expired.count ?? 0}</span>
          <span className="text-body-sm text-text-secondary">past their expiry date</span>
        </li>
        <li className="rounded-panel border border-border-hairline bg-surface px-4 py-3">
          <span className="block font-display text-h3 tabular-nums">{attempts.count ?? 0}</span>
          <span className="text-body-sm text-text-secondary">lookups ever attempted</span>
        </li>
      </ul>

      {stored !== backed ? (
        <p
          role="alert"
          className="mt-6 max-w-prose rounded-panel border border-state-alert-ink/50 bg-surface p-4 text-body-sm"
        >
          <strong>
            {stored} certificate(s) exist but {backed} have a plaintext backup.
          </strong>{' '}
          The restricted store is the only thing that makes rotating{' '}
          <code className="font-mono text-mono">CERT_PLATE_HMAC_SECRET</code> recoverable — without
          it there is nothing left to re-hash from, and a rotation would permanently orphan every
          certificate missing one. Re-run the source file to repair it.
        </p>
      ) : null}

      <section className="mt-10 max-w-prose">
        <h2 className="font-display-tight text-h3">Before you import</h2>
        <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-body-sm text-text-secondary">
          <li>
            The file needs a <code className="font-mono">plate</code> column and a{' '}
            <code className="font-mono">phone</code> column. Optional:{' '}
            <code className="font-mono">certificate_number</code>,{' '}
            <code className="font-mono">installed_on</code>,{' '}
            <code className="font-mono">expires_on</code>. Dates may be written{' '}
            <code className="font-mono">2026-09-10</code> or{' '}
            <code className="font-mono">10/09/2026</code>; the second is read day first.
          </li>
          <li>
            <strong>The phone number is not optional.</strong> Its last four digits are the second
            factor. A certificate without one could be looked up by plate alone, and a plate is
            painted on the outside of the vehicle — a lookup that revealed validity from a plate
            would be a list of vehicles worth stealing.
          </li>
          <li>
            Only the <strong>last four characters</strong> of the certificate number are stored.
            Enough to disambiguate on a support call, useless for guessing others.
          </li>
          <li>
            No plate is stored in readable form in the lookup table. The plaintext goes to a
            separate, admin-only table that the lookup never touches, and exists only so a key
            rotation is recoverable.
          </li>
        </ul>

        {/*
          V04 is open and the page says so, rather than the assumption living
          only in a source comment. Whoever imports the first real file is the
          person who can confirm or correct the format.
        */}
        <p className="mt-4 rounded-panel border border-state-warn-ink/40 bg-surface p-4 text-body-sm">
          <strong>The format above is an assumption, not a confirmed specification.</strong> It is
          taken from the legacy specimen certificate — serial{' '}
          <code className="font-mono text-mono">P051510924U/2007</code>, one-year validity — and
          register item V04 is still open. If the real export looks different, say so before
          importing rather than reshaping the file to fit this.
        </p>
      </section>

      <CertificateImporter />

      <p className="mt-10 max-w-prose text-body-sm text-text-secondary">
        Company registrations — KEBS, CAK, ODPC, PSRA — are a different thing entirely and live at{' '}
        <Link
          href="/admin/certifications"
          className="text-brand-signal-ink underline decoration-1 underline-offset-4"
        >
          Certifications
        </Link>
        .
      </p>
    </>
  );
}
