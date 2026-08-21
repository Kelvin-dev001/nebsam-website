-- ============================================================================
-- 0002 — Solutions, products, industries, categories and their joins.
--
-- PRODUCTS AND SHOP ARE ONE TABLE. Brief PART 1.5 #14 merges the spec page and
-- the commerce page, so the commercial columns live on `products` — there is no
-- separate shop table and no second row to keep in sync.
-- ============================================================================

-- ── Shared SEO columns, as a domain-ish convention ──────────────────────────
-- Repeated inline rather than via a composite type so that generated TypeScript
-- types stay flat and queryable.

create table solutions (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null unique,
  name              text not null,
  summary           text,
  body              text,
  hero_image        text,
  sort_order        integer not null default 0,
  status            content_status not null default 'draft',
  -- Brief 13.3 requires a visible "last updated" on solution pages.
  last_reviewed_at  timestamptz,
  seo_title         text,
  seo_description   text,
  seo_image         text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create trigger solutions_set_updated_at before update on solutions
  for each row execute function set_updated_at();
alter table solutions enable row level security;

create index solutions_status_idx on solutions (status);

create table product_categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  description text,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger product_categories_set_updated_at before update on product_categories
  for each row execute function set_updated_at();
alter table product_categories enable row level security;

create table products (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  family      text,
  summary     text,
  body        text,
  specs       jsonb not null default '{}'::jsonb,
  features    jsonb not null default '[]'::jsonb,
  gallery     jsonb not null default '[]'::jsonb,
  category_id uuid references product_categories (id) on delete set null,

  -- ── Commercial columns. Products and shop are merged. ────────────────────
  sku           text,

  -- VAT-EXCLUSIVE, in whole KES (brief PART 1.5 #10).
  -- NULL is meaningful and load-bearing: it means "Request price". The page
  -- then renders a WhatsApp CTA instead of add-to-cart and emits Product schema
  -- WITHOUT an Offer. There is deliberately no way to store a placeholder
  -- number, because brief 10.2 forbids inventing one.
  price_kes     integer check (price_kes is null or price_kes >= 0),
  price_visible boolean not null default true,
  availability  availability_status not null default 'in_stock',
  featured      boolean not null default false,

  -- Recurring cost of ownership. PoC radios carry a KES 3,000 per device per
  -- year CAK licence renewal. Brief 10.2 requires this ON THE PRODUCT PAGE,
  -- not at checkout — an undisclosed recurring cost discovered after purchase
  -- destroys the trust the rest of the site is built to earn.
  recurring_fee_kes    integer check (recurring_fee_kes is null or recurring_fee_kes >= 0),
  recurring_fee_period text,
  recurring_fee_note   text,

  -- [[NEEDS_VERIFICATION: installation and delivery terms per category]] — V05
  installation_terms text,

  status          content_status not null default 'draft',
  seo_title       text,
  seo_description text,
  seo_image       text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  -- A recurring fee without a period is meaningless to a reader.
  constraint recurring_fee_needs_period
    check (recurring_fee_kes is null or recurring_fee_period is not null)
);
create trigger products_set_updated_at before update on products
  for each row execute function set_updated_at();
alter table products enable row level security;

create index products_status_idx   on products (status);
create index products_category_idx on products (category_id);
create index products_featured_idx on products (featured) where featured;

create table industries (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  name            text not null,
  summary         text,
  body            text,
  hero_image      text,
  sort_order      integer not null default 0,
  status          content_status not null default 'draft',
  seo_title       text,
  seo_description text,
  seo_image       text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create trigger industries_set_updated_at before update on industries
  for each row execute function set_updated_at();
alter table industries enable row level security;

-- ── Relationship rule: no orphan pages (brief 4.3) ──────────────────────────
-- Every solution links to its products and industries; every product links
-- back. These joins are what the "links in AND links out" audit runs against.

create table product_solutions (
  product_id  uuid not null references products  (id) on delete cascade,
  solution_id uuid not null references solutions (id) on delete cascade,
  primary key (product_id, solution_id)
);
alter table product_solutions enable row level security;

create table product_industries (
  product_id  uuid not null references products   (id) on delete cascade,
  industry_id uuid not null references industries (id) on delete cascade,
  primary key (product_id, industry_id)
);
alter table product_industries enable row level security;

create table solution_industries (
  solution_id uuid not null references solutions  (id) on delete cascade,
  industry_id uuid not null references industries (id) on delete cascade,
  primary key (solution_id, industry_id)
);
alter table solution_industries enable row level security;

comment on column products.price_kes is
  'VAT-EXCLUSIVE whole KES. NULL means "Request price" — no Offer schema, no add-to-cart.';
comment on column products.recurring_fee_kes is
  'Recurring cost of ownership, rendered next to the price and carried into the WhatsApp order message.';
