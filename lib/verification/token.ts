import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * THE PRINTED-CERTIFICATE QR TOKEN.
 *
 * SECURITY_REQUIREMENTS §1.2, final paragraph. This is the half of the design
 * that keeps the legitimate path frictionless: the holder of the physical
 * certificate scans the QR code printed on it and sees the answer immediately,
 * with no second factor at all. Only manual plate entry has to prove anything,
 * because only manual plate entry can be performed by someone who has never
 * touched the certificate.
 *
 * ── Why possession is enough ────────────────────────────────────────────────
 * The token is not a secret the site issues to a browser. It is printed on a
 * document that lives in a specific vehicle's glovebox. Holding it is already
 * the evidence of legitimate interest that the last-four-digits factor exists to
 * establish. Demanding a second factor from someone holding the certificate
 * would add friction that buys nothing.
 *
 * ── What the signature actually buys ────────────────────────────────────────
 * The certificate id never travels unprotected. Without a signature the token
 * would be a bare identifier in a URL, and a bare identifier in a URL is
 * enumerable — which is the whole failure this subsystem is built to avoid,
 * reintroduced through the convenient door. The HMAC means a token that was not
 * minted by Nebsam is rejected without a database round trip.
 *
 * ── Separate secret, deliberately ───────────────────────────────────────────
 * CERT_QR_TOKEN_SECRET is not CERT_PLATE_HMAC_SECRET. Rotating the plate secret
 * invalidates the entire lookup index and needs a planned re-hash migration
 * (0006). Rotating this one invalidates printed QR codes and nothing else. They
 * are separate so that the cheap emergency and the expensive one stay separate.
 *
 * ── No `server-only` guard here either ─────────────────────────────────────
 * For the same reason as hashing.ts, and it matters more here. Sprint 11's gate
 * requires proving that a token cannot be replayed after expiry, which means the
 * penetration test has to MINT an already-expired token — with the real signing
 * function, not a copy of it. A test that signs tokens its own way proves that
 * its own code agrees with itself.
 *
 * `server-only` is supplied by Next, so importing it would put this module out
 * of reach of any plain Node process. The exposure given up is small:
 * `node:crypto` fails a browser bundle outright, and the secret is not a
 * `NEXT_PUBLIC_` variable, so a stray client import is a loud build error rather
 * than a quiet leak.
 *
 * ── Expiry ──────────────────────────────────────────────────────────────────
 * A token carries its own expiry, and the natural value is the certificate's,
 * because a QR code printed on a one-year certificate has to keep working for
 * that year. Replay WITHIN the window is expected and fine — the owner may scan
 * it monthly. Replay AFTER it is refused, and Sprint 11's gate tests exactly
 * that.
 */

const TOKEN_VERSION = 'v1';

function secret(): string {
  const value = process.env.CERT_QR_TOKEN_SECRET;
  if (!value) {
    throw new Error(
      'CERT_QR_TOKEN_SECRET is not set. Printed-certificate QR links cannot be signed or checked. See .env.example.',
    );
  }
  return value;
}

function sign(payload: string): string {
  return createHmac('sha256', secret()).update(payload).digest('base64url');
}

export interface TokenClaims {
  certificateId: string;
  /** Seconds since the epoch. */
  expiresAt: number;
}

/**
 * Mints a token for printing. Not called by any page — the import tooling that
 * loads real certificates calls it, and Sprint 11's penetration test calls it to
 * mint the expired one it then tries to replay.
 */
export function signVerificationToken({ certificateId, expiresAt }: TokenClaims): string {
  const payload = `${TOKEN_VERSION}.${certificateId}.${expiresAt}`;
  return `${payload}.${sign(payload)}`;
}

export type TokenResult =
  | { ok: true; certificateId: string }
  /**
   * One reason code, never surfaced to the browser. The page renders the same
   * generic copy for every failure; this exists so the attempt log can tell an
   * expired token apart from a forged one, which is a materially different
   * signal about what is happening to the site.
   */
  | { ok: false; reason: 'malformed' | 'bad_signature' | 'expired' };

/** Verifies shape, then signature, then expiry — in that order, on purpose. */
export function verifyVerificationToken(token: string, now: Date = new Date()): TokenResult {
  const parts = token.split('.');
  if (parts.length !== 4) return { ok: false, reason: 'malformed' };

  const [version, certificateId, expiresAtRaw, signature] = parts;
  if (version !== TOKEN_VERSION) return { ok: false, reason: 'malformed' };
  if (!/^[0-9a-f-]{36}$/i.test(certificateId)) return { ok: false, reason: 'malformed' };

  const expiresAt = Number(expiresAtRaw);
  if (!Number.isInteger(expiresAt)) return { ok: false, reason: 'malformed' };

  // Signature BEFORE expiry. The expiry is attacker-supplied text until the
  // signature has been checked, so trusting it first would mean acting on an
  // unauthenticated claim — and it would let a forged token be reported as
  // merely expired, which is the wrong entry in the attempt log.
  const expected = sign(`${version}.${certificateId}.${expiresAtRaw}`);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { ok: false, reason: 'bad_signature' };
  }

  if (expiresAt * 1000 <= now.getTime()) return { ok: false, reason: 'expired' };

  return { ok: true, certificateId };
}
