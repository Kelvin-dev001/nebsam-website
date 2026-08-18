# SECURITY REQUIREMENTS

Threat notes, RLS, rate limits, headers and DPA 2019 posture.

Nebsam is a registered Data Controller and Data Processor under Kenya's **Data Protection Act,
2019**. The site must not undermine that posture — a privacy failure here is a regulatory matter,
not a bug report.

---

## 1. Certificate verification — the highest-risk surface

`/support/verify-installation`. Brief PART 9.2.

### 1.1 The threat

Customers look up their installation **by vehicle number plate** (confirmed, PART 1.5 #13). That is
the right UX call — nobody remembers a certificate number, everybody knows their plate. It also
changes the threat model completely, because **a plate is public information visible on every
vehicle on the road**.

A plate-only public lookup that returns validity or expiry becomes three things at once:

1. **A target list for vehicle thieves.** It discloses which vehicles carry a Nebsam installation
   and — far worse — **which installations have expired**. An expired record identifies a vehicle
   whose owner believes it is protected and whose protection has lapsed. That is the single most
   valuable piece of information the site could hand a thief.
2. **A customer list for competitors.** Plate ranges are enumerable and cheap to scrape.
3. **A disclosure of personal data.** A vehicle registration linked to a named service relationship
   is personal data about the owner under the DPA 2019, and Nebsam is a registered data controller.

**Do not ship a plate-only public lookup that reveals validity or expiry.**

### 1.2 The design

Built to **Option A**: plate + **last 4 digits of the phone number registered on the installation**.
No SMS cost, one extra field, and it defeats casual and automated enumeration.

**V03 is still open.** Option B (plate + OTP to the registered phone) is stronger, carries SMS cost
and friction, and is worth offering as the fallback when the number on file has changed. Switching
is a change to the second factor only — it does not alter the schema or the threat model. ADR-0002
is written when V03 is answered.

Option C (plate + certificate number) defeats the purpose of the change and is not on the table.

**The legitimate path stays frictionless.** The QR code printed on the certificate deep-links with a
**signed, expiring token** — `/support/verify-installation?t=<signed>` — resolving straight to the
result with **no second factor at all**. The holder of the physical certificate scans and sees the
answer instantly. Only manual plate entry requires the second factor. That gives the convenience the
client wants without the exposure.

### 1.3 If the client ever insists on plate-only

The public response reduces to a **single neutral state**:

> An installation record exists for this vehicle. Contact Nebsam for details.

No dates. **No valid/expired distinction** — the valid/expired distinction is the harmful part. Full
details go out by SMS or WhatsApp to the number on file, never to the browser.

### 1.4 The public result, on success

```
Status:            VALID / EXPIRED / NOT FOUND
Vehicle:           KXX 000X   (as entered, echoed only)
Installation date: DD/MM/YYYY
Expiry date:       DD/MM/YYYY
```

**Nothing else.** No customer name, no phone number, no branch, no technician name, no device ID, no
address.

### 1.5 Implementation requirements

- **Server-side lookup only.** The certificate table, or any part of it, is never shipped to the
  client. No client-side filtering of a fetched list — that is the same bug in a nicer wrapper.
- **Store a keyed hash of the normalised plate, never plaintext.** Normalise (uppercase, strip
  spaces and hyphens, canonicalise `O`/`0`), then HMAC-SHA256 with `CERT_PLATE_HMAC_SECRET`, and
  index on the hash. A database leak yields no usable plate list. Any plaintext plate operations
  genuinely need lives in a separate restricted table, never joined into the lookup path.
- **Rate limit per IP and per normalised plate**, with escalating backoff. Defaults in
  `.env.example`: 10 per IP per hour, 5 per plate per day. Plate-space enumeration is cheap; make it
  expensive.
- **Bot protection from the first failed attempt** (Turnstile), implemented so it **never blocks
  keyboard-only users** — tested with keyboard only before it ships.
- **Identical, generic failure copy** whether the plate is unknown or the second factor is wrong. A
  different response for the two states is itself an oracle. The generic message must still be
  announced to a screen reader (`ACCESSIBILITY_PLAN.md` A6) — the security constraint and the
  accessibility requirement are satisfied together, not traded.
- **Constant-time comparison** on the second factor.
- **Log every attempt** — hashed IP, hashed plate, outcome, timestamp — in `verification_attempts`,
  and surface a spike alert in admin. An enumeration attack looks like traffic; you only see it if
  you are counting.
- **No plate, and no verification outcome tied to a plate, in analytics, URLs, logs or error
  messages.** Fire `certificate_verified` with the **outcome only**.

### 1.6 Secret rotation

Rotating `CERT_PLATE_HMAC_SECRET` **invalidates the entire lookup index**. Rotation requires a
planned re-hash migration from the restricted operational table. Recorded here because it is the
kind of constraint discovered at the worst possible moment.

`CERT_QR_TOKEN_SECRET` is separate, so QR links can be invalidated without touching the plate index.

---

## 2. Row Level Security

**RLS on every table.** A table without a policy denies everything; that default is relied upon.

- The **anon key is read-only**, against **public views** that expose published rows and public
  columns only — never base tables.
- The **service-role key is server-side only** and never reaches a client bundle.
- Admin routes are protected by **middleware and RLS**. Never a client-side-only guard — a hidden
  button is not a permission.
- Roles `admin` / `editor` / `sales` / `viewer` are enforced in policy, not in the UI.
- `audit_log` is append-only: no update or delete, by anyone, including admin.

Full policy table: `docs/DATABASE_ARCHITECTURE.md` §7.

---

## 3. Input, forms and uploads

- **Zod validation on the server for every mutation.** Client validation is a convenience; the
  server is the boundary.
- **Never trust client prices.** Every total is recomputed server-side from the database at order
  creation. `order_items` stores snapshots of what was actually shown.
- Rate limiting on **all** public POST endpoints, not only verification.
- Honeypot **and** Turnstile on public forms; no CAPTCHA that blocks keyboard users.
- **Uploads:** extension allowlist **and** MIME sniffing (extension alone is not a check), size cap,
  **private bucket**, served only through short-lived signed URLs to admins. Never from a public
  path. Applies to suggestion attachments (brief 9.3) and the media library.
- Order numbers are **bearer tokens** — `/orders/[orderNumber]` must be unguessable, so the `XXXX`
  suffix is random, not sequential, and the page is `noindex`.

---

## 4. Headers

| Header | Value |
|---|---|
| `Content-Security-Policy` | Report-only first, then enforced. No `unsafe-inline` in the enforced policy — nonce the two scripts that need it |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | deny camera, microphone, geolocation unless a feature needs it |
| `frame-ancestors` | `'none'` |

CSP ships report-only in Sprint 2 and is enforced before Sprint 15. Third parties to allowlist
deliberately: Supabase, Vercel, GA4 (post-consent only), Turnstile, and the maps embed.

---

## 5. Privacy and DPA 2019

- **No PII in logs, analytics, URLs or error messages.**
- **No customer data in seed files.** Demonstration telemetry uses obviously illustrative plates
  (brief 6.5), held in component fixtures rather than the database.
- **Cookie notice with genuine consent gating.** GA4 does not fire before consent — not "fires and
  respects a flag".
- `audit_log` written for every admin create, update and delete.
- **Privacy policy must name:** what is collected, why, retention periods, third parties (Supabase,
  Vercel, Google, WhatsApp/Meta), data-subject rights under the DPA 2019, and how to contact the
  data protection contact person. `[[NEEDS_VERIFICATION: DPO / data protection contact details]]` —
  **V11**.

### 5.1 Media privacy — already-identified exposures

Two confirmed, both blocking:

1. **`Video_Telematics_Proposal_2025.pdf`** contains customer vehicle registrations, a fleet group
   name, device IDs, GPS coordinates and **two clearly identifiable faces** in a vehicle cab.
   Publishing any of it without written consent would be a data protection failure by a registered
   data controller, and a straightforward privacy wrong to the people in the cab. **The file is not
   in the repository** — it must be treated as NOT CLEARED on arrival (**V14**).
2. **`public/certificates/kebs.jpg`** carries five exposures, not the two anticipated: the
   unpublished phone number, the administrative email, the postal address, the physical address, a
   **handwritten Managing Director signature**, and a QR code whose contents have not been read.
   A published signature image is a forgery risk in its own right. **Crop before display** (**V34**).

`installation.jpg` was cleared of the feared exposure — it is a blank specimen with no customer data
— but carries a technician's first name and third-party branding (**V32**, **V33**).

**Treat every supplied screenshot as suspect until checked** for plates, names, faces, coordinates
and device IDs.

### 5.2 Children's and biometric data — School Bus Solution

The highest legal-sensitivity content on the site. It processes children's personal data, optionally
children's **biometric** data (face, fingerprint, iris), and driver biometric and alcohol-screening
data. Under the DPA 2019 biometric data is **sensitive** personal data and children's data attracts
heightened protection.

The marketing site does not process this data, but **how the site describes it creates the company's
public commitments**. So:

- Describe plainly what is collected, who can see it, and how long it is retained.
- State that biometric attendance is **optional**, and that RFID or manual attendance are
  alternatives — parents and schools must be able to see a non-biometric path.
- Never imply in-bus video is viewable by anyone beyond authorised school administrators.
- **Never promise absolute safety.** The system supports safety; it does not guarantee it.
- **Never present driver alcohol screening as a legal or evidential test.**
- The privacy policy addresses children's and biometric data **specifically for this product**, not
  by generic reference.
- `[[NEEDS_VERIFICATION: retention periods for in-bus video, attendance records and biometric
  templates]]` — **V21**.

**Draft conservatively and flag for legal review before launch.**

---

## 6. Secrets

`.env.example` documents every variable, commented and grouped; any new variable is added in the
same commit that introduces its use. Real values never appear in code, commits, docs or logs.

Server-only, never `NEXT_PUBLIC_`: `SUPABASE_SERVICE_ROLE_KEY` · `CERT_PLATE_HMAC_SECRET` ·
`CERT_QR_TOKEN_SECRET` · `TURNSTILE_SECRET_KEY` · `EMAIL_PROVIDER_API_KEY` · `CLOUDINARY_URL`.

`.gitignore` already covers `.env`, `.env.local` and `.env*.local`, and `.claude/settings.json`
denies reading them.

---

## 7. The build-time content check

Brief 3.2 requires a build-time check that **fails the build** if a retired address string or the
unpublished phone number appears in rendered output.

This is cheap and it prevents the single most likely regression on this project, because those
strings live in the source documents being read all the way through Sprint 6.

- Ships in **Sprint 2**.
- Scans **rendered output**, not source — internal registers under `docs/` legitimately name the
  strings and must not trip it.
- Covers: the unpublished phone number, the administrative email, all four retired address forms,
  and the retired product names "Basic Tracker" and "Hybrid Alarm".
- The strings live in one server-side config, never in a client bundle.
- **Images need a separate redaction pass** — the check reads text, and the KEBS permit carries the
  number as pixels.

---

## 8. Testing

| Sprint | Security work |
|---|---|
| 2 | CSP report-only, headers, build-time content check |
| 3 | RLS policies reviewed table by table; anon key confirmed unable to write |
| 7 | Order flow: client price tampering rejected; order persists before WhatsApp opens |
| 11 | **Verification penetration test** — enumeration, rate limit, oracle behaviour, timing, QR token replay and expiry |
| 12 | Role separation verified per role, in RLS not just the UI |
| 14 | CSP enforced; upload allowlist bypass attempts |
| 15 | Full pass; secrets audit; backups and monitoring confirmed |

**Sprint 11's gate is a security test on verification, not a feature demo.** Specifically: attempt
plate enumeration at scale, confirm escalating backoff, confirm identical copy for unknown-plate and
wrong-factor, confirm no timing difference between them, and confirm a QR token cannot be replayed
after expiry.
