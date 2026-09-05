# ADR-0004 — Where performance is measured, and what the budget should be

**Status** Proposed, 5 September 2026 — revised the same day after the evidence it was built on was
found to be wrong
**Amends, if accepted** `CLAUDE.md` §11 and `docs/PERFORMANCE_BUDGETS.md` §3
**Related** ADR-0003, which is why the Sprint 4–6 numbers were wrong; register V47 and V53

## What this ADR is now about

The first version of this ADR asked whether to hold the Performance ≥ 90 budget or revise it
downward, on the evidence that the site measured 80–82 and that client JavaScript cost 17 points.

**Both figures were measurement artefacts.** Re-measured under a controlled protocol the same day,
the site medians **89 / 93 / 97** across the three built route types, and a paired control prices all
client JavaScript at **+3 points**. The budget is not obviously unreachable, so the question is no
longer whether to lower it.

The question this ADR now records is the one that actually blocks progress: **the project has no
measurement environment capable of deciding whether a budget is met.**

## Context

`docs/PERFORMANCE_BUDGETS.md` §3 requires every measurement to be taken against a **Vercel preview
deployment**. `CLAUDE.md` §11 requires `npm run build && npm start`. The two have contradicted each
other since Sprint 1, and every measurement to date has followed CLAUDE.md, because it is the file
read at the start of every session.

On 5 September the development machine produced, for one page on one build:

- Performance scores from **72 to 97**
- `environment.benchmarkIndex` from **606 to 3174** — a fivefold swing in reported CPU capability

A budget gate cannot be run on that. Worse, it is actively misleading: two of the three wrong
conclusions this project has drawn about performance came from comparing runs taken minutes apart
under different machine load, and reading the difference as a property of the code.

## Decision

Three things, of which only the first is a real decision.

**1. Budget compliance is judged on a Vercel preview deployment.** Local measurement stays useful for
one thing — **paired comparisons**, where two variants are interleaved against the same server and
the median of the differences is taken. Those are robust to drift and have already produced two
trustworthy results (favicon −226 ms LCP; all client JS −449 ms LCP, +3 points). Absolute scores from
a local run go in a sprint report as an indication, never as a gate result.

*Trade-off:* it costs a deployment per measurement and cannot be done offline. Against that, it is
the only way the Sprint 14 gate means anything, and it is what the budgets document already said.

**2. `CLAUDE.md` §11 is amended to match.** It should say that budget numbers come from a preview
deployment, and that `npm run build && npm start` is for paired local comparison. Leaving the two
documents in contradiction guarantees the next session repeats this.

**3. The budget numbers themselves are not changed yet.** Performance ≥ 90 is met at the median on
two routes of three and missed by one point on the third; LCP ≤ 2.5 s is met on the product page and
missed by 76–83 ms on the other two. Those are marginal, and a marginal miss measured on an
unreliable rig is not grounds for rewriting the brief. Revisit once a preview measurement exists.

## Consequences

- **The client decision raised as V53 is withdrawn from the client for now.** It was going to ask them
  to accept a sixteen-point miss or fund a sprint against it. Neither is the real situation, and
  putting a decision to a client on numbers this unstable would have been the second avoidable error
  in one day.
- **The Sprint 4 acceptance stays withdrawn.** It was given on pre-hydration numbers, and that is
  independent of everything above.
- **The cookie-notice deferral is dropped.** With all client JavaScript priced at three points,
  deferring one ~2 KB component is below the noise floor, and it would have put lazy-loading
  indirection into consent code — the most legally sensitive client component on the site.
- **The favicon fix ships regardless** (`47833df`). 191 KB → 3.4 KB, verified at −226 ms LCP by paired
  measurement, same artwork re-encoded rather than redrawn.

## What would change this decision

A preview-deployment measurement showing the budget missed by a margin that survives repetition. At
that point the options are the 89 KB Archivo variable font — which reopens ADR-0002 and must be
measured rather than assumed — the render-blocking CSS, and only then the budget numbers themselves.
