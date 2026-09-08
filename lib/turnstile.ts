import 'server-only';

/**
 * CLOUDFLARE TURNSTILE — bot protection that must not lock out a keyboard user.
 *
 * Brief PART 16 and docs/ACCESSIBILITY_PLAN.md. Two requirements pull in
 * opposite directions and both are non-negotiable, so neither is traded:
 *
 *   - SECURITY_REQUIREMENTS §1.5: bot protection on certificate verification
 *     "from the first failed attempt".
 *   - CLAUDE.md §9: "Bot protection (honeypot + Turnstile) that never blocks
 *     keyboard-only users."
 *
 * How they are reconciled: the widget is `managed` and rendered inline in normal
 * document order, immediately before the submit button, so it is reachable by
 * Tab and its challenge is operable by keyboard. It is never the first thing a
 * visitor meets — the first attempt is unchallenged — so nobody is asked to
 * solve anything before they have done anything.
 *
 * ── Why the gate is server-derived ──────────────────────────────────────────
 * Whether a challenge is required is decided from the attempt log, not from a
 * flag the browser sends back. A client-side "I was challenged" boolean is worth
 * nothing against the only adversary that matters here, which is a script that
 * never runs the client at all.
 *
 * ── When it is not configured ───────────────────────────────────────────────
 * Both keys are absent until the client supplies them. `isTurnstileConfigured()`
 * is therefore load-bearing, and the honest behaviour is to let verification
 * proceed rather than to refuse every visitor. That is a REAL, RECORDED GAP, not
 * a shrug: with no keys, certificate verification is defended by rate limiting
 * and the second factor alone. It is in the Sprint 11 report under known issues.
 * `turnstileStatus()` exists so the sprint's penetration test can assert which
 * of the two modes it measured, rather than reporting a pass that came from the
 * check being switched off.
 */

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export function isTurnstileConfigured(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
}

export function turnstileStatus(): 'enforced' | 'not-configured' {
  return isTurnstileConfigured() ? 'enforced' : 'not-configured';
}

/**
 * Verifies a Turnstile response token with Cloudflare.
 *
 * Returns true when not configured — see the module note. A network failure
 * returns FALSE: if the challenge cannot be checked it has not been passed, and
 * on the one endpoint in this application where enumeration is the whole threat,
 * failing closed is right even though it costs a legitimate visitor a retry.
 */
export async function verifyTurnstileToken(
  token: string | null | undefined,
  remoteIp?: string,
): Promise<boolean> {
  if (!isTurnstileConfigured()) return true;
  if (!token) return false;

  const body = new FormData();
  body.append('secret', String(process.env.TURNSTILE_SECRET_KEY));
  body.append('response', token);
  // Cloudflare treats remoteip as optional and advisory. It is sent when known
  // and omitted otherwise, never faked.
  if (remoteIp) body.append('remoteip', remoteIp);

  try {
    const response = await fetch(VERIFY_URL, { method: 'POST', body, cache: 'no-store' });
    if (!response.ok) return false;
    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch {
    // No detail is logged. An error object from this call can carry the request
    // body, and the request body carries the visitor's IP — PART 16 forbids PII
    // in logs, and a catch block is where that rule is usually broken.
    return false;
  }
}
