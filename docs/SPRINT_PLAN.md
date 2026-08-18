# SPRINT PLAN

Sixteen sprints, each with acceptance criteria. **Every sprint ends with a report (brief PART 21.2)
and a full stop.** Never roll into the next sprint unprompted.

**Sprint 0 has no code. Sprint 1 has no content migration. Do not merge sprints.**

---

## Branch model

```
main  (production — currently serving the live CRA site, frozen)
  └── develop  (integration)
        └── sprint/NN-name  (work)
```

**Vercel production stays pinned to `main` until Sprint 15.** Every sprint is reviewed on a `develop`
preview URL. There is no period where a half-finished rebuild is the public site.

`main` must stay frozen — no feature work — for the single merge at Sprint 15 to be safe.

Conventional commits. Small, single-purpose. PR per sprint with the sprint report as the description.
Preview URL included in every report.

---

## Definition of Done — every sprint

`tsc --noEmit`, lint and build pass · rendered and interacted with in a real browser, screenshots
captured · zero console errors on affected routes · 360 px / tablet / desktop / ultrawide verified ·
keyboard-only pass on new interactive elements · contrast checked on any new dark or glass surface ·
perf budgets **measured, not assumed** · metadata and schema present and validated · reduced motion
verified · no unlogged `[[NEEDS_VERIFICATION]]` · no secrets, no PII, no fabricated content · docs
updated · committed in clean scoped commits.

---

## Sprint 0 — Discovery & Architecture ✅

**Delivers** `CLAUDE.md` + 15 planning documents. No code.
**Gate** Human approves the architecture.

- [x] Repository audited independently; PART 7.0 re-verified
- [x] Design tokens derived by sampling the logo; contrast table computed
- [x] Full source-document → page mapping
- [x] 301 map complete, **including the ECTS route absent from every prior inventory**
- [x] Verification register reconciled against the 190 tokens actually in `content-source/`
- [x] ADR-0001 recorded
- [ ] **Human approval**

---

## Sprint 1 — Design System & Homepage Prototype

**Delivers** Next.js scaffold, tokens, type, primitives, motion primitives, the signature element,
one homepage screen as visual proof.
**Gate** Human approves *the look*.

- CRA deleted on `develop`; Next.js + TypeScript + Tailwind scaffolded; `package.json` and
  `README.md` replaced
- Tokens implemented exactly as `DESIGN_SYSTEM.md` §2; contrast re-verified in the browser
- Typefaces chosen against **rendered specimens**, within the 3-file limit
- Primitives built (`DESIGN_SYSTEM.md` §7), including `PriceTag` with its non-optional VAT label
- Three signature directions prototyped, **one proposed** (§8)
- Two-pass process followed: plan → critique before code → build → screenshot → critique → remove one thing
- **Budgets measured on the prototype** — proving the budget is achievable before twelve sprints are built on it

**No content migration. No database.**

---

## Sprint 2 — Core Infrastructure

**Delivers** Layout, nav, footer, WhatsApp button, SEO/metadata/schema infrastructure, generated
sitemap, robots, `llms.txt`, **the full 301 map**, the retired-string build check, error and loading
states, analytics + consent.
**Gate** Lighthouse and a11y baseline; **every old URL resolves**.

- [ ] `lib/company.ts` — the single NAP source, with the canonical description
- [ ] **Every redirect in `ROUTE_MAP.md` §2 verified by request**, not by reading config —
      including `/services/electronic-cargo-tracking-system`
- [ ] **V25 closed** — Search Console cross-checked; anything indexed and missing added to the map
- [ ] **V28a resolved** — ODPC renewal confirmed, or the registration sentence removed from the
      canonical description. *This sprint publishes it to the footer, About, `llms.txt` and every
      page's schema, so it cannot ship unresolved.*
- [ ] Build-time retired-string check failing the build on rendered output
- [ ] `sitemap.xml` generated, `llms.txt` generated, `robots.txt` regenerated
- [ ] Consent gating verified: GA4 does not fire before consent
- [ ] CSP report-only + security headers
- [ ] V07 (info@ live), V08 (social URLs), V10 (Google properties), V35 (support@) resolved or
      explicitly deferred with the field omitted rather than guessed

---

## Sprint 3 — Data & Content Layer

**Delivers** Supabase schema, migrations, RLS, generated types, content access layer, seed data,
admin auth + shell.
**Gate** Schema review.

- [ ] Migrations 0001–0010 per `DATABASE_ARCHITECTURE.md` §8
- [ ] **RLS on every table**, reviewed table by table; anon key confirmed unable to write
- [ ] Types generated, not hand-written
- [ ] Every query in `lib/content/`; no component calls Supabase directly
- [ ] Seed contains **no real customer data**
- [ ] Certificate tables built to Option A; plate stored as HMAC only
- [ ] V04 (certificate source and format) resolved or the import deferred

---

## Sprint 4 — Homepage (production)

**Delivers** The full narrative homepage on real data.
**Gate** Perf budget + review.

- [ ] Twelve sections or fewer — cut rather than pad
- [ ] Proof band uses **only** permission-confirmed logos (V12); if none are confirmed, the band
      shows registrations rather than logos
- [ ] Platform section uses **only** cleared screenshots (V13); if none are cleared, the section is
      cut, not filled with placeholders
- [ ] Testimonials real or the section is absent (V15)
- [ ] **All budgets met** — this is the heaviest page on the site

---

## Sprint 5 — Solutions

**Delivers** Reusable solution template + **ten** solutions.
**Gate** Content accuracy review.

- [ ] Eleven-section model per solution (`CONTENT_ARCHITECTURE.md` §1.1)
- [ ] `vehicle-tracking`, `vehicle-security`, `vehicle-recovery` **derived** from the product
      write-ups — every fact traceable, nothing invented, recovery's service specifics tokenised
- [ ] `container-e-seal` carries "Electronic Cargo Tracking System (ECTS)" in title and H1 —
      it receives the ECTS 301
- [ ] AI video telematics: **no NTSA transmission claim**, "KEBS accredited" corrected to the permit
      wording
- [ ] Speed governors: IRMS wording resolved (V02) or the mention omitted
- [ ] School bus: 8 items resolved (V17–V24), SOURCE NOTES block deleted, **legal review**
- [ ] Every source hedge preserved word for word
- [ ] `fleet-management` and `asset-tracking` **not built** — slugs reserved, not minted, not in the
      sitemap

---

## Sprint 6 — Products

**Delivers** Product template + all products + families + comparison.
**Gate** Naming and spec review.

- [ ] Built to the confirmed names; no retired name anywhere
- [ ] **Specifications server-rendered, never in a client-only tab**
- [ ] Hybrid Dashcam ↔ AI Video Telematics cross-linked, difference stated plainly
- [ ] Hybrid Pro Max: KIPI described as an **intellectual property registration**, never "certified"
- [ ] Four priced radio models as full pages; the other seven held as "request price"
- [ ] Audit items A01–A07 resolved before the affected pages ship
- [ ] V05 (installation terms) resolved

---

## Sprint 7 — Commerce

**Delivers** Price + VAT labelling, recurring-fee display, categories, filters, cart, order creation,
WhatsApp handoff, order lookup.
**Gate** End-to-end order test including VAT and the recurring fee in the WhatsApp message.

Acceptance list: `SHOP_ARCHITECTURE.md` §8. The two that matter most:

- [ ] **An order row exists before WhatsApp opens** — verified by killing the chat mid-flow
- [ ] **A tampered client price is rejected**; the server total wins

---

## Sprint 8 — Industries

**Delivers** Industry template + cross-linking.
**Gate** Review.

- [ ] Only industries the source documents actually name
- [ ] Each page says something specific about that sector, or is honestly a link hub
- [ ] No orphan pages: solution ↔ product ↔ industry all linked

---

## Sprint 9 — Blog & CMS

**Delivers** Full publishing workflow, editor, 8–10 seeded articles.
**Gate** **A non-technical user publishes a post unaided.**

- [ ] Draft → in review → published, scheduling, unpublish
- [ ] Autosave and revision history working
- [ ] SEO panel with live character counts
- [ ] Preview before publish
- [ ] Slug locks after first save; changing one creates a 301 automatically
- [ ] On-demand revalidation — publish, refresh, it is live
- [ ] Real author profiles (V09); no anonymous bylines
- [ ] Every article links to at least one solution

---

## Sprint 10 — Resources

**Delivers** Downloads, FAQs, guides.
**Gate** Review.

- [ ] `cleared_for_publication` enforced — **nothing publishes without a human clearance**
- [ ] Decision made on regenerating the four proposals from `content-source/` rather than redacting
      the Canva originals
- [ ] File size shown before the click
- [ ] Definitional content published: telematics, geofencing, immobilisation, anti-jamming, fuel
      siphoning detection, PoC radio, e-seal

---

## Sprint 11 — Trust & Support

**Delivers** Certifications, testimonials, coverage map, branches, certificate verification,
suggestions, contact, quote, booking.
**Gate** **Security test on verification** — not a feature demo.

- [ ] **V03 answered and ADR-0002 written** before verification is built
- [ ] Penetration test per `SECURITY_REQUIREMENTS.md` §8: enumeration at scale, escalating backoff,
      identical copy for unknown-plate and wrong-factor, **no timing difference**, QR token replay
      and expiry
- [ ] No plate in analytics, URLs, logs or error messages
- [ ] **Certifications: three expired registrations resolved** (V27–V30) — nothing lapsed displayed
- [ ] KEBS permit **cropped** before display (V34); scope stated on the page (product-scoped, not
      company-scoped)
- [ ] CAK described accurately — **it is not a licence** (V31)
- [ ] `installation.jpg` redacted or replaced (V32, V33)
- [ ] Coverage map: branches and coverage towns **visually distinct and legended**; no invented
      addresses, no counts of agents
- [ ] V11 (data protection contact) resolved — the privacy policy needs it

---

## Sprint 12 — Admin Completion

**Delivers** Orders pipeline, inbox, media library, roles, audit log.
**Gate** Staff walkthrough.

- [ ] A staff member adds a product, changes a price, uploads a brochure, imports certificates and
      reads the inbox — **unaided**
- [ ] Role separation verified per role **against RLS**, not the UI
- [ ] `audit_log` append-only; no update or delete policy exists for anyone
- [ ] Media library: alt text enforced at the database level; privacy prompt on upload
- [ ] CSV import: dry-run preview, transactional, plates hashed at import

---

## Sprint 13 — SEO / LLM Audit

**Delivers** Full crawl, schema validation, metadata, internal linking, `llms.txt`, Search Console.
**Gate** Crawl report clean.

Definition of clean: `SEO_LLM_STRATEGY.md` §8. Including: **no `[[NEEDS_VERIFICATION]]` token on any
public page**, and every 301 resolving in one hop with no chains.

---

## Sprint 14 — Performance & Accessibility

**Delivers** Budgets met, keyboard and screen-reader pass, image optimisation, bundle analysis.
**Gate** All budgets green.

- [ ] Every budget in `PERFORMANCE_BUDGETS.md` §2 green on **every** template
- [ ] The 28 MB legacy `public/` fully audited; nothing unconverted promoted
- [ ] NVDA + iOS VoiceOver on all five critical paths
- [ ] Keyboard-only end-to-end; 200% zoom and 400% reflow; forced-colours pass
- [ ] CSP enforced

---

## Sprint 15 — QA & Launch

**Delivers** Cross-device QA, forms, emails, the 301 map live, backups, monitoring, deploy.
**Gate** Human sign-off.

- [ ] **`develop` merged to `main`; Vercel production switched**
- [ ] Every old URL verified live against production, not preview
- [ ] Sitemap submitted to Search Console
- [ ] Backups and monitoring confirmed
- [ ] Secrets audit
- [ ] **No unresolved `[[NEEDS_VERIFICATION]]` on any public page** — brief PART 2.2 forbids launch
      otherwise

---

## Post-launch scope — recorded, not dropped

| Item | Blocked by |
|---|---|
| `/solutions/fleet-management` | No source material; platform screenshots (**V13**) |
| `/solutions/asset-tracking` | No source material describing the non-vehicle operational context |
| Seven remaining radio product pages | ~120 open specification tokens; 7 unconfirmed prices |
| Download centre proposals | All four blocked on content clearance |
| Swahili locale | Architecture is i18n-ready; one locale active |
| M-Pesa / card payments | Schema prepared, flow not built |

The two deferred solutions leave "fleet management Kenya" and "asset tracking Kenya" without an
owner at launch. That is a deliberate, recorded cost of not fabricating content.

---

## Open items owned by the client

| # | Item | Blocks |
|---|---|---|
| **V25** | Search Console cross-check | **Sprint 2 cannot close** |
| **V28a** | ODPC renewal confirmation | **Sprint 2 cannot close** |
| V03 | Verification second factor | Sprint 11 |
| V02 | IRMS wording | Sprint 5 |
| V01 | NTSA transmission | Sprint 5 (claim stays off the site regardless) |
| V13, V15, V12 | Screenshots, testimonials, logo permissions | Sprint 4 |
| V27–V31 | Expired registrations, CAK description | Sprint 11 |
| **V39** | **Named sprint approver** | Every gate |
| **V40** | **Target launch date** | Sequencing and risk flagging |
| V38 | Off-machine backup of `_inbox/` | — (standing risk) |

**V39 and V40 are unanswered.** Every gate in this plan says "human approves" without naming who,
and no target date exists against which to flag an at-risk sprint.
