# ADR-0001 — Migrate from Create React App to Next.js App Router

**Status:** Accepted
**Date:** 18 August 2026
**Sprint:** 0
**Deciders:** Client (Kelvin), Claude Code
**Supersedes:** —

---

## Context

`nebsamdigital.com` runs on Create React App (`react-scripts` 5.0.1), React 19, `react-router-dom` 7,
with `react-helmet` for metadata and no backend of any kind. This was verified directly in Sprint 0
and matches brief PART 7.0.

The commercial brief asks for three things: qualified enquiries, discoverability by both Google and
LLM assistants, and a working shop managed by non-technical staff. The current architecture actively
prevents the second and cannot support the third.

**The evidence, measured rather than assumed:**

- `public/index.html` ships an empty shell — `<div id="root"></div>`, `<title>Nebsam</title>`, no
  meta description. Every real title, description and JSON-LD block is injected by `react-helmet`
  **after hydration**.
- There is no server render and no static prerender. A crawler that does not execute JavaScript
  sees a title of "Nebsam" and nothing else, on every page.
- `Organization.logo` on every service page points at `/images/logo.png`, which does not exist.
- `public/sitemap.xml` is hand-maintained and already inaccurate — it omits
  `/services/electronic-cargo-tracking-system`, a fully built live route.
- There is no API, no database, no auth and no environment configuration, so there is nothing to
  build a shop, a CMS or certificate verification on.

The diagnosis in the brief was right and it is architectural. Adding meta tags does not fix a page
whose content is assembled in the browser.

## Decision

**Migrate to Next.js App Router.** This is a rebuild, not a refactor. Almost nothing in `src/`
transfers.

We will not attempt to preserve the SPA and bolt server rendering onto it, and we will not run CRA
and Next.js side by side. Brief PART 7.0 forbids both, and both would double the routing surface
while leaving the original defect in place.

**Stack:** Next.js (App Router) + React + TypeScript + Tailwind + Supabase (Postgres, Auth, Storage,
RLS) on Vercel. Server Components by default; `"use client"` only where interaction requires it.

**Cutover:** `main` keeps serving the live CRA site. The rebuild proceeds on `develop`, with Vercel
production pinned to `main`. Each sprint is reviewed on a `develop` preview URL. A single merge at
Sprint 15 makes the new site live.

**The 301 map ships in Sprint 2**, not at launch.

## Alternatives considered

**Incrementally add SSR to CRA.** Rejected. CRA has no server-rendering path without ejecting or
replacing the toolchain, at which point it is not CRA. It would also leave `react-helmet`'s
after-hydration metadata in place, which is the specific defect being fixed.

**Vite + React Router 7 in framework mode.** A genuine option — React Router 7 does server render,
and it is closer to the existing code so more of `src/` might have survived. Rejected because the
brief already specifies Next.js, because the ecosystem for the pieces this project needs (`next/image`
with AVIF, ISR with on-demand revalidation for the CMS, route-level metadata and schema, Vercel
integration) is materially better trodden on Next.js, and because "more of `src/` survives" is worth
little when the components are being redesigned anyway.

**Astro.** Excellent for the content and SEO half — arguably better. Rejected because roughly half
this project is an authenticated admin CMS and a stateful cart, which is not what Astro is for, and
splitting the site across two frameworks to get the best of each would cost more than it returns.

**A headless CMS (Sanity, Payload) instead of Supabase-as-CMS.** Deferred, not rejected outright. It
would give a better editor experience out of the box. Rejected for this build because the project
also needs Postgres, auth and RLS for orders, certificate verification and the audit log — adding a
second content system alongside Supabase means two data stores, two auth models and two places a
staff member has to learn. Brief PART 11's requirements are met by a well-built admin on Supabase.

**Keep the CRA site live and build the new one in a separate repository.** Rejected. `content-source/`,
the brief and the docs are the substrate the code is written from; separating them from the code
means the contract and the implementation drift. Branch isolation achieves the same protection.

## Consequences

**Good.**
- Content, titles, descriptions and schema are in the served HTML — the central defect is fixed by
  construction rather than by discipline.
- ISR plus on-demand revalidation lets non-technical staff publish and see the result immediately,
  which is what determines whether the blog survives contact with reality (brief PART 25 #6).
- `next/image` with AVIF/WebP is the mechanism for getting 28 MB of `public/` inside a 1.5 MB
  homepage budget.
- Server actions with Zod give one validation boundary rather than client checks plus an API.
- One deployment target, previews per branch, and the existing Vercel project retained.

**Costs and risks.**
- Almost nothing in `src/` transfers. Nine components are rewritten, not ported. This is a real cost
  and it is accepted because they are being redesigned regardless.
- Server Components are a genuine shift in how state and data flow are reasoned about; the
  `"use client"` boundary has to be defended in review or it spreads.
- `main` and `develop` diverge for fifteen sprints. Acceptable here only because `main` is frozen —
  no feature work happens on it — and it must stay frozen for the merge at Sprint 15 to be safe.
- Vendor gravity toward Vercel increases. Accepted; the site is already deployed there and the brief
  retains it.

**Irreversible if done wrong.** The `/services/*` URLs hold whatever ranking equity the site has.
The 301 map in `docs/ROUTE_MAP.md` — including the ECTS route that every existing inventory omits —
must ship in Sprint 2 and be exercised on every preview build thereafter.

## Compliance and verification

- No code in Sprint 0. The migration begins in Sprint 1.
- Sprint 2 does not close until every old URL resolves through the 301 map, verified by request, not
  by reading the config.
- Brief PART 13's server-rendering requirement is verified per route by viewing source with
  JavaScript disabled, as the `nebsam-seo` skill requires — never assumed from the code.

## Related

- `docs/PROJECT_ARCHITECTURE.md` — folder layout, rendering strategy per template
- `docs/ROUTE_MAP.md` — the full 301 map
- `docs/DATABASE_ARCHITECTURE.md` — the Supabase schema this decision commits to
- ADR-0002 (pending) — certificate verification second factor, to be written when register item
  **V03** is answered
