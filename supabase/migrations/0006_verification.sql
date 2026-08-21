-- ============================================================================
-- 0006 — Certificate verification. SECURITY-CRITICAL.
--
-- Brief PART 9.2. Read that before changing anything in this file.
--
-- THE THREAT. Customers look up their installation by vehicle number plate,
-- which is the right UX call — nobody remembers a certificate number, everybody
-- knows their plate. But a plate is PUBLIC INFORMATION visible on every vehicle
-- on the road, so a plate-only lookup that returns validity or expiry becomes:
--
--   1. a target list for vehicle thieves — it discloses which vehicles carry an
--      installation and, far worse, which installations have EXPIRED. An
--      expired record identifies a vehicle whose owner believes it is protected
--      and whose protection has lapsed.
--   2. a customer list for competitors — plate ranges are cheap to enumerate.
--   3. a disclosure of personal data — a registration linked to a named service
--      relationship is personal data under the DPA 2019, and Nebsam is a
--      registered data controller.
--
-- THE DESIGN. Option A: plate + last 4 digits of the registered phone.
-- V03 is still open; Option B (plate + OTP) changes the second factor only and
-- does not alter this schema.
--
-- NO PLAINTEXT PLATE IS STORED HERE. Normalise (uppercase, strip spaces and
-- hyphens, canonicalise O/0), then HMAC-SHA256 with CERT_PLATE_HMAC_SECRET —
-- a server-only secret — and index on the digest. A database leak then yields
-- no usable plate list.
-- ============================================================================

create table installation_certificates (
  id uuid primary key default gen_random_uuid(),

  -- HMAC-SHA256 of the NORMALISED plate. Never the plate itself.
  plate_hash bytea not null,
  -- HMAC of the last 4 digits of the registered phone, same key domain.
  phone_last4_hash bytea not null,

  -- Last 4 of the certificate number only. Enough for a support call to
  -- disambiguate, useless for enumeration.
  certificate_number_last4 text check (certificate_number_last4 is null
                                       or certificate_number_last4 ~ '^[0-9A-Za-z]{4}$'),

  installed_on date,
  expires_on   date,
  status       text not null default 'active',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- One certificate per vehicle. Also makes the lookup a single index probe.
  unique (plate_hash)
);
create trigger installation_certificates_set_updated_at
  before update on installation_certificates
  for each row execute function set_updated_at();
alter table installation_certificates enable row level security;

create index installation_certificates_plate_hash_idx
  on installation_certificates (plate_hash);

comment on table installation_certificates is
  'NEVER queried from the client. Server action only. No plaintext plate — see brief PART 9.2.';
comment on column installation_certificates.plate_hash is
  'HMAC-SHA256 of the normalised plate. Rotating CERT_PLATE_HMAC_SECRET invalidates this index and requires a planned re-hash migration.';

-- ── Restricted operational plate store ──────────────────────────────────────
-- Where operations genuinely need a plaintext plate, it lives HERE, in a
-- separate table with its own policy, and is NEVER joined into the public
-- lookup path. Admin-only, and the only thing that makes a secret rotation
-- recoverable.
create table installation_plates_restricted (
  certificate_id uuid primary key
                 references installation_certificates (id) on delete cascade,
  plate_plaintext text not null,
  phone_plaintext text,
  created_at      timestamptz not null default now()
);
alter table installation_plates_restricted enable row level security;

comment on table installation_plates_restricted is
  'Admin-only. Separate from the lookup path by design. Required to re-hash after a secret rotation.';

-- ── Attempt log ─────────────────────────────────────────────────────────────
-- Brief 9.2: log every attempt and surface a spike alert in admin. An
-- enumeration attack looks like ordinary traffic; you only see it if you are
-- counting. Both the IP and the plate are hashed — the log itself must not
-- become the leak.
create table verification_attempts (
  id         uuid primary key default gen_random_uuid(),
  ip_hash    bytea,
  plate_hash bytea,
  outcome    verification_outcome not null,
  created_at timestamptz not null default now()
);
alter table verification_attempts enable row level security;

create index verification_attempts_created_idx on verification_attempts (created_at desc);
create index verification_attempts_ip_idx      on verification_attempts (ip_hash, created_at desc);
create index verification_attempts_plate_idx   on verification_attempts (plate_hash, created_at desc);

-- Rate-limit support: counts for the escalating backoff in brief 9.2.
-- SECURITY DEFINER so the server action can count without exposing the table.
create or replace function verification_attempt_counts(
  p_ip_hash bytea,
  p_plate_hash bytea
)
returns table (ip_last_hour bigint, plate_last_day bigint)
language sql
stable
security definer
set search_path = public
as $$
  select
    (select count(*) from verification_attempts
      where ip_hash = p_ip_hash and created_at > now() - interval '1 hour'),
    (select count(*) from verification_attempts
      where plate_hash = p_plate_hash and created_at > now() - interval '1 day');
$$;

comment on function verification_attempt_counts is
  'Feeds the per-IP and per-plate rate limits. Plate-space enumeration is cheap; make it expensive.';
