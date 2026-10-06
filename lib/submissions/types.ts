/**
 * ENQUIRY FORMS — the shared shape.
 *
 * Four public forms write to one `submissions` table: contact, quote,
 * suggestions and installation booking. They differ in their fields and in
 * almost nothing else, so the field specs, the minimum lengths and the result
 * type live here, in a module with NO `server-only` import and NO Zod, and both
 * the client form and the server action read from it. The Zod schemas are in
 * schemas.ts, server-only (Sprint 14): the browser needs labels and lengths,
 * not a validator, and Zod was 20-odd KB on every form page.
 *
 * That is what stops the two halves disagreeing. A field rendered by the client
 * that the server does not validate is an unvalidated field; a field the server
 * requires that the client never renders is a form nobody can submit. Declaring
 * them once makes both impossible.
 */

/**
 * Minimum lengths, read by the schemas (schemas.ts) AND by the fields' `minLength`, so
 * the browser refuses what the server would, before anything is sent (V81).
 */
export const MIN = { name: 2, phone: 9, message: 10, interest: 3, product: 2, town: 2 } as const;

/** The four forms. Kept in step with the schemas by `satisfies` in schemas.ts. */
export const SUBMISSION_KINDS = ['contact', 'quote', 'installation', 'suggestion'] as const;
export type SubmissionKind = (typeof SUBMISSION_KINDS)[number];

export interface FieldSpec {
  name: string;
  label: string;
  type?: 'text' | 'tel' | 'email' | 'textarea' | 'checkbox' | 'select';
  required?: boolean;
  /** From MIN, never a literal. Checked only once something is typed. */
  minLength?: number;
  hint?: string;
  options?: string[];
  autoComplete?: string;
  inputMode?: 'text' | 'tel' | 'email' | 'numeric';
}

/** What each form renders. Ordered as it should be filled in. */
export const SUBMISSION_FIELDS: Record<SubmissionKind, FieldSpec[]> = {
  contact: [
    { name: 'name', minLength: MIN.name, label: 'Your name', required: true, autoComplete: 'name' },
    {
      name: 'phone',
      minLength: MIN.phone,
      label: 'Phone number',
      type: 'tel',
      required: true,
      autoComplete: 'tel',
      inputMode: 'tel',
    },
    { name: 'email', label: 'Email', type: 'email', autoComplete: 'email', hint: 'Optional.' },
    {
      name: 'branch',
      label: 'Nearest branch',
      type: 'select',
      options: ['No preference', 'Nairobi', 'Mombasa', 'Nakuru'],
      hint: 'Only three branches exist. Everywhere else is served by agents and technicians.',
    },
    {
      name: 'message',
      minLength: MIN.message,
      label: 'How can we help?',
      type: 'textarea',
      required: true,
    },
  ],
  quote: [
    { name: 'name', minLength: MIN.name, label: 'Your name', required: true, autoComplete: 'name' },
    {
      name: 'phone',
      minLength: MIN.phone,
      label: 'Phone number',
      type: 'tel',
      required: true,
      autoComplete: 'tel',
      inputMode: 'tel',
    },
    { name: 'email', label: 'Email', type: 'email', autoComplete: 'email', hint: 'Optional.' },
    {
      name: 'organisation',
      label: 'Company or organisation',
      autoComplete: 'organization',
      hint: 'Optional.',
    },
    {
      name: 'interest',
      minLength: MIN.interest,
      label: 'What do you need?',
      required: true,
      hint: 'For example: tracking for a delivery fleet, or a speed limiter for NTSA compliance.',
    },
    { name: 'vehicles', label: 'How many vehicles?', hint: 'A rough number is fine.' },
    { name: 'town', label: 'Town', hint: 'So we can say who would carry out the work.' },
    {
      name: 'message',
      minLength: MIN.message,
      label: 'Anything else we should know?',
      type: 'textarea',
    },
  ],
  installation: [
    { name: 'name', minLength: MIN.name, label: 'Your name', required: true, autoComplete: 'name' },
    {
      name: 'phone',
      minLength: MIN.phone,
      label: 'Phone number',
      type: 'tel',
      required: true,
      autoComplete: 'tel',
      inputMode: 'tel',
    },
    { name: 'email', label: 'Email', type: 'email', autoComplete: 'email', hint: 'Optional.' },
    {
      name: 'product',
      minLength: MIN.product,
      label: 'What is being installed?',
      required: true,
      hint: 'The product name, or describe it.',
    },
    { name: 'vehicle', label: 'Vehicle', hint: 'Make and model. Optional.' },
    {
      name: 'town',
      minLength: MIN.town,
      label: 'Town',
      required: true,
      hint: 'Where the vehicle will be.',
    },
    {
      name: 'preferred',
      label: 'Preferred day or time',
      hint: 'We will confirm before anyone travels — this is a request, not a booking.',
    },
    { name: 'message', minLength: MIN.message, label: 'Anything else?', type: 'textarea' },
  ],
  suggestion: [
    {
      name: 'anonymous',
      label: 'Send this anonymously',
      type: 'checkbox',
      hint: 'We will not store your name, phone number or email with this suggestion.',
    },
    { name: 'name', label: 'Your name', autoComplete: 'name', hint: 'Optional.' },
    {
      name: 'phone',
      label: 'Phone number',
      type: 'tel',
      autoComplete: 'tel',
      inputMode: 'tel',
      hint: 'Optional.',
    },
    { name: 'email', label: 'Email', type: 'email', autoComplete: 'email', hint: 'Optional.' },
    {
      name: 'message',
      minLength: MIN.message,
      label: 'Your suggestion',
      type: 'textarea',
      required: true,
    },
  ],
};

export type SubmissionResult =
  | { ok: true; reference: string; kind: SubmissionKind }
  | {
      ok: false;
      message: string;
      field?: string;
      /**
       * What the person typed, handed back so the form can put it back (V81).
       * React resets a form after every action, failed ones included, so without
       * this a refusal wipes the lot. Only ever on a refusal.
       */
      values?: Record<string, string>;
    };
