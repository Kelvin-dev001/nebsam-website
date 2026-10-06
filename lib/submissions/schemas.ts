import 'server-only';
import { z } from 'zod';
import { MIN, type SubmissionKind } from './types';

/**
 * THE ENQUIRY SCHEMAS — server-side validation for the four public forms.
 *
 * Split out of types.ts in Sprint 14, and `server-only` so it cannot drift back
 * into a client bundle. The forms only need the field specs and the minimum
 * lengths (types.ts) to render and to have the browser refuse what the server
 * would. Shipping Zod too cost every form page about 20 KB compressed and an
 * LCP over budget, and under the enforced CSP its `new Function` probe raised
 * a violation in the browser. Both halves still read MIN from one place.
 */

/** Kenyan mobile numbers, loosely. */
const phone = z
  .string()
  .min(MIN.phone, 'A phone number is needed so we can reply.')
  .max(20)
  .regex(/^[0-9+\s()-]+$/, 'Use digits, spaces and + only.');

const name = z.string().min(MIN.name, 'Please give a name we can use.').max(120);
const optionalEmail = z
  .string()
  .max(160)
  .email('That does not look like an email address.')
  .optional()
  .or(z.literal(''));
const message = z.string().min(MIN.message, 'Please tell us a little more.').max(4000);

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
    interest: z.string().min(MIN.interest, 'Tell us what you are looking for.').max(400),
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
    product: z.string().min(MIN.product, 'What is being installed?').max(200),
    town: z.string().min(MIN.town, 'Where should we meet you?').max(80),
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
} as const satisfies Record<SubmissionKind, z.ZodType>;
