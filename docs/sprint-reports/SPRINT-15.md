# SPRINT 15 — QA & LAUNCH

**Branch:** `sprint/15-launch`, cut from `develop` at `6c329d2` (Sprint 14 merged). Merged into
`develop`, and `main` fast-forwarded to it. **Production deployed from `main` on 6 October 2026**
(`b5ade7a`), at Kelvin's decision.
**Gate:** human sign-off.

## WHAT WAS FOUND FIRST: THE SITE WAS ALREADY LIVE

Production was not the old Create React App site. Since 5 October, Vercel production has served a
build of `develop` at `ff7ee63` (Sprint 12o), promoted outside the sprint process. The domain
returned that build: the report-only CSP and the Next.js markers proved it. Live, it still had what
Sprints 13 and 14 fixed:
- `/platform` linked from every page's header, a 404.
- `/team` and `/clients` redirecting to 404s.
- The old product photos and a client logo downloadable.
- `llms.txt` naming five 404s.
- No enforced CSP.

No enquiry or order had arrived, so nothing was lost. Kelvin chose to deploy the current build
rather than roll back.

## THE GATE

| Criterion | State |
|---|---|
| `develop` merged to `main`; Vercel production switched | ✅ `main` = `develop` = `b5ade7a`, built by Vercel as production |
| Every old URL verified live against production | ✅ the 13 redirects and 4 direct routes, against `https://nebsamdigital.com`. Whether the map is complete is V25 |
| Sitemap submitted to Search Console | ❌ needs Kelvin's access (V10) |
| Backups and monitoring confirmed | ❌ V104 |
| Secrets audit | ✅ (below) |
| No `[[NEEDS_VERIFICATION]]` on any public page | ❌ **6 tokens on the privacy notice and the terms, live.** Legal text (V66–V70) |
| **Human sign-off** | Kelvin |

## WHAT CHANGED

- **Staff email notifications (V103).** The brief's `lib/email.ts`, which did not exist.
  - One email per new enquiry or order, carrying the kind, the reference and the admin link. The
    customer's details are never in it.
  - Resend over HTTP, with no dependency, sent after the response, and never throws.
  - Inert until the key is set. Tested in isolation with `fetch` mocked: 12 of 12.
- **The cookie bar only asks when there is analytics to consent to.** Production has no GA4 ID, so
  every first visitor was being asked to accept analytics that never load.
  - Tested on production builds both ways: with an ID, the bar shows and gtag.js loads after
    Accept, with no CSP violation; without one, no bar.
- **`docs/LAUNCH_RUNBOOK.md`.** How production works, deploying, rolling back, the checks after
  every deploy, monitoring, what is still open, and a deploy log.
- **CLAUDE.md.** Production is live, `main` is production, and a preview must never be promoted
  (previews have no environment variables).

## SECRETS AUDIT

- **The repository and its full history:** no environment file ever committed. No JWT-shaped key,
  no Supabase, Resend, Stripe, AWS or GitHub key pattern, no private key, and no
  `SECRET=value` line in any commit.
- **The build:** the service-role key, the HMAC secret, the access token and the Turnstile secret
  appear in none of the 356 built browser and HTML files (checked by value, never printed).
- **Vercel Production**, names only:
  - **Missing:** `SUBMISSION_IP_HMAC_SECRET`, so the live forms have no rate limiting.
  - **Should not be there:** `SUPABASE_ACCESS_TOKEN`, and the two dead `CERT_VERIFY_RATE_LIMIT_*`.
- **Local:** `.env.local` has a Turnstile secret set, presumably Cloudflare's always-pass test key
  from Sprint 11. Production correctly has none (V78).

## DEVIATIONS

- **The cutover was not the merge it was planned as.** Production had been switched by promotion
  the day before. The merge brought `main` level with it and made `main` the source again.
- **Not done here, and not doable here:** Search Console (V10, V25), backups and uptime (V104), the
  email key (V103), the legal text, and NVDA and VoiceOver (V101).

## FILES

- **New:** `lib/email.ts`, `docs/LAUNCH_RUNBOOK.md`, this report.
- **Changed:**
  - Email wiring: `lib/submissions/actions.ts`, `app/(site)/cart/actions.ts`.
  - The cookie bar: `components/consent/cookie-notice.tsx`.
  - Docs: `.env.example`, CLAUDE.md, NEEDS_VERIFICATION (V103, V104), SPRINT_PLAN.

## DATABASE CHANGES / DEPENDENCIES

None. None: Resend is called over `fetch`.

## VERIFICATION

**Before the deploy, on the production build:**
- typecheck, lint and Prettier on the whole repository;
- builds of 75 pages with the retired-strings check clean;
- `audit:crawl` (only the legal tokens), `check-redirects` and `check-sitemap`;
- `verify:db`: clean, with no customer rows;
- `verify:roles`: 38 of 38, with the test accounts removed;
- the forms with JavaScript on and off;
- 66 pages at 1920 and 2560px: no sideways scroll and no console errors.

**After the deploy, against `https://nebsamdigital.com`:** see the runbook's deploy log.
- The enforced CSP is in the live response.
- Every fix is visible.
- All four gates pass, with the same two token problems.
- All four forms pass both ways, with no rows written (`verify:db`).
- No runtime errors.
- Lighthouse through the edge: 2.04–2.17 s, Performance 98, the rest 100.

## PERFORMANCE

Live, through Vercel's edge: Home 2,092 ms, `/contact` 2,036, `/products` 2,166. CLS 0, Performance
98, Accessibility, Best Practices and SEO 100. Faster than the local measurements (PERFORMANCE_BASELINE
§20), because the edge compresses and caches.

## NEEDS_VERIFICATION

- **Opened:**
  - V103: email, built and switched off.
  - V104: backups and uptime.
- **Still open for launch:** the legal text (V66–V70), V25, V10, V28a, V16, V98, V100 and V101.

## DECISIONS NEEDED

1. **Sign-off.** The site is live, so the gate is now: accept it as launched with the open items
   below, or say what must change first.
2. **Today, in Vercel Production:** add `SUBMISSION_IP_HMAC_SECRET` with a new value (the live forms
   have no rate limiting until then), and remove `SUPABASE_ACCESS_TOKEN` and the two
   `CERT_VERIFY_RATE_LIMIT_*` variables. Then redeploy, so the running functions pick up the secret.
3. **The legal text** for the privacy notice and the terms. Six tokens are public now.
4. **Email (V103):** a Resend account and the domain verified, or a named person who checks the admin
   every working day.
5. **Search Console (V10, V25):** add the property, submit `https://nebsamdigital.com/sitemap.xml`,
   and compare the old site's indexed URLs with the redirect map.
6. **Backups and uptime (V104).**

**STOPPING HERE FOR REVIEW.**
