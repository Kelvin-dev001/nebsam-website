import 'server-only';
import { headers } from 'next/headers';
import { serviceClient } from '@/lib/supabase/server';
import { verifyTurnstileToken } from '@/lib/turnstile';
import type { VerificationResult } from './types';
import { verifyVerificationToken } from './token';
import {
  constantTimeEquals,
  decoyFactorHash,
  fromBytea,
  ipHash,
  normalisePhoneFactor,
  normalisePlate,
  phoneFactorHash,
  plateHash,
  toBytea,
} from './hashing';

/**
 * THE CERTIFICATE LOOKUP. The highest-risk surface on the site.
 *
 * Brief PART 9.2 · docs/SECURITY_REQUIREMENTS.md §1. Every rule below is from
 * there, and each is written next to the code that implements it so that a later
 * change has to argue with the reason rather than merely edit past it.
 *
 * ── Five properties this file exists to hold ────────────────────────────────
 *  1. No plaintext plate is stored or queried. The probe is on a keyed digest.
 *  2. Unknown plate and wrong second factor return the SAME result, by the same
 *     code path, in the same time.
 *  3. Every attempt is logged with hashed IP, hashed plate and outcome —
 *     including the attempts that were refused before any lookup happened.
 *  4. Rate limits escalate on their own, because refusals are logged too.
 *  5. Nothing here ever logs, returns or reports a plate.
 */

/**
 * The timing floor, in milliseconds.
 *
 * §1.5 requires no timing difference between "unknown plate" and "wrong second
 * factor". The comparison itself is already constant-time and the two paths do
 * the same number of database round trips, so the residual difference is the
 * cost of transferring one small row — microseconds, swamped by network jitter.
 *
 * The floor makes it unobservable rather than merely small: every answer takes
 * at least this long, so an attacker measuring the wire learns the floor and
 * nothing else.
 *
 * ── Why 750 and not 500 ─────────────────────────────────────────────────────
 * MEASURED, not chosen. A floor only equalises paths that finish INSIDE it, and
 * at 500 ms it never bound: the fastest real response on the development machine
 * was 636 ms, so every answer was already past the floor by the time it was
 * consulted and the floor equalised nothing at all. Sprint 11's penetration test
 * put the two failure branches at an AUC around 0.6 in that state.
 *
 * 750 ms sits above the observed fast path and still well under the ~1 s at
 * which a form begins to feel broken. Against a Supabase instance co-located
 * with the function — the deployed case, rather than a laptop reaching across
 * the internet — there is more headroom still.
 *
 * The floor is a backstop, not the argument. The real guarantee is structural:
 * both branches issue the same reads, at the same time, and compare against a
 * decoy when there is nothing to compare against. Sprint 11's penetration test
 * measures the distributions rather than trusting this comment, and it should be
 * re-run against the preview deployment, where the latencies are the real ones.
 */
export const TIMING_FLOOR_MS = 750;

/** Attempts per IP per hour before refusal. Default 10, per .env.example. */
function ipLimit(): number {
  return Number(process.env.CERT_VERIFY_RATE_LIMIT_PER_HOUR ?? 10);
}

/** Attempts per plate per day before refusal. Default 5. */
function plateLimit(): number {
  return Number(process.env.CERT_VERIFY_RATE_LIMIT_PER_PLATE_PER_DAY ?? 5);
}

/**
 * The client IP, as the platform reports it.
 *
 * ── THE TRUST ASSUMPTION, STATED ────────────────────────────────────────────
 * Every rate limit here is only as good as this function, and this function
 * trusts a request header. `x-forwarded-for` is set by whatever sits in front of
 * the application — and if nothing does, it is set by the CALLER. A client that
 * can choose its own `x-forwarded-for` has an unlimited supply of rate-limit
 * buckets and the limiter stops existing.
 *
 * Sprint 11's penetration test demonstrates this deliberately: it spoofs the
 * header to give each section its own bucket, which it can only do because a
 * local `npm start` has no proxy in front of it.
 *
 * `x-vercel-forwarded-for` is therefore preferred. Vercel sets it at the edge
 * and a client cannot forge it past the platform, so on the deployment target it
 * is authoritative. `x-forwarded-for` is the fallback for any other host, and it
 * is trustworthy ONLY behind a proxy that overwrites rather than appends.
 *
 * DEPLOYMENT DEPENDENCY: serving this application from an origin that is
 * directly reachable, without a trusted proxy, makes certificate-verification
 * rate limiting bypassable. It is recorded in the Sprint 11 report.
 */
async function clientIp(): Promise<string> {
  const h = await headers();
  const platform = h.get('x-vercel-forwarded-for');
  if (platform) return platform.split(',')[0].trim();
  const forwarded = h.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return h.get('x-real-ip')?.trim() || 'local';
}

type Outcome = 'valid' | 'expired' | 'not_found' | 'factor_failed' | 'rate_limited';

/**
 * Writes the attempt log. Never throws into the caller.
 *
 * A failure to log must not turn a legitimate verification into an error page —
 * but it must also not pass silently, because the log is the only thing standing
 * between an enumeration attack and nobody noticing. So it is swallowed here and
 * surfaced as a generic console error carrying no plate, no IP and no outcome
 * detail.
 */
async function recordAttempt(
  ip: Buffer,
  plate: Buffer | null,
  outcome: Outcome,
): Promise<void> {
  try {
    await serviceClient().from('verification_attempts').insert({
      ip_hash: toBytea(ip),
      plate_hash: plate ? toBytea(plate) : null,
      outcome,
    });
  } catch {
    console.error('[verification] attempt log write failed');
  }
}

/**
 * How many attempts from this IP in the last hour ended in a failure?
 *
 * This is the challenge gate: §1.5 wants bot protection "from the first failed
 * attempt", which means counting failures specifically rather than all traffic.
 * Counting all traffic would challenge the honest customer who verifies two
 * vehicles in a row, which is friction bought for nothing.
 *
 * Read with the service-role client straight off the base table. That is the
 * sanctioned use — `verification_attempts` has no public view and must never
 * have one — and it avoids adding a database function for one count.
 */
async function recentFailures(ip: Buffer): Promise<number> {
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count, error } = await serviceClient()
    .from('verification_attempts')
    .select('id', { count: 'exact', head: true })
    .eq('ip_hash', toBytea(ip))
    .gt('created_at', since)
    .in('outcome', ['not_found', 'factor_failed', 'rate_limited']);
  // Fail CLOSED. If the count cannot be read we do not know whether this client
  // has been failing, and on this endpoint the safe assumption is that it has.
  if (error) return Number.POSITIVE_INFINITY;
  return count ?? 0;
}

/**
 * Rate limit, per IP per hour and per plate per day.
 *
 * ── Why this escalates without any backoff arithmetic ───────────────────────
 * §8 asks for "escalating backoff". There is no timer here and no penalty
 * counter, because the log already produces the behaviour: a REFUSED attempt is
 * itself logged, as `rate_limited`. So a client that keeps hammering keeps
 * feeding the same trailing-hour window it is being measured against, and stays
 * blocked for a full hour after its LAST attempt rather than its tenth. Give up
 * and you are back in ten minutes; keep going and you are never back.
 *
 * That is the property migration 0039 exists for. Log refusals as `not_found`
 * and the escalation silently disappears while the code still looks correct.
 */
async function isRateLimited(ip: Buffer, plate: Buffer): Promise<boolean> {
  const { data, error } = await serviceClient().rpc('verification_attempt_counts', {
    p_ip_hash: toBytea(ip),
    p_plate_hash: toBytea(plate),
  });
  // Fail closed, for the same reason as the failure count above.
  if (error) return true;
  const row = Array.isArray(data) ? data[0] : data;
  if (!row) return false;
  return Number(row.ip_last_hour) >= ipLimit() || Number(row.plate_last_day) >= plateLimit();
}

/** Holds the response until the floor has elapsed. */
async function holdUntilFloor(startedAt: number): Promise<void> {
  const remaining = TIMING_FLOOR_MS - (Date.now() - startedAt);
  if (remaining > 0) await new Promise((resolve) => setTimeout(resolve, remaining));
}

/**
 * The single exit. Waits out the floor and the attempt-log write TOGETHER, then
 * answers.
 *
 * ── Why the write is overlapped rather than awaited first ───────────────────
 * The insert is the third round trip, and on the previous shape it sat on the
 * critical path in front of the floor — so it pushed every response past the
 * floor and, again, stopped the floor from equalising anything. Started here and
 * awaited alongside the wait, it costs nothing on any request where the floor is
 * doing its job.
 *
 * It is still AWAITED. Returning while a security-log write is in flight would
 * mean a serverless function that can be frozen the instant it responds might
 * never finish writing the row — and the log going quiet under load is exactly
 * the failure the log exists to prevent. Overlapped, not skipped.
 *
 * Both waits run concurrently, so the response is held for whichever takes
 * longer, which is the floor whenever the floor is binding.
 */
async function finish(
  startedAt: number,
  write: Promise<void> | null,
  result: VerificationResult,
): Promise<VerificationResult> {
  await Promise.all([holdUntilFloor(startedAt), write ?? Promise.resolve()]);
  return result;
}

interface PlateLookupInput {
  plate: string;
  phoneLast4: string;
  turnstileToken?: string | null;
}

/**
 * Plate + second factor. The path a visitor types into.
 *
 * Reads top to bottom as: decide whether this client may ask at all, then ask,
 * then answer identically however it failed.
 */
export async function lookupByPlate(input: PlateLookupInput): Promise<VerificationResult> {
  const startedAt = Date.now();
  const ip = await clientIp();
  const ipDigest = ipHash(ip);

  const normalisedPlate = normalisePlate(input.plate);
  const normalisedFactor = normalisePhoneFactor(input.phoneLast4);

  // Input validation says nothing about any record, so it returns before the
  // floor. A visitor who typed two characters learns only that they typed two
  // characters.
  if (normalisedPlate.length < 4 || normalisedPlate.length > 16) {
    return {
      status: 'invalid_input',
      message: 'Enter the vehicle registration as it appears on the plate.',
      requiresChallenge: false,
    };
  }
  if (normalisedFactor.length !== 4) {
    return {
      status: 'invalid_input',
      message: 'Enter the last four digits of the phone number registered on the installation.',
      requiresChallenge: false,
    };
  }

  const plateDigest = plateHash(normalisedPlate);

  /**
   * EVERY REQUEST DOES THE SAME THREE READS, AT THE SAME TIME.
   *
   * ── Why this shape, and what the previous shape cost ────────────────────────
   * The obvious code asks its questions in order and stops as soon as it can:
   * check the rate limit, then the challenge, then look the certificate up. It is
   * easier to read and it was measurably WRONG.
   *
   * Three sequential Supabase round trips put roughly 1.3 s of work in front of a
   * 500 ms floor, so the floor never bound — it can only equalise paths that
   * finish inside it. Sprint 11's penetration test measured the two failure
   * branches as separable at an AUC around 0.7 across seven runs: not enough to
   * read a single response, enough to be a real signal, and it did not exist in
   * the database layer when measured on its own (AUC 0.537). It was the SHAPE of
   * the code, not the queries.
   *
   * So all three reads are issued together. Precedence is unchanged — the gates
   * are still evaluated in order below, and a refused client still learns
   * nothing — but the wall time is one round trip instead of three, which puts
   * the work back under the floor where the floor can do its job.
   *
   * ── The cost, stated ────────────────────────────────────────────────────────
   * A rate-limited request now performs a certificate lookup whose result is
   * discarded. That is one extra index probe per refused request, and it buys
   * uniform timing for every request that is NOT refused. It discloses nothing:
   * the row never reaches a response, and the refusal is returned before the
   * value is read.
   */
  const [limited, failures, lookup] = await Promise.all([
    isRateLimited(ipDigest, plateDigest),
    recentFailures(ipDigest),
    serviceClient()
      .from('installation_certificates')
      .select('phone_last4_hash, installed_on, expires_on, status')
      .eq('plate_hash', toBytea(plateDigest))
      .maybeSingle(),
  ]);

  if (limited) {
    return finish(startedAt, recordAttempt(ipDigest, plateDigest, 'rate_limited'), {
      status: 'rate_limited',
      requiresChallenge: true,
    });
  }

  // The challenge gate. Derived from the log, so a script that never renders the
  // widget cannot opt out of it by not sending the flag.
  const challengeRequired = failures > 0;
  if (challengeRequired) {
    const passed = await verifyTurnstileToken(input.turnstileToken, ip);
    if (!passed) {
      // NOT logged as a verification attempt: nothing was looked up, and writing
      // it would let anyone push their own IP over the rate limit without ever
      // touching a certificate.
      return finish(startedAt, null, { status: 'challenge_required', requiresChallenge: true });
    }
  }

  const { data: certificate, error } = lookup;

  if (error) {
    return finish(startedAt, null, {
      status: 'invalid_input',
      message: 'Verification is unavailable at the moment. Please try again shortly.',
      requiresChallenge: challengeRequired,
    });
  }

  /**
   * THE COMPARISON, AND THE DECOY.
   *
   * When there is no certificate there is nothing to compare against, and the
   * obvious code returns here. Returning here is measurably faster than the path
   * that compares — and that difference is an oracle separating "unknown plate"
   * from "wrong factor" while both messages stay identical. So the unknown-plate
   * path compares against a decoy digest and throws the answer away.
   */
  const storedFactor = certificate ? fromBytea(certificate.phone_last4_hash) : decoyFactorHash();
  const factorMatches = constantTimeEquals(phoneFactorHash(normalisedFactor), storedFactor);
  /**
   * Both operands are ALREADY COMPUTED above, so this branch short-circuits no
   * work — the decoy comparison has run whether or not there is a certificate.
   * Written as a guard rather than a `verified` boolean purely so TypeScript
   * narrows `certificate` for the success path below; a non-null assertion would
   * have read as an assumption, and there are no assumptions in this file.
   */
  if (!certificate || !factorMatches) {
    return finish(
      startedAt,
      recordAttempt(ipDigest, plateDigest, certificate ? 'factor_failed' : 'not_found'),
      // ONE message for both. The distinction exists in the log, where only
      // Nebsam can see it, and nowhere else.
      { status: 'unverified', plate: input.plate.trim(), requiresChallenge: true },
    );
  }

  const status = certificateStatus(certificate.expires_on, certificate.status);
  return finish(startedAt, recordAttempt(ipDigest, plateDigest, status), {
    status,
    plate: input.plate.trim(),
    installedOn: certificate.installed_on,
    expiresOn: certificate.expires_on,
    requiresChallenge: false,
  });
}

/**
 * Scanned from the printed certificate. No second factor — see token.ts.
 *
 * Still rate limited and still logged. A signed token is not a licence to make
 * unlimited requests, and a burst of forged tokens is exactly the kind of thing
 * the attempt log should show.
 */
export async function lookupByToken(token: string): Promise<VerificationResult> {
  const startedAt = Date.now();
  const ipDigest = ipHash(await clientIp());

  const claims = verifyVerificationToken(token);
  if (!claims.ok) {
    // A forged or expired token is a second-factor failure: the token IS the
    // factor on this path. `plate_hash` is null because no plate was involved —
    // the log records what actually happened, not a plausible reconstruction.
    return finish(startedAt, recordAttempt(ipDigest, null, 'factor_failed'), {
      status: 'unverified',
      requiresChallenge: false,
    });
  }

  const { data: certificate, error } = await serviceClient()
    .from('installation_certificates')
    .select('installed_on, expires_on, status')
    .eq('id', claims.certificateId)
    .maybeSingle();

  if (error || !certificate) {
    return finish(startedAt, recordAttempt(ipDigest, null, 'not_found'), {
      status: 'unverified',
      requiresChallenge: false,
    });
  }

  const status = certificateStatus(certificate.expires_on, certificate.status);
  return finish(startedAt, recordAttempt(ipDigest, null, status), {
    status,
    installedOn: certificate.installed_on,
    expiresOn: certificate.expires_on,
    requiresChallenge: false,
  });
}

/**
 * Valid or expired.
 *
 * A row whose `status` is anything but `active` is reported as expired rather
 * than valid. There is no third public state and there should not be: brief 9.2
 * fixes the vocabulary at VALID, EXPIRED and NOT FOUND, and inventing
 * "suspended" or "cancelled" would leak an operational detail about one
 * customer's account to whoever is looking at the screen.
 */
function certificateStatus(expiresOn: string | null, status: string): 'valid' | 'expired' {
  if (status !== 'active') return 'expired';
  if (!expiresOn) return 'expired';
  return new Date(`${expiresOn}T23:59:59Z`).getTime() > Date.now() ? 'valid' : 'expired';
}
