-- ============================================================================
-- 0001 — Extensions, enums, profiles, and the RLS baseline.
--
-- Brief PART 12 and docs/DATABASE_ARCHITECTURE.md.
--
-- Every migration in this project is a reviewed file. Schema is NEVER mutated
-- outside a migration.
--
-- RLS is enabled on every table as it is created. A table with RLS on and no
-- policy denies everything, which is the safe default this project relies on:
-- forgetting a policy fails closed, not open. Policies land in 0008, after all
-- tables exist, so they can reference each other.
-- ============================================================================

create extension if not exists "pgcrypto";      -- gen_random_uuid, hmac, digest
create extension if not exists "pg_trgm";       -- search on names/slugs later

-- ── Shared enums ────────────────────────────────────────────────────────────
create type user_role as enum ('admin', 'editor', 'sales', 'viewer');
create type content_status as enum ('draft', 'in_review', 'published');
create type order_status as enum (
  'new', 'contacted', 'confirmed', 'installed', 'closed', 'cancelled'
);
create type submission_type as enum (
  'contact', 'quote', 'demo', 'installation', 'suggestion'
);
create type coverage_type as enum ('agent', 'technician', 'both');
create type availability_status as enum ('in_stock', 'out_of_stock', 'pre_order');
create type verification_outcome as enum (
  'valid', 'expired', 'not_found', 'factor_failed'
);

-- ── Reusable updated_at trigger ─────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── profiles ────────────────────────────────────────────────────────────────
-- One row per authenticated staff user. `role` is the authority for every
-- policy in 0008 — it is enforced in RLS, never merely hidden in the UI.
create table profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null,
  full_name   text,
  role        user_role not null default 'viewer',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on profiles
  for each row execute function set_updated_at();

alter table profiles enable row level security;

-- ── Role helpers ────────────────────────────────────────────────────────────
-- SECURITY DEFINER so a policy can read the caller's role without that read
-- itself being subject to the policy it is evaluating (which would recurse).
-- search_path is pinned: a SECURITY DEFINER function with a mutable
-- search_path is a privilege-escalation vector.
create or replace function current_role_name()
returns user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from profiles where id = auth.uid();
$$;

create or replace function is_staff(min_role user_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select case current_role_name()
    when 'admin'  then true
    when 'editor' then min_role in ('editor', 'sales', 'viewer')
    when 'sales'  then min_role in ('sales', 'viewer')
    when 'viewer' then min_role = 'viewer'
    else false
  end;
$$;

comment on function is_staff is
  'Role gate for RLS. admin > editor > sales > viewer. Returns false for anon.';
