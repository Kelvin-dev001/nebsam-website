'use server';

import { after } from 'next/server';
import { SITE_URL } from '@/lib/company';
import { notifyStaff } from '@/lib/email';
import { serviceClient } from '@/lib/supabase/server';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { z } from 'zod';
import { clientIp, recordAttempt } from './rate-limit';
import { SUBMISSION_SCHEMAS } from './schemas';
import { SUBMISSION_FIELDS, type SubmissionKind, type SubmissionResult } from './types';

/**
 * THE ENQUIRY INBOX — one action for all four public forms.
 *
 * Brief PART 16: server-side Zod on every mutation, rate limiting on every
 * public POST endpoint, bot protection that never blocks a keyboard user, and no
 * PII anywhere it does not belong.
 *
 * ── Why one action and not four ─────────────────────────────────────────────
 * Four near-identical actions is four places to forget the honeypot. The kind is
 * a parameter, the schema is looked up from it, and there is exactly one path
 * from a browser into `submissions`.
 *
 * ── What is deliberately NOT collected ──────────────────────────────────────
 * No IP address in the clear, no user agent, no referrer, no device
 * fingerprint. The only trace of the sender beyond what they typed is a KEYED
 * HASH of their IP, kept apart from the enquiry and deleted after 24 hours
 * (`rate-limit.ts`), and it exists solely to make rate limiting possible.
 */

/** A short, human-quotable reference. Random, so nothing is enumerable. */
function reference(): string {
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // no I, L, O, 0, 1
  const bytes = new Uint32Array(6);
  crypto.getRandomValues(bytes);
  return `NBS-${Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('')}`;
}

/**
 * WHAT THE PERSON TYPED, handed back with a refusal (register V81).
 *
 * React resets a form after every action, failed ones included, so a refusal
 * that returns only a message wipes the form: "please tell us a little more",
 * and nothing left to add to. Only the form's own fields go back, read by name
 * from SUBMISSION_FIELDS — never the honeypot, the kind or the Turnstile token —
 * and only to the browser that has just sent them. Never with a success.
 */
function typed(kind: SubmissionKind, formData: FormData): Record<string, string> {
  const values: Record<string, string> = {};
  for (const { name } of SUBMISSION_FIELDS[kind]) {
    const value = formData.get(name);
    // 4000: the longest any field accepts (the message).
    if (typeof value === 'string') values[name] = value.slice(0, 4000);
  }
  return values;
}

/**
 * WHICH FORM THIS IS, read from the request rather than bound to the action.
 *
 * ── Why not `submitEnquiry.bind(null, kind)` ────────────────────────────────
 * Because it hung the server. Measured, on the production build of Next 15.5.23:
 * a form whose action was created with `.bind()` blocked the Node event loop the
 * moment it was submitted along the no-JavaScript path — not a slow response, a
 * dead process. The port stayed open and every subsequent request, including
 * plain GETs of unrelated pages, went unanswered until it was killed.
 *
 * It was isolated rather than guessed at. A submission that fails validation on
 * its first field, doing no database or network work at all, hung identically —
 * which ruled out the rate limiter, Turnstile and Supabase. Posting to the
 * UNBOUND verification action on the same build returned in 1.7 s, and the bound
 * enquiry action on the next request hung. The difference was the binding.
 *
 * So the kind travels as an ordinary hidden field. It is untrusted input and is
 * validated as such — but note what it actually controls: which schema validates
 * the rest, and which value lands in `submissions.type`. A caller who forges it
 * gets their message filed under the wrong heading in an inbox a human reads.
 * There is no authorisation attached to it and no branch that trusts it further.
 */
const KIND = z.enum(['contact', 'quote', 'installation', 'suggestion']);

export async function submitEnquiry(
  _previous: SubmissionResult | null,
  formData: FormData,
): Promise<SubmissionResult> {
  const kindResult = KIND.safeParse(formData.get('kind'));
  if (!kindResult.success) return { ok: false, message: 'That form is not available.' };
  const kind: SubmissionKind = kindResult.data;
  const schema = SUBMISSION_SCHEMAS[kind];

  const raw = Object.fromEntries(formData.entries());
  const parsed = schema.safeParse(raw);

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      ok: false,
      message: issue?.message ?? 'Please check the form.',
      field: typeof issue?.path[0] === 'string' ? issue.path[0] : undefined,
      values: typed(kind, formData),
    };
  }

  const { company, ...fields } = parsed.data as Record<string, unknown> & {
    company?: string | null;
  };

  // The honeypot. Answered with SUCCESS, not an error: a bot that is told it
  // failed gets rewritten, and a bot that believes it succeeded goes away. The
  // row is simply never written.
  if (company) return { ok: true, reference: reference(), kind };

  /**
   * ANONYMITY IS ENFORCED HERE, not in the browser — and decided BEFORE rate
   * limiting, because an anonymous suggestion is never recorded as an attempt
   * (see rate-limit.ts for why a timestamp would otherwise identify it).
   *
   * When a suggestion is marked anonymous the contact fields are DROPPED before
   * the row is built — not stored and hidden, not stored and filtered on read.
   * A checkbox that only changes what an admin screen displays is not anonymity,
   * and the person ticking it is trusting that it is.
   */
  const anonymous = kind === 'suggestion' && Boolean((fields as { anonymous?: string }).anonymous);

  const ip = await clientIp();
  const { limited } = anonymous ? { limited: false } : await recordAttempt(ip, kind);

  if (limited) {
    return {
      ok: false,
      message:
        'We have already received several messages from this connection. Please give us a little time to reply, or send us a WhatsApp message.',
      values: typed(kind, formData),
    };
  }

  /**
   * Turnstile, where it is configured.
   *
   * Checked on the FIRST submission — there is no failure to count. It fails
   * OPEN when unconfigured, so an enquiry is never lost to a missing key.
   * NOTE: no widget renders a token yet (register V78; see lib/turnstile.ts), so
   * the keys must not be set until one does.
   */
  const token = formData.get('cf-turnstile-response');
  const passed = await verifyTurnstileToken(typeof token === 'string' ? token : null, ip);
  if (!passed) {
    return {
      ok: false,
      message:
        'We could not confirm you are not a bot. Please try again, or message us on WhatsApp.',
      values: typed(kind, formData),
    };
  }

  const payloadFields = anonymous
    ? { message: (fields as { message?: string }).message ?? '' }
    : fields;

  const ref = reference();
  const { error } = await serviceClient()
    .from('submissions')
    .insert({
      type: kind,
      is_anonymous: anonymous,
      status: 'new',
      // No rate-limit fingerprint here any more (V79): it lives in
      // submission_attempts, apart from the enquiry, and is pruned after 24 hours.
      payload: { ...payloadFields, reference: ref },
    });

  if (error) {
    return {
      ok: false,
      message:
        'We could not record your message just now. Please try again, or message us on WhatsApp.',
      values: typed(kind, formData),
    };
  }

  // Tell staff, once the response has gone (lib/email.ts): the kind and the
  // reference only, never what the person wrote. Quotes and bookings are sales.
  const what = NOTIFY_WORDING[kind];
  after(() =>
    notifyStaff(
      kind === 'quote' || kind === 'installation' ? 'sales' : 'info',
      `New ${what} on the website: ${ref}`,
      `A new ${what} (${ref}) is waiting in the admin inbox:\n${SITE_URL}/admin/inbox\n\n` +
        'The details are in the inbox, not in this email.',
    ),
  );

  return { ok: true, reference: ref, kind };
}

const NOTIFY_WORDING: Record<SubmissionKind, string> = {
  contact: 'contact message',
  quote: 'quote request',
  installation: 'installation booking',
  suggestion: 'suggestion',
};
