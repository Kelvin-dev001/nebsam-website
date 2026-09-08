# ADR-0005 — The second factor on certificate verification

**Status** Accepted, provisionally. Option A is built; **V03 is still open** and Option B remains a
swap of one step, not a rebuild.
**Date** 8 September 2026 · Sprint 11
**Supersedes** nothing. **Related** brief PART 9.2 · `docs/SECURITY_REQUIREMENTS.md` §1 ·
migration `0006_verification.sql`

---

## Note on the ADR number

`SPRINT_PLAN.md` and `SECURITY_REQUIREMENTS.md` both say **"ADR-0002 written"** for this decision.
ADR-0002 already exists and is the visual direction, written in Sprint 0. That is a documentation
error, not a decision to overwrite a design ADR, so this is **ADR-0005** — the next free number —
and both documents are corrected in the same commit.

---

## Context

`/support/verify-installation` answers the question "is this Nebsam installation certificate
genuine, and is it still current?".

The obvious design is a box for the vehicle registration. It is also the dangerous one, and the
reason is not a detail of the implementation — it is the input itself. **A number plate is public
information, painted on the outside of the vehicle.** A lookup keyed on it that returns validity or
expiry is three things at once:

1. **A target list for vehicle thieves.** It discloses which vehicles carry an installation and —
   far worse — **which installations have expired**. An expired record identifies a vehicle whose
   owner believes it is protected and whose protection has lapsed. That is the single most valuable
   thing this site could hand a thief.
2. **A customer list for competitors.** Kenyan plate ranges are cheap to enumerate.
3. **A disclosure of personal data.** A registration linked to a named service relationship is
   personal data about the owner under the Data Protection Act 2019, and Nebsam is a registered data
   controller.

The client confirmed plate-based lookup as the desired UX (brief PART 1.5 #13), and they are right
about the UX: nobody remembers a certificate number, everybody knows their plate. The problem is not
the plate as an input. It is the plate as the **only** input.

## Options considered

| | Option | Verdict |
|---|---|---|
| **A** | Plate + **last 4 digits of the phone number registered at installation** | **Built** |
| **B** | Plate + **OTP** sent to the registered number | Stronger, deferred — see below |
| **C** | Plate + certificate number | **Rejected outright** |
| **D** | Plate only, single neutral response | Fallback if the client insists — see §1.3 of `SECURITY_REQUIREMENTS.md` |

**C is not on the table.** It defeats the purpose: a certificate number is printed on the document,
so anyone holding the document already has both factors, and anyone *not* holding it is defeated by
a factor that is likely sequential — which is to say, enumerable in a different namespace. It trades
one enumerable key for two.

**D is the floor, not a plan.** If the client ever insists on plate-only, the public response reduces
to a single neutral state — "an installation record exists for this vehicle, contact Nebsam" — with
no dates and, critically, **no valid/expired distinction**, because the valid/expired distinction is
the harmful part. Details go out by SMS or WhatsApp to the number on file, never to the browser.

## Decision

**Option A.** Plate plus the last four digits of the phone number registered on the installation.

Four reasons, in order of weight:

1. **It defeats the attack the plate creates.** The second factor is not public, is not printed on
   the vehicle, and is not derivable from it. Enumeration now costs 10,000 guesses per plate against
   a limiter that allows five a day.
2. **It costs nothing to run.** No SMS gateway, no per-message fee, no delivery failures, no
   dependency on a third party being up at the moment a customer is standing at a roadside.
3. **It is one field.** The friction is a single short input on a page most people will use once.
4. **The legitimate path avoids it entirely.** The QR code printed on the certificate deep-links with
   a signed, expiring token and resolves with **no second factor at all**. Someone holding the
   physical document has already proved the thing the second factor exists to establish.

### Why Option B is deferred rather than rejected

An OTP to the registered number is stronger — it proves possession of the number rather than
knowledge of four digits, and four digits are guessable in 10,000 attempts by someone patient enough
to defeat the rate limiter across many days and addresses.

It is deferred because it costs money per attempt, adds a delivery dependency, and fails outright for
the customer whose number has changed since installation — which is exactly the customer most likely
to be checking an old certificate.

**B is also the right fallback for that customer**, and is worth offering as a second route rather
than a replacement. It is recorded as future work, not as a rejected option.

## Consequences

**The schema does not depend on this decision.** `installation_certificates` stores
`phone_last4_hash` alongside `plate_hash`, both HMAC-SHA256 under `CERT_PLATE_HMAC_SECRET`. Switching
to Option B replaces how the second factor is *proven* and leaves the table, the threat model, the
rate limiter, the attempt log and the QR path untouched.

**No plaintext plate is stored.** Normalise, HMAC, index on the digest. A database leak yields no
usable plate list. Where operations genuinely need a plaintext plate it lives in
`installation_plates_restricted`, which is never joined into the lookup path — and which is the only
thing that makes a secret rotation recoverable, because rotating `CERT_PLATE_HMAC_SECRET` invalidates
the entire lookup index.

**Unknown plate and wrong factor are indistinguishable.** Same copy, same HTTP status, same rendered
bytes, same timing. A different answer for the two states is itself an oracle, and it would hand back
most of what the second factor was added to prevent.

**Four digits are guessable in principle, and the rate limiter is what makes that irrelevant.** Five
attempts per plate per day, ten per IP per hour, escalating because refusals are themselves logged.
This is the assumption to revisit first if the threat model ever changes: the strength of Option A is
not in the factor, it is in the factor *plus* the limiter. Weakening the limiter weakens the design
far more than it looks.

**If V03 comes back as Option B**, this ADR is superseded by one that records the change, and the
work is a new implementation of the second-factor step in `lib/verification/lookup.ts`. Nothing else
moves.

## Verification

Sprint 11's gate was a penetration test, not a feature demo —
`scripts/pentest-verification.mjs`, 37 checks, run over HTTP against the production build. It
attacks the endpoint the way an attacker would: it parses the form, posts it, and ignores the page.

It found four real defects, all fixed: a timing difference between the two failure branches (AUC
0.72–0.87, now 0.47–0.56 across four consecutive runs); a dead end for visitors without JavaScript;
a honeypot checked only in the browser; and a rate limiter resting on a spoofable
`x-forwarded-for`. The details are in the Sprint 11 report.
