# ADR-0007 — Remove installation-certificate verification

**Status:** Proposed — awaiting Kelvin's approval of the plan below. No code has been changed.
**Date:** 28 September 2026
**Deciders:** Client (Kelvin) decided the removal on 28 September 2026 ("remove this feature
completely", register V03/V04); this ADR proposes how.
**Supersedes:** ADR-0005 (certificate verification second factor)
**Branch:** `sprint/12c-remove-certificate-verification`, cut from `sprint/12b-motion-scroll`

---

## Context

Sprint 11 built public installation-certificate verification at `/support/verify-installation`,
with a phone-digits second factor (ADR-0005), rate limiting, an attempt log, signed QR links, and
Sprint 12 added a staff CSV import. Kelvin has decided to remove the feature completely.

Two facts make the removal low-risk, and one makes it less simple than it looks:

- **The certificates table holds zero rows** (counted 28 September 2026, read-only). Nothing has
  been imported, so no real certificate and no printed QR link depends on this route.
- **The route has never been live.** `main` still serves the CRA site, which had no verify page (it
  is not among the 13 legacy redirects in `ROUTE_MAP.md`), and the new route is `noindex`. Removing
  it needs **no 301**; it will simply 404.
- **The enquiry forms depend on one of its secrets.** `lib/submissions/actions.ts:51` hashes client
  IPs for form rate limiting with `CERT_PLATE_HMAC_SECRET`. Deleting the certificate secrets along
  with the feature would silently break that rate limiter.

## Decision (proposed)

Remove the feature end to end, in small commits, keeping only what other features use.

### 1. Public surface
- Delete `app/(site)/support/verify-installation/` (page and server action),
  `components/support/verify-form.tsx`, `components/support/strip-token-from-url.tsx`.
- Remove every link to it: `components/layout/nav-data.ts`, `app/(site)/support/page.tsx`,
  `app/(site)/support/book-installation/page.tsx`, and `ROUTES.verifyInstallation` in
  `lib/constants.ts`.
- `app/robots.ts` and `app/sitemap.ts`: drop the route from their lists.
- `llms.txt`: drop any mention, **in the same commit** (CLAUDE.md §7).

### 2. Admin
- Delete `app/(admin)/admin/certificates/` (the import) and `app/(admin)/admin/security/` (it shows
  only the verification attempt log), with `components/admin/certificate-import.tsx` and
  `lib/admin/certificate-import.ts`.
- Remove their entries from `lib/admin/nav.ts`, the dashboard (`lib/admin/dashboard.ts`,
  `app/(admin)/admin/page.tsx`) and the audit labels (`lib/admin/audit.ts`,
  `app/(admin)/admin/audit/page.tsx`). Past audit rows stay: `audit_log` is append-only by design.

### 3. Library, analytics, scripts
- Delete `lib/verification/` (hashing, lookup, token, types).
- Remove the `certificateVerified` event from `lib/constants.ts` and `lib/analytics.ts`.
- Delete `scripts/seed-verification-fixtures.mjs` and `scripts/pentest-verification.mjs`, and the
  `seed:certs` and `pentest:verify` npm scripts. Update `scripts/verify-db.mjs` and
  `scripts/verify-roles.mjs` to stop checking the dropped tables (`verify:roles` is the Sprint 12
  RLS gate and must still pass afterwards).
- **Keep** `lib/turnstile.ts`: the enquiry forms use it too.

### 4. The shared secret — renamed, not deleted
- Form rate limiting moves to a new **`SUBMISSION_IP_HMAC_SECRET`**, reading the old
  `CERT_PLATE_HMAC_SECRET` as a fallback for one release so nothing breaks while environments are
  updated.
- Also tighten a pre-existing weakness this exposes: the code falls back to an **empty** HMAC key
  (`?? ''`) when the secret is missing, which would make the IP digests unkeyed. It should fail
  closed instead.
- `.env.example`: remove `CERT_QR_TOKEN_SECRET` and the two `CERT_VERIFY_RATE_LIMIT_*` values, and
  document `SUBMISSION_IP_HMAC_SECRET`. After deployment, the old variables can be deleted from
  `.env.local` and any Vercel environment.

### 5. Database — a migration that drops the feature's objects
New migration, `00xx_remove_certificate_verification.sql`:
- `drop function verification_attempt_counts(...)`
- `drop table verification_attempts`, `installation_plates_restricted`, `installation_certificates`
  (with their policies, indexes and trigger)
- **Not touched:** `certifications` and `public_certifications` (the company's KEBS permit and
  similar), which are a different thing.
- Written now; **applied when the Supabase access token is renewed** (register V61, which also blocks
  0041–0043). Database types are regenerated at the same time, never hand-edited (CLAUDE.md §12).

### 6. Legal pages and docs
- **Privacy policy and terms** describe verification processing (plates, phone digits, the attempt
  log). Those passages are removed, because the processing stops. This is legal copy: the edit only
  removes a described activity, but it should still pass the same review as the rest of those pages.
- **ADR-0005** marked superseded by this ADR.
- **CLAUDE.md:** §10's verification paragraph and §11's `seed:certs` and `pentest:verify` commands.
- **SECURITY_REQUIREMENTS, ROUTE_MAP, DATABASE_ARCHITECTURE, CMS_ARCHITECTURE, SPRINT_PLAN:** updated.
- **Past sprint reports:** left as they were, since they are history.
- **The brief (PART 9.2) specifies this feature, and the brief outranks everything else.** Kelvin's
  decision needs recording there as a dated amendment ("PART 9.2 withdrawn by the client, 28 September
  2026"). The brief is Kelvin's document, so this is proposed, not done.

## Trade-offs

| Choice | Proposed | Alternative | Why the proposal |
|---|---|---|---|
| Database | **Drop** the three tables and the function | Keep them dormant, with the code removed | Zero rows, so nothing is lost. Dormant tables with RLS policies are attack surface and schema noise for a feature that no longer exists. Dropping is irreversible, but so is the decision |
| Secret | **Rename**, with a one-release fallback | Keep `CERT_PLATE_HMAC_SECRET` for the forms | A secret named after a deleted feature invites someone to delete it later, and that silently breaks form rate limiting |
| URL | **Let it 404**, no redirect | 301 to `/support` | It was never live, never indexed, and no QR code points at it |

## Consequences

- About 25 files deleted or edited, one migration, and the docs. First Load JS on public routes should
  not change. The support pages lose a link.
- `npm run verify:roles` loses its certificate checks but must still pass. `npm run pentest:verify` is
  gone, because there is nothing left to attack.
- Until the migration is applied (V61), the tables remain in the database, unused by any code.

## Verification planned

Typecheck, lint and build; the retired-strings check; `verify:roles` against the live policies; a
browser pass over the support pages, the admin navigation and the enquiry forms (including a
rate-limit hash computed under the new secret name); `curl` confirming `/support/verify-installation`
is 404 and absent from `llms.txt`, the sitemap and robots.
