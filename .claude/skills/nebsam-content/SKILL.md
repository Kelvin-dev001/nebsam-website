---
name: nebsam-content
description: "Convert a Nebsam source document into website content. Use when migrating anything from content-source/, or when writing or editing any solution, product or industry page."
---

# Converting Nebsam source documents into web content

`content-source/` is **authoritative and read-only**. Rewrite *out of* it, never *into* it. Same
facts, better structure, tighter language. Never paste a source document verbatim — it is
deck-style, ALL-CAPS and repetitive, and it reads badly as a web page.

Full contract: `docs/brief/00-MASTER-BRIEF.md`. This is the working subset.

## 1. Three rules that override everything else

**Never invent.** Not statistics, customer counts, years in business, uptime figures, prices,
warranty terms, technical specifications, certifications, partnerships, client names, testimonials,
awards, superlatives, locations, staff names or response times. Nebsam is a regulated business —
a fabricated claim is a legal risk, not a quality problem.

When a fact is missing, write the token and add a row to `docs/NEEDS_VERIFICATION.md` with page,
line and question:

```
[[NEEDS_VERIFICATION: exactly what is needed]]
```

No public page ships carrying an unresolved token.

**Preserve hedging verbatim.** The sources hedge deliberately — *"according to the configured
security logic"*, *"subject to network and GPS availability"*, *"where supported by the vehicle"*,
*"within the supported remote range"*. That is accuracy, not padding. Rewrite the sentence around
the hedge; keep the hedge word for word.

**Strip the shouting, keep the substance.** ALL-CAPS headings become sentence case. Deck-style
one-liners either earn their place as real copy or they go.

## 2. Confirmed names — build against these, do not re-decide

| Use | Never use |
|---|---|
| Standard Tracker | Basic Tracker |
| Hybrid Car Alarm | Hybrid Alarm |
| Hybrid ProMax Car Alarm *(vibrating key remote)* | — |
| Hybrid ProMax Plus Car Alarm *(vibrating key remote + Anti-Jammer GPS)* | — |
| Hybrid Dashcam **and** AI Vehicle Video Telematics — two separate products | one merged "dashcam" product |
| Nebsam Digital Solutions (K) Ltd — plural | Nebsam Digital Solution (K) Ltd |
| Kiambu Road, Ridgeways (Nairobi) | Equity Ngara · Utawala |
| Makupa Roundabout, next to Mass Petrol Station (Mombasa) | Kenyatta Ave · Saba Saba |

Also never published: **+254 727 727 461** and **nebsam3kenya@gmail.com**. They appear in source
documents and on the KEBS permit. Strip them from every output.

Branches are Nairobi, Mombasa and Nakuru — **only** these three. Everywhere else is agents and
technicians. Never imply an office where there is none, and never state a count of them.

## 3. Never publish these claims

| Claim | Do instead |
|---|---|
| "Trusted by over 50,000 customers across Africa" | omit |
| "#1 vehicle theft prevention solution in Kenya" | omit |
| "The strongest active vehicle protection system in Kenya" | omit |
| "No way a thief will drive away with your car" | omit — never promise absolute security |
| "Decrease fuel theft by 90%" | omit — third-party vendor claim |
| "Unlimited distances without interference" | rewrite as dependent on cellular network coverage |
| "Out-of-this-world advantages" | replace with a capability statement |
| Traffic sign recognition "transmits data directly to NTSA servers" | **write the section without it — absent, not hedged** |
| "KEBS accredited" | "Permit to Use the Standardization Mark", product-scoped to STREAMAX video telematics cameras |

**Approved and usable:** "over 10 years", "70+ corporate clients", and the KEBS laboratory test
report (ref BS202445237, 5 Feb 2025, result "Complies" — never paraphrase into anything stronger).

## 4. Solution page model — eleven sections, in this order

1. **What it is** — one paragraph a non-specialist understands
2. **The problem it solves** — in Kenyan operational terms
3. **Who it is for** — industries, fleet sizes, vehicle types
4. **How it works** — 4–6 concrete steps
5. **What you get** — features grouped and explained, not bulleted flatly
6. **Hardware options** — the actual products that deliver it
7. **Installation & support** — what happens, where, how long
8. **Coverage** — where Nebsam can install and support it
9. **FAQs** — 6–10 real questions, marked up as `FAQPage`
10. **Related** — solutions, products, industries, articles
11. **Conversion block** — WhatsApp / quote / call

Write for a fleet manager who is technical about vehicles and not about software.

## 5. Writing standards

- Sentence case for headings.
- Short paragraphs, one idea each. Never "In today's fast-paced world".
- Specific over clever: *"detects abnormal fuel level drops and alerts you with time, location and
  litres lost"* beats *"revolutionary fuel intelligence"*.
- Kenyan English, international clarity. Use local nouns where they are the right nouns — matatu,
  PSV, NTSA, boda boda, ICD, Makupa. They carry real search value.
- Every page states plainly who Nebsam is and where it operates. LLMs quote what is explicit.
- Conversion order: WhatsApp → call → quote → book installation → form → email → demo. The primary
  action on a page is unmistakable.

## 6. Worked example

Source: `content-source/01-solutions/radio-communication/write-up.md`

### BEFORE — the source, verbatim

```markdown
# UNLIMITED COMMUNICATION RANGE

## COMMUNICATE ACROSS BORDERS

One of the biggest advantages of Long-Range PoC communication is that teams do not
need to be within traditional radio range of one another.

A user in **Mombasa** can communicate with a team in **Nairobi**.

A supervisor in **Kenya** can communicate with teams operating in other countries,
subject to network coverage and service availability.

### CITY TO CITY. REGION TO REGION. COUNTRY TO COUNTRY.

**No conventional radio-distance limitation.**
```

### AFTER — the web version

```markdown
## How far can a PoC radio actually reach?

A PoC radio carries voice over a mobile data network instead of transmitting directly
to another handset, so the distance between two users stops being the limit. A driver
in Mombasa can talk to a dispatcher in Nairobi on the same channel.

What replaces distance as the limit is coverage. Communication with teams in other
countries is possible, subject to network coverage and service availability. Where
there is no mobile data service, the handset cannot transmit or receive at all — which
is the trade-off against a short-range radio, and the reason many fleets run both.

**Range is bounded by network coverage, not by radio distance.**
```

### Why each change was made

| Decision | Reason |
|---|---|
| Dropped "UNLIMITED" from the heading | "Unlimited distances without interference" is on the unpublishable list (§3) |
| Heading became a question in sentence case | §5, and it is the question a buyer actually types — see the `nebsam-seo` skill on answer-shaped content |
| Answer moved into the first sentence | An assistant retrieving this page lifts the first clear answer |
| Kept *"subject to network coverage and service availability"* **word for word** | Source hedging is preserved verbatim (§1) |
| Added the no-coverage consequence | The source implies a limit without stating it; making it explicit is accuracy, not a new fact |
| Cut "CITY TO CITY. REGION TO REGION. COUNTRY TO COUNTRY." | Deck rhythm that carries no information (§5) |
| Kept one bolded closing line | It states the actual constraint, so it earns its place |
| Invented nothing | No distance figure, no coverage percentage, no carrier named |

## 7. Before you finish

- [ ] Every fact traces to `content-source/` or the brief — nothing invented
- [ ] Every source hedge preserved word for word
- [ ] No claim from §3; no retired name, address, phone or email from §2
- [ ] Sentence case headings; no ALL-CAPS carried over
- [ ] Any gap written as `[[NEEDS_VERIFICATION: …]]` **and** logged in the register
- [ ] Prices carry a visible `excl. VAT` label; recurring costs shown on the page, not at checkout
- [ ] Links out to related solutions, products and industries — no orphan pages
- [ ] `SOURCE NOTES — NOT FOR PUBLICATION` blocks deleted from anything rendered
