-- ============================================================================
-- 0004 — Trust assets and operations.
--
-- Three columns in this file are doing COMPLIANCE work rather than
-- data-modelling work, and each exists because of a specific finding:
--
--   certifications.expires_on           three of six registrations have already
--                                       lapsed (V27–V30), and brief 3.5 says
--                                       the site must never display one
--   certifications.scope_note           the KEBS permit is product-scoped, not
--                                       company-scoped (brief 3.5 accuracy trap)
--   *.permission_confirmed              naming or logo-ing a client requires
--                                       that client's permission (V12, V15)
--
-- Each defaults to the safe value, so forgetting to set one hides the record
-- rather than publishing it.
-- ============================================================================

create table branches (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique,
  name       text not null,
  address    text not null,
  town       text not null,
  county     text,
  phones     jsonb not null default '[]'::jsonb,
  maps_url   text,
  hours      text not null default '24/7, Monday–Sunday',
  lat        numeric(9, 6),
  lng        numeric(9, 6),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger branches_set_updated_at before update on branches
  for each row execute function set_updated_at();
alter table branches enable row level security;

comment on table branches is
  'Physical offices ONLY — Nairobi, Mombasa, Nakuru. Never add a coverage town here.';

-- Deliberately a SEPARATE table from branches, not a flag on it. Brief 3.4
-- requires the UI to distinguish a branch from service coverage and forbids
-- implying an office where there is none. Two tables make that structural
-- rather than a rendering convention someone can forget.
create table coverage_locations (
  id         uuid primary key default gen_random_uuid(),
  town       text not null,
  county     text,
  type       coverage_type not null default 'both',
  lat        numeric(9, 6),
  lng        numeric(9, 6),
  active     boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (town)
);
create trigger coverage_locations_set_updated_at before update on coverage_locations
  for each row execute function set_updated_at();
alter table coverage_locations enable row level security;

comment on table coverage_locations is
  'Agents and technicians — NOT offices. Never store or display a count of them.';

create table certifications (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  issuer           text not null,
  description      text,
  reference_number text,
  document_path    text,
  image            text,
  effective_on     date,
  -- NULL means "no expiry recorded", which the public view treats as NOT
  -- displayable. Failing closed is correct here: an unknown expiry on a
  -- regulatory instrument is not evidence that it is current.
  expires_on       date,
  -- Required in practice by the admin, not by the schema, because only some
  -- instruments are scoped. The KEBS permit MUST carry one.
  scope_note       text,
  sort_order       integer not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create trigger certifications_set_updated_at before update on certifications
  for each row execute function set_updated_at();
alter table certifications enable row level security;

create table testimonials (
  id                   uuid primary key default gen_random_uuid(),
  author_name          text not null,
  company              text,
  industry             text,
  quote                text not null,
  logo                 text,
  -- Defaults false. Never invent a testimonial, and never publish a real one
  -- without permission to name the person (V15).
  permission_confirmed boolean not null default false,
  status               content_status not null default 'draft',
  sort_order           integer not null default 0,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);
create trigger testimonials_set_updated_at before update on testimonials
  for each row execute function set_updated_at();
alter table testimonials enable row level security;

create table client_logos (
  id                   uuid primary key default gen_random_uuid(),
  name                 text not null,
  logo_path            text,
  sector               text,
  -- The AGGREGATE claim "70+ corporate clients" is approved. Naming or
  -- logo-ing an INDIVIDUAL client is not, until that client confirms (V12).
  permission_confirmed boolean not null default false,
  permission_requested_at timestamptz,
  sort_order           integer not null default 0,
  notes                text,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);
create trigger client_logos_set_updated_at before update on client_logos
  for each row execute function set_updated_at();
alter table client_logos enable row level security;

create table downloads (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  title          text not null,
  description    text,
  file_path      text,
  file_type      text,
  file_size      bigint,
  category       text,
  thumbnail      text,
  document_date  date,
  version        text,
  download_count integer not null default 0,

  -- Defaults FALSE and may only be set by a human. Uploading a file must not
  -- make it downloadable. All four prepared PDFs are currently blocked on
  -- content grounds — retired addresses, the unpublished number, retired
  -- product names, unsubstantiated claims.
  cleared_for_publication boolean not null default false,
  cleared_by              uuid references profiles (id) on delete set null,
  cleared_at              timestamptz,

  status     content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Clearance must be attributable. An unattributed clearance is not one.
  constraint clearance_is_attributable
    check (not cleared_for_publication or (cleared_by is not null and cleared_at is not null))
);
create trigger downloads_set_updated_at before update on downloads
  for each row execute function set_updated_at();
alter table downloads enable row level security;

comment on column downloads.cleared_for_publication is
  'Human-only gate. Brief 9.4: never publish a document not supplied — and never one not cleared.';
