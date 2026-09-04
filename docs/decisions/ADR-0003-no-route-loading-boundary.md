# ADR-0003 — No `loading.tsx` route boundary

**Status** Accepted, 4 September 2026
**Supersedes** the `app/(site)/loading.tsx` added in Sprint 2

## Decision

The public site has no `loading.tsx`. A route-group loading boundary is not
used, and one must not be reintroduced without re-testing hydration.

## Why

`app/(site)/loading.tsx` **broke client hydration of every page in the group**.
Header, footer, mobile navigation and the cookie bar hydrated normally, because
they live in the layout. Nothing inside `<main>` hydrated at all.

The consequences were not subtle:

- **Add to cart did nothing.** It rendered and was inert, which made the whole
  of Sprint 7 unshippable.
- **The signature telematics element was frozen.** It rendered its resolved
  default state and the four-second sequence never ran — the centrepiece of the
  homepage, silently dead.
- **`Reveal` never ran.** Harmless in itself, since Reveal is written so content
  is visible without it, but it means the motion system was inert too.

## Evidence

Measured on a clean production build, with `.next` deleted first:

| | hydrated elements inside `<main>` |
|---|---|
| With `loading.tsx` | **0** |
| Without | **223** |

It is not specific to static pages. `/cart` is `force-dynamic`, and with the
boundary present it also showed 0 hydrated elements and sat permanently on
`CartView`'s pre-mount "Loading" state, because its `useEffect` never ran.

Ruled out on the way, each tested individually: the `.next` cache (survives a
full clean rebuild), `force-dynamic`, `revalidate`, the `(site)/not-found`
boundary, `prefers-reduced-motion`, and hydration errors — there were none, in
development or production. The server-rendered HTML was complete and correct
throughout; the failure was purely client-side.

## What we lose, and why it does not matter

A loading skeleton. For the public site that costs nothing real: every page in
the group is statically prerendered or ISR, so there is no generation delay for
a skeleton to cover. The two genuinely dynamic routes, `/cart` and
`/orders/[n]`, render fast enough that a skeleton would flash rather than help —
and `CartView` already renders its own "Loading your cart…" state while it reads
`localStorage`, which is the only wait a visitor actually experiences there.

## If a loading state is wanted later

Add it to ONE route, not the group, and verify hydration before merging:

```js
// with the page open, in the console
[...document.querySelectorAll('main *')]
  .filter(e => Object.keys(e).some(k => k.startsWith('__react'))).length
// 0 means the page subtree did not hydrate. Anything above 0 is healthy.
```

That one line is the whole regression test, and it would have caught this in
Sprint 2.
