'use client';

import * as React from 'react';
import { Section, Shell, Eyebrow } from '@/components/layout/section';
import { Button, ButtonLink } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';
import { whatsappUrl } from '@/lib/company';

/**
 * Route error boundary.
 *
 * Errors explain what happened and how to proceed, in the interface's voice.
 * They do not apologise and they are never vague.
 *
 * The digest is shown because it is the one thing that makes a support
 * conversation efficient — it is an opaque hash, not PII. The raw error message
 * is NOT rendered: it can contain internal detail, and brief PART 16 forbids
 * PII in error messages.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Server-side logging lands in Sprint 12 with the audit log. Console only
    // for now, and deliberately without the stack in production.
    console.error('[route error]', error.digest ?? error.message);
  }, [error]);

  return (
    <Section tone="dark">
      <Shell>
        <Eyebrow>Something went wrong</Eyebrow>
        <h1 className="mt-4 max-w-[22ch] font-display text-display md:text-md-display">
          This page didn&rsquo;t load.
        </h1>
        <p className="mt-5 max-w-prose text-body-lg text-text-secondary-inverse">
          The problem is on our side, not yours. Try again — if it keeps happening, message us on
          WhatsApp and we will sort it out.
        </p>

        {error.digest ? (
          <p className="mt-4 font-mono text-mono text-text-secondary-inverse">
            Reference: {error.digest}
          </p>
        ) : null}

        <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Button variant="primary" size="lg" onClick={reset}>
            Try again
          </Button>
          <ButtonLink href={whatsappUrl()} variant="secondary" size="lg">
            Message us on WhatsApp
          </ButtonLink>
          <ButtonLink href={ROUTES.home} variant="ghost">
            Back to the homepage
          </ButtonLink>
        </div>
      </Shell>
    </Section>
  );
}
