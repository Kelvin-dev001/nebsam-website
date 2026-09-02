-- ============================================================================
-- 0005 — Orders, order items, and the payment tables that are PREPARED BUT
--        NOT BUILT.
--
-- WhatsApp is the checkout. There is no online payment in this build
-- (brief PART 10). The schema is prepared for M-Pesa/card so that adding a
-- provider later does not require touching the cart, product or order UI.
-- ============================================================================

create table orders (
  id           uuid primary key default gen_random_uuid(),
  -- NBS-YYMMDD-XXXX. XXXX is RANDOM, not sequential: /orders/[orderNumber] is
  -- reachable by anyone holding the number, so it is a bearer token and must be
  -- unguessable.
  order_number text not null unique,
  status       order_status not null default 'new',

  customer_name  text,
  customer_phone text,
  customer_town  text,

  fulfilment_type text check (fulfilment_type in ('installation', 'pickup')),
  branch_id       uuid references branches (id) on delete set null,

  -- VAT-EXCLUSIVE, recomputed SERVER-SIDE from the database at order creation.
  -- A client-supplied total is never trusted (brief 10.2).
  subtotal_kes integer not null default 0 check (subtotal_kes >= 0),
  -- The rate at the time of order. The current rate is itself unconfirmed (V06)
  -- and rates change; an order must record what was actually quoted.
  vat_rate_snapshot numeric(5, 4),

  -- Set when the wa.me link is handed to the client. The ROW IS CREATED FIRST:
  -- brief 10.2 calls this the single most important detail in the shop, because
  -- a dropped chat must still be a recorded lead.
  whatsapp_sent_at timestamptz,

  notes      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger orders_set_updated_at before update on orders
  for each row execute function set_updated_at();
alter table orders enable row level security;

create index orders_status_idx  on orders (status, created_at desc);
create index orders_created_idx on orders (created_at desc);

create table order_items (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references orders (id) on delete cascade,
  product_id uuid references products (id) on delete set null,

  -- SNAPSHOTS. An order records what the customer was SHOWN, not what the
  -- product record says today. A price change six months later must not
  -- rewrite history — and the recurring fee matters just as much, because it
  -- was part of what was agreed.
  name_snapshot          text not null,
  unit_price_snapshot    integer not null check (unit_price_snapshot >= 0),
  recurring_fee_snapshot integer check (recurring_fee_snapshot is null or recurring_fee_snapshot >= 0),
  recurring_fee_period_snapshot text,

  qty        integer not null check (qty > 0),
  created_at timestamptz not null default now()
);
alter table order_items enable row level security;

create index order_items_order_idx on order_items (order_id);

-- ── Submissions inbox ───────────────────────────────────────────────────────
create table submissions (
  id           uuid primary key default gen_random_uuid(),
  type         submission_type not null,
  payload      jsonb not null default '{}'::jsonb,
  -- The anonymous option on /support/suggestions is a genuine choice: an
  -- anonymous row must not be linkable to a person.
  is_anonymous boolean not null default false,
  status       text not null default 'new',
  assigned_to  uuid references profiles (id) on delete set null,
  notes        text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create trigger submissions_set_updated_at before update on submissions
  for each row execute function set_updated_at();
alter table submissions enable row level security;

create index submissions_type_status_idx on submissions (type, status, created_at desc);

-- ============================================================================
-- PREPARED BUT NOT BUILT — brief 10.3.
--
-- No code writes to these in this build. They exist so that adding M-Pesa
-- Daraja later is a new implementation of the PaymentProvider interface and a
-- new row here, and nothing more.
-- ============================================================================

create table payments (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references orders (id) on delete cascade,
  provider   text not null,
  amount_kes integer not null check (amount_kes >= 0),
  status     text not null default 'pending',
  reference  text,
  created_at timestamptz not null default now()
);
alter table payments enable row level security;

create table payment_intents (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references orders (id) on delete cascade,
  provider   text not null,
  payload    jsonb not null default '{}'::jsonb,
  status     text not null default 'created',
  created_at timestamptz not null default now()
);
alter table payment_intents enable row level security;

create table shipments (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references orders (id) on delete cascade,
  carrier      text,
  tracking_ref text,
  status       text not null default 'pending',
  created_at   timestamptz not null default now()
);
alter table shipments enable row level security;

comment on table payments is 'PREPARED, NOT BUILT. WhatsApp is the checkout in this build (brief PART 10).';
