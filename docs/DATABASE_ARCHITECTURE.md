# DATABASE ARCHITECTURE

Tables, relations, RLS policies and the migration plan.

Supabase Postgres. **RLS on every table, no exceptions.** Every migration is a reviewed file in
`supabase/migrations/`; schema is never mutated outside a migration.

> **STATUS — Sprint 3, updated 2 Sep 2026.** All 10 migrations are written in
> `supabase/migrations/` and **have been applied to the Supabase project**, along with the RLS
> policies (0008), the public read-only views (0009) and the reference seed (0010).
>
> **Verified against the live database**, not against the SQL, by `npm run verify:db`:
>
> | Check | Result |
> |---|---|
> | Tables present (service role) | 30 / 30 |
> | Public views readable by `anon` | 17 / 17 |
> | Base tables readable by `anon` | **0** — correct |
> | Writes by `anon` refused | **30 / 30**, by RLS or permission denial |
>
> Seed landed as designed: 3 branches (Nairobi, Mombasa, Nakuru), 16 coverage towns, 5 product
> categories, 8 blog categories. Every customer-bearing table — `orders`, `order_items`,
> `submissions`, `installation_certificates`, `installation_plates_restricted`, `testimonials`,
> `client_logos`, `payments`, `profiles` — is **empty**. Content tables (`solutions`, `products`,
> `industries`, `faqs`, `authors`) are empty by design; content migration is Sprint 4 onward.
>
> Certificate shape confirmed as **Option A** by reading the live PostgREST schema:
> `installation_certificates` carries `plate_hash`, `phone_last4_hash` and `certificate_number_last4`
> and **no plaintext plate**; the only plaintext plate column in the entire schema is
> `installation_plates_restricted.plate_plaintext`, which `anon` cannot read.
>
> **V46 CLOSED (2 Sep 2026).** `types/database.ts` is genuine `supabase gen types` output — 2,207
> lines covering 30 tables, 17 views and 7 enums — regenerated with `npm run db:types`. It is pure
> generated output and is never hand-edited; the derived aliases the application reads live in
> `types/content.ts`, so regeneration cannot clobber them and every alias resolves through
> `Database`.
>
> Closing it exposed a real gap: neither Supabase client was parameterised with `Database`, so every
> query returned `any` and the row types in `lib/content/` were unchecked casts. The generated types
> would have compiled and meant nothing. Both clients now take the generic, verified by a negative
> test — `tsc` rejects a query against a table that does not exist.
>
> `npm run check:migrations` remains the build-time static gate; `npm run verify:db` is the live
> counterpart and is **deliberately not in the build**, since it needs `.env.local` and network.
>
> One design point changed during implementation: a **separate restricted table**,
> `installation_plates_restricted`, now holds plaintext plates for operations. Without it, rotating
> `CERT_PLATE_HMAC_SECRET` would be unrecoverable — there would be nothing left to re-hash from.
> That secret is **still empty in `.env.local`** and must be set before any certificate import.

This document is the design the migrations are built to.

---

## 1. Principles

1. **RLS on every table.** A table without a policy denies everything — that is the safe default and
   we rely on it.
2. **Public read only where genuinely public**, and through **read-only views**, not base tables.
3. **The anon key is read-only.** Every write goes through a server action using the service-role
   key, after Zod validation.
4. **Never trust a client price.** Every total is recomputed server-side from the database at order
   creation.
5. **No real customer data in seed files, ever.**
6. Content tables carry `status` (`draft` / `in_review` / `published`) and `seo_*` columns.
7. Timestamps are `timestamptz`. Money is integer minor units where it is money.

---

## 2. Core content

```sql
profiles(id uuid pk → auth.users, email, full_name, role, created_at)
  role: 'admin' | 'editor' | 'sales' | 'viewer'

solutions(id, slug unique, name, summary, body, hero_image, sort_order,
          status, last_reviewed_at, seo_title, seo_description, seo_image)

products(id, slug unique, name, family, summary, body,
         specs jsonb, features jsonb, gallery jsonb,
         category_id → product_categories,
         -- commercial fields live here: products and shop are MERGED
         sku, price_kes integer NULL,        -- EXCL. VAT. NULL = "Request price"
         price_visible boolean default true,
         availability, featured boolean,
         recurring_fee_kes integer NULL,
         recurring_fee_period,               -- e.g. 'year'
         recurring_fee_note,                 -- e.g. 'CAK annual licence renewal, per device'
         installation_terms,                 -- V05
         status, seo_*)

product_categories(id, slug unique, name, description, sort_order)
industries(id, slug unique, name, summary, body, hero_image, status, seo_*)

product_solutions(product_id, solution_id, primary key (both))
product_industries(product_id, industry_id, primary key (both))
solution_industries(solution_id, industry_id, primary key (both))
```

`price_kes NULL` is the mechanism behind brief 10.2: no price means the page renders **"Request
price"** with a WhatsApp CTA and emits `Product` schema **without** `Offer`. There is no placeholder
number anywhere in the system, because the column that would hold one is null instead.

`recurring_fee_*` exists because the PoC radios carry a **KES 3,000 per device per year CAK licence
renewal**, and brief 10.2 requires recurring costs on the product page rather than at checkout. The
fields render next to the price and are carried into the generated WhatsApp order message.

`VAT_RATE` is **not** a column. It is a single constant in `lib/constants.ts`, so a VAT-inclusive
display toggle can be added later without touching data. All stored prices are VAT-exclusive.

---

## 3. Commerce

```sql
orders(id, order_number unique,        -- NBS-YYMMDD-XXXX
       status,                          -- new|contacted|confirmed|installed|closed|cancelled
       customer_name, customer_phone, customer_town,
       fulfilment_type,                 -- 'installation' | 'pickup'
       branch_id → branches,
       subtotal_kes integer,            -- recomputed server-side, EXCL. VAT
       vat_rate_snapshot numeric,       -- the rate at time of order
       whatsapp_sent_at, notes, created_at)

order_items(id, order_id → orders, product_id → products,
            name_snapshot, unit_price_snapshot integer, qty,
            recurring_fee_snapshot integer NULL)

-- Prepared, NOT built (brief 10.3)
payments(id, order_id, provider, amount_kes, status, reference, created_at)
payment_intents(id, order_id, provider, payload jsonb, status, created_at)
shipments(id, order_id, carrier, tracking_ref, status, created_at)
```

**The snapshot columns are the point.** An order records what the customer was shown, not what the
product record says today. A price change six months later must not rewrite history — and
`recurring_fee_snapshot` matters just as much, because the recurring cost is part of what was
agreed.

`vat_rate_snapshot` exists because the current rate is itself unconfirmed (**V06**) and rates change.

**`orders` is written before WhatsApp opens.** Brief 10.2 calls this the single most important detail
in the shop: a dropped chat must still be a recorded lead. The row is created, the order number
issued, and only then is the `wa.me` link opened.

The order number is a **bearer token** — `/orders/[orderNumber]` is reachable by anyone holding it,
so it must be unguessable. `XXXX` is random, not sequential.

---

## 4. Editorial and trust

```sql
blog_posts(id, slug unique, title, excerpt, body, featured_image,
           author_id → authors, category_id → blog_categories,
           status, published_at, updated_at, reading_time, seo_*)
blog_categories(id, slug unique, name, description, solution_id → solutions NULL)
authors(id, name, role, bio, avatar, links jsonb)

faqs(id, question, answer, scope, scope_id, sort_order)
  -- scope: 'global' | 'solution' | 'product' | 'industry'

downloads(id, slug unique, title, description, file_path, file_type,
          file_size, category, thumbnail, download_count,
          document_date, version,
          cleared_for_publication boolean default false,
          cleared_by, cleared_at, status)

certifications(id, name, issuer, description, document_path, image,
               reference_number, effective_on, expires_on,
               scope_note, sort_order)

testimonials(id, author_name, company, industry, quote, logo,
             permission_confirmed boolean default false, status, sort_order)

client_logos(id, name, logo_path, sort_order,
             permission_confirmed boolean default false)
```

Three columns are doing compliance work, not data-modelling work:

- **`downloads.cleared_for_publication`** defaults false and is set only by a human. All four
  prepared PDFs are currently blocked on content grounds — retired addresses, the unpublished phone
  number, unsubstantiated claims. A file that is merely uploaded must not become downloadable.
- **`certifications.expires_on`** exists because **three of six registrations have already expired**
  (V27–V29). Brief 3.5 requires the site never displays a lapsed permit. Admin surfaces an expiry
  reminder and the public page filters on it.
- **`certifications.scope_note`** exists because the KEBS permit is **product-scoped**, not
  company-scoped. The scope must be stated on the face of the page, so it is a required field rather
  than something a page template hopes to remember.
- **`permission_confirmed`** on both `testimonials` and `client_logos` defaults false. The aggregate
  "70+ corporate clients" claim is approved; naming or logo-ing any individual client is not, until
  that client confirms (V12, V15).

---

## 5. Operations

```sql
branches(id, slug unique, name, address, town, phones jsonb,
         maps_url, hours, lat, lng)                    -- exactly three rows
coverage_locations(id, town, county, type, lat, lng, active)
  -- type: 'agent' | 'technician' | 'both'  — NEVER an office

submissions(id, type, payload jsonb, is_anonymous,
            status, assigned_to → profiles, notes, created_at)
  -- type: 'contact'|'quote'|'demo'|'installation'|'suggestion'

media(id, path, alt_text NOT NULL, width, height, bytes, mime,
      uploaded_by → profiles, created_at)

audit_log(id, actor_id → profiles, action, entity, entity_id,
          diff jsonb, created_at)
```

`branches` and `coverage_locations` are separate tables rather than one table with a flag, because
brief 3.4 requires the UI to **visually distinguish a branch from service coverage** and forbids
implying an office where there is none. Two tables make that structural rather than a rendering
convention someone can forget.

`media.alt_text` is `NOT NULL` at the database level. Brief 11.1 requires it; a nullable column with
a "required" form field is a rule that lasts until the first hurried upload.

---

## 6. Certificate verification — security-critical

Brief PART 9.2. Designed to **Option A** (plate + last 4 digits of the registered phone).
**V03 is still open**; Option B (plate + OTP) is a swap of the second factor only and does not change
this schema. ADR-0002 is written when V03 is answered.

```sql
installation_certificates(
  id,
  plate_hash bytea NOT NULL,          -- HMAC-SHA256 of the NORMALISED plate
  phone_last4_hash bytea NOT NULL,    -- HMAC of the last 4 digits, same key domain
  certificate_number_last4 text,
  installed_on date, expires_on date,
  status, created_at,
  UNIQUE (plate_hash)
)
CREATE INDEX ON installation_certificates (plate_hash);

verification_attempts(
  id, ip_hash bytea, plate_hash bytea,
  outcome,                            -- 'valid'|'expired'|'not_found'|'factor_failed'
  created_at
)
CREATE INDEX ON verification_attempts (created_at DESC);
CREATE INDEX ON verification_attempts (ip_hash, created_at DESC);
```

**No plaintext plate is stored in this table.** Normalise first — uppercase, strip spaces and
hyphens, canonicalise `O`/`0` confusion — then HMAC with `CERT_PLATE_HMAC_SECRET`, a server-only
secret, and index on the hash. A database leak then yields no usable plate list.

Where operations genuinely need a plaintext plate, it lives in a **separate restricted table** with
its own policy, never joined into the public lookup path.

**Rotating `CERT_PLATE_HMAC_SECRET` invalidates the entire lookup index.** Rotation requires a
planned re-hash migration from the restricted operational table. This is recorded here because it is
the kind of constraint that is discovered at the worst possible moment.

`installation.jpg` in the repo shows the legacy certificate serial format `P051510924U/2007` and
states the installation is "valid for 1 year" — both directly relevant to the import format
(**V04**).

---

## 7. RLS policy design

| Table | Anon | Authenticated | Notes |
|---|---|---|---|
| `solutions`, `products`, `industries`, `product_categories`, `faqs` | **read published only, via view** | role-based write | Views expose published rows and public columns only |
| `blog_posts`, `blog_categories`, `authors` | read published only | editor+ write | |
| `downloads` | read where `status='published' AND cleared_for_publication` | editor+ write | Both conditions, always |
| `certifications` | read where not expired | admin write | |
| `testimonials`, `client_logos` | read where `permission_confirmed AND status='published'` | admin write | |
| `branches`, `coverage_locations` | read all | admin write | Genuinely public |
| `orders`, `order_items` | **none** | sales+ read/write | Public lookup is by order number through a server action only |
| `submissions` | **insert only**, via server action | sales+ read | Never readable by anon |
| `installation_certificates` | **none** | admin write | **Never queried from the client. Server action only** |
| `verification_attempts` | **none** | admin read | |
| `media` | read | editor+ write | |
| `profiles` | none | self read; admin all | |
| `audit_log` | **none** | admin read, **no update or delete by anyone** | Append-only |
| `payments`, `payment_intents`, `shipments` | none | admin | Prepared, unused |

### 7.1 Roles

| Role | Scope |
|---|---|
| `admin` | everything |
| `editor` | content + shop; **no** settings, no users |
| `sales` | inbox + orders only |
| `viewer` | read-only |

Enforced in **RLS**, not merely hidden in the UI. A hidden button is not a permission.

---

## 8. Migration plan — Sprint 3

| # | Migration | Contents |
|---|---|---|
| 0001 | `init_extensions_and_profiles` | `pgcrypto`, `profiles`, role enum, RLS baseline |
| 0002 | `content_core` | solutions, products, industries, categories, join tables |
| 0003 | `content_editorial` | blog, authors, categories, faqs |
| 0004 | `trust_and_operations` | testimonials, client_logos, certifications, branches, coverage, downloads |
| 0005 | `commerce` | orders, order_items + prepared payment tables |
| 0006 | `verification` | installation_certificates, verification_attempts |
| 0007 | `media_and_audit` | media, audit_log |
| 0008 | `rls_policies` | every policy, applied last so it can reference all tables |
| 0009 | `public_views` | read-only views the anon key reads through |
| 0010 | `seed_reference_data` | branches, coverage towns, categories — **no customer data** |

Types are **generated** from the database into `types/database.ts`. Never hand-written.

---

## 9. Seeding

The seed script contains reference data only: three branches, the coverage towns, product
categories, and content migrated from `content-source/`.

**It contains no real customer data.** No plates, no names, no phone numbers, no certificates.
Demonstration telemetry uses obviously illustrative plates per brief 6.5, and those live in
component fixtures, not in the database.

---

## 10. Open items affecting this schema

| Item | Effect |
|---|---|
| **V03** — verification second factor | Option B changes the second factor, not the schema |
| **V04** — certificate source and format; is the number sequential? | Import tooling; whether the number needs enumeration hardening too |
| **V05** — installation and delivery terms per category | `products.installation_terms` content |
| **V06** — current VAT rate | `VAT_RATE` constant and `vat_rate_snapshot` |
| **V24** — school bus pricing model | Whether it is a shop item or enquiry-only |
| **A07** — the brochure's Hybrid Car Alarm + tracker bundle | May require a bundle or kit concept before Sprint 7 |
