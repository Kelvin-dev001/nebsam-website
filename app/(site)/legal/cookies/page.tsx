import Link from 'next/link';
import { buildMetadata } from '@/lib/seo/metadata';
import { ROUTES, CONSENT_COOKIE, CONSENT_VERSION } from '@/lib/constants';
import { DATA_PROTECTION_CONTACT } from '@/lib/company';
import { LegalPage, LegalSectionBlock, LegalTable } from '@/components/legal/legal-page';

/**
 * COOKIE NOTICE.
 *
 * ── The only one of the three legal pages written entirely from fact ────────
 *
 * Every cookie listed here was read out of the code, not drafted from a
 * template: `nebsam_consent` in `lib/analytics.ts`, the Supabase auth cookie in
 * `lib/admin/session.ts`, and the two third parties in `next.config.mjs`'s
 * content security policy. There is no `[[NEEDS_VERIFICATION]]` token on this
 * page and there should never need to be one — if a cookie is added, this table
 * is part of adding it.
 *
 * ── What is deliberately NOT claimed ────────────────────────────────────────
 *
 * No "we use cookies to improve your experience". The page says which cookie,
 * set by what, for how long, and what happens if it is refused. A cookie notice
 * that describes its purpose in marketing language is one nobody can check.
 *
 * The durations are the real `max-age` values from `lib/analytics.ts`: 365 days
 * for a granted consent, 180 for a denied one. The asymmetry is deliberate in
 * the code — a refusal is re-asked sooner than an acceptance is — and it is
 * stated here rather than hidden, because a reader who declines is entitled to
 * know they will be asked again in six months.
 */
export const revalidate = 3600;

export const metadata = buildMetadata({
  title: 'Cookie notice — Nebsam Digital Solutions',
  description:
    'Every cookie this website sets, what it does, how long it lasts and how to refuse it. Analytics do not run until you accept them.',
  path: ROUTES.cookies,
});

const GRANTED_DAYS = 365;
const DENIED_DAYS = 180;

export default function CookieNoticePage() {
  return (
    <LegalPage
      title="Cookie notice"
      lead="Which cookies this website sets, what each one does, and how long it lasts. Nothing that tracks you runs before you say yes."
      path={ROUTES.cookies}
      reviewedOn="2026-09-11"
      scope={
        <>
          <p>
            This notice covers <strong>cookies and similar storage on this website</strong>,{' '}
            <code className="font-mono text-mono">nebsamdigital.com</code>.
          </p>
          <p>
            It does not cover the vehicle tracking platform you sign in to as a customer, which is a
            separate system with its own login. It does not cover WhatsApp, which has its own
            policies — see <Link href={ROUTES.privacy} className="underline underline-offset-4">our privacy notice</Link>.
          </p>
        </>
      }
    >
      <LegalSectionBlock id="what-is-a-cookie" heading="What a cookie is here">
        <p>
          A cookie is a small piece of text a website asks your browser to keep and send back on
          later visits. Some are needed for a site to work at all. Others exist to count visitors or
          follow them between sites.
        </p>
        <p>
          This site sets <strong>one cookie before you choose anything</strong>, and it is the one
          that records your choice.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="cookies-we-set" heading="Cookies this site sets">
        <p>These are set by nebsamdigital.com itself.</p>

        <LegalTable
          caption="First-party cookies set by this website"
          columns={['Name', 'What it does', 'How long', 'Can you refuse it?']}
          rows={[
            [
              <code key="n" className="font-mono text-mono">
                {CONSENT_COOKIE}
              </code>,
              <>
                Remembers whether you accepted or declined analytics, so you are not asked on every
                page. Its value is{' '}
                <code className="font-mono text-mono">granted-v{CONSENT_VERSION}</code> or{' '}
                <code className="font-mono text-mono">denied-v{CONSENT_VERSION}</code> and nothing
                else — it holds no identifier and nothing about you.
              </>,
              <>
                {GRANTED_DAYS} days if you accept,
                <br />
                {DENIED_DAYS} days if you decline
              </>,
              <>
                No. Without it the site cannot remember your answer and would have to ask again on
                every page. It is the cookie that makes declining possible.
              </>,
            ],
            [
              <code key="s" className="font-mono text-mono">
                sb-…-auth-token
              </code>,
              <>
                Keeps a <strong>Nebsam staff member</strong> signed in to the administration area.
                It is never set for an ordinary visitor, and it appears only after someone signs in
                at <code className="font-mono text-mono">/admin</code>.
              </>,
              <>Until sign-out, or the session expires</>,
              <>Not applicable — it is only ever set for staff accounts</>,
            ],
          ]}
        />
      </LegalSectionBlock>

      <LegalSectionBlock id="analytics" heading="Analytics, and why they do not run by default">
        <p>
          We use <strong>Google Analytics 4</strong> to count visits and see which pages are read.
          It is loaded only <strong>after</strong> you accept — not loaded and then told to ignore
          you. Until you accept, no Google script is fetched and no Google cookie is set.
        </p>
        <p>
          If you accept, Google sets its own cookies to recognise a returning browser and to measure
          a session. If you decline, or simply never answer, none of that happens.
        </p>
        <LegalTable
          caption="Third parties and when they are contacted"
          columns={['Who', 'Why', 'When they are contacted']}
          rows={[
            [
              'Google Analytics 4',
              'Counting visits and page views, so we know which pages are worth improving',
              <strong key="a">Only after you accept analytics</strong>,
            ],
            [
              'Cloudflare Turnstile',
              'Checking that a form is being submitted by a person rather than a script',
              'When a page with a form is opened. It is a security control, not analytics, and it sets no advertising cookie',
            ],
            [
              'Supabase',
              'The database and file storage behind this site, including staff sign-in',
              'On pages that read or write data. No cookie is set for an ordinary visitor',
            ],
            [
              'WhatsApp (Meta)',
              'The chat itself, when you choose to message us',
              'Only when you tap a WhatsApp button and leave this site',
            ],
          ]}
        />
      </LegalSectionBlock>

      <LegalSectionBlock id="no-advertising" heading="What this site does not do">
        <p>
          There is <strong>no advertising network</strong> on this site, no retargeting pixel, no
          social media tracking script, and nothing that follows you to other websites. If that ever
          changes, this page changes with it and you would be asked again.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="changing-your-mind" heading="Changing your mind">
        <p>
          Clearing cookies for this site in your browser removes your answer, and you will be asked
          again on your next visit. Every major browser can also block cookies entirely — the site
          will still work, and analytics simply never run.
        </p>
        <p>
          If you accepted previously and want that undone, clearing site data is the reliable way to
          do it, because it removes both our record of your answer and anything Google set while it
          stood.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="contact" heading="Asking us about this">
        <p>
          Data protection questions go to <strong>{DATA_PROTECTION_CONTACT.name}</strong> at{' '}
          <a
            href={`mailto:${DATA_PROTECTION_CONTACT.email}`}
            className="underline underline-offset-4"
          >
            {DATA_PROTECTION_CONTACT.email}
          </a>{' '}
          or{' '}
          <a
            href={`tel:${DATA_PROTECTION_CONTACT.phone.e164}`}
            className="underline underline-offset-4"
          >
            {DATA_PROTECTION_CONTACT.phone.display}
          </a>
          .
        </p>
        <p>
          What we do with the information you send us — and what we do with vehicle tracking data —
          is in the{' '}
          <Link href={ROUTES.privacy} className="underline underline-offset-4">
            privacy notice
          </Link>
          .
        </p>
      </LegalSectionBlock>
    </LegalPage>
  );
}
