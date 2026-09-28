import 'server-only';

import { headers } from 'next/headers';
import { createHmac } from 'node:crypto';
import { serviceClient } from '@/lib/supabase/server';
import type { SubmissionKind } from './types';

/**
 * RATE LIMITING FOR THE ENQUIRY FORMS — on `submission_attempts` (migration
 * 0041, register V58), wired up in register V79.
 *
 * Until V79 the count lived inside each enquiry, as a keyed IP fingerprint in
 * `submissions.payload.meta`, kept as long as the enquiry was. The privacy
 * notice promises the counts are deleted after 24 hours; that is now what
 * happens, because the attempts live in their own table and are pruned on every
 * write.
 *
 * ── What is recorded ───────────────────────────────────────────────────────
 * One row per attempt: a keyed digest of the client IP, which form, whether it
 * was refused, and when. No IP in the clear, no link to the enquiry. A refused
 * attempt is recorded too, so a client that keeps posting keeps feeding the
 * window it is measured against — the backoff escalates without a timer (0041).
 *
 * ── Anonymous suggestions are NOT recorded ─────────────────────────────────
 * 0041 intended to rate limit them too, reasoning that no column joins an
 * attempt to its submission. A timestamp does: an attempt at 10:42:07 beside an
 * anonymous suggestion at 10:42:07 ties the suggestion to an IP fingerprint, and
 * through it to that person's named enquiries, for the 24 hours the row lives.
 * The privacy notice promises an anonymous suggestion stores no fingerprint at
 * all, so none is recorded. The cost — anonymous suggestions are protected by
 * the honeypot alone until Turnstile is live (V78) — is the right side to err on.
 */

export const RATE_LIMIT_PER_HOUR = 5;

let warnedNoSecret = false;

function ipDigestHex(ip: string): string {
  // SUBMISSION_IP_HMAC_SECRET only. The old certificate secret's name was read
  // as a fallback for one release after ADR-0007, and no longer is.
  const secret = process.env.SUBMISSION_IP_HMAC_SECRET || '';
  if (!secret) {
    // Fails OPEN, but not silently. No IP, no payload: just that a guard is off.
    if (!warnedNoSecret) {
      console.warn('SUBMISSION_IP_HMAC_SECRET is not set: enquiry-form rate limiting is off.');
      warnedNoSecret = true;
    }
    return '';
  }
  return createHmac('sha256', secret).update(`submission-ip:${ip}`).digest('hex');
}

/** The client IP. The platform header first: it cannot be forged past Vercel. */
export async function clientIp(): Promise<string> {
  const h = await headers();
  const platform = h.get('x-vercel-forwarded-for');
  if (platform) return platform.split(',')[0].trim();
  const forwarded = h.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return h.get('x-real-ip')?.trim() || 'local';
}

/**
 * Records this attempt and says whether it is over the limit.
 *
 * FAILS OPEN at every step, deliberately. Where an unreadable counter guards
 * something an attacker wants, refusing is right; here, refusing means a
 * customer with an enquiry is told to go away, and losing a lead is the failure
 * this site exists to prevent.
 */
export async function recordAttempt(
  ip: string,
  kind: SubmissionKind,
): Promise<{ limited: boolean }> {
  const hex = ipDigestHex(ip);
  if (!hex) return { limited: false };

  // bytea, in the hex input format PostgREST accepts.
  const ipHash = `\\x${hex}`;
  const db = serviceClient();
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  const { count, error } = await db
    .from('submission_attempts')
    .select('id', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .gt('created_at', since);
  const limited = !error && (count ?? 0) >= RATE_LIMIT_PER_HOUR;

  await db.from('submission_attempts').insert({ ip_hash: ipHash, kind, refused: limited });
  // Retention on write (0041): pg_cron is not adopted, and a delete that runs
  // with every attempt cannot quietly stop running the way a schedule can.
  await db.rpc('prune_submission_attempts');

  return { limited };
}
