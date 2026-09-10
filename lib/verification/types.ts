/**
 * The shape of a verification answer.
 *
 * Deliberately in its own module with NO `server-only` import, because the
 * client form needs the type and importing the lookup would drag the
 * service-role client into a browser bundle — or, more likely, fail the build,
 * which is the safer of the two but still a wasted afternoon.
 *
 * ── What a result may contain ───────────────────────────────────────────────
 * SECURITY_REQUIREMENTS §1.4 fixes this exhaustively: status, the plate as the
 * visitor typed it, installation date, expiry date. NOTHING ELSE. No customer
 * name, no phone number, no branch, no technician, no device id, no address.
 * The type is written to make that structural — there is no field here for any
 * of them, so adding one is a visible decision rather than an autocomplete.
 */

export type VerificationStatus =
  | 'valid'
  | 'expired'
  /**
   * The single generic failure. Unknown plate and wrong second factor BOTH land
   * here, and they are indistinguishable to the caller by design: two different
   * answers would tell an enumerator which plates exist, which is the entire
   * disclosure the second factor was added to prevent (§1.5).
   */
  | 'unverified'
  | 'rate_limited'
  /** A challenge is required and was absent, or failed. */
  | 'challenge_required'
  /** The form itself was not filled in usably. Says nothing about any record. */
  | 'invalid_input';

export interface VerificationResult {
  status: VerificationStatus;
  /** Echoed back exactly as typed, so the visitor can see what was searched. */
  plate?: string;
  /** ISO dates. Present only on `valid` and `expired`, where both factors matched. */
  installedOn?: string | null;
  expiresOn?: string | null;
  /** Field-level message for `invalid_input` only. Never carries a lookup outcome. */
  message?: string;
  /**
   * Whether the NEXT attempt from this client must carry a Turnstile token.
   * Server-derived from the attempt log, never from anything the browser said.
   */
  requiresChallenge: boolean;
}

/** Everything the analytics layer is allowed to know. The outcome, and nothing else. */
export type VerificationEventOutcome = VerificationStatus;
