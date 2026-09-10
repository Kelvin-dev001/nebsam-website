'use server';

import { headers } from 'next/headers';
import { createHmac } from 'node:crypto';
import { serviceClient } from '@/lib/supabase/server';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { z } from 'zod';
import { SUBMISSION_SCHEMAS, type SubmissionKind, type SubmissionResult } from './types';

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
 * HASH of their IP, and it exists solely to make rate limiting possible.
 */

/**
 * Rate limiting WITHOUT a new table.
 *
 * The obvious implementation is a `submission_attempts` table beside
 * `verification_attempts`. CLAUDE.md §3.5 requires a data-model change to be
 * proposed and approved in writing before it is made, and this sprint had one
 * unavoidable one already (migration 0039). So the counter uses a column that
 * already exists: `submissions.payload` is `jsonb`, and the hash goes in it
 * under `meta`.
 *
 * It is a keyed hash, in a table no anon role can read, treated exactly as
 * `verification_attempts` treats an IP — which is the treatment the brief itself
 * specifies. It is not as clean as a dedicated table and it is not pretending to
 * be: a proper `submission_attempts` table is RECOMMENDED FOR SPRINT 12 in the
 * Sprint 11 report, where the admin inbox is built and the change can be
 * approved on its merits rather than smuggled in behind a contact form.
 */
const RATE_LIMIT_PER_HOUR = 5;

function ipDigest(ip: string): string {
  // Falls back to the plate secret's key domain deliberately: one server-only
  // secret to manage, and a separate prefix so a submission hash can never be
  // compared against a verification hash.
  const secret = process.env.CERT_PLATE_HMAC_SECRET ?? '';
  if (!secret) return '';
  return createHmac('sha256', secret).update(`submission-ip:${ip}`).digest('hex');
}

async function clientIp(): Promise<string> {
  const h = await headers();
  // Same precedence as the verification lookup, for the same reason: the
  // platform header cannot be forged past Vercel, a client-supplied one can.
  const platform = h.get('x-vercel-forwarded-for');
  if (platform) return platform.split(',')[0].trim();
  const forwarded = h.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return h.get('x-real-ip')?.trim() || 'local';
}

async function overRateLimit(digest: string): Promise<boolean> {
  if (!digest) return false;
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count, error } = await serviceClient()
    .from('submissions')
    .select('id', { count: 'exact', head: true })
    .eq('payload->meta->>ip_hash', digest)
    .gt('created_at', since);
  // Fail OPEN here, unlike verification.
  //
  // The asymmetry is deliberate. On the certificate endpoint an unreadable
  // counter means a possible attack and the safe answer is to refuse. On a
  // contact form it means a customer with an enquiry gets told to go away —
  // and losing a lead is the failure this whole site exists to prevent, while
  // the worst case here is a few extra rows in an inbox a human reads.
  if (error) return false;
  return (count ?? 0) >= RATE_LIMIT_PER_HOUR;
}

/** A short, human-quotable reference. Random, so nothing is enumerable. */
function reference(): string {
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // no I, L, O, 0, 1
  const bytes = new Uint32Array(6);
  crypto.getRandomValues(bytes);
  return `NBS-${Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('')}`;
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
    };
  }

  const { company, ...fields } = parsed.data as Record<string, unknown> & { company?: string | null };

  // The honeypot. Answered with SUCCESS, not an error: a bot that is told it
  // failed gets rewritten, and a bot that believes it succeeded goes away. The
  // row is simply never written.
  if (company) return { ok: true, reference: reference(), kind };

  const ip = await clientIp();
  const digest = ipDigest(ip);

  if (await overRateLimit(digest)) {
    return {
      ok: false,
      message:
        'We have already received several messages from this connection. Please give us a little time to reply, or send us a WhatsApp message.',
    };
  }

  /**
   * Turnstile, where it is configured.
   *
   * Unlike certificate verification, these forms are challenged on the FIRST
   * submission — there is no failure to count, and a contact form is a cheaper
   * target than a lookup. It fails OPEN when unconfigured, so an enquiry is
   * never lost to a missing key.
   */
  const token = formData.get('cf-turnstile-response');
  const passed = await verifyTurnstileToken(typeof token === 'string' ? token : null, ip);
  if (!passed) {
    return {
      ok: false,
      message: 'We could not confirm you are not a bot. Please try again, or message us on WhatsApp.',
    };
  }

  /**
   * ANONYMITY IS ENFORCED HERE, not in the browser.
   *
   * When a suggestion is marked anonymous the contact fields are DROPPED before
   * the row is built — not stored and hidden, not stored and filtered on read.
   * A checkbox that only changes what an admin screen displays is not anonymity,
   * and the person ticking it is trusting that it is.
   */
  const anonymous = kind === 'suggestion' && Boolean((fields as { anonymous?: string }).anonymous);
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
      payload: {
        ...payloadFields,
        reference: ref,
        // The rate-limit counter, and nothing else. An anonymous suggestion
        // stores NO hash at all — a per-sender counter would make anonymous
        // rows linkable to each other and to a named enquiry from the same
        // person, which is precisely the linkage the checkbox promises to
        // prevent. The cost is that anonymous suggestions are rate limited only
        // by Turnstile, and that is the right side to err on.
        meta: anonymous ? {} : { ip_hash: digest },
      },
    });

  if (error) {
    return {
      ok: false,
      message: 'We could not record your message just now. Please try again, or message us on WhatsApp.',
    };
  }

  return { ok: true, reference: ref, kind };
}
