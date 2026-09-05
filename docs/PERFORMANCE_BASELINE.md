# PERFORMANCE BASELINE — measured 5 Sep 2026

The first performance measurement taken on this project with page-level client JavaScript actually
executing. It supersedes every Lighthouse figure recorded in Sprints 4, 5 and 6.

Budgets and method are defined in `docs/PERFORMANCE_BUDGETS.md`; this file records what was measured
against them, and is appended to rather than overwritten.

---

## 1. Why this measurement exists

Sprint 7 removed a `loading.tsx` that had been suppressing hydration on every route
(commit `3d58ddf`). Until that commit, every page rendered its server HTML and then stopped — the
client bundle downloaded but never booted. Every Lighthouse run before 4 Sep 2026 therefore measured
a site that shipped JavaScript and never paid for it.

Those numbers were not wrong. They measured a real build. They are simply not comparable to anything
measured from now on, and they flattered the site by roughly **sixteen Performance points**.

---

## 2. The headline

**Performance is 80–82 on the mobile preset, against a budget of ≥ 90. It was previously recorded as
94–95.** The regression is entirely main-thread: TBT rose from 80–120 ms to 475–596 ms.

Accessibility, Best Practices, SEO, CLS, page weight and per-route JS all still pass.

---

## 3. Method

```bash
npm run build && npm start          # production build, port 3000
npx lighthouse@12 <url> --output=json \
  --chrome-flags="--headless=new --no-sandbox --disable-gpu"
```

- Lighthouse **12.8.2**, mobile preset, default **simulated** throttling (Slow 4G, 4× CPU).
- **Median of three runs** per route, as in Sprint 5. Ranges are given because single runs vary by
  up to 3 points.
- Measured against `localhost:3000` serving the production build, on the development machine, with
  the Next server competing for the same CPU.
- `environment.benchmarkIndex` ranged **728–1173** across runs. Below ~1000 Lighthouse considers the
  host underpowered, so these scores are likely a point or two pessimistic — **not sixteen**.
- Raw JSON reports archived outside the repo at
  `~/.claude/projects/C--Projects-nebsam-website/perf-2026-09-05/`.

**One deviation from the standard profile, stated plainly.** `PERFORMANCE_BUDGETS.md` §3 requires
measurement against a **Vercel preview deployment**; `CLAUDE.md` §11 requires `npm run build &&
npm start`. These two instructions disagree. This run followed CLAUDE.md, because a local production
build is what Sprints 4–6 measured and the whole point of this exercise is a like-for-like comparison
with them. A preview-deployment run will read differently — real network, real TTFB, Vercel's CDN and
compression — and should be taken before Sprint 15. The two documents should be reconciled either
way.

Build output for the same commit: 49 static pages, First Load JS **103–106 KB** shared, retired-string
check clean across 233 artefacts.

---

## 4. Results

### 4.1 Homepage `/` (n=3)

| Metric | Median | Range | Budget | |
|---|---|---|---|---|
| Performance | **80** | 80–81 | ≥ 90 | ❌ |
| Accessibility | **100** | 100 | ≥ 95 | ✅ |
| Best Practices | **96** | 96 | ≥ 95 | ✅ |
| SEO | **100** | 100 | ≥ 95 | ✅ |
| LCP | **3.088 s** | 3.034–3.101 | ≤ 2.5 s | ❌ |
| FCP | 1.008 s | 0.976–1.622 | — | |
| Speed Index | 3.845 s | 2.561–4.109 | — | |
| TBT | **475 ms** | 470–515 | — | |
| CLS | **0.000** | 0.000–0.012 | ≤ 0.05 | ✅ |
| Total transfer | **305 KB** | — | ≤ 1.5 MB | ✅ |

### 4.2 Solution `/solutions/container-e-seal` (n=3)

| Metric | Median | Range | Budget | |
|---|---|---|---|---|
| Performance | **80** | 79–80 | ≥ 90 | ❌ |
| Accessibility | **100** | 100 | ≥ 95 | ✅ |
| Best Practices | **96** | 96 | ≥ 95 | ✅ |
| SEO | **100** | 100 | ≥ 95 | ✅ |
| LCP | **2.988 s** | 2.854–3.019 | ≤ 2.5 s | ❌ |
| FCP | 0.977 s | 0.941–0.989 | — | |
| Speed Index | 2.162 s | 2.160–2.715 | — | |
| TBT | **596 ms** | 558–614 | — | |
| CLS | **0.012** | 0.012 | ≤ 0.05 | ✅ |
| Total transfer | **306 KB** | — | ≤ 1.0 MB | ✅ |

The same URL Sprint 5 measured, so the comparison is like for like: **94–95 → 80**.

### 4.3 Product `/products/hybrid-car-alarm` (n=3)

| Metric | Median | Range | Budget | |
|---|---|---|---|---|
| Performance | **82** | 81–83 | ≥ 90 | ❌ |
| Accessibility | **100** | 100 | ≥ 95 | ✅ |
| Best Practices | **96** | 96 | ≥ 95 | ✅ |
| SEO | **100** | 100 | ≥ 95 | ✅ |
| LCP | **2.880 s** | 2.458–2.910 | ≤ 2.5 s | ❌ |
| FCP | 1.348 s | 0.773–1.434 | — | |
| Speed Index | 3.832 s | 1.562–3.903 | — | |
| TBT | **486 ms** | 451–582 | — | |
| CLS | **0.000** | 0.000–0.012 | ≤ 0.05 | ✅ |
| Total transfer | **296 KB** | — | ≤ 1.0 MB | ✅ |

The lightest of the three, and it scores best — the product page carries a smaller DOM (228 elements
against 447 on the solution page).

---

## 5. The control — what the JavaScript actually costs

The same solution page, measured twice with `--blocked-url-patterns="*/_next/static/chunks/*"`. That
reproduces the pre-Sprint-7 condition exactly: server HTML renders, no client JS executes.

| Metric | With hydration | Chunks blocked | Delta |
|---|---|---|---|
| **Performance** | **80** | **97** | **+17** |
| LCP | 2.988 s | 2.412 s | −576 ms |
| TBT | 596 ms | 134 ms | −462 ms |
| Speed Index | 2.162 s | 1.758 s | −404 ms |
| Total transfer | 306 KB | 184 KB | −122 KB |
| Script evaluation | 832 ms | 18 ms | −814 ms |
| Accessibility / SEO | 100 / 100 | 100 / 100 | — |

**Read the last two rows together.** 122 KB of client JavaScript costs 814 ms of script evaluation on
a 4×-throttled CPU, and that single number accounts for the whole regression. Nothing about the
content, the images, the CSS or the fonts changed between these two columns.

It also shows the site passes its LCP budget with room to spare when nothing hydrates — **2.412 s
against ≤ 2.5 s**. The LCP miss and the Performance miss are the same problem, not two.

---

## 6. Where the time goes

Main-thread breakdown, solution page (Lighthouse `mainthread-work-breakdown`):

| Category | With hydration | Chunks blocked |
|---|---|---|
| Script Evaluation | 832 ms | 18 ms |
| Style & Layout | 641 ms | 484 ms |
| Other | 231 ms | 165 ms |
| Script Parsing & Compilation | 122 ms | 18 ms |
| Rendering | 57 ms | 38 ms |
| Parse HTML & CSS | 17 ms | 19 ms |

LCP phase breakdown, homepage — the LCP element is the hero paragraph, a text node in the server HTML:

| Phase | Time |
|---|---|
| TTFB | 458 ms |
| Load delay | 0 ms |
| Load time | 0 ms |
| **Render delay** | **2 630 ms** |

Load delay and load time are zero because there is no image to fetch. The entire LCP is TTFB plus
render delay, and the render delay is main-thread contention. This corrects the Sprint 4 reading of
V47, which recorded observed LCP as identical to FCP — that was true only while nothing hydrated.

Critical-path assets, homepage:

| Asset | Transfer | Priority | Note |
|---|---|---|---|
| `/fonts/archivo-latin.woff2` | 89 KB | High | preloaded; largest single asset |
| **`/favicon.ico`** | **54 KB** | **High** | **191 KB on disk — legacy CRA artefact** |
| `chunks/4bd1b696….js` | 54 KB | Low | react-dom |
| `chunks/255….js` | 47 KB | Low | 21 KB unused |
| document | 17 KB | VeryHigh | |
| `/fonts/plex-mono-latin.woff2` | 11 KB | High | |
| `static/css/….css` | 7 KB | VeryHigh | 158 ms render-blocking |

---

## 7. Budget compliance, all three routes

| Budget | Status |
|---|---|
| LCP ≤ 2.5 s | ❌ 2.88–3.09 s |
| CLS ≤ 0.05 | ✅ 0.000–0.012 |
| Initial JS per route ≤ 180 KB | ✅ 103–106 KB |
| Homepage weight ≤ 1.5 MB | ✅ 305 KB |
| Content page weight ≤ 1.0 MB | ✅ 296–306 KB |
| Lighthouse Performance ≥ 90 | ❌ 80–82 |
| Lighthouse A11y ≥ 95 | ✅ 100 |
| Lighthouse Best Practices ≥ 95 | ✅ 96 |
| Lighthouse SEO ≥ 95 | ✅ 100 |
| Web fonts ≤ 3 files | ✅ 2 delivered |
| Largest delivered image ≤ 250 KB | ✅ on these routes — but see §9 |
| INP ≤ 200 ms | Not measurable in a lab run |

---

## 8. Candidate fixes, ranked

**None of these are decisions.** They are what the trace supports, with the cost of each named.

1. **Replace `public/favicon.ico` (191 KB on disk, 54 KB transferred, High priority).** A legacy CRA
   artefact sitting on the critical path ahead of the render. A correctly sized `.ico` or an SVG icon
   is 1–5 KB. Cost: minutes. Effect: −50 KB of High-priority transfer; helps LCP, not TBT.

2. **Instance or subset `archivo-latin.woff2` (89 KB).** The largest asset on every page. It carries
   weight 100–900 and width 62–125%; the design system uses two widths (100 and 118) and a handful of
   weights. Narrowing the axis ranges, or shipping static instances, could cut it materially. Cost:
   reopens the ADR-0002 "one superfamily separated by optical width" decision, and V47 already
   records that static instances may not in fact be smaller across four weight/width combinations —
   so this needs measuring before it is chosen, not assuming.

3. **Reduce the hydration surface.** Four client components sit in or near the shared layout —
   `mobile-nav` (212 lines), `cookie-notice`, `whatsapp-button`, `reveal`. All are genuinely
   interactive, so none can simply be deleted; but `cookie-notice` need not hydrate before first
   paint, and `mobile-nav` may be reducible to a CSS-only disclosure. Cost: a focused sprint task.
   Effect: uncertain — see the caveat below.

4. **Accept that ~80 is the App Router floor on this measurement rig and revise the budget.** The
   React and Next client runtime is 103 KB before this project's own code, and it hydrates the whole
   tree whether or not a given page has interactive parts. If items 1–3 do not close a 10-point gap,
   the choice is between a stack change and a budget change, and both are §3.5 architecture decisions
   for the human, not engineering judgement calls.

**The caveat on item 3:** the 814 ms of script evaluation is dominated by the framework runtime, not
by these four components. Removing one of them will not return 17 points. The honest expectation is
that items 1–3 together recover part of the LCP miss and only a few Performance points, and that
item 4 is the conversation this measurement is really asking for.

**Quantified, so item 4 is not an opinion.** Of the ~110 KB of client JavaScript on the homepage,
**99 KB is framework** — `4bd1b696….js` at 53 KB gzipped is React and react-dom, `255….js` at 46 KB
is the Next client runtime and router. This project's own client components compile to about **10 KB**
across three route chunks (`page….js`, `356….js`, `531….js`; the `Reveal` component's
`revealDecided` marker is in the 8 KB raw homepage chunk, not in either large one). The framework
hydrates the whole tree whether or not a route has interactive parts.

**Where this decision now lives.** The options are written up with their trade-offs in
`docs/decisions/ADR-0004-performance-budget.md`, which stays **Proposed** until the client answers
**V53**. V53 also withdraws the Sprint 4 acceptance, which was given on the pre-hydration numbers.

---

## 9. What was not measured

- **INP.** Not obtainable from a lab run; it needs field data, which needs traffic, which needs V10
  (GA4) and a live site.
- **`/cart`, `/admin`, blog and industry routes.** The cart is the other substantial client component
  on a public route and should be measured in the sprint that next touches it.
- **A real device on real Kenyan mobile data.** Everything here is simulation. The brief's audience
  test — a mid-range Android on metered data — is still unverified on hardware.
- **Unused legacy media.** `public/` still holds CRA-era images up to 1.9 MB
  (`about-us-image-1.jpg`). None is referenced by a built route today, so none appears in these
  numbers, but the about pages are unbuilt and must not pick them up unprocessed.
