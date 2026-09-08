'use client';

import * as React from 'react';
import { useActionState } from 'react';
import { submitEnquiry } from '@/lib/submissions/actions';
import { Button } from '@/components/ui/button';
import { CheckboxField, Field, SelectField, TextareaField } from '@/components/ui/field';
import { track } from '@/lib/analytics';
import { EVENTS, type EventName } from '@/lib/constants';
import { CONTACT, DATA_PROTECTION_CONTACT, whatsappUrl } from '@/lib/company';
import {
  SUBMISSION_FIELDS,
  type SubmissionKind,
  type SubmissionResult,
} from '@/lib/submissions/types';

/**
 * THE ENQUIRY FORM — contact, quote, installation booking and suggestions.
 *
 * One component, four forms, because they differ only in their fields. The
 * fields come from `lib/submissions/types.ts`, which the SERVER action reads
 * too, so a field cannot be rendered without also being validated.
 *
 * ── It submits without JavaScript ───────────────────────────────────────────
 * `<form action={…}>` with `useActionState`, so Next emits the hidden action
 * field and a plain POST works when the script never arrives. Most of this
 * site's visitors are on a mid-range Android over metered mobile data, and a
 * lead lost to a script that failed to load is a lead lost for good — which is
 * the first of the three commercial objectives, failing silently.
 *
 * ── Why the whole form is not disabled while submitting ─────────────────────
 * Only the button is. Disabling a fieldset mid-submit moves focus to the
 * document and a screen-reader user loses their place in the form.
 */

const EVENT_BY_KIND: Record<SubmissionKind, EventName> = {
  contact: EVENTS.contactSubmitted,
  quote: EVENTS.quoteSubmitted,
  installation: EVENTS.installationBookingSubmitted,
  suggestion: EVENTS.suggestionSubmitted,
};

const SUBMIT_LABEL: Record<SubmissionKind, string> = {
  contact: 'Send message',
  quote: 'Request a quote',
  installation: 'Request a booking',
  suggestion: 'Send suggestion',
};

const SUCCESS_HEADING: Record<SubmissionKind, string> = {
  contact: 'Message received',
  quote: 'Quote request received',
  installation: 'Booking request received',
  suggestion: 'Thank you',
};

export function EnquiryForm({ kind, whatsappMessage }: { kind: SubmissionKind; whatsappMessage: string }) {
  const [result, formAction, pending] = useActionState<SubmissionResult | null, FormData>(
    submitEnquiry,
    null,
  );
  const [anonymous, setAnonymous] = React.useState(false);

  React.useEffect(() => {
    if (result?.ok) track(EVENT_BY_KIND[kind], { kind });
  }, [result, kind]);

  if (result?.ok) {
    return (
      <div data-enquiry-result className="border-l-2 border-state-ok-ink bg-surface-raised p-5 md:p-6">
        <h2 className="font-display-tight text-h3 text-text-primary">{SUCCESS_HEADING[kind]}</h2>
        <p className="mt-3 text-body text-text-secondary">
          {kind === 'suggestion'
            ? 'We read every suggestion. Thank you for taking the time.'
            : 'We will get back to you. If it is urgent, WhatsApp is the fastest way to reach us.'}
        </p>
        <p className="mt-4 font-mono text-body-sm text-text-secondary">
          Reference <span className="text-text-primary">{result.reference}</span>
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

  const fields = SUBMISSION_FIELDS[kind];

  return (
    <form action={formAction} className="flex max-w-prose flex-col gap-5">
      {/* Which form this is. A hidden field rather than a bound argument —
          `submitEnquiry.bind(null, kind)` hung the production server on the
          no-JavaScript submit path. The reasoning and the measurements are in
          lib/submissions/actions.ts. */}
      <input type="hidden" name="kind" value={kind} />

      {fields.map((field) => {
        const error = result && !result.ok && result.field === field.name ? result.message : undefined;

        // A suggestion sent anonymously hides the contact fields rather than
        // merely ignoring them. Leaving them on screen invites someone to fill
        // in a name they have just asked us not to keep.
        if (kind === 'suggestion' && anonymous && ['name', 'phone', 'email'].includes(field.name)) {
          return null;
        }

        if (field.type === 'checkbox') {
          return (
            <CheckboxField
              key={field.name}
              name={field.name}
              label={field.label}
              hint={field.hint}
              checked={anonymous}
              onChange={(event) => setAnonymous(event.currentTarget.checked)}
            />
          );
        }
        if (field.type === 'select') {
          return (
            <SelectField
              key={field.name}
              name={field.name}
              label={field.label}
              hint={field.hint}
              error={error}
              required={field.required}
              options={field.options ?? []}
            />
          );
        }
        if (field.type === 'textarea') {
          return (
            <TextareaField
              key={field.name}
              name={field.name}
              label={field.label}
              hint={field.hint}
              error={error}
              required={field.required}
            />
          );
        }
        return (
          <Field
            key={field.name}
            name={field.name}
            label={field.label}
            hint={field.hint}
            error={error}
            required={field.required}
            type={field.type ?? 'text'}
            autoComplete={field.autoComplete}
            inputMode={field.inputMode}
          />
        );
      })}

      {/* Honeypot. Off-screen rather than display:none, aria-hidden and out of
          the tab order, and checked on the server. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${kind}-company`}>Company</label>
        <input id={`${kind}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {/* The failure message, announced. Field-level errors render on the field
          itself; this is for everything that is not about one field. */}
      <div role="status" aria-live="polite">
        {result && !result.ok && !result.field ? (
          <p data-enquiry-result className="border-l-2 border-state-alert-ink bg-surface-raised p-4 text-body-sm">
            {result.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" variant="primary" size="lg" disabled={pending}>
          {pending ? 'Sending…' : SUBMIT_LABEL[kind]}
        </Button>
        <a className="text-body-sm text-brand-signal-ink underline underline-offset-4" href={whatsappUrl(whatsappMessage)}>
          Or message us on WhatsApp
        </a>
      </div>

      {/*
        THE DATA-PROTECTION NOTICE.
        Nebsam is a registered data controller and processor under the Data
        Protection Act 2019, so a form that collects a name and a phone number
        has to say what happens to them AT THE POINT OF COLLECTION — not only in
        a policy page. It names a person and an address a request can actually be
        sent to, from lib/company.ts (register item V11).

        It does NOT link to /legal/privacy-policy, because that route does not
        exist yet and a notice pointing at a 404 is worse than one that does not
        point anywhere. The link lands in the sprint that builds it.
      */}
      <p className="text-body-sm text-text-secondary">
        {kind === 'suggestion' && anonymous
          ? 'Sent anonymously: your name, phone number and email are not stored with this suggestion.'
          : `We use what you send here to reply to you, and we do not sell it or pass it to anyone else. To ask what we hold about you, or to have it removed, contact ${DATA_PROTECTION_CONTACT.name} at ${DATA_PROTECTION_CONTACT.email} or call ${CONTACT.whatsapp.display}.`}
      </p>
    </form>
  );
}
