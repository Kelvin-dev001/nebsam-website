# SEO AND LLM DISCOVERABILITY STRATEGY

Target intents, schema plan, internal linking, `llms.txt` and the 301 map rationale.

Per-route checklist: the **`nebsam-seo`** skill. Route inventory and the full 301 table:
`docs/ROUTE_MAP.md`.

---

## 1. The before, measured

This is the baseline the rebuild is judged against. Every figure was verified in Sprint 0, not
assumed.

| | Current (CRA) | After |
|---|---|---|
| Content in served HTML | **None.** `<div id="root"></div>` | Fully server-rendered |
| `<title>` in served HTML | **`Nebsam`** — on every page | Unique, 50–60 chars, per route |
| Meta description in served HTML | **Absent** | Unique, 140–155 chars, per route |
| Structured data | Injected post-hydration by `react-helmet` | Server-rendered JSON-LD |
| `Organization.logo` | Points at `/images/logo.png` — **file does not exist** | Real, resolvable |
| Sitemap | Hand-maintained, **missing at least one live route** | Generated from published content |
| `robots.txt` | Permissive and correct | Regenerated, unchanged in effect |
| `llms.txt` | **None** | Generated, updated in the same commit as any route or name change |
| Canonicals | Present but client-side | Server-rendered, self-referencing |

**The single fix underneath all of it:** content that matters is server-rendered. A crawler that
does not execute JavaScript currently sees the word "Nebsam" and nothing else, on every page of the
site. That is the whole problem, and it is architectural.

**Verification method, per route:** view source with JavaScript disabled and confirm the content,
title, description and JSON-LD are present. Never assumed from reading the code — brief PART 2.6.

---

## 2. Target intents

One page owns one intent. If two pages compete for the same intent they are merged or differentiated
— which is exactly why products and shop are a single merged page type.

| Intent | Owner |
|---|---|
| vehicle tracking Kenya · GPS tracker Kenya | `/solutions/vehicle-tracking` |
| car tracking Nairobi · car tracking Mombasa | branch content within `/about/coverage` + `/solutions/vehicle-tracking` |
| fleet management Kenya · fleet tracking system Kenya | **deferred** — `/solutions/fleet-management` is post-launch |
| fuel monitoring Kenya · fuel theft detection | `/solutions/fuel-monitoring` |
| speed governor Kenya · NTSA speed limiter | `/solutions/speed-governors` |
| dashcam Kenya | `/products/hybrid-dashcam` |
| driver behaviour monitoring | `/solutions/ai-video-telematics` |
| vehicle immobilizer Kenya · anti-jammer tracker Kenya | `/solutions/vehicle-security`, `/products/anti-jammer-tracker` |
| motorbike tracking Kenya | `/solutions/vehicle-tracking` |
| school bus tracking Kenya | `/solutions/school-bus-management` |
| car hire vehicle tracking | `/industries/car-hire-rental` |
| container e-seal Kenya · **electronic cargo tracking system Kenya · ECTS Kenya** | `/solutions/container-e-seal` |
| asset tracking Kenya | **deferred** — post-launch |
| vehicle key programming Nairobi | `/solutions/vehicle-key-programming` |
| PoC radio Kenya | `/solutions/radio-communication` |
| telematics East Africa | `/` and `/about` |

**Two intents have no owner at launch** — "fleet management Kenya" and "asset tracking Kenya" —
because their pages are deferred for want of source material. That is a deliberate, recorded cost of
not fabricating content, not an oversight. Both slugs are reserved.

**No thin town-landing pages** (client decision). Local relevance comes from real branch pages, the
coverage architecture and consistent NAP.

---

## 3. Schema plan

| Template | Schema |
|---|---|
| Every page | `Organization` (with `sameAs`, `logo`, `contactPoint`) + `WebSite` |
| Branch / coverage | `LocalBusiness` × 3, consistent NAP, `openingHours` 24/7, `geo` |
| `/solutions/[slug]` | `Service` |
| `/products/[slug]` | `Product` + `Offer` **only where a real price is published** |
| Blog article | `Article` with real `author`, `datePublished`, `dateModified` |
| Any FAQ block | `FAQPage` |
| Industry | `Service` or `WebPage` |
| All | `BreadcrumbList` |

**Never** emit `Review` or `AggregateRating` — there are no genuine collected reviews, and the six
real testimonials are not a review corpus. **Never** emit markup that contradicts the visible page.
Validate every type before a sprint closes.

`sameAs` is currently empty — social URLs are unconfirmed (**V08**). An absent `sameAs` is better
than a wrong one; the field is omitted until the URLs are supplied rather than guessed.

### 3.1 The `Offer` discipline

Most products have no confirmed price. Those pages emit `Product` **without** `Offer` and show
"Request price" with a WhatsApp CTA. Emitting an `Offer` with a fabricated or placeholder price
would be structured-data fraud and would also contradict the visible page.

Where a price is published, `Offer` carries the **VAT-exclusive** figure, matching the visible
`excl. VAT` label exactly. Recurring costs (the KES 3,000 per device per year CAK renewal on PoC
radios) are stated on the page next to the price — schema has no clean field for them, so the page
must carry the disclosure.

---

## 4. LLM discoverability

Assistants answer from text that is explicit, self-contained and consistent. Four mechanisms:

**The canonical company description.** Written **once** in `lib/company.ts`, reused **verbatim** in
the footer, About, `llms.txt` and `Organization` schema. Identical wording everywhere strengthens
entity resolution; drift weakens it. Never reworded per page.

> Nebsam Digital Solutions (K) Ltd installs and supports vehicle tracking, fleet telematics, vehicle
> security, fuel monitoring, video telematics and radio communication systems across Kenya, from
> branches in Nairobi, Mombasa and Nakuru. The company is a registered Data Controller and Data
> Processor with the Office of the Data Protection Commissioner, and holds a KEBS Permit to Use the
> Standardization Mark for vehicle cameras for video telematics.

> ⚠️ **Dependency — register item V28a, gated on Sprint 2.** Both ODPC registrations expired
> 27 May 2026. The client has confirmed renewal is in hand and the sentence ships. Because it lives
> in exactly one constant, if renewal slips the correction is a one-line change rather than a
> rewrite across the footer, About, `llms.txt` and every page's schema. **Sprint 2 does not close
> until renewal is confirmed or the sentence is removed.**
>
> `[[NEEDS_VERIFICATION: client sign-off on the final canonical company description wording]]`

**Self-contained pages.** Each page states its own context — an assistant may retrieve one page with
no site context. Every page makes plain who Nebsam is and where it operates.

**Answer-shaped sections.** A short, direct answer paragraph immediately under each question
heading, before any elaboration. Headings phrased as the question a buyer actually types. Assistants
and featured snippets lift the first clear answer.

**Definitional content as a deliberate type.** Pages that define telematics, geofencing,
immobilisation, anti-jamming, fuel siphoning detection, PoC radio and e-seal. Definitions get cited,
and a citation is a link.

**Zero contradictions.** One phone number per branch, one product name per product, one company
description, site-wide. This is why `lib/company.ts` exists and why nothing hard-codes NAP.
Contradictions make a model distrust the source.

**Real dates.** `datePublished` and `dateModified` on articles; a visible "last updated" on solution
pages.

### 4.1 `llms.txt`

Served at the root, **generated** from `lib/company.ts` and the route table — never hand-maintained,
because a stale `llms.txt` is worse than none: it teaches assistants outdated product names.

Carries: who Nebsam is and what it does · where it operates, with branch details · the canonical
list of solutions with URLs · the canonical list of products with URLs · pointers to key pages · the
canonical company description, verbatim.

**Updated in the same commit** as any change to routes, product names or company facts.

---

## 5. Internal linking — no orphan pages

- Every **solution** → its products, its industries, at least one article
- Every **product** → its solutions, its industries, its shop entry
- Every **industry** → relevant solutions and products
- Every **article** → at least one solution
- Every page reachable from navigation or a hub
- Links **in** and **out**. A page with no inbound internal link does not exist

Two cross-links are specifically load-bearing and easy to forget:

1. **Hybrid Dashcam ↔ AI Vehicle Video Telematics.** They are separate products that a buyer will
   confuse. "Which one do I need?" is a real buying question, and a page that answers it well will
   rank. Each links to the other and states plainly how they differ.
2. **`/solutions/container-e-seal` ↔ `/industries/cross-border-transport`.** This is the destination
   of the ECTS 301 and needs inbound links proportionate to the equity being redirected into it.

---

## 6. The 301 map — the one irreversible mistake

Full table: `docs/ROUTE_MAP.md` §2.

`/services/*` holds whatever ranking equity the site has. Losing it cannot be undone. Three points
that matter more than the table itself:

1. **The redirects ship in Sprint 2, not Sprint 15.** Thirteen sprints of preview deployments
   exercising them is the difference between a tested map and a hoped-for one.
2. **`/services/electronic-cargo-tracking-system` was missing from every inventory** — the live
   sitemap, the captured URL list, and the brief. Sprint 0 found it by reading `src/`. It is the
   single most likely URL to have been lost, and it is now the first row of §2.2.
3. **Search Console has not been cross-checked** (**V25**). The live sitemap has been proven
   incomplete by at least one route, so it cannot be trusted as the full inventory. Anything indexed
   and not in the map is a permanent loss at cutover. This blocks Sprint 2 closing.

A 301 preserves equity only if the destination is topically the same page. That is why
`/solutions/container-e-seal` must carry "Electronic Cargo Tracking System (ECTS)" in its title and
H1 despite the slug following the confirmed taxonomy.

---

## 7. Measurement

Instrumented from Sprint 2, consent-gated, no PII in any payload:

`whatsapp_click` (source page + context) · `phone_click` · `quote_submitted` ·
`installation_booking_submitted` · `demo_requested` · `contact_submitted` · `suggestion_submitted` ·
`download_started` (file name) · `view_item` · `add_to_cart` · `begin_checkout` ·
`whatsapp_order_submitted` (order number + value) · `certificate_verified` (**outcome only**, never
the plate) · `blog_read_complete`.

One wrapper in `lib/analytics.ts`; event names in `lib/constants.ts`. Nothing fires before cookie
consent. GA4 conversions configured for WhatsApp click, quote submitted and WhatsApp order
submitted. Sitemap submitted to Search Console at launch.

**No plate, and no verification outcome tied to a plate, may enter analytics, URLs, logs or error
messages.**

Existing Google properties are unconfirmed (**V10**) — whether a GA4 property, Search Console
account or Business Profile already exists determines whether historical data survives, and a
Business Profile is also a NAP-consistency surface that must match `lib/company.ts`.

---

## 8. Sprint 13 audit — what "clean" means

Full crawl with JavaScript disabled · every schema type validated · no duplicate titles or
descriptions · exactly one H1 per page · every page has an inbound internal link · sitemap matches
published content exactly · `llms.txt` current · every 301 resolves in one hop, no chains · no
`[[NEEDS_VERIFICATION]]` token on any public page · no page indexed that should be `noindex`.
