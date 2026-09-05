# ADR-0004 — Performance budget: hold ≥ 90, or revise it to what the stack can hold

**Status** Proposed, 5 September 2026 — awaiting the client decision recorded as register V53
**Amends, if accepted** brief PART 14 and `docs/PERFORMANCE_BUDGETS.md` §2
**Depends on** ADR-0003, which is why the earlier numbers were wrong

## Context

The performance budgets were set in brief PART 14 before any code existed, which is the right way
round: they are a design input, not a cleanup task. The audience test behind them is explicit — a
mid-range Android on mobile data the reader pays for by the megabyte.

Sprint 4 measured the homepage at Lighthouse mobile **Performance 95**, **TBT 80 ms**, **LCP
2.878 s**, and reported that the trace showed *observed LCP at 237 ms, identical to FCP* — no real
late paint. The client accepted the 378 ms LCP miss on that basis and directed Sprint 4 to proceed.

Every one of those readings was taken while `app/(site)/loading.tsx` suppressed hydration on every
route in the group. Nothing inside `<main>` ever executed. ADR-0003 removed it in Sprint 7.

Re-measured on 5 September 2026 with hydration working, median of three per route:

| | Homepage | Solution | Product |
|---|---|---|---|
| Performance | 80 | 80 | 82 |
| LCP | 3.088 s | 2.988 s | 2.880 s |
| TBT | 475 ms | 596 ms | 486 ms |

Nine of eleven budgets still hold, including CLS, page weight, per-route JS, accessibility, best
practices, SEO and font count. The two that miss are Performance ≥ 90 and LCP ≤ 2.5 s, and the
control run below shows they are one defect, not two.

## The measured floor

A control run of the solution page with `/_next/static/chunks/*` blocked — the pre-Sprint-7
condition reproduced deliberately — scores **97** with **LCP 2.412 s, inside budget**, and script
evaluation falling from **832 ms to 18 ms**.

That establishes the ceiling and the floor at once, because of how the bundle divides:

| Chunk | Transferred (gz) | What it is |
|---|---|---|
| `4bd1b696….js` | 53 KB | React and react-dom |
| `255….js` | 46 KB | The Next client runtime and router |
| `webpack….js`, `main-app….js` | 2 KB | Module runtime |
| `page….js`, `356….js`, `531….js` | ~10 KB | **This project's own client components** |

Roughly **99 KB of the ~110 KB is framework**, and it hydrates the whole tree whether or not a route
has interactive parts. This project's four client components — mobile navigation, cookie notice,
WhatsApp button, reveal — account for about a tenth of the client JavaScript and cannot simply be
deleted: they are the mobile menu, the consent gate and the cart's sibling machinery.

So 97 is not an available score. It is the score of a site with no client JavaScript at all.

## Options, with the trade-off named

**A. Hold the budget and spend a sprint trying to reach it.** Replace the 191 KB legacy favicon
(certain, minutes, helps LCP only), measure whether instancing the 89 KB Archivo variable font is
actually smaller across the four weight and width combinations in use, and defer the cookie notice's
hydration. *Trade-off:* one sprint of the fifteen, spent on a target the arithmetic above says it
will not hit. The font route also reopens ADR-0002, which is a design decision, not a performance one.

**B. Change the architecture.** Reaching ≥ 90 reliably means not shipping the framework runtime on
content routes. *Trade-off:* a stack change eight sprints into a fifteen-sprint build, against a
budget number rather than a user complaint. Not recommended, and stated only so the option is on the
record rather than discovered later.

**C. Revise the budget to the measured reality and keep everything else.** Set Performance ≥ 80 and
LCP ≤ 3.1 s on mobile; leave CLS, weight, per-route JS, accessibility, best practices, SEO and fonts
exactly as they are. *Trade-off:* the brief's headline number changes, and it changes downward. A
budget that cannot be met is not a standard, it is a line item that gets waived at every gate, and
this project's stated failure mode is reporting budgets green and shipping red.

## Recommendation

**A then C, in that order, and not as a dedicated sprint.** Do the favicon inside whatever sprint
runs next — it costs minutes and it is indefensible to ship 191 KB of Create React App leftovers on
the critical path. Measure the font question rather than assuming it. Then set the budget to what the
measurements actually support, so the Sprint 14 gate means something.

The one number worth protecting on its own terms is not the Lighthouse score. It is page weight,
where the site is at 296–306 KB against a 1.0–1.5 MB budget — and that is the budget the brief's
audience test is really about.

## Decision

Not taken. This ADR stays Proposed until the client answers register V53.
