'use client';

import * as React from 'react';
import { whatsappUrl } from '@/lib/company';
import type { SubmissionKind } from '@/lib/submissions/types';

const SUCCESS_HEADING: Record<SubmissionKind, string> = {
  contact: 'Message received',
  quote: 'Quote request received',
  installation: 'Booking request received',
  suggestion: 'Thank you',
};

/**
 * The confirmation that replaces an enquiry form once it is accepted. Split
 * out of enquiry-form.tsx in Sprint 12b T5.
 *
 * IT TAKES FOCUS WHEN IT APPEARS (accessibility fix A). The form it replaces
 * held focus on its submit button; when that button went, focus fell to the
 * document body and a screen-reader user heard nothing at all. Focusing the
 * heading reads the confirmation out and leaves the reader where the next
 * thing is. A live region would not do: this panel is newly inserted, and
 * content that arrives WITH its live region is not reliably announced.
 *
 * IT FADES AND SETTLES 8px as it arrives (`enter-rise`, micro-interactions.css):
 * the form it replaces is gone in a frame and the page height collapses, so
 * the change needs a bridge. Under reduced motion it is simply there.
 */
export function EnquirySuccess({
  kind,
  reference,
  whatsappMessage,
}: {
  kind: SubmissionKind;
  reference: string;
  whatsappMessage: string;
}) {
  const headingRef = React.useRef<HTMLHeadingElement | null>(null);

  React.useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div
      data-enquiry-result
      className="enter-rise border-l-2 border-state-ok-ink bg-surface-raised p-5 md:p-6"
    >
      <h2 ref={headingRef} tabIndex={-1} className="font-display-tight text-h3 text-text-primary">
        {SUCCESS_HEADING[kind]}
      </h2>
      <p className="mt-3 text-body text-text-secondary">
        {kind === 'suggestion'
          ? 'We read every suggestion. Thank you for taking the time.'
          : 'We will get back to you. If it is urgent, WhatsApp is the fastest way to reach us.'}
      </p>
      <p className="mt-4 font-mono text-body-sm text-text-secondary">
        Reference <span className="text-text-primary">{reference}</span>
      </p>
      {kind !== 'suggestion' ? (
        <p className="mt-5 text-body">
          <a
            className="text-brand-signal-ink underline underline-offset-4"
            href={whatsappUrl(whatsappMessage)}
          >
            Continue on WhatsApp
          </a>
        </p>
      ) : null}
    </div>
  );
}
