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
 * The obvious implementation is a `submission_attempts` table of its own. CLAUDE.md §3.5 requires a data-model change to be
 * proposed and approved in writing before it is made, and this sprint had one
 * unavoidable one already (migration 0039). So the counter uses a column that
 * already exists: `submissions.payload` is `jsonb`, and the hash goes in it
 * under `meta`.
 *
 * It is a keyed hash, in a table no anon role can read — the treatment the
 * brief itself specifies for an IP. It is not as clean as a dedicated table and it is not pretending to
 * be: a proper `submission_attempts` table is RECOMMENDED FOR SPRINT 12 in the
 * Sprint 11 report, where the admin inbox is built and the change can be
 * approved on its merits rather than smuggled in behind a contact form.
 */
const RATE_LIMIT_PER_HOUR = 5;

let warnedNoSecret = false;

function ipDigest(ip: string): string {
  // SUBMISSION_IP_HMAC_SECRET since ADR-0007. It used to share the certificate
  // lookup's CERT_PLATE_HMAC_SECRET; certificate verification is gone, and a
  // secret named after a deleted feature invites someone to delete it — which
  // would switch this rate limiting off without a sound. The old name is read
  // as a fallback until every environment has the new one; remove it then.
  const secret = process.env.SUBMISSION_IP_HMAC_SECRET || process.env.CERT_PLATE_HMAC_SECRET || '';
  if (!secret) {
    // Still fails OPEN (see overRateLimit), but no longer silently. No IP, no
    // payload, nothing personal: just the fact that a guard is off.
    if (!warnedNoSecret) {
      console.warn('SUBMISSION_IP_HMAC_SECRET is not set: enquiry-form rate limiting is off.');
      warnedNoSecret = true;
    }
    return '';
  }
  return createHmac('sha256', secret).update(`submission-ip:${ip}`).digest('hex');
}

async function clientIp(): Promise<string> {
  const h = await headers();
  // The platform header first: it cannot be forged past Vercel, a
  // client-supplied one can.
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
  // Fail OPEN, deliberately. Where an unreadable counter guards something an
  // attacker wants, the safe answer is to refuse. Here, refusing means a
  // customer with an enquiry gets told to go away — and losing a lead is the
  // failure this whole site exists to prevent, while the worst case of failing
  // open is a few extra rows in an inbox a human reads.
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

  const { company, ...fields } = parsed.data as Record<string, unknown> & {
    company?: string | null;
  };

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
      message:
        'We could not record your message just now. Please try again, or message us on WhatsApp.',
    };
  }

  return { ok: true, reference: ref, kind };
}
