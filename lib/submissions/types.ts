import { z } from 'zod';

/**
 * ENQUIRY FORMS — the shared shape.
 *
 * Four public forms write to one `submissions` table: contact, quote,
 * suggestions and installation booking. They differ in their fields and in
 * almost nothing else, so the schemas, the field specs and the result type live
 * here, in a module with NO `server-only` import, and both the client form and
 * the server action read from it.
 *
 * That is what stops the two halves disagreeing. A field rendered by the client
 * that the server does not validate is an unvalidated field; a field the server
 * requires that the client never renders is a form nobody can submit. Declaring
 * them once makes both impossible.
 */

/** Kenyan mobile numbers, loosely. */
const phone = z
  .string()
  .min(9, 'A phone number is needed so we can reply.')
  .max(20)
  .regex(/^[0-9+\s()-]+$/, 'Use digits, spaces and + only.');

const name = z.string().min(2, 'Please give a name we can use.').max(120);
const optionalEmail = z
  .string()
  .max(160)
  .email('That does not look like an email address.')
  .optional()
  .or(z.literal(''));
const message = z.string().min(10, 'Please tell us a little more.').max(4000);

/**
 * The honeypot, on every form.
 *
 * Named `company` because that is a field a form filler expects to see and will
 * happily complete. It is checked on the SERVER — a browser-side check stops
 * nothing that posts directly, which is the only adversary that matters.
 */
const honeypot = z.string().max(200).optional().nullable();

export const SUBMISSION_SCHEMAS = {
  contact: z.object({
    name,
    phone,
    email: optionalEmail,
    branch: z.string().max(40).optional().or(z.literal('')),
    message,
    company: honeypot,
  }),
  quote: z.object({
    name,
    phone,
    email: optionalEmail,
    organisation: z.string().max(160).optional().or(z.literal('')),
    // Free text on purpose. A dropdown of products would go stale the moment
    // the catalogue changes, and a fleet manager describing "14 lorries and two
    // pickups" tells sales more than any select could.
    interest: z.string().min(3, 'Tell us what you are looking for.').max(400),
    vehicles: z.string().max(80).optional().or(z.literal('')),
    town: z.string().max(80).optional().or(z.literal('')),
    message: message.optional().or(z.literal('')),
    company: honeypot,
  }),
  installation: z.object({
    name,
    phone,
    email: optionalEmail,
    vehicle: z.string().max(160).optional().or(z.literal('')),
    product: z.string().min(2, 'What is being installed?').max(200),
    town: z.string().min(2, 'Where should we meet you?').max(80),
    preferred: z.string().max(120).optional().or(z.literal('')),
    message: message.optional().or(z.literal('')),
    company: honeypot,
  }),
  /**
   * Suggestions are the one form where the contact details are OPTIONAL, and
   * that is the whole point of it. An anonymous route only means something if it
   * is genuinely anonymous, so nothing here is required except the suggestion,
   * and the action stores no contact fields at all when anonymity is chosen.
   */
  suggestion: z.object({
    name: z.string().max(120).optional().or(z.literal('')),
    phone: z.string().max(20).optional().or(z.literal('')),
    email: optionalEmail,
    anonymous: z.string().optional().nullable(),
    message,
    company: honeypot,
  }),
} as const;

export type SubmissionKind = keyof typeof SUBMISSION_SCHEMAS;

export interface FieldSpec {
  name: string;
  label: string;
  type?: 'text' | 'tel' | 'email' | 'textarea' | 'checkbox' | 'select';
  required?: boolean;
  hint?: string;
  options?: string[];
  autoComplete?: string;
  inputMode?: 'text' | 'tel' | 'email' | 'numeric';
}

/** What each form renders. Ordered as it should be filled in. */
export const SUBMISSION_FIELDS: Record<SubmissionKind, FieldSpec[]> = {
  contact: [
    { name: 'name', label: 'Your name', required: true, autoComplete: 'name' },
    { name: 'phone', label: 'Phone number', type: 'tel', required: true, autoComplete: 'tel', inputMode: 'tel' },
    { name: 'email', label: 'Email', type: 'email', autoComplete: 'email', hint: 'Optional.' },
    {
      name: 'branch',
      label: 'Nearest branch',
      type: 'select',
      options: ['No preference', 'Nairobi', 'Mombasa', 'Nakuru'],
      hint: 'Only three branches exist. Everywhere else is served by agents and technicians.',
    },
    { name: 'message', label: 'How can we help?', type: 'textarea', required: true },
  ],
  quote: [
    { name: 'name', label: 'Your name', required: true, autoComplete: 'name' },
    { name: 'phone', label: 'Phone number', type: 'tel', required: true, autoComplete: 'tel', inputMode: 'tel' },
    { name: 'email', label: 'Email', type: 'email', autoComplete: 'email', hint: 'Optional.' },
    { name: 'organisation', label: 'Company or organisation', autoComplete: 'organization', hint: 'Optional.' },
    {
      name: 'interest',
      label: 'What do you need?',
      required: true,
      hint: 'For example: tracking for a delivery fleet, or a speed limiter for NTSA compliance.',
    },
    { name: 'vehicles', label: 'How many vehicles?', hint: 'A rough number is fine.' },
    { name: 'town', label: 'Town', hint: 'So we can say who would carry out the work.' },
    { name: 'message', label: 'Anything else we should know?', type: 'textarea' },
  ],
  installation: [
    { name: 'name', label: 'Your name', required: true, autoComplete: 'name' },
    { name: 'phone', label: 'Phone number', type: 'tel', required: true, autoComplete: 'tel', inputMode: 'tel' },
    { name: 'email', label: 'Email', type: 'email', autoComplete: 'email', hint: 'Optional.' },
    { name: 'product', label: 'What is being installed?', required: true, hint: 'The product name, or describe it.' },
    { name: 'vehicle', label: 'Vehicle', hint: 'Make and model. Optional.' },
    { name: 'town', label: 'Town', required: true, hint: 'Where the vehicle will be.' },
    {
      name: 'preferred',
      label: 'Preferred day or time',
      hint: 'We will confirm before anyone travels — this is a request, not a booking.',
    },
    { name: 'message', label: 'Anything else?', type: 'textarea' },
  ],
  suggestion: [
    {
      name: 'anonymous',
      label: 'Send this anonymously',
      type: 'checkbox',
      hint: 'We will not store your name, phone number or email with this suggestion.',
    },
    { name: 'name', label: 'Your name', autoComplete: 'name', hint: 'Optional.' },
    { name: 'phone', label: 'Phone number', type: 'tel', autoComplete: 'tel', inputMode: 'tel', hint: 'Optional.' },
    { name: 'email', label: 'Email', type: 'email', autoComplete: 'email', hint: 'Optional.' },
    { name: 'message', label: 'Your suggestion', type: 'textarea', required: true },
  ],
};

export type SubmissionResult =
  | { ok: true; reference: string; kind: SubmissionKind }
  | { ok: false; message: string; field?: string };
