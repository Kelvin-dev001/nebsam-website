# SHOP ARCHITECTURE

Catalogue, cart, WhatsApp checkout and the order lifecycle.

**WhatsApp is the checkout. There is no online payment.** No card gateway, no M-Pesa in this build.
The schema is prepared for them; the flow is not built.

---

## 1. Products and shop are one page type

`/products/[slug]` is canonical and carries everything: technical specification, features, use cases,
compatibility, installation, price and add-to-cart. **There is no separate commercial page.**

This avoids the keyword-cannibalisation trap where a spec page and a shop page for the same device
compete and split their own ranking signal. It also halves what staff maintain.

Consequences, all of them binding:

- **One `Product` schema block per product**, with `Offer` **only** where a real price is published.
- `/shop` and `/shop/*` **301** to the `/products` equivalents. "Shop" may remain a navigation label.
  **Never let both resolve 200.**
- A product without a published price shows **"Request price"** and a WhatsApp CTA in place of
  add-to-cart. Same page, different action.
- The page serves two very different readers without becoming a mess: **decision-useful summary and
  price above the fold, deep specification below it.** The specification is **never** in a
  client-only tab — that is the crawlability failure this rebuild exists to fix.

---

## 2. Catalogue

| Route | Purpose |
|---|---|
| `/products` | Browse, filter, compare |
| `/products/category/[slug]` | GPS trackers · car alarms · dashcams and video · radios · systems |
| `/products/[slug]` | The merged page |

Filters are **URL-driven** (`?category=…&family=…`), not client-only state, so a filtered view is
linkable, shareable and crawlable. Comparison is a server-rendered table, not a client widget.

### 2.1 Launch catalogue

| Family | Count | Priced |
|---|---|---|
| Trackers | 7 | none confirmed |
| Car alarms | 5 | none confirmed |
| Video | 2 — Hybrid Dashcam, AI Vehicle Video Telematics | none confirmed |
| Systems | 3 — fuel monitoring, speed governor, container e-seal | none confirmed |
| Radios | 4 full pages at launch | **all four priced** |

**Only four products have a confirmed price at launch** — the PoC radios. Everything else renders
"Request price". That is the honest state, and brief 10.2 forbids inventing a number to fill it.

Seven further radio models are held as an "other models — request price" section on
`/solutions/radio-communication` until specifications and prices arrive (~120 open spec tokens).

---

## 3. Pricing rules

- **Prices are published**, VAT-**exclusive**, and every displayed price carries a visible
  `excl. VAT` label — on the product page, in the cart, in the cart total, **and inside the generated
  WhatsApp order message**. A VAT-exclusive price shown without a label is the most common source of
  order disputes in Kenyan e-commerce, and the fix costs one span.
- The label is a property of the `PriceTag` component, **not** something each caller remembers. Four
  places must carry it; making it optional means one of the four eventually will not.
- `price_kes` stores the VAT-exclusive figure. `VAT_RATE` is a single constant in
  `lib/constants.ts`, so a VAT-inclusive toggle can be added later without touching data.
  The current rate is unconfirmed — **V06**.
- **Confirmed prices (2025):** Inrico T-521 **KES 22,000** · S-100 **KES 30,000** · S-200
  **KES 30,000** · TM-7 **KES 30,000**.
- **Recurring costs are disclosed on the product page, not at checkout.** PoC radios carry an
  **annual CAK licence renewal of KES 3,000 per device**. `recurring_fee_kes`,
  `recurring_fee_period` and `recurring_fee_note` render next to the price and are carried into the
  WhatsApp message. Hiding a recurring fee until after purchase generates refund requests and
  destroys the trust the rest of the site is built to earn.
- Each product states plainly whether installation is included or quoted separately —
  `[[NEEDS_VERIFICATION: installation and delivery terms per product category]]`, **V05**.

---

## 4. The flow

```
Browse → product page → add to cart → cart review → "Order on WhatsApp"
   → order persisted server-side, order number issued
   → WhatsApp opens with a pre-filled structured message
   → Nebsam confirms, arranges payment and installation off-platform
   → admin moves the order through its status pipeline
```

### 4.1 The one detail that matters most

**Pressing "Order on WhatsApp" must create the `orders` row _before_ opening WhatsApp**, so a
dropped chat is still a recorded lead. Brief 10.2 calls this the single most important detail in the
shop, and brief PART 25 lists losing it as a project-failure mode.

Order creation is therefore a **server action that returns the `wa.me` URL**. The client does not
construct the link and does not open WhatsApp until the row exists. If persistence fails, the user
sees an error and the WhatsApp link is not offered — a lost order is recoverable, a silently lost
lead is not.

### 4.2 Cart

- Persists across reloads in client storage.
- **Rehydrated safely: client prices are never trusted.** On load and again at order creation, every
  line is re-fetched from the database by product id, and the total is recomputed server-side.
- A product that has since been unpublished or lost its price is flagged in the cart rather than
  silently priced from stale storage.

### 4.3 Order number

Format **`NBS-YYMMDD-XXXX`** — short and human-readable over a phone call.

`XXXX` is **random, not sequential**. `/orders/[orderNumber]` is reachable by anyone holding the
number, so it is a bearer token and must be unguessable. The page is `noindex` and exposes only that
order.

### 4.4 The WhatsApp message

Generated **server-side** and deep-linked via `https://wa.me/254759000111?text=…`, URL-encoded.
**All shop orders route to +254 759 000 111** — no per-branch routing (PART 1.5 #12).

```
NEBSAM ORDER  NBS-260817-0431

1x Hybrid Pro Max Tracker
2x Hybrid Car Alarm

Subtotal: KES 00,000 (excl. VAT)
Recurring: KES 3,000 per device per year (CAK licence renewal)
Preference: Installation at Mombasa branch
Name: (customer fills)

View: nebsamdigital.com/orders/NBS-260817-0431
```

The `excl. VAT` label and any recurring fee appear **in the message**, not only on the page. The
message is the artefact the conversation happens around; a cost that is not in it will be disputed.

### 4.5 Pre-checkout fields

Name, town, install vs pickup, preferred branch. **Optional, and kept to the minimum that makes the
WhatsApp conversation efficient.** Every additional field costs conversions.

A single **"Enquire on WhatsApp"** action sits on every product page for buyers who never open the
cart — which, given the conversion hierarchy, will be most of them.

---

## 5. Order lifecycle

```
new → contacted → confirmed → installed → closed
                            ↘ cancelled
```

Managed in admin with internal notes and CSV export. Every transition is written to `audit_log`.

`order_items` stores `name_snapshot`, `unit_price_snapshot` and `recurring_fee_snapshot` — an order
records what the customer was shown, not what the product says today. A price change must not
rewrite history.

`orders.vat_rate_snapshot` records the rate at the time of order, because the rate is itself
unconfirmed and rates change.

---

## 6. Prepared but not built

`payments`, `payment_intents` and `shipments` tables exist, plus a `PaymentProvider` interface with
a single `WhatsAppManualProvider` implementation.

**Adding M-Pesa Daraja later must not require touching the cart, product or order UI.** That is the
test of whether the abstraction is real: a second provider is a new implementation of the interface
and a new row in `payments`, nothing more.

---

## 7. Instrumentation

`view_item` · `add_to_cart` · `begin_checkout` · `whatsapp_order_submitted` (order number and value)
· `whatsapp_click` (source page and context).

Consent-gated, no PII, event names in `lib/constants.ts`. GA4 conversions configured for WhatsApp
click, quote submitted and WhatsApp order submitted.

The funnel worth watching: `view_item → add_to_cart → begin_checkout → whatsapp_order_submitted`,
against the parallel `view_item → whatsapp_click` path that skips the cart entirely. If the second
dominates, the cart is not the product page's job and the design should follow the evidence.

---

## 8. Sprint 7 acceptance

- [ ] An order row exists **before** WhatsApp opens — verified by killing the chat mid-flow
- [ ] A tampered client price is rejected; the server total wins
- [ ] `excl. VAT` appears on the product page, in the cart, in the total **and** in the WhatsApp message
- [ ] The recurring CAK fee appears next to the price **and** in the WhatsApp message
- [ ] A product with no price shows "Request price", no add-to-cart, and emits **no** `Offer` schema
- [ ] `/shop` and `/shop/*` 301 correctly; neither resolves 200
- [ ] Order lookup by number works and exposes no other order
- [ ] Cart survives reload and revalidates against the database
- [ ] Full funnel fires with no PII in any payload

---

## 9. Open items

| Item | Register |
|---|---|
| Installation and delivery terms per category | **V05** |
| Current VAT rate | **V06** |
| Prices for 7 radio models and every non-radio product | ~10 rows in the spec annexe |
| Whether the Inrico T-290 is still sold | spec annexe |
| Whether the KES 3,000 renewal applies to the DR10 gateway | spec annexe |
| CAK licensing obligation and cost for the five short-range radios | spec annexe |
| The brochure's "Hybrid Car Alarm + Hybrid Tracker package (optional)" — a bundling and pricing claim that may need a kit concept | audit **A07** |
| School bus pricing model — per bus, per student, per term, per module? | **V24** |
