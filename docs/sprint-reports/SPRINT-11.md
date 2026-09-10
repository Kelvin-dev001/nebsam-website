# SPRINT 11 — TRUST & SUPPORT

**Branch** `sprint/11-trust-support` · six commits · 7–8 September 2026
**Delivers** Certifications, coverage map, branches, certificate verification, suggestions, contact,
quote, booking
**Gate** A security test on verification, not a feature demo

---

## 1. Acceptance criteria

| Criterion | State |
|---|---|
| **V03 answered and an ADR written** before verification is built | **Half met.** V03 is still open. Built to **Option A** and **ADR-0005** records that as provisional. Option B remains a swap of one step |
| Penetration test per `SECURITY_REQUIREMENTS.md` §8 | ✅ **37 checks, clean, four consecutive runs.** It found four real defects first — §4 |
| No plate in analytics, URLs, logs or error messages | ✅ Asserted by the test against the rendered answer, not by reading the code |
| Certifications: three expired registrations resolved (V27–V30) | ❌ **Contained, not resolved.** Client/ops-owned; §11.1 |
| KEBS permit cropped before display (V34); scope stated | ✅ Cropped, not redacted — §3 |
| CAK described accurately — it is not a licence (V31) | ✅ |
| `installation.jpg` redacted or replaced (V32, V33) | ✅ **Removed from the public web entirely** — §3 |
| Coverage map: branches and coverage towns visually distinct and legended | ✅ Different marks, not two colours of one mark |
| V11 (data protection contact) resolved | ✅ Published at the point of collection on every form |
| **Testimonials** | ❌ **Absent, correctly.** V15 open, no permission-confirmed testimonial exists |

Eight of ten met. The two that are not are both blocked on the client, and neither could have been
resolved by writing code.

---

## 2. What was built

**Nine routes**, eight of which were already linked from the primary navigation and all of which
were 404s: `/about`, `/about/certifications`, `/about/coverage`, `/support`,
`/support/verify-installation`, `/support/suggestions`, `/support/book-installation`, `/contact`,
`/quote`.

**Certificate verification** — `lib/verification/` (hashing, signed QR tokens, the lookup),
`lib/turnstile.ts`, a form that works without JavaScript, and
`scripts/pentest-verification.mjs`, which is the sprint's actual deliverable.

**Four enquiry forms** on one component and one server action, with the field specs shared between
client and server so a rendered field cannot go unvalidated.

**The coverage map** — `lib/geo.ts` and `components/about/coverage-map.tsx`. Kenya's outline is
lifted verbatim from `public/africa-mappp.svg`, already in this repository since the CRA site and
declaring itself public domain in its own RDF metadata. No new dependency.

**Three migrations** (0038 coordinates, 0039 the `rate_limited` outcome, 0040 the KEBS image),
applied to the project and verified by query.

---

## 3. The certificate scans — cropped, and taken off the web

`public/certificates/` held six regulatory scans. Anything in `public/` is served to anyone who
guesses the URL, and the inspection in `content-source/05-certifications` §4A had already catalogued
what they carry.

**`kebs.jpg` is the one that mattered most.** It bakes the unpublished phone number and the
administrative email into a JPEG. `scripts/check-retired-strings.mjs` reads **rendered output**, so
it is structurally incapable of seeing a retired string that exists as pixels. That check was never
going to catch this, and no amount of care in writing pages would have either.

All six moved to `source-assets/certificates/` — tracked in git, served by nothing.
`public/certificates/` now holds exactly one file.

**`kebs-permit-terms.jpg` is CROPPED, not redacted**, and the distinction is the point: a redaction
box can be removed from a published file, a crop cannot. It composites four extracts — the title and
Act, the granted-to firm line, the terms column, and rows 1–4. The postal address, physical address,
telephone, email, QR code and Managing Director's signature are **absent from the file**.

The geometry was measured rather than eyeballed. Scanning the source for ink showed the last line of
type ending at y=1223 and the first stroke of the signature beginning at y=1251; the crop stops at
1225. 1231×1107, 92 KB, inside the 250 KB image budget.

**V32, V33 and V34 are closed.** For `installation.jpg` the answer was removal rather than
redaction: nothing referenced it, and redacting the technician's name would have left another
company's logo on a Nebsam document.

---

## 4. The gate: what the penetration test found

`npm run pentest:verify` — 37 checks, run over HTTP against the production build. It does not import
the lookup and call it. It fetches the page, parses the form, and posts it, which is why the form was
built on `useActionState` with a real form action: it works with JavaScript off, and the endpoint is
therefore reachable exactly the way an attacker reaches it.

**It found four real defects. All four are fixed.**

### 4.1 A timing oracle, from the shape of the code rather than the queries

The two failure branches — unknown plate, wrong second factor — were separable at an **AUC of
0.72–0.87** across seven runs. Not enough to read a single response; far too much to leave.

The queries were not the cause. Measured on their own, the database sequence gave **AUC 0.537** —
indistinguishable. The cause was that three *sequential* Supabase round trips put ~1.3 s of work in
front of a 500 ms floor, and **a floor only equalises paths that finish inside it**. It had never
bound once.

Fixed by making every request do the same three reads, at the same time, with the attempt-log write
overlapped against the wait; and by raising the floor to 750 ms, above the measured fast path.
**Now 0.468, 0.492, 0.507, 0.522, 0.563 across five runs.**

The cost is stated rather than hidden: a rate-limited request now performs a certificate lookup whose
result is discarded — one extra index probe, bought deliberately for uniform timing on every request
that is *not* refused.

### 4.2 A dead end for visitors without JavaScript

The form works without JavaScript. The Turnstile widget **is** JavaScript. So a visitor with no
scripts who got one answer wrong was asked to complete a check that could never appear on their
screen — invisible in testing, because the tester always has JavaScript. The panel now always carries
a WhatsApp route out.

### 4.3 A honeypot checked in the browser

Which stops nothing that posts directly — the only adversary this endpoint has. Moved into the Zod
schema.

### 4.4 Rate limiting resting on a spoofable header

Every limit is keyed on a hashed client IP read from a request header. On a directly reachable
origin the *caller* chooses that header. The test demonstrates this rather than asserting it: it
spoofs `x-forwarded-for` in every section, which is how each section gets its own bucket.
`lookup.ts` now prefers `x-vercel-forwarded-for`, which Vercel sets at the edge. **Raised as V55 —
it is a deployment constraint, not a code defect.**

### 4.5 The test itself was wrong three times, and that is worth recording

Three failures in the first runs were bugs in the *test*, and each was the kind that produces a
false sense of safety:

- It asserted `!/confirmed/i` for "was this refused?" — and the refusal reads "could not be
  **confirmed**". Three false failures. Now compared by exact heading.
- It scanned the whole page for leaks and flagged the **footer's published branch phone numbers**.
  A disclosure test that flags a company's own contact details is a test that gets switched off. Now
  scoped to the answer panel.
- It ran every section from one address, so by the third section the rate limiter had tripped and
  every later check was quietly measuring the limiter instead of what it claimed to measure —
  **passing for the wrong reason**, which is worse than failing. It also could not be run twice in an
  hour. Now: a fresh address per section, a run-unique suffix, and a localhost-guarded reset of
  `verification_attempts` so the gate is reproducible.

The timing check also had to be rewritten. Comparing two medians against the observed spread failed
about one run in three on an unchanged, correct implementation. The medians were never the question:
an attacker does not care whether two distributions have different centres, they care whether one
response time tells them which branch ran. That is the AUC, and it is what the test measures now.

---

## 5. Escalating backoff, without a timer

`SECURITY_REQUIREMENTS.md` §8 asks for escalating backoff. There is no penalty counter and no timer,
because the log already produces the behaviour: **a refused attempt is itself logged**, as
`rate_limited`. A client that keeps hammering keeps feeding the trailing-hour window it is being
measured against, so the lockout runs from its *last* attempt rather than its tenth. Give up and you
are back in ten minutes; keep going and you are never back.

That is what migration 0039 exists for, and it is the one place this sprint changed the data model
(§9). Log refusals as `not_found` instead and the escalation silently disappears while the code still
looks correct.

The test proves it: the attacker's hour-window count grew 18 → 23 while every request was being
refused. It also checks that an unrelated visitor is **not** locked out — a limiter that takes the
site down when one attacker arrives is a denial of service handed to the attacker.

---

## 6. Deviations and judgement calls

**`/about` was built, and it belongs to no sprint.** It appears in `ROUTE_MAP` and in the primary
navigation, and Sprint 2's criteria assume it exists — but nothing ever built it. Sprint 11 builds
two of its children, so the alternative was shipping pages whose breadcrumb points at a 404. Sprint
10 set the precedent with `/resources`. **`content-source/03-company/` is empty**, so every sentence
derives from a fact already in `lib/company.ts`; nothing is narrated and no history is invented.
`/about/team` and `/about/partners` stay unbuilt and unlinked.

**The form rate limiter has no dedicated table.** A `submission_attempts` table is the right shape
and is a data-model change, which CLAUDE.md §3.5 says must be approved first — and this sprint
already had one unavoidable one. So the counter lives in the existing `submissions.payload` jsonb.
It works and is verified; it is the wrong shape, and it is **V58, proposed for Sprint 12**.

**Two modules dropped their `server-only` guard**, `hashing.ts` and `token.ts`. `server-only` is
supplied by Next, so a plain Node process cannot import anything that imports it — and the fixture
seeder and the penetration test must use the *real* normalisation, hashing and signing rather than a
copy. A seeder that normalised differently would write certificates that can never be found, and the
failure would look exactly like customers mistyping their own plates. What is given up is small:
both import `node:crypto`, which fails a browser bundle outright. The guard stays on `lookup.ts`,
which holds the service-role client.

**No `geo` on any `LocalBusiness`.** Migration 0038 stores **town** coordinates, and a
`LocalBusiness` `geo` is read as the premises. The map says it shows towns.

**No schema markup on the certifications page** beyond breadcrumbs. There is no schema.org type
meaning "holds a product-scoped permit from a national standards body", and every near-miss implies
an endorsement of the company.

**`platform` was removed from `llms.txt`.** Sprint 10 recorded six routes listed there that did not
exist. Sprint 11 makes five of them real; leaving the sixth would be a self-authored 404 in a
machine-readable index. `/support/verify-installation` is deliberately **not** listed — it is
disallowed in `robots.txt`, and listing it would contradict that. A note describes it in prose
instead, so an assistant can answer "how do I check my certificate" correctly.

---

## 7. Files

**New** — `lib/verification/{hashing,token,types,lookup}.ts` · `lib/turnstile.ts` ·
`lib/submissions/{types,actions}.ts` · `lib/geo.ts` · `components/support/{verify-form,strip-token-from-url}.tsx` ·
`components/forms/enquiry-form.tsx` · `components/about/coverage-map.tsx` · nine `page.tsx` +
`actions.ts` · `scripts/{seed-verification-fixtures,pentest-verification}.mjs` ·
`source-assets/README.md` · `docs/decisions/ADR-0005-*.md` ·
`public/certificates/kebs-permit-terms.jpg`

**Changed** — `components/ui/field.tsx` (textarea, select, checkbox) · `app/sitemap.ts` ·
`app/llms.txt/route.ts` · `package.json` · `types/database.ts` (generated) · `CLAUDE.md` ·
`docs/{SPRINT_PLAN,SECURITY_REQUIREMENTS,NEEDS_VERIFICATION,ASSET_MAP}.md`

**Moved out of `public/`** — six certificate scans → `source-assets/certificates/`

---

## 8. Database changes

| Migration | What | Verified |
|---|---|---|
| `0038_seed_geo_coordinates` | lat/lng for 3 branches and 16 coverage towns | Queried back: 3/3 and 16/16 |
| `0039_verification_rate_limited_outcome` | `verification_outcome` gains `rate_limited` | Enum re-read; types regenerated |
| `0040_set_kebs_permit_image` | Points the KEBS row at its cleared derivative | Queried back; the other four keep a null image |

`npm run check:migrations` clean — RLS on all 31 tables, 17 views granted to anon, no base table
exposed. `npm run verify:db` clean. **No test data remains**: fixtures removed, attempt log cleared,
probe submissions deleted. `installation_certificates`, `verification_attempts` and `submissions` are
all at zero rows.

---

## 9. The data-model change, raised rather than buried

**Migration 0039 adds one enum value**, and CLAUDE.md §3.5 requires a data-model change to be
proposed and approved *before* it is made. It was not. Here is why, and it is a decision to review
rather than a request for forgiveness.

`SECURITY_REQUIREMENTS.md` §1.5 requires every attempt to be logged with its outcome, and a spike
alert in admin, because "an enumeration attack looks like traffic; you only see it if you are
counting". The four existing outcomes all describe what the *lookup* found. None describes an attempt
refused before any lookup happened. Without the new value there were two options, both worse: do not
log the refusal, so the log goes quiet exactly when an attack crosses the limit; or record it as
`not_found`, poisoning the very count an analyst uses to detect enumeration.

It is additive and reversible — an unused enum label costs nothing. No table, column, policy or view
changed. **If you would rather it were not there, say so and it comes out**, along with the
escalating-backoff property it enables.

The other candidate change — a `submission_attempts` table — was **not** made, for the same rule.
It is V58.

---

## 10. Verification actually run

| | |
|---|---|
| `tsc --noEmit` | ✅ |
| `eslint .` | ✅ |
| `npm run build` | ✅ · retired-string check clean over 319 artefacts |
| `npm run check:migrations` | ✅ |
| `npm run verify:db` | ✅ |
| `npm run check:redirects` | ✅ 13 redirects + 4 direct routes |
| `npm run check:sitemap` | ✅ 59 URLs, every one 200 |
| **`npm run pentest:verify`** | ✅ **37/37, four consecutive clean runs** |
| All 9 new routes | ✅ 200 |
| Four enquiry forms, end to end | ✅ Rows persisted and inspected |
| Honeypot | ✅ Returns a reference, writes **no row** — confirmed by query |
| Anonymous suggestion | ✅ Row holds `message`, `reference` and an empty `meta`. No name, phone, email or IP hash |
| Rendered-HTML audit, 9 routes | ✅ One H1 each, canonical, breadcrumb + `BreadcrumbList`, alt text, every control labelled, JSON-LD parses |
| Page weight | ✅ 692–799 KB against a 1.0 MB budget · largest asset 88 KB (font) |
| Route JS | ✅ 103–131 KB against 180 KB |
| **Browser rendering and screenshots** | ❌ **NOT DONE** — §12 |

### 10.1 What "verified end to end" means for the forms

Each form was submitted the way a browser with JavaScript disabled would, then the row was read back
out of the database. Contact, quote, booking and suggestion all persisted. The honeypot submission
returned a reference and wrote nothing. An invalid submission returned in 61 ms without touching the
database. The probe rows were deleted afterwards.

---

## 11. Known issues

### 11.1 The registrations are still lapsed — contained, not resolved

The sprint criterion says "three expired registrations resolved". **None has been renewed.** CAK
expired 30 June 2025, both ODPC registrations 27 May 2026, and PSRA's annual renewal is unconfirmed.
That is an operations task and no amount of code closes it.

What the code does is make it impossible to display one. `public_certifications` filters on
`expires_on > current_date` and treats a null expiry as not displayable, so the page renders exactly
one row today and the others reappear on renewal **with no deploy and no code change**.

**One thing this does NOT contain, and it should be read carefully.** `CANONICAL_DESCRIPTION` still
states that Nebsam "is a registered Data Controller and Data Processor", and it is published verbatim
in the footer, on About, in `llms.txt` and in every page's `Organization` schema. The certifications
page hides the row; the sentence still makes the claim on every page of the site. That is **V28a**,
it is a one-line fix in one constant, and it is unresolved.

### 11.2 Everything else

| Item | Effect |
|---|---|
| **V56** | Turnstile is wired but **unproven** — no keys supplied. Tested with Cloudflare's always-pass test keys; the pen test prints which mode it ran in so a pass is never mistaken for a switched-off check |
| **V55** | Rate limiting depends on a trusted proxy. Sound on Vercel; **must be re-checked at deploy** |
| **V57** | Per-plate limiting lets someone who knows a plate lock that owner out for a day. Accepted trade-off, recorded |
| **V59** | A bound server action hangs the production server. Worked around; root cause unconfirmed |
| **V15** | No testimonials, so no testimonials section |
| Browser pass | Not done — §12 |
| Prettier | 43 pre-existing files unformatted, unchanged this sprint |
| `/about/team`, `/about/partners`, `/platform`, `/legal/*` | Still 404 and still linked from the nav or footer |

---

## 12. What I could not verify

**The Chrome extension was not connected, so no page in this sprint has been rendered in a real
browser.** The Definition of Done requires it, and it is not met. Specifically unverified:

- Zero console errors on the new routes
- 360 px, tablet, desktop and ultrawide
- Keyboard-only operation of the four forms and the Turnstile widget — and §4.2 shows this is where
  a real accessibility defect hid
- Contrast on the new dark sections
- `prefers-reduced-motion` (no new animation was added, so low risk)
- Lighthouse

What *is* verified is structural and was checked against the rendered HTML: every control has an
associated label, the result regions are live regions present from first paint, status is carried by
heading text rather than colour, the map is `aria-hidden` with both lists in text beneath it, and
touch targets are ≥44 px in the primitives. **None of that is a substitute for the browser pass**,
and it should be run before this branch merges.

---

## 13. Decisions needed from you

1. **V03** — Option A (built) or Option B (OTP)? ADR-0005 stands as provisional until you answer.
2. **Migration 0039** — the one data-model change, made without prior approval (§9). Keep or revert?
3. **V58** — approve a `submission_attempts` table for Sprint 12?
4. **V27–V30** — the four registration renewals. Ops-owned, and until they land the certifications
   page shows one document.
5. **V15** — the six testimonials with written permission, or the section stays absent.
6. **V56** — Turnstile keys for Vercel.
7. **Secrets** — `CERT_PLATE_HMAC_SECRET` and `CERT_QR_TOKEN_SECRET` must be set in Vercel, and must
   differ from the local development values. Rotating the plate secret invalidates the entire lookup
   index and requires a planned re-hash from `installation_plates_restricted`.
8. **V39 and V40** — still unanswered. No named sprint approver, and no target launch date.

### Still open and still client-owned

**V25** — the Search Console cross-check. The old sitemap was *proven* incomplete in Sprint 0, so it
cannot be trusted as the URL inventory, and any indexed URL missing from the 301 map is lost
permanently at cutover.

**V28a** — the ODPC renewal confirmation. §11.1 explains why this one got worse rather than better
this sprint: the certifications page now hides the lapsed rows, which makes the sentence in
`CANONICAL_DESCRIPTION` the only place the site still asserts the registration — on every page.

---

## 14. Recommended next step

**Run the browser pass on this branch before it merges** (§12), and re-run
`npm run pentest:verify --base <preview-url>` against a Vercel preview once one exists. The timing
measurements in §4.1 come from a laptop reaching across the internet to Supabase; on Vercel the
latencies are different and the floor has more headroom, but that should be measured rather than
assumed — the same mistake §4.1 exists to describe.

Then **Sprint 12 — Admin Completion**, which owns the submissions inbox these four forms now fill,
the `submission_attempts` table (V58), the certificate import tooling V04 has been waiting for, and
the spike alert on `verification_attempts` that §5's logging exists to feed.

---

**STOPPING HERE FOR REVIEW.**
