# PERFORMANCE BASELINE — measured 5 September 2026

Budgets and method are defined in `docs/PERFORMANCE_BUDGETS.md`; this file records what was measured
against them, and is appended to rather than overwritten.

> ## Correction, same day
>
> **The first version of this document reported Performance 80–82 and a 17-point cost for client
> JavaScript. Both figures were wrong, and the documents built on them — V47, V53 and ADR-0004 — were
> corrected with it.**
>
> The error was not in the tooling. It was in comparing runs taken minutes apart on a machine whose
> load was swinging by a factor of four, and in measuring a server that had just started and had not
> served a single request. Re-measured under a controlled protocol, the same build medians **89–97**.
>
> The lesson is recorded in §3 because it will otherwise be repeated: **on this development machine,
> a single Lighthouse run means nothing, and an unpaired comparison between two runs means less.**

---

## 1. What prompted the measurement

Sprint 7 removed a `loading.tsx` that had been suppressing hydration on every route
(commit `3d58ddf`, ADR-0003). Until that commit every page shipped a client bundle and never executed
it, so every Lighthouse figure recorded in Sprints 4, 5 and 6 measured a site doing less work than
the real one. Those numbers cannot be compared with anything measured from now on. That much was
true, and remains true.

What changed is the size of the gap. It is not sixteen points. On the evidence below it is small
enough that the budget question is open rather than lost.

---

## 2. Results

Production build, warmed server, Lighthouse 12.8.2 mobile preset, median of n runs.

| Route | n | Performance | Range | LCP | Range | TBT | Transfer |
|---|---|---|---|---|---|---|---|
| `/` | 9 | **93** | 82–97 | **2.583 s** | 2.492–2.837 | 232 ms | 255 KB |
| `/solutions/container-e-seal` | 9 | **89** | 72–97 | **2.576 s** | 2.490–2.858 | 363 ms | 256 KB |
| `/products/hybrid-car-alarm` | 7 | **97** | 79–98 | **2.420 s** | 2.343–2.739 | 95 ms | 246 KB |

Accessibility 100, Best Practices 96, SEO 100 on every run of every route. CLS 0.000–0.012.

**Against budget:** Performance ≥ 90 is met at the median on two routes of three and missed by one
point on the third. LCP ≤ 2.5 s is met on the product page and missed by **76–83 ms** on the other
two — not by the 588 ms first reported.

The ranges are the finding as much as the medians. A spread of 72–97 on one page, one build and one
machine is not a property of the site.

---

## 3. Method, and why the first attempt was wrong

```bash
npm run build && npm start
# warm every route under test with a few requests first
npx lighthouse@12 <url> --output=json \
  --chrome-flags="--headless=new --no-sandbox --disable-gpu"
```

Lighthouse **12.8.2**, mobile preset, default **simulated** throttling (Slow 4G, 4× CPU), against
`localhost:3000` serving the production build.

**Three protocol rules, each learned by getting it wrong this morning:**

1. **Warm the server first.** The first attempt measured a server that had just started. Routes carry
   `revalidate: 3600`, so the first request to each renders rather than serving from cache, and that
   render time lands in observed TTFB, which Lantern then charges for. Production behind a CDN is
   warm; a cold local server is not representative of anything.

2. **Never compare two unpaired runs.** `environment.benchmarkIndex` ranged **606–3174** across this
   session — a fivefold swing on one machine, driven by whatever else Windows was doing. The first
   attempt's "80 vs 97" compared a loaded-machine run against a quiet-machine run and read the
   difference as a property of the code. **A/B questions are answered by interleaving the two arms —
   old, new, old, new — against the same server, and taking the median of the paired differences.**

3. **Nine runs, not three.** Three runs happened to cluster tightly in the first attempt, which read
   as precision and was luck.

**The standing conflict, now resolved by evidence.** `PERFORMANCE_BUDGETS.md` §3 requires measurement
against a **Vercel preview deployment**; `CLAUDE.md` §11 requires `npm run build && npm start`. §3 is
right, and this session is the argument for it: a shared development machine cannot hold a Lighthouse
score still to within twenty points. **CLAUDE.md §11 should be amended to say that local measurement
is for paired comparisons only, and that budget compliance is judged on a preview deployment.** Until
that happens, no absolute score in this document should be treated as the site's score.

---

## 4. Paired comparisons

These are the trustworthy numbers, because each is a median of differences measured back to back
under the same conditions.

### 4.1 The favicon — shipped

`public/favicon.ico` was a CRA leftover: nine sizes to 256×256 as uncompressed 32-bit bitmaps,
191 KB, fetched at High priority ahead of the render. Re-encoded to 16/32/48 as PNG-in-ICO, same
artwork, **3.4 KB**. Five interleaved pairs on the homepage:

| | Median paired delta |
|---|---|
| **LCP** | **−226 ms** (range −381 to +1) |
| Transfer | 305 KB → 255 KB |
| Performance | no resolvable change |

The score is TBT-dominated, so 50 KB off the critical path shows up in LCP and not in the headline
number. LCP is the budget that was missed, which is why it was worth doing.

### 4.2 All client JavaScript — the framework's real cost

Five interleaved pairs on the solution page, normal against
`--blocked-url-patterns="*/_next/static/chunks/*"`:

| | Median paired delta from blocking **all** client JS |
|---|---|
| Performance | **+3 points** |
| LCP | **−449 ms** |
| TBT | −155 ms |

**This supersedes the +17 first reported.** Removing every interactive part of the site — cart,
mobile menu, consent bar, the lot — buys three points. The framework is not the reason the budget is
close; it costs about 450 ms of LCP and three points of score.

That cuts both ways. It kills the argument that a sprint of optimisation could recover a large
score. It also means the remaining LCP gap of ~80 ms is small against a JS cost of 450 ms, so it is
plausibly reachable — unlike the 588 ms gap first reported.

---

## 5. Bundle composition

Of roughly 110 KB of client JavaScript on the homepage:

| Chunk | Transferred (gz) | What it is |
|---|---|---|
| `4bd1b696….js` | 53 KB | React and react-dom |
| `255….js` | 46 KB | Next client runtime and router |
| `webpack….js`, `main-app….js` | 2 KB | Module runtime |
| `page….js`, `356….js`, `531….js` | ~10 KB | This project's own client components |

About **99 KB is framework**. This project's four client components — mobile navigation, cookie
notice, WhatsApp button, reveal — are roughly a tenth of the client JavaScript. Verified by locating
the `Reveal` component's `revealDecided` marker in the 8 KB raw homepage chunk rather than in either
large one.

**Consequence for the cookie-notice deferral, which was proposed and is now dropped.** Deferring one
~2 KB component cannot matter when removing all 110 KB is worth three points. It would have added
lazy-loading indirection to consent code, which is the most legally sensitive client component on the
site, for an effect below the noise floor. Not done, deliberately.

---

## 6. Budget compliance

| Budget | Status |
|---|---|
| LCP ≤ 2.5 s | **Marginal** — 2.420 s product, 2.576–2.583 s home and solution |
| Lighthouse Performance ≥ 90 | **Marginal** — medians 89, 93, 97; unresolvable on this rig |
| CLS ≤ 0.05 | ✅ 0.000–0.012 |
| Initial JS per route ≤ 180 KB | ✅ 103–106 KB |
| Homepage weight ≤ 1.5 MB | ✅ 255 KB |
| Content page weight ≤ 1.0 MB | ✅ 246–256 KB |
| Accessibility ≥ 95 | ✅ 100 |
| Best Practices ≥ 95 | ✅ 96 |
| SEO ≥ 95 | ✅ 100 |
| Web fonts ≤ 3 files | ✅ 2 delivered |
| Largest delivered image ≤ 250 KB | ✅ on these routes — see §8 |
| INP ≤ 200 ms | Not obtainable in a lab run |

---

## 7. What to do next, in order

1. **Measure on a Vercel preview deployment** before any further conclusion. Nothing else in this
   document is worth acting on until an absolute score exists that does not move by twenty points
   between runs. This is what `PERFORMANCE_BUDGETS.md` §3 has always required.
2. **Then, if LCP still misses by ~80 ms**, the candidates are the 89 KB Archivo variable font — the
   largest single asset and High priority on the critical path — and the render-blocking 7 KB CSS.
   The font question reopens ADR-0002 and must be measured, not assumed.
3. **Do not spend a sprint on client-JS reduction.** §4.2 prices the entire client bundle at three
   points.

---

## 8. What was not measured

- **INP.** Needs field data, which needs traffic and V10 (GA4).
- **A Vercel preview deployment.** The measurement that actually decides budget compliance.
- **`/cart`, `/admin`, blog and industry routes.**
- **A real device on real Kenyan mobile data.** Everything here is simulation.
- **Unused legacy media.** `public/` still holds CRA-era images up to 1.9 MB
  (`about-us-image-1.jpg`). None is referenced by a built route today, but the about pages are
  unbuilt and must not pick them up unprocessed.

Raw JSON for every run in this document is archived outside the repo at
`~/.claude/projects/C--Projects-nebsam-website/perf-2026-09-05/`.
