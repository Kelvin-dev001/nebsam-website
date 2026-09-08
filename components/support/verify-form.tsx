'use client';

import * as React from 'react';
import { useActionState } from 'react';
import { verifyInstallationAction } from '@/app/(site)/support/verify-installation/actions';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { track } from '@/lib/analytics';
import { whatsappUrl } from '@/lib/company';
import { EVENTS } from '@/lib/constants';
import type { VerificationResult } from '@/lib/verification/types';

/**
 * CERTIFICATE VERIFICATION — the form.
 *
 * This component renders a question and an answer. It decides nothing: the
 * server returns a `VerificationResult` and this maps it to copy. That split is
 * the point. Every rule that matters — identical failure copy, the timing floor,
 * the challenge gate, rate limiting, the honeypot — is enforced where a browser
 * cannot reach it, and no branch here can reveal more than the server sent,
 * because the server did not send more.
 *
 * ── Why `useActionState` and a real form action ─────────────────────────────
 * Not for the ergonomics. `<form action={…}>` means Next emits the hidden action
 * field that makes the form WORK WITHOUT JAVASCRIPT — the visitor gets a full
 * page response with their answer on it. For an audience on mid-range Android
 * over metered mobile data, where a script can simply fail to arrive, a
 * verification form that degrades to a plain POST is worth more than one that
 * degrades to a dead button.
 *
 * It has a second consequence, and it is a feature: the endpoint is now
 * reachable the way an attacker would reach it — parse the form, post it, ignore
 * the page. That is precisely what Sprint 11's penetration test does, so the
 * test exercises the real surface rather than a convenient one.
 *
 * ── Two failures, one message ───────────────────────────────────────────────
 * `unverified` covers both "no such plate" and "wrong last four digits", and
 * this file does NOT know which. There is no branch here to get wrong later.
 *
 * ── The screen reader gets the same answer, at the same time ────────────────
 * ACCESSIBILITY_PLAN A6. The result region is a live region present from first
 * paint, so the answer is announced rather than merely appearing. The security
 * constraint and the accessibility requirement are satisfied together: the
 * generic message is what is announced, so a screen-reader user is told neither
 * less nor more than anyone else.
 *
 * ── Analytics ───────────────────────────────────────────────────────────────
 * `certificate_verified` fires with the OUTCOME only. lib/analytics.ts refuses a
 * `plate` key outright, but the real guarantee is that one is never passed.
 */

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, options: Record<string, unknown>) => string;
      reset: (id?: string) => void;
    };
  }
}

export function VerifyForm() {
  const [result, formAction, pending] = useActionState<VerificationResult | null, FormData>(
    verifyInstallationAction,
    null,
  );

  const challengeNeeded = Boolean(result?.requiresChallenge && TURNSTILE_SITE_KEY);
  const widgetRef = React.useRef<HTMLDivElement>(null);
  const widgetId = React.useRef<string | null>(null);

  /** Outcome only. Never the plate, never the dates. */
  React.useEffect(() => {
    if (result && result.status !== 'invalid_input') {
      track(EVENTS.certificateVerified, { outcome: result.status });
    }
    // A Turnstile token is single-use at Cloudflare. Without this reset the next
    // attempt sends a spent token and fails the challenge for a reason the
    // visitor can neither see nor fix.
    if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current);
  }, [result]);

  /**
   * The Turnstile script loads ONLY once a challenge is actually required, never
   * on first paint. Most visitors verify once and succeed; they should not pay
   * for a third-party script to do it, on a route budget written for a mid-range
   * Android on metered data.
   */
  React.useEffect(() => {
    if (!challengeNeeded || !TURNSTILE_SITE_KEY || !widgetRef.current) return;

    const renderWidget = () => {
      if (!window.turnstile || !widgetRef.current || widgetId.current) return;
      widgetId.current = window.turnstile.render(widgetRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: 'light',
      });
    };

    if (window.turnstile) {
      renderWidget();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.onload = renderWidget;
    document.head.appendChild(script);
  }, [challengeNeeded]);

  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] md:gap-12">
      <form action={formAction} className="flex flex-col gap-5">
        <Field
          label="Vehicle registration"
          name="plate"
          required
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          hint="As it appears on the plate. Spaces and dashes do not matter."
          error={result?.status === 'invalid_input' ? result.message : undefined}
        />

        <Field
          label="Last 4 digits of the registered phone number"
          name="phoneLast4"
          required
          inputMode="numeric"
          autoComplete="off"
          maxLength={8}
          hint="The number given to us when the unit was installed."
        />

        {/* Honeypot. Positioned off-screen rather than display:none — a field
            that is display:none is skipped by some form fillers, which is the
            opposite of what a honeypot wants — and aria-hidden with tabIndex -1
            so a screen reader never announces it and a keyboard user never
            reaches it. It is checked on the server. */}
        <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
          <label htmlFor="company">Company</label>
          <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        {challengeNeeded ? (
          <div>
            <p className="mb-2 text-body-sm text-text-secondary">One check before we look again.</p>
            <div ref={widgetRef} />
          </div>
        ) : null}

        <div>
          <Button type="submit" variant="primary" size="lg" disabled={pending}>
            {pending ? 'Checking…' : 'Check this vehicle'}
          </Button>
        </div>
      </form>

      {/* Live region, present from first paint and empty. A region added to the
          DOM at the same moment as its content is frequently not announced. */}
      <div role="status" aria-live="polite" className="min-h-[3rem]">
        {result ? <Answer result={result} /> : null}
      </div>
    </div>
  );
}

function formatDate(value: string | null | undefined): string {
  if (!value) return 'Not recorded';
  return new Date(`${value}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function Answer({ result }: { result: VerificationResult }) {
  if (result.status === 'invalid_input') return null;

  if (result.status === 'rate_limited') {
    return (
      <Panel tone="warn" heading="Too many checks from this connection">
        <p>
          Please wait a while and try again. If you need an answer now, message us on WhatsApp or
          call the branch that carried out the installation.
        </p>
      </Panel>
    );
  }

  if (result.status === 'challenge_required') {
    /**
     * The dead end this copy exists to avoid.
     *
     * The form works without JavaScript, but the Turnstile widget does not — it
     * IS JavaScript. So a visitor with no scripts who gets one answer wrong is
     * asked to complete a check that will never appear on their screen. That is
     * a worse outcome than never supporting them at all, and it is invisible in
     * testing because the tester always has JavaScript.
     *
     * So the panel always carries a human route out. It costs one sentence, it
     * converts a dead end into an enquiry, and an enquiry is what this site is
     * for.
     */
    return (
      <Panel tone="warn" heading="One more step">
        <p>Complete the check below the form, then try again.</p>
        <p>
          If no check appears, message us on{' '}
          <a
            className="text-brand-signal-ink underline underline-offset-4"
            href={whatsappUrl('Hello Nebsam — I would like to confirm an installation certificate.')}
          >
            WhatsApp
          </a>{' '}
          and we will confirm the certificate for you.
        </p>
      </Panel>
    );
  }

  if (result.status === 'unverified') {
    // THE IDENTICAL MESSAGE. Unknown plate and wrong second factor both arrive
    // here, and nothing in this branch depends on which. Making it more helpful
    // — "we found the vehicle, but not that number" — would rebuild the oracle
    // the entire design exists to remove.
    return (
      <Panel tone="neutral" heading="We could not confirm this installation">
        <p>
          Check the registration and the last four digits of the phone number given at installation,
          then try again. If both are right, contact us and we will confirm it for you directly.
        </p>
      </Panel>
    );
  }

  const valid = result.status === 'valid';
  return (
    <Panel
      tone={valid ? 'ok' : 'warn'}
      heading={valid ? 'Installation confirmed' : 'This installation has expired'}
    >
      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 font-mono text-body-sm">
        {result.plate ? (
          <>
            <dt className="text-text-secondary">Vehicle</dt>
            <dd className="uppercase">{result.plate}</dd>
          </>
        ) : null}
        <dt className="text-text-secondary">Installed</dt>
        <dd>{formatDate(result.installedOn)}</dd>
        <dt className="text-text-secondary">Expires</dt>
        <dd>{formatDate(result.expiresOn)}</dd>
      </dl>
      {!valid ? (
        <p className="mt-4">
          Contact us to renew. An expired record does not mean the equipment has been removed.
        </p>
      ) : null}
    </Panel>
  );
}

/**
 * The result panel.
 *
 * Status is carried by the heading text, not by the colour — WCAG 1.4.1. The
 * left rule reinforces it for sighted users and is the only part a
 * forced-colours mode may drop.
 */
function Panel({
  tone,
  heading,
  children,
}: {
  tone: 'ok' | 'warn' | 'neutral';
  heading: string;
  children: React.ReactNode;
}) {
  const rule = {
    ok: 'border-state-ok-ink',
    warn: 'border-state-warn-ink',
    neutral: 'border-border-strong',
  }[tone];

  return (
    <div data-verification-result className={`border-l-2 ${rule} bg-surface-raised p-5 md:p-6`}>
      <h2 className="font-display-tight text-h3 text-text-primary">{heading}</h2>
      <div className="mt-3 flex flex-col gap-2 text-body text-text-secondary">{children}</div>
    </div>
  );
}
