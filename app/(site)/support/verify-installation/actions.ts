'use server';

import { z } from 'zod';
import { lookupByPlate } from '@/lib/verification/lookup';
import type { VerificationResult } from '@/lib/verification/types';

/**
 * The only entry point a browser has into certificate verification.
 *
 * Everything that decides an answer lives in lib/verification/lookup.ts. This
 * file is the boundary: it validates, and it refuses to pass anything through
 * that has not been validated. Brief PART 16 — server-side Zod on every
 * mutation, never trust client input.
 *
 * ── Why this action is so thin ──────────────────────────────────────────────
 * A server action is a public HTTP endpoint with a friendly signature. Anyone
 * can call it with any payload, in any order, as fast as they like. Keeping the
 * logic behind one validated call means the rate limiting, the timing floor and
 * the identical-failure guarantee cannot be skipped by reaching the lookup a
 * different way, because there is no other way to reach it.
 *
 * ── What is NOT here ────────────────────────────────────────────────────────
 * No logging. Not of the plate, not of the outcome, not of a failure.
 * SECURITY_REQUIREMENTS §1.5 forbids a plate — or an outcome tied to one — in
 * logs, and an action wrapper is precisely where a helpful `console.log(input)`
 * gets added while debugging and then forgotten. The attempt log, hashed and in
 * the database, is the record.
 */

const schema = z.object({
  // Bounds only. Normalisation and the real length rules belong to the lookup,
  // which owns the canonical form; duplicating them here is how the two drift.
  plate: z.string().min(1, 'Enter the vehicle registration.').max(32),
  phoneLast4: z.string().min(1, 'Enter the last four digits.').max(24),
  turnstileToken: z.string().max(4096).optional().nullable(),
  /**
   * The honeypot, checked HERE rather than in the browser.
   *
   * A client-side honeypot check stops nothing that matters: the adversary this
   * endpoint is built against posts straight to the action and never runs the
   * page. Checked on the server, a filled field is what it is meant to be — a
   * reliable tell that the caller filled every input it could find.
   */
  company: z.string().max(200).optional().nullable(),
});

/**
 * Adapts the lookup to `useActionState`.
 *
 * The `previous` argument is deliberately ignored. Carrying state forward across
 * attempts would mean the browser could tell the server what happened last time,
 * and on this endpoint the server trusts the attempt log for that and nothing
 * else.
 */
export async function verifyInstallationAction(
  _previous: VerificationResult | null,
  formData: FormData,
): Promise<VerificationResult> {
  const parsed = schema.safeParse({
    plate: formData.get('plate'),
    phoneLast4: formData.get('phoneLast4'),
    turnstileToken: formData.get('cf-turnstile-response'),
    company: formData.get('company'),
  });

  if (!parsed.success) {
    return {
      status: 'invalid_input',
      message: parsed.error.issues[0]?.message ?? 'Please check both fields.',
      // A malformed submission is not evidence about this client either way, so
      // it neither raises nor clears the challenge requirement. The next real
      // attempt asks the log.
      requiresChallenge: false,
    };
  }

  if (parsed.data.company) {
    // Answered with the ordinary failure copy and nothing else. Telling a bot it
    // tripped a honeypot teaches whoever wrote it to stop filling the field.
    return { status: 'unverified', requiresChallenge: false };
  }

  return lookupByPlate(parsed.data);
}
