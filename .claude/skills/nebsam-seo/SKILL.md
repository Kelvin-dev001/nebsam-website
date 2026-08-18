---
name: nebsam-seo
description: "SEO and LLM-discoverability checklist for every Nebsam page. Use when creating or editing any route."
---

# SEO and LLM discoverability — per-page checklist

The rebuild exists because the current site is a client-rendered SPA whose content and metadata are
largely invisible to crawlers and to LLM retrieval. Every rule here protects against repeating that.

**The rule underneath all of them: content that matters is server-rendered.** Nothing important
behind client-only rendering or interaction. Specifications must not sit in a tab that renders
client-side only — that is the exact failure this rebuild is fixing.

Full contract: `docs/brief/00-MASTER-BRIEF.md` PART 13.

## 1. Metadata — every indexable page

| Element | Rule | Limit |
|---|---|---|
| `<title>` | Unique per page. Primary intent first, brand last. | **50–60 chars** — truncates past ~60 |
| Meta description | Unique. Describes the page, contains the intent, ends with a reason to click. | **140–155 chars** — truncates past ~160 |
| H1 | **Exactly one.** May differ from `<title>`. | ~70 chars |
| H2/H3 | Logical nesting, no skipped levels | — |
| Canonical | Self-referencing on every page | — |
| Slug | Clean, descriptive, `kebab-case`, no dates or IDs | — |
| OG + Twitter card | Real image, never a placeholder | 1200×630 |
| Image alt text | On every image, written for a human | — |
| Breadcrumbs | Visible **and** `BreadcrumbList` schema | — |

Slugs are permanent. Confirm naming before minting a URL; any later change costs a 301.

## 2. Schema by template

| Template | Schema |
|---|---|
| Global (every page) | `Organization` (with `sameAs`, `logo`, `contactPoint`) + `WebSite` |
| Branch pages | `LocalBusiness` × 3, consistent NAP, `openingHours` 24/7, `geo` |
| `/solutions/[slug]` | `Service` |
| `/products/[slug]` | `Product` + `Offer` **only where a real price is published** |
| Blog article | `Article` with real `author`, `datePublished`, `dateModified` |
| Any FAQ block | `FAQPage` |
| Industry pages | `Service` or `WebPage` |

**Never** emit `Review` or `AggregateRating` without genuine collected reviews. **Never** emit
markup that contradicts the visible page. Validate every type before a sprint closes.

## 3. Internal linking — no orphan pages

- Every **solution** links to its products, its industries and at least one article
- Every **product** links to its solutions, its industries and its shop entry
- Every **industry** links to relevant solutions and products
- Every **article** links to at least one solution
- Every page is reachable from navigation or a hub page
- Links in **and** links out — a page with no inbound internal link does not exist

## 4. Answer-shaped content

Assistants and featured snippets lift the first clear answer under a heading. So:

- Put a **short, direct answer paragraph immediately under each question heading**, before any
  elaboration. Do not open with background.
- Phrase headings as the question a buyer actually types.
- Make each page **self-contained** — state its own context, because an assistant may retrieve one
  page with no site context. Every page should make plain who Nebsam is and where it operates.
- Write **definitional content**: telematics, geofencing, immobilisation, anti-jamming, fuel
  siphoning detection, PoC radio, e-seal. Definitions get cited.
- **Zero contradictions.** One phone number per branch, one product name per product, one company
  description, site-wide. Contradictions make a model distrust the source.
- Real dates: `datePublished` and `dateModified` on articles, a visible "last updated" on solution
  pages.

## 5. The canonical company description

Stored **once** in `lib/company.ts` and reused **verbatim** in the footer, the About page,
`llms.txt` and `Organization` schema. Identical wording everywhere strengthens entity resolution;
drift weakens it. Never reword it per page.

Draft, assembled only from verified facts in brief PART 3 —
`[[NEEDS_VERIFICATION: client sign-off on the canonical company description wording]]`:

> Nebsam Digital Solutions (K) Ltd installs and supports vehicle tracking, fleet telematics,
> vehicle security, fuel monitoring, video telematics and radio communication systems across Kenya,
> from branches in Nairobi, Mombasa and Nakuru. The company is a registered Data Controller and
> Data Processor with the Office of the Data Protection Commissioner, and holds a KEBS Permit to
> Use the Standardization Mark for vehicle cameras for video telematics.

Never hard-code a phone number, address or company name in a component. They live in
`lib/company.ts` only. NAP consistency drives local SEO and LLM entity resolution.

## 6. `llms.txt`

Served at the root. Update it in the **same commit** as any change to the routes, product names or
company facts it lists — a stale `llms.txt` is worse than none, because it teaches assistants
outdated names.

It must carry: who Nebsam is and what it does · where it operates, with branch details · the
canonical list of solutions with URLs · the canonical list of products with URLs · pointers to key
pages · the canonical company description, verbatim from §5.

## 7. Target intents — build genuine depth, never stuff

```
vehicle tracking Kenya · GPS tracker Kenya · car tracking Nairobi · car tracking Mombasa
fleet management Kenya · fleet tracking system Kenya · fuel monitoring Kenya
fuel theft detection · speed governor Kenya · NTSA speed limiter · dashcam Kenya
driver behaviour monitoring · vehicle immobilizer Kenya · anti-jammer tracker Kenya
motorbike tracking Kenya · school bus tracking Kenya · car hire vehicle tracking
container e-seal Kenya · asset tracking Kenya · vehicle key programming Nairobi
PoC radio Kenya · telematics East Africa
```

One page owns one intent. If two pages compete for the same intent, merge them or differentiate
them — that is why products and shop are a single merged page type.

**No thin town-landing pages** (client decision). Local relevance comes from real branch pages, the
coverage architecture and consistent NAP.

## 8. The 301 map — the one irreversible mistake

`/services/*` holds whatever ranking equity the site has. Losing it cannot be undone. These
redirects are implemented in `next.config.js` in Sprint 2, not at launch:

```
/services                            → /solutions
/services/car-tracking               → /solutions/vehicle-tracking
/services/fuel-monitoring            → /solutions/fuel-monitoring
/services/radio-calls                → /solutions/radio-communication
/services/vehicle-video-telematics   → /solutions/ai-video-telematics
/services/speed-governors            → /solutions/speed-governors
/services/car-alarms                 → /solutions/vehicle-security
/shop  and  /shop/*                  → /products equivalents
```

Never let both `/shop/x` and `/products/x` resolve 200. Cross-check Search Console for indexed URLs
absent from `public/sitemap.xml` before launch.

## 9. Before you finish a route

- [ ] Unique title (50–60) and meta description (140–155); exactly one H1
- [ ] Self-referencing canonical; slug confirmed permanent
- [ ] Correct schema type for the template, validated, not contradicting the visible page
- [ ] `Offer` only where a real price is published; price carries `excl. VAT`
- [ ] Breadcrumbs visible and marked up
- [ ] OG/Twitter image real, 1200×630; alt text on every image
- [ ] Links in and out — solution ↔ product ↔ industry ↔ article
- [ ] Direct answer paragraph under each question heading
- [ ] Company description verbatim from `lib/company.ts`; no hard-coded NAP
- [ ] `llms.txt` and the generated sitemap updated in this commit if routes or names changed
- [ ] Content server-rendered — verified by viewing source with JS disabled, not assumed
