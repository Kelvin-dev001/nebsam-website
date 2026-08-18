# PROJECT ARCHITECTURE

App structure, rendering strategy and folder conventions for the Next.js rebuild.
Decision record: `docs/decisions/ADR-0001-cra-to-nextjs.md`. Route inventory: `docs/ROUTE_MAP.md`.

---

## 1. Shape of the application

Next.js App Router, TypeScript, Tailwind, Supabase, deployed on Vercel. **Server Components by
default.** `"use client"` is an exception that must be justified, not a default.

The site has three audiences with three different needs, and the route groups follow them:

| Group | Serves | Rendering |
|---|---|---|
| `app/(site)` | the public — solutions, industries, resources, trust, support | Static / ISR |
| `app/(shop)` | buyers — products, cart, orders | Static product pages, dynamic cart and orders |
| `app/(admin)` | staff — CMS, orders, inbox | Dynamic, auth-gated, `noindex` |
| `app/api` | machine — webhooks, verification, health | Dynamic, rate-limited |

## 2. Folder layout

```
app/
  (site)/
    layout.tsx                      site chrome — header, footer, WhatsApp button, consent
    page.tsx                        home
    solutions/[slug]/page.tsx
    industries/[slug]/page.tsx
    platform/page.tsx
    resources/blog/[slug]/page.tsx
    about/…  support/…  legal/…
  (shop)/
    products/[slug]/page.tsx        MERGED spec + commerce page
    products/category/[slug]/page.tsx
    cart/page.tsx                   client island
    orders/[orderNumber]/page.tsx
  (admin)/
    layout.tsx                      auth gate + admin chrome
    …
  api/
    verify-installation/route.ts    rate-limited, server-only
    revalidate/route.ts
  llms.txt/route.ts                 generated, never hand-maintained
  sitemap.ts  robots.ts             generated
components/
  ui/            primitives — button, field, dialog, disclosure
  layout/        header, footer, nav, breadcrumbs
  content/       prose, spec table, FAQ, answer block
  commerce/      price, add-to-cart, cart line, WhatsApp CTA
  telemetry/     the signature element and its motion primitives
  media/         image, ImagePlaceholder, gallery, device frame
lib/
  company.ts     ← THE single source of NAP + canonical description
  constants.ts   routes, event names, statuses, VAT_RATE
  supabase/      server client, browser client, generated types
  content/       data access layer — every query lives here
  seo/           metadata builders, schema builders
  analytics.ts   one wrapper, consent-gated
  email.ts       one interface, provider behind it
  rate-limit.ts  verification.ts  hash.ts
types/           shared types; database types GENERATED, never hand-written
content/         MDX or JSON for anything not in the CMS
supabase/migrations/
docs/            this folder
content-source/  READ-ONLY source of truth
```

## 3. Rendering strategy per template

The rule the whole rebuild exists to enforce: **content that matters is server-rendered.** Nothing
important behind client-only rendering or interaction. Specifications never sit in a client-only tab.

| Template | Strategy | Why |
|---|---|---|
| Home | Static, ISR 1 h | Content changes rarely; must be instant on mobile data |
| `/solutions/[slug]` | `generateStaticParams` + ISR 1 h | Primary SEO surface — fully rendered HTML, always |
| `/products/[slug]` | `generateStaticParams` + ISR 15 min | Specs and price must be in the HTML. Shorter window because price changes |
| `/products/category/[slug]` | Static + ISR 15 min | Filters are URL-driven, not client-only state |
| `/industries/[slug]` | Static + ISR 1 h | |
| `/resources/blog/[slug]` | Static + on-demand revalidate on publish | Staff publish and see it live without a deploy |
| `/platform`, `/about/*`, `/legal/*` | Static | |
| `/cart` | Client island inside a server shell | Cart is client state by nature; the shell is not |
| `/orders/[orderNumber]` | Dynamic, `noindex` | Per-request lookup; order number is a bearer token |
| `/support/verify-installation` | Dynamic, server action only | Security-critical; never ships data to the client |
| `/admin/*` | Dynamic, auth-gated, `noindex, nofollow` | Excluded from the sitemap |

**Client boundaries are deliberately few:** cart, the mega menu, the verification form, carousels,
the admin editor, and the signature telemetry element. Each is dynamically imported where it is
below the fold. Everything else is a Server Component.

### 3.1 Revalidation

Content edits in the CMS call an on-demand revalidate route with a tagged cache key rather than
waiting out an ISR window. That is what makes the admin feel real to a non-technical editor — they
publish, they refresh, it is there. Time-based ISR is the fallback, not the mechanism.

## 4. Data access

**Every query lives in `lib/content/`.** Components never call Supabase directly. This keeps RLS
assumptions in one reviewable place, makes the eventual caching layer a single change, and stops
service-role usage leaking into a component by accident.

- Public reads go through the anon key against **read-only public views**, governed by RLS.
- Writes and anything privileged run server-side with the service-role key, never exposed.
- Database types are **generated** from Supabase into `types/database.ts`. Never hand-written.

## 5. Content layer

Three tiers, deliberately:

1. **`lib/company.ts`** — compiled-in constants. Name, branches, phones, emails, hours, the canonical
   description. Never in the database, because it must never be editable by accident and it is
   needed at build time for schema and `llms.txt`.
2. **Supabase** — everything staff edit: solutions, products, industries, FAQs, posts, downloads,
   testimonials, certifications, branches, coverage.
3. **`content/`** — MDX or JSON for structural copy that is neither company constant nor CMS content
   (legal pages, definitional glossary entries).

`content-source/` feeds tier 2 and 3 through a one-way migration. It is never read at runtime.

## 6. Internationalisation

English only is active. Architecture must accommodate Swahili later **without refactoring**:

- Copy lives in the content layer or a message catalogue, **never inline in JSX**.
- Routing is i18n-ready (`next-intl` or the App Router `[locale]` pattern) with **one locale active**.
- No component hard-codes a user-facing string.

This costs almost nothing now and saves a rewrite later. It is the reason no copy is inlined even
where inlining would be shorter.

## 7. Migration and cutover

`main` continues to serve the live CRA site. The rebuild happens on `develop`.

| Sprint | State of `main` | State of `develop` |
|---|---|---|
| 0 | live CRA | docs only |
| 1 | live CRA | CRA deleted, Next.js scaffold + design system |
| 2–14 | live CRA | rebuild proceeds, reviewed on preview URLs |
| 15 | **`develop` merged in, Next.js goes live** | — |

**Vercel production is pinned to `main`.** Every sprint is reviewed on the `develop` preview URL.
There is no period where a half-finished rebuild is the public site, and no attempt to run CRA and
Next.js side by side — brief PART 7.0 forbids it and it would double the routing surface for no gain.

The 301 map (`docs/ROUTE_MAP.md`) ships in `next.config.js` in **Sprint 2**, not at launch, so it is
exercised on every preview deployment for thirteen sprints before it matters.

## 8. Conventions

`kebab-case` files and folders · `PascalCase` components · `camelCase` functions · one component per
file · colocate component-only helpers · **no component over ~200 lines** · no magic strings —
routes, event names, statuses and `VAT_RATE` live in `lib/constants.ts` · shared types in `types/`.

ESLint + Prettier + `tsc --noEmit` pass before any commit. A dependency is added only with a
one-line justification in the sprint report.

## 9. Environment

`.env.example` documents every variable, commented and grouped by service. Any new variable is added
there **in the same commit** that introduces its use. Server-only keys are marked as such:
`SUPABASE_SERVICE_ROLE_KEY`, `CERT_PLATE_HMAC_SECRET`, `CERT_QR_TOKEN_SECRET`,
`TURNSTILE_SECRET_KEY`, `EMAIL_PROVIDER_API_KEY`.

`CERT_PLATE_HMAC_SECRET` deserves a note: rotating it invalidates the entire plate lookup index, so
rotation requires a planned re-hash migration. That is recorded in `docs/SECURITY_REQUIREMENTS.md`.

## 10. What this architecture is protecting against

Each choice above answers a specific failure named in brief PART 25:

| Choice | Failure it prevents |
|---|---|
| Server Components by default; no client-only specs | Repeating the current site's invisibility to crawlers |
| Data access confined to `lib/content/` | RLS assumptions scattered where nobody reviews them |
| `lib/company.ts` as the only NAP source | Contradictory phone numbers and addresses that make an LLM distrust the source |
| Route groups + generated sitemap | Admin routes leaking into the index |
| Copy never inline in JSX | A Swahili rewrite becoming a refactor |
| Production pinned to `main` until Sprint 15 | Fifteen sprints of a half-built site in public |
| 301 map in Sprint 2 | Losing `/services/*` equity, which cannot be undone |
