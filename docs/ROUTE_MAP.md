# ROUTE MAP

Every route, its template, data source, metadata and schema type — plus the complete 301 map.

Slugs are permanent. Any later change costs a 301.

---

## 1. Public routes

`ISR` values are revalidation windows. Every route below is server-rendered; none depends on
client-side rendering for its content.

| Route | Template | Data source | Render | Schema |
|---|---|---|---|---|
| `/` | Home | `lib/company.ts` + CMS featured slots | Static, ISR 1 h | `Organization`, `WebSite` |
| `/solutions` | Solutions index | `solutions` | Static, ISR 1 h | `BreadcrumbList` |
| `/solutions/[slug]` | Solution detail | `solutions` + relations | Static params, ISR 1 h | `Service`, `FAQPage`, `BreadcrumbList` |
| `/products` | Catalogue — browse, filter, compare | `products`, `product_categories` | Static, ISR 15 min | `BreadcrumbList` |
| `/products/category/[slug]` | Category | `product_categories` | Static params, ISR 15 min | `BreadcrumbList` |
| `/products/[slug]` | **Merged spec + commerce** | `products` + relations | Static params, ISR 15 min | `Product` (+ `Offer` **only** where a real price is published), `FAQPage`, `BreadcrumbList` |
| `/cart` | Cart → WhatsApp checkout | client storage, revalidated server-side | Client island in a server shell | none · `noindex` |
| `/orders/[orderNumber]` | Order status lookup | `orders` | Dynamic | none · `noindex` |
| `/industries` | Industries index | `industries` | Static, ISR 1 h | `BreadcrumbList` |
| `/industries/[slug]` | Industry detail | `industries` + relations | Static params, ISR 1 h | `Service` or `WebPage`, `BreadcrumbList` |
| `/platform` | Fleet platform showcase | `media` (cleared screenshots only) | Static | `WebPage` |
| `/resources` | Resources hub | mixed | Static, ISR 1 h | `BreadcrumbList` |
| `/resources/blog` | Blog index | `blog_posts` | Static, ISR + on-demand | `Blog`, `BreadcrumbList` |
| `/resources/blog/category/[slug]` | Blog category | `blog_categories` | Static params, ISR | `BreadcrumbList` |
| `/resources/blog/[slug]` | Article | `blog_posts`, `authors` | Static params, on-demand revalidate | `Article` with real `author`, `datePublished`, `dateModified` |
| `/resources/downloads` | Download centre | `downloads` | Static, ISR 1 h | `BreadcrumbList` |
| `/resources/faqs` | FAQs | `faqs` | Static, ISR 1 h | `FAQPage`, `BreadcrumbList` |
| `/about` | About Nebsam | `lib/company.ts` + `03-company` | Static | `AboutPage`, `Organization` |
| `/about/team` | Team | `authors` / CMS | Static | `BreadcrumbList` |
| `/about/certifications` | Certifications & registrations | `certifications` | Static | `BreadcrumbList` |
| `/about/coverage` | Coverage network | `branches`, `coverage_locations` | Static | `LocalBusiness` × 3 |
| `/about/partners` | Partners | `client_logos` (permission-gated) | Static | `BreadcrumbList` |
| `/support` | Support hub | static | Static | `BreadcrumbList` |
| `/support/verify-installation` | **Certificate verification** | `installation_certificates` server-side only | Dynamic, server action | none · `noindex` |
| `/support/suggestions` | Suggestions | `submissions` | Dynamic | none |
| `/support/book-installation` | Installation booking | `submissions` | Dynamic | none |
| `/contact` | Contact | `lib/company.ts`, `branches` | Static shell + form | `ContactPage`, `LocalBusiness` × 3 |
| `/quote` | Request a quote | `submissions` | Dynamic | none |
| `/legal/privacy-policy` | Privacy policy (DPA 2019) | `content/` | Static | `WebPage` |
| `/legal/terms` | Terms | `content/` | Static | `WebPage` |
| `/legal/cookies` | Cookie notice | `content/` | Static | `WebPage` |
| `/admin/*` | Admin | Supabase, auth-gated | Dynamic | none · `noindex, nofollow`, excluded from sitemap |
| `/llms.txt` | Generated | `lib/company.ts` + routes | Route handler | — |
| `/robots.txt` | Generated | `app/robots.ts` | Generated | — |
| `/sitemap.xml` | **Generated** — never hand-maintained | all published content | `app/sitemap.ts` | — |

### 1.1 Solution slugs — ten at launch

| Slug | Status |
|---|---|
| `/solutions/vehicle-tracking` | Launch — derived |
| `/solutions/vehicle-security` | Launch — derived |
| `/solutions/vehicle-recovery` | Launch — derived |
| `/solutions/fuel-monitoring` | Launch |
| `/solutions/ai-video-telematics` | Launch |
| `/solutions/school-bus-management` | Launch, pending legal review |
| `/solutions/speed-governors` | Launch, pending V02 |
| `/solutions/container-e-seal` | Launch — **receives the ECTS 301** |
| `/solutions/radio-communication` | Launch |
| `/solutions/vehicle-key-programming` | Launch |
| `/solutions/fleet-management` | **Deferred past launch** — slug reserved, not minted |
| `/solutions/asset-tracking` | **Deferred past launch** — slug reserved, not minted |

A deferred slug is **not** published as a stub and **not** placed in the sitemap. A reserved slug
that 404s is honest; a stub page that ranks for an intent it cannot satisfy is worse than nothing.

---

## 2. The 301 map

**This is the one irreversible part of the project.** `/services/*` holds whatever ranking equity the
site has.

> **STATUS: IMPLEMENTED AND VERIFIED — Sprint 2.** All 13 redirects live in `next.config.mjs` and
> are checked by request, not by reading config, via `npm run check:redirects`. Every one returns
> **308** with the correct `Location`. Destinations under `/solutions/*` and `/products/*` are built
> in Sprints 5–6; a correct redirect to a not-yet-built page is the expected intermediate state.
>
> **Sprint 2 also removed `public/sitemap.xml` and `public/robots.txt`.** Those legacy CRA files
> were *shadowing* the generated routes — Next serves `public/` in preference to a route handler, so
> the site was still serving the old, incomplete sitemap: the very one missing the ECTS URL.

All redirects are **permanent (308/301)**.

### 2.1 From the live sitemap

| From | To | Confirmed |
|---|---|---|
| `/` | `/` | ✅ |
| `/about` | `/about` | ✅ |
| `/services` | `/solutions` | ✅ |
| `/services/car-tracking` | `/solutions/vehicle-tracking` | ✅ |
| `/services/fuel-monitoring` | `/solutions/fuel-monitoring` | ✅ |
| `/services/radio-calls` | `/solutions/radio-communication` | ✅ |
| `/services/vehicle-video-telematics` | `/solutions/ai-video-telematics` | ✅ |
| `/services/speed-governors` | `/solutions/speed-governors` | ✅ |
| `/services/car-alarms` | `/solutions/vehicle-security` | ✅ |
| `/contact` | `/contact` | ✅ |

### 2.2 Found in Sprint 0 — absent from every existing inventory

| From | To | Status |
|---|---|---|
| `/services/electronic-cargo-tracking-system` | `/solutions/container-e-seal` | ✅ **confirmed this sprint** |

This route is live. It is served by the dynamic `/services/:serviceName` route (`src/App.js:24`) and
resolved from the `serviceMeta` map in `ServiceDetail.js`; it sits in the primary navigation
(`Navbar.js:22`) and carries its own canonical (`ServiceDetail.js:36`), `Service` schema, OG image
and ~20 dedicated images. It appears in **none** of `public/sitemap.xml`,
`content-source/07-legacy-site/indexed-urls.txt`, or brief PART 7.0.

**Requirement on the destination:** `/solutions/container-e-seal` must carry "Electronic Cargo
Tracking System (ECTS)" in its `<title>` and H1. The slug follows the confirmed PART 4.3 taxonomy,
but the term the page currently ranks for is "electronic cargo tracking system" / "ECTS Kenya", and
a 301 only preserves equity if the destination is topically the same page.

### 2.3 Dead navigation links — need a decision and a redirect

| From | Proposed to | Status |
|---|---|---|
| `/team` | `/about/team` | Proposed — no route exists today; renders a soft 404 at HTTP 200 |
| `/clients` | `/about/partners` | Proposed — same |

Both are linked from the live primary navigation (`Navbar.js:58`, `:63`) but have no route in
`App.js`. If either has been indexed, it is indexed as a blank page. Confirm against Search Console
under **V25**.

### 2.4 Shop consolidation

| From | To |
|---|---|
| `/shop` | `/products` |
| `/shop/*` | `/products/*` equivalents |

"Shop" may remain a navigation **label** pointing at `/products`. **Never let both resolve 200** —
that is the keyword-cannibalisation trap the merged page type exists to avoid.

### 2.5 Still to be cross-checked — V25

`content-source/07-legacy-site/indexed-urls.txt` was captured from `public/sitemap.xml`, and Sprint 0
proved that sitemap is incomplete by at least one live route. **Search Console → Pages must be
cross-checked before Sprint 2 closes.** Anything found there and missing here is a permanent loss at
cutover.

Sprint 2 does not close until every URL in the table above resolves through the redirect, verified by
request, not by reading the config.

---

## 3. Metadata rules per template

| Template | Title pattern | Notes |
|---|---|---|
| Home | `Vehicle Tracking & Fleet Telematics in Kenya \| Nebsam` | Primary intent first, brand last |
| Solution | `{Solution} in Kenya \| Nebsam` | 50–60 chars. One page owns one intent |
| Product | `{Product} — Price & Specifications \| Nebsam` | Price in the title only where one is published |
| Category | `{Category} in Kenya \| Nebsam` | |
| Industry | `Telematics for {Industry} in Kenya \| Nebsam` | |
| Article | `{Title} \| Nebsam` | |
| Branch/coverage | `{Town} — Vehicle Tracking \| Nebsam` | No thin town-landing pages (client decision) |

Every indexable page: unique title (50–60), unique meta description (140–155), **exactly one H1**,
self-referencing canonical, breadcrumbs visible **and** as `BreadcrumbList`, OG/Twitter with a real
1200×630 image, alt text on every image, links in and out.

`Offer` is emitted **only** where a real price is published. Seven of eleven radio models and most
non-radio products currently have no confirmed price — those pages carry `Product` without `Offer`
and show "Request price".

## 4. Excluded from the sitemap

`/admin/*` · `/cart` · `/orders/[orderNumber]` · `/support/verify-installation` · any draft or
unpublished content · the two deferred solution slugs.
