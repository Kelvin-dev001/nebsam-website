import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * KEYED HASHING FOR CERTIFICATE VERIFICATION. SECURITY-CRITICAL.
 *
 * Brief PART 9.2, docs/SECURITY_REQUIREMENTS.md §1. Read §1.1 before changing
 * anything here — the threat is not obvious from the code.
 *
 * The short version: a vehicle number plate is PUBLIC INFORMATION painted on the
 * outside of the vehicle. A lookup keyed on it that reveals validity or expiry
 * hands a thief a list of vehicles whose owners believe they are protected and
 * are not. So no plaintext plate is ever stored, and the lookup is a probe on a
 * keyed digest that is useless to anyone who steals the database without also
 * stealing the key.
 *
 * ── Every hash in the system is produced here ───────────────────────────────
 * There is exactly one implementation of "how a plate becomes a digest", and
 * both the reader (the server action) and the writer (the import tooling)
 * import it. That is not tidiness. If the seeder normalised differently from
 * the lookup — trimmed a hyphen the other did not, or skipped the O/0 fold —
 * every certificate would verify as NOT FOUND, and the failure would look
 * exactly like a customer mistyping their plate. It would be found by a support
 * call, months later, from someone who had already given up.
 *
 * ── Why this module alone has no `server-only` guard ───────────────────────
 * Every other module in lib/verification/ imports `server-only`, and this one
 * deliberately does not. The reason is the paragraph above.
 *
 * `server-only` is not an ordinary package — Next.js supplies it, so a plain
 * Node process cannot import anything that imports it. With the guard here, the
 * certificate seeder and the sprint's penetration test could not use these
 * functions and would have to reimplement normalisation and hashing. That copy
 * is the exact divergence the previous paragraph describes as catastrophic and
 * near-undetectable, and it would have been introduced to satisfy a guard.
 *
 * What is actually given up is small. This file imports `node:crypto`, which
 * fails a browser bundle outright, so a stray client import is a loud build
 * error rather than a silent leak — and the secret it reads is not a
 * `NEXT_PUBLIC_` variable, so Next would inline `undefined` and `secret()` would
 * throw rather than hash with a default. The guard stays where the real exposure
 * is: `lookup.ts`, which holds the service-role client.
 *
 * ── Domain separation ───────────────────────────────────────────────────────
 * One key, two message prefixes. Migration 0006 says the phone factor uses the
 * "same key domain" as the plate, and it does; the prefixes mean a plate whose
 * normalised form happened to equal a four-digit phone fragment still cannot
 * produce a colliding digest, and a stolen `phone_last4_hash` cannot be replayed
 * into `plate_hash`.
 */

/** The one place the secret is read. Throws loudly rather than hashing with a default. */
function secret(): string {
  const value = process.env.CERT_PLATE_HMAC_SECRET;
  if (!value) {
    // Deliberately fatal. A missing key must never silently degrade into
    // hashing with an empty string, which would be a stable, guessable digest
    // over a public plate — exactly the property the key exists to remove.
    throw new Error(
      'CERT_PLATE_HMAC_SECRET is not set. Certificate verification cannot run without it. See .env.example.',
    );
  }
  return value;
}

/**
 * The canonical form of a plate.
 *
 * Uppercase, drop everything that is not a letter or a digit, then fold O to 0
 * (brief 9.2). Kenyan plates are written a dozen ways — `KDA 123A`, `kda-123a`,
 * `KDA123A` — and all of them are the same vehicle to the person typing.
 *
 * The O/0 fold is a deliberate, lossy collision: `KDO 123A` and `KD0 123A`
 * become one key. That is the correct trade. The two are indistinguishable on a
 * dusty plate at the roadside and in most people's memory of their own vehicle,
 * and the alternative is a customer who cannot verify a certificate that exists.
 * The second factor, not the plate, is what makes the lookup safe.
 */
export function normalisePlate(input: string): string {
  return input.toUpperCase().replace(/[^A-Z0-9]/g, '').replace(/O/g, '0');
}

/**
 * The last four digits of the registered phone, canonically.
 *
 * Digits only, last four. `0722 123 456`, `+254722123456` and `...3456` all
 * reduce to `3456`, because a customer reading their own number off a contract
 * should not have to guess which format the form wants.
 */
export function normalisePhoneFactor(input: string): string {
  return input.replace(/\D/g, '').slice(-4);
}

function hmac(prefix: string, value: string): Buffer {
  return createHmac('sha256', secret()).update(`${prefix}:${value}`).digest();
}

/** HMAC of the NORMALISED plate. Never call this with raw input. */
export function plateHash(normalisedPlate: string): Buffer {
  return hmac('plate', normalisedPlate);
}

/** HMAC of the normalised last-four phone factor. */
export function phoneFactorHash(normalisedFactor: string): Buffer {
  return hmac('phone', normalisedFactor);
}

/**
 * HMAC of the client IP, for the attempt log.
 *
 * The log must not become the leak it exists to detect. An IP is personal data
 * under the DPA 2019 and Nebsam is a registered data controller, so the rate
 * limiter counts digests, never addresses. Keyed rather than plain SHA-256:
 * IPv4 is a 32-bit space and a plain digest of one is trivially reversed by
 * enumeration.
 */
export function ipHash(ip: string): Buffer {
  return hmac('ip', ip);
}

/** PostgREST's wire form for `bytea`. Verified against the live database, not assumed. */
export function toBytea(buffer: Buffer): string {
  return `\\x${buffer.toString('hex')}`;
}

/** Parses PostgREST's `\x…` back to bytes. Returns an empty buffer on anything unexpected. */
export function fromBytea(value: unknown): Buffer {
  if (typeof value !== 'string' || !value.startsWith('\\x')) return Buffer.alloc(0);
  const hex = value.slice(2);
  if (!/^[0-9a-f]*$/i.test(hex) || hex.length % 2 !== 0) return Buffer.alloc(0);
  return Buffer.from(hex, 'hex');
}

/**
 * Constant-time equality (SECURITY_REQUIREMENTS §1.5).
 *
 * `timingSafeEqual` throws on a length mismatch, and the throw itself is a
 * timing signal — it returns far faster than a real comparison. Both digests are
 * SHA-256 so lengths always match in practice; the guard covers a truncated or
 * corrupt stored value without introducing an early return that leaks.
 */
export function constantTimeEquals(a: Buffer, b: Buffer): boolean {
  if (a.length !== b.length || a.length === 0) return false;
  return timingSafeEqual(a, b);
}

/**
 * A digest to compare against when there is nothing to compare against.
 *
 * When the plate is unknown there is no stored phone hash, so the natural code
 * returns early — and returning early is measurably faster than the path that
 * does a comparison. That difference IS the oracle §1.5 forbids: it separates
 * "unknown plate" from "wrong second factor" without either message differing.
 *
 * So the unknown-plate path compares the submitted factor against this instead
 * and discards the result. Derived from the key, so it is a real digest of the
 * right shape rather than a constant an attacker could recognise.
 */
export function decoyFactorHash(): Buffer {
  return hmac('decoy', 'no-such-certificate');
}
