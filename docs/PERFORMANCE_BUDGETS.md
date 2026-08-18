# PERFORMANCE BUDGETS

The budgets, and how each one is measured.

**A sprint does not close if a budget is breached.** Not "is noted as a risk" — does not close.

---

## 1. Why this is a design input, not a cleanup task

Most visitors arrive on a mid-range Android phone, on mobile data they pay for by the megabyte. A
cinematic, animation-rich site that costs 8 MB is a **failure**, however good it looks on a MacBook
on office fibre.

The starting position makes this concrete: `public/` is **28 MB across 120 files**, and per
`docs/ASSET_MAP.md` not one file is web-ready at its current size. Eight exceed 700 KB.
`about-team.jpg` is 3600×2400. `about-us-image-1.jpg` alone is 1,914 KB — **one image is 128% of the
entire homepage budget.**

Nothing from `public/` is promoted into the rebuild without conversion.

---

## 2. The budgets

| Metric | Budget | Measured by |
|---|---|---|
| LCP (mobile, throttled 4G, mid-tier Android) | **≤ 2.5 s** | Lighthouse mobile + PageSpeed Insights field data |
| INP | **≤ 200 ms** | Lighthouse + real-user data once traffic exists |
| CLS | **≤ 0.05** | Lighthouse mobile |
| Initial JS per route (gzipped) | **≤ 180 KB** | `@next/bundle-analyzer`, per route |
| Total page weight — homepage | **≤ 1.5 MB** | DevTools Network, empty cache, throttled |
| Total page weight — content pages | **≤ 1.0 MB** | as above |
| Largest single delivered image | **≤ 250 KB** | Network panel, delivered bytes not source bytes |
| Lighthouse mobile Performance | **≥ 90** | Lighthouse CI, mobile preset |
| Lighthouse Accessibility | **≥ 95** | Lighthouse CI |
| Lighthouse Best Practices | **≥ 95** | Lighthouse CI |
| Lighthouse SEO | **≥ 95** | Lighthouse CI |
| Web fonts | **≤ 3 files total** | Network panel, site-wide |

**Delivered bytes, not source bytes.** A 2 MB source image served as a 180 KB AVIF passes. The
budget is what crosses the network.

---

## 3. Measurement method

Measuring on a development machine on fibre is how budgets get reported green and shipped red.

**Standard profile — every measurement uses it:**

- Lighthouse **mobile** preset (Moto G Power class, 4× CPU throttle, Slow 4G)
- Empty cache, no extensions, incognito
- Against a **Vercel preview deployment**, never `next dev` — dev builds are not production builds
- Three runs, **median** reported

**Per sprint, recorded in the sprint report as numbers:**

```
PERFORMANCE
Route            LCP     INP     CLS     JS (gz)   Page      Largest image
/                1.9s    120ms   0.01    142 KB    1.1 MB    180 KB
/solutions/…     1.4s     90ms   0.00    118 KB    0.7 MB    140 KB
```

"Budgets met" without numbers is not a report. Brief PART 2.6: verify, don't claim.

---

## 4. How each budget is held

### LCP ≤ 2.5 s
Server Components by default, so HTML arrives complete. The LCP element is a `next/image` with
`priority` — **and it is the only image with `priority`**; marking several defeats it. Fonts are
self-hosted with `font-display: swap`. No animation runs before the LCP element paints. No
render-blocking third-party script; GA4 loads after consent, which is after LCP by construction.

### INP ≤ 200 ms
Few client boundaries — cart, mega menu, verification form, carousels, admin editor, signature
element. Each dynamically imported where below the fold. No layout-thrashing scroll handlers;
scroll work uses `IntersectionObserver`. Heavy client components (maps, editors) are never in the
initial bundle.

### CLS ≤ 0.05
Every image has explicit `width` and `height`. Fonts have size-adjusted fallbacks so the swap does
not reflow. Space is reserved for anything that loads late — including the cookie banner, which is a
classic CLS source because it appears after paint. **Animation never causes layout shift**
(`ANIMATION_SYSTEM.md` §3).

### JS ≤ 180 KB per route
Measured per route, not site-wide. Route-level code splitting is automatic; the discipline is
keeping `"use client"` from spreading. One animation library — Motion, with GSAP only where a
timeline genuinely needs it and never both on a page. Three icon libraries in the current CRA app
collapse to **one**. shadcn primitives are used selectively, not wholesale.

### Page weight ≤ 1.5 MB / 1.0 MB
AVIF with WebP fallback, sized to actual display dimensions and served responsively. Lazy-load
everything below the fold. **No autoplaying background video on mobile** — poster image with
optional tap to play. Managed media moves to Supabase Storage or Cloudinary rather than shipping
from `public/`.

### Largest image ≤ 250 KB
Enforced at conversion, before an asset enters the repo. `ASSET_MAP.md` carries the current sizes;
every file needs a pass. Hero images are the risk — `hero-image.webp` is already 333 KB and needs
re-encoding.

### Fonts ≤ 3 files
Three families (display, body, mono) at three files means one weight each, with variable fonts or
synthesised weights covering the rest. Subset to Latin. Self-hosted via `next/font`, preloaded, no
external font request.

---

## 5. Where the budget is most likely to break

| Risk | Why | Guard |
|---|---|---|
| Homepage hero | 12 sections plus a cinematic hero plus the signature element | Hero is the only `priority` image; everything below the fold lazy-loads |
| The signature element | Level 3 data motion runs continuously by design | Capped at three concurrent pulses; dynamically imported; profiled on mobile |
| Product galleries | Multiple 1600×1600 studio shots per product | Responsive sizes, lazy, AVIF; only the first is eager |
| `/about/coverage` map | An interactive map is a heavy client component | Dynamic import; static stylised map as the default, interactivity as enhancement |
| Admin editor | Rich text plus media library | Entirely inside `(admin)`, never in a public bundle |
| Download centre | Three of four prepared PDFs exceed 1 MB | A download is not a page render — but **file size is shown before the click** so a visitor on mobile data can choose |
| Legacy `public/` assets | 28 MB, none web-ready | No asset promoted without conversion; Sprint 14 gate |

---

## 6. Gates

| Sprint | Gate |
|---|---|
| 1 | Design system and prototype measured on the standard profile — the budget is proven achievable before twelve more sprints are built on it |
| 2 | Lighthouse baseline on the shell; every old URL resolves |
| 4 | Homepage meets **all** budgets on real data |
| 6–8 | Product, solution and industry templates each measured |
| 14 | **All budgets green across every template.** Full bundle analysis, image audit complete |
| 15 | Re-measured on production after cutover |

Between gates, any route that regresses past a budget is fixed in the sprint that caused it, not
deferred to Sprint 14. Sprint 14 verifies; it is not where the work happens.

---

## 7. Regression protection

- `@next/bundle-analyzer` run per sprint; JS deltas per route reported.
- Lighthouse CI on preview deployments, failing the run below threshold.
- A dependency is added only with a one-line justification **and** its gzipped cost in the sprint
  report.
- Any new image is checked against the 250 KB delivered ceiling before commit.
- Raw media over ~2 MB never enters git — Storage or Cloudinary instead.
