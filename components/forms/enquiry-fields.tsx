'use client';

import { CheckboxField, Field, SelectField, TextareaField } from '@/components/ui/field';
import {
  SUBMISSION_FIELDS,
  type SubmissionKind,
  type SubmissionResult,
} from '@/lib/submissions/types';

/**
 * THE FIELDS OF ONE ENQUIRY FORM, rendered from the spec the server validates.
 *
 * ── After a refusal, each field starts from what the person typed ───────────
 * React resets a form once its action settles, failed or not, and it resets to
 * `defaultValue`. So the refusal carries the typed values back (register V81)
 * and they become the defaults: the reset puts the person's words back instead
 * of wiping them. Without JavaScript the server renders the same values, so the
 * no-script path keeps them too.
 *
 * `minLength` comes from the same table the schemas read, so the commonest
 * refusal, a message that is too short, is caught before anything is sent.
 */
export function EnquiryFields({
  kind,
  result,
  anonymous,
  onAnonymousChange,
}: {
  kind: SubmissionKind;
  result: SubmissionResult | null;
  anonymous: boolean;
  onAnonymousChange: (anonymous: boolean) => void;
}) {
  const refused = result && !result.ok ? result : null;

  return SUBMISSION_FIELDS[kind].map((field) => {
    const error = refused?.field === field.name ? refused.message : undefined;
    const defaultValue = refused?.values?.[field.name];

    // A suggestion sent anonymously hides the contact fields rather than
    // merely ignoring them. Leaving them on screen invites someone to fill
    // in a name they have just asked us not to keep. Never one carrying an
    // error, though: without JavaScript all fields are sent, and a refusal on
    // a hidden field would be a refusal nobody can see.
    const contact = ['name', 'phone', 'email'].includes(field.name);
    if (kind === 'suggestion' && anonymous && contact && !error) return null;

    if (field.type === 'checkbox') {
      // `defaultChecked`, not `checked`: the reset puts a box back to its
      // default, so a controlled box came back UNTICKED after a refusal while
      // the contact fields stayed hidden, and the next send went out as not
      // anonymous. The default follows the state, so the reset now agrees.
      return (
        <CheckboxField
          key={field.name}
          name={field.name}
          label={field.label}
          hint={field.hint}
          defaultChecked={anonymous}
          onChange={(event) => onAnonymousChange(event.currentTarget.checked)}
        />
      );
    }
    if (field.type === 'select') {
      // Keyed by the value handed back: React applies a select's
      // `defaultValue` only when the select is created, so a new value needs
      // a new select, or the reset falls back to the first option.
      return (
        <SelectField
          key={`${field.name}:${defaultValue ?? ''}`}
          name={field.name}
          label={field.label}
          hint={field.hint}
          error={error}
          required={field.required}
          options={field.options ?? []}
          defaultValue={defaultValue}
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
          minLength={field.minLength}
          defaultValue={defaultValue}
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
        minLength={field.minLength}
        defaultValue={defaultValue}
        type={field.type ?? 'text'}
        autoComplete={field.autoComplete}
        inputMode={field.inputMode}
      />
    );
  });
}
