# Sprint 7 — Commerce

**Branch** `sprint/07-commerce` → `develop`
**Report date** 5 September 2026
**Format** Brief PART 21.2

Deferred after Sprint 6 (V49) and run once A01–A07 and V05 were answered.

---

## 1. Completed

Acceptance list from `SHOP_ARCHITECTURE.md` §8:

| Criterion | State |
|---|---|
| An order row exists **before** WhatsApp opens — verified by killing the chat mid-flow | ✅ **proven** |
| A tampered client price is rejected; the server total wins | ✅ **proven, and structurally impossible** |
| `excl. VAT` on the product page, in the cart, in the total **and** in the WhatsApp message | ✅ |
| The recurring fee appears next to the price **and** in the WhatsApp message | ✅ |
| A product with no price shows "Request price", no add-to-cart, and emits **no** `Offer` schema | ✅ |
| `/shop` and `/shop/*` 301 correctly; neither resolves 200 | ✅ (308, see §2) |
| Order lookup by number works and exposes no other order | ✅ |
| Cart survives reload and revalidates against the database | ✅ |
| Full funnel fires with no PII in any payload | ❌ **cannot test — no GA4 (V10)** |

Eight of nine. The ninth needs an analytics property that does not exist yet.

---

## 2. Deviations from plan

**`/shop` returns 308, not 301.** `next.config.mjs` uses `permanent: true`, which Next implements as
308. Both are permanent redirects and Google honours them identically; 308 additionally preserves the
request method. The criterion says 301, so this is recorded rather than silently accepted — say the
word and every legacy redirect switches to an explicit `statusCode: 301`.

**The cart lives under `app/(site)`, not a separate `app/(shop)` group.** CLAUDE.md §12 lists a
`(shop)` group, but a separate group needs its own layout, which would mean a second copy of the
header, footer, WhatsApp button and cookie bar. The shop is part of the public site and shares its
chrome, so it shares its group.

**No add-to-cart on unpriced products, by design rather than omission.** Ten of fourteen products
have no published price. They show "Request price" and a WhatsApp CTA. All three behaviours — the
label, the missing button, the absent `Offer` — follow from the same null, so they cannot drift apart.

---

## 3. Files

**Added**
```
app/(site)/cart/page.tsx                 cart, noindex, dynamic
app/(site)/cart/actions.ts               createOrder — Zod, server-priced
app/(site)/orders/[orderNumber]/page.tsx order lookup
app/(site)/not-found.tsx                 404 with site chrome
components/cart/cart-view.tsx            cart and checkout
components/cart/add-to-cart.tsx          add-to-cart button
lib/cart.ts                              browser cart state
docs/decisions/ADR-0003-no-route-loading-boundary.md
docs/sprint-reports/SPRINT-07.md         this report
```

**Removed**
```
app/(site)/loading.tsx                   see §5 — it broke all page hydration
```

**Changed**
```
components/product/product-price.tsx     add-to-cart where a price exists
```

---

## 4. How the two hard criteria are met

**The order row exists before WhatsApp opens.** `createOrder` writes the order and its items, then
returns the `wa.me` URL. The client opens WhatsApp only after that resolves. Brief 10.2 calls a
dropped chat losing an order the single most important thing to prevent in the shop, and the ordering
of those two steps is the whole mechanism.

**A tampered price cannot be sent, let alone rejected.** The action's schema accepts `productId` and
`quantity`. Nothing else. There is no price field, no total, and no branch that reads a number from
the browser — every figure is read from `public_products` at order time. The cart in `localStorage`
holds IDs and quantities for the same reason: storing a price would create a number the server might
one day be tempted to trust.

---

## 5. The defect that blocked this sprint, and three others

**`app/(site)/loading.tsx`, added in Sprint 2, broke client hydration of every page in the group.**

| | hydrated elements inside `<main>` |
|---|---|
| With `loading.tsx` | **0** |
| Without | **223** |

Layout components — header, mobile navigation, cookie bar, footer — hydrated normally throughout,
which is what made it look like React was working.

It was not specific to static pages. `/cart` is `force-dynamic` and also showed 0, sitting
permanently on `CartView`'s pre-mount "Loading" state because its `useEffect` never ran.

**What it had broken, silently:**

- **Add to cart rendered and did nothing.** The entire point of this sprint.
- **The signature telematics element was frozen** on its resolved default state; the four-second
  sequence never ran. That is the homepage centrepiece, approved at the Sprint 1 gate, and it had
  been dead since at least Sprint 7's branch point.
- **`Reveal` never ran**, so the motion system was inert. Harmless in itself, only because Reveal is
  written so content is visible without it.

**Why it took so long to find.** The served HTML was complete and correct. There were no hydration
errors in development or production. The build output was healthy. Every visible signal said the page
was fine. Ruled out individually before the cause was found: the `.next` cache (survives a full clean
rebuild), `force-dynamic`, `revalidate`, the `(site)/not-found` boundary, and
`prefers-reduced-motion`.

Recorded as **ADR-0003**, with the one-line console check that would have caught it in Sprint 2.

**Two further defects, found on the way:**

The order page returned **HTTP 200 carrying a not-found body**, and `generateMetadata` **echoed the
requested order number into the `<title>`** — on the one page whose security model is that the number
is a bearer token nobody else should learn. Metadata is now static and generic, and a missing order
renders an explicit "we cannot find that order" state rather than a 404 page served under a 200.

---

## 6. Verification actually run

Driven through the real UI, not simulated.

| | |
|---|---|
| `tsc --noEmit`, `eslint .`, `npm run build` | pass |
| `npm run verify:db` | pass — 31 tables, none anon-readable or anon-writable |
| `npm run check:sitemap` | pass — every URL 200 |
| **Killed-chat test** | `window.open` stubbed so WhatsApp never opened. Order `NBS-260904-J8T7` still existed, subtotal 44,000 server-computed, VAT snapshot 0.16, item snapshot intact |
| **Tamper test** | `price_kes: 1` injected into `localStorage`; the page priced it at the real **22,000** from the server catalogue |
| Cart persistence | survives reload |
| WhatsApp message | carries order number, lines, `excl. VAT`, VAT at 16%, total, and the recurring fee |
| Order lookup | correct totals; customer phone **not** rendered |
| `/shop`, `/shop/*` | redirect, never 200 |
| Unpriced product | "Request price", no add-to-cart, no `Offer` |
| Cleanup | test order deleted, `order_items` cascaded, catalogue untouched |

---

## 7. Security notes

- The order number is a **bearer token**: `NBS-YYMMDD-XXXX` with a cryptographically random suffix
  from an alphabet excluding `I`, `L`, `O`, `0` and `1`. A sequential suffix would let anyone who
  placed one order enumerate every order placed that day.
- Lookup is **exact match only**. No prefix search, no listing, no "recent orders". There is no path
  from one order to another.
- The order page is `noindex` and **does not render the customer's phone number**. Whoever opens the
  link is not necessarily the person who placed the order.
- Nothing personal is left in `localStorage`. Name, phone and town are typed at checkout and go
  straight to the server.

---

## 8. Performance

Not measured this sprint. The cart is the first substantial client component on a public route
(3.86 kB route JS). It is `noindex` and not part of the acquisition funnel, but a measurement on
`/cart` and on a product page belongs in the next sprint that touches either — particularly since
hydration only started working today, and every previous measurement was taken with the page's
client JS inert.

**That last point matters:** the Lighthouse numbers recorded in Sprints 4, 5 and 6 were measured
while no page-level client component hydrated. They are not wrong, but they are not comparable to
anything measured from now on.

---

## 9. Decisions needed from the human

1. **V10 — GA4.** Blocks the funnel criterion. You said you would create new properties.
2. **301 vs 308** on the legacy redirect map. Currently 308; both are permanent.
3. **V12 — client logos.** Of the thirteen approved names only *Ngong Veg* has a logo file, and five
   logos in the repository are not on the approved list. Also `"Jayid Enterprises D olphine
   Freighters"` reads as two companies, and Ngong Veg / Ngong Vegetables and Broadway Transport /
   Broadway Logistics may be duplicates.
4. **V39 / V40** — a named approver and a real target launch date. "We need to launch" is not a date
   a sprint can be flagged against.

---

## 10. Known issues and open register items

| Item | Effect |
|---|---|
| **V10** | No GA4. Funnel criterion untestable |
| **V12** | Logo files do not match the approved names |
| **V17–V24** | School bus draft; proposal document awaited in `media-inbox/` |
| **V25** | Search Console cross-check. **Sprint 2 still cannot formally close** |
| **V28a / V51** | ODPC claim live; expired certificates now displayed with status, pending renewal dates |
| **V50 / V43** | `sharp` pinned to 0.35.4; `npm audit` never re-ran to confirm |
| **V47** | LCP 2.878 s. **Now worth re-measuring** — the old figures were taken with page JS inert |
| **V09** | Author bio and photograph awaited in `media-inbox/author/` |
| **V37 / V45** | Logo variants; 1200×630 OG image |
| **V03 / V04** | Certificate verification design and data source |
| `CERT_PLATE_HMAC_SECRET` | Empty |
| Prettier | 43 existing files unformatted |
| Ultrawide | Never rendered on real hardware |

---

## 11. Recommended next step

**Re-measure performance before building anything else.** Every Lighthouse figure on this project was
taken while page-level client components were inert. The homepage, a solution page and a product page
should be re-measured so V47 is judged against reality.

After that, Sprint 10 — Resources — is the natural continuation.

---

**STOPPING HERE FOR REVIEW.**
