import 'server-only';

/**
 * CLOUDFLARE TURNSTILE — bot protection that must not lock out a keyboard user.
 *
 * Brief PART 16; CLAUDE.md §9: "Bot protection (honeypot + Turnstile) that
 * never blocks keyboard-only users." Its one caller since certificate
 * verification was removed (ADR-0007) is the enquiry forms,
 * `lib/submissions/actions.ts`.
 *
 * ── WARNING: NO WIDGET IS RENDERED ANYWHERE (register V78) ───────────────────
 * The only Turnstile widget on the site was in the certificate verification
 * form, which is gone. The enquiry forms CHECK a token on the server but never
 * render the widget that produces one. Today that is harmless, because both
 * keys are unset and an unconfigured check passes. **Setting the keys before
 * a widget is added to the forms would reject every enquiry.** Add the widget
 * (managed mode, inline before the submit button, reachable by Tab) and allow
 * challenges.cloudflare.com in the CSP first.
 *
 * ── When it is not configured ───────────────────────────────────────────────
 * `isTurnstileConfigured()` is load-bearing: with no keys the check passes and
 * the forms fail OPEN, so an enquiry is never lost to a missing key. The
 * honeypot and the rate limit still apply.
 */

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export function isTurnstileConfigured(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
}

/**
 * Verifies a Turnstile response token with Cloudflare.
 *
 * Returns true when not configured — see the module note. A network failure
 * returns FALSE: if the challenge cannot be checked it has not been passed.
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
