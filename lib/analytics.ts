'use client';

import { CONSENT_COOKIE, CONSENT_VERSION, type EventName } from '@/lib/constants';

/**
 * The single analytics wrapper (brief PART 19).
 *
 * Three rules enforced here rather than left to each caller:
 *  1. NOTHING fires before cookie consent. Not "fires and respects a flag" —
 *     the GA4 script is not even loaded until consent is granted.
 *  2. NO PII in any payload, ever.
 *  3. Certificate verification reports the OUTCOME only, never the plate
 *     (brief 9.2). There is no parameter here that could carry one.
 *
 * Event names come from lib/constants.ts so a typo is a type error.
 */

type Payload = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Keys that must never reach an analytics payload. */
const FORBIDDEN_KEYS = [
  'plate',
  'registration',
  'phone',
  'email',
  'name',
  'customer',
  'address',
  'ip',
  'certificate',
];

export function hasConsent(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie
    .split('; ')
    .some((c) => c === `${CONSENT_COOKIE}=granted-v${CONSENT_VERSION}`);
}

export function grantConsent() {
  if (typeof document === 'undefined') return;
  // 12 months, lax, path-wide. Not http-only by necessity — the client must
  // read it to decide whether to load GA4 at all.
  document.cookie = `${CONSENT_COOKIE}=granted-v${CONSENT_VERSION}; max-age=${60 * 60 * 24 * 365}; path=/; samesite=lax`;
  loadGa4();
}

export function denyConsent() {
  if (typeof document === 'undefined') return;
  document.cookie = `${CONSENT_COOKIE}=denied-v${CONSENT_VERSION}; max-age=${60 * 60 * 24 * 180}; path=/; samesite=lax`;
}

export function consentAnswered(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie.split('; ').some((c) => c.startsWith(`${CONSENT_COOKIE}=`));
}

let ga4Loaded = false;

/** Injects GA4 only after consent. Called by grantConsent and on load if already granted. */
export function loadGa4() {
  if (ga4Loaded) return;
  const id = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
  // No measurement ID configured (register V10) — the wrapper stays inert
  // rather than erroring, so the site works fine without it.
  if (!id || typeof window === 'undefined' || !hasConsent()) return;

  ga4Loaded = true;
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', id, { anonymize_ip: true, send_page_view: true });
}

function stripForbidden(payload: Payload): Payload {
  const clean: Payload = {};
  for (const [key, value] of Object.entries(payload)) {
    const lower = key.toLowerCase();
    if (FORBIDDEN_KEYS.some((f) => lower.includes(f))) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[analytics] dropped forbidden key "${key}" — no PII in payloads`);
      }
      continue;
    }
    clean[key] = value;
  }
  return clean;
}

export function track(event: EventName, payload: Payload = {}) {
  if (typeof window === 'undefined') return;
  if (!hasConsent()) return; // hard gate — brief PART 16
  if (!window.gtag) return;
  window.gtag('event', event, stripForbidden(payload));
}
