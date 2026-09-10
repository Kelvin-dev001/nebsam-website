-- ============================================================================
-- 0041 — submission_attempts: rate limiting for the four public enquiry forms.
--
-- REGISTER ITEM V58. Proposed in the Sprint 11 report §6, approved by the
-- client on 10 September 2026 before this file was written, per CLAUDE.md §3.5.
--
-- ── What this replaces, and why it was wrong ────────────────────────────────
--
-- Sprint 11 counted prior submissions by a keyed IP hash stored inside
-- `submissions.payload` jsonb, because a new table is a data-model change and
-- those need approval first. It worked. It was the wrong shape for two reasons,
-- and only the second is serious:
--
--   1. The counter shared a table with the content it counts. Deleting a
--      handled enquiry — which an inbox exists to let staff do — silently
--      reduced that sender's rate-limit count. The limiter got weaker the more
--      diligently the inbox was worked.
--
--   2. AN ANONYMOUS SUGGESTION STORED NO HASH AT ALL. Deliberately: an
--      anonymous row must not be linkable to a person, and a hash sitting in the
--      row is a join key waiting to be used. The cost was that the one form most
--      likely to attract abuse was the one form with no rate limit behind it —
--      defended by Turnstile alone, which register item V56 records as wired but
--      unproven because no keys have been supplied.
--
-- A separate table fixes both at once. The attempt is recorded HERE and the
-- content is recorded THERE, with no column joining them, so an anonymous
-- submission can be rate limited without becoming attributable. That is the
-- whole argument for the table, and it is the same argument that put
-- `verification_attempts` beside `installation_certificates` in 0006.
--
-- ── What is NOT stored ──────────────────────────────────────────────────────
--
-- No IP in the clear, no user agent, no referrer, no submission id, no
-- reference. A row here says "someone behind this keyed digest posted a form of
-- this kind at this time" and nothing else. Reversing the digest needs
-- CERT_PLATE_HMAC_SECRET, which is server-only; the digest is keyed rather than
-- plain for the reason 0006 gives — IPv4 is a 32-bit space and a bare digest of
-- one is trivially enumerated.
-- ============================================================================

create table submission_attempts (
  id uuid primary key default gen_random_uuid(),

  -- HMAC of the client IP, in the same key domain as verification_attempts but
  -- under a different prefix, so a submission hash can never be compared
  -- against a verification hash to link one person's actions across the two.
  ip_hash bytea not null,

  -- Which form. Reuses the existing enum rather than a free-text column, so a
  -- typo cannot create a silent fifth bucket that is never counted.
  kind submission_type not null,

  -- Whether the attempt was refused. A refused attempt is STILL LOGGED, which
  -- is what produces escalating backoff without a penalty counter or a timer:
  -- a client that keeps posting keeps feeding the trailing window it is being
  -- measured against, so the lockout runs from its last attempt rather than its
  -- fifth. Same property as migration 0039 on the verification side, and it
  -- disappears silently if a refusal is ever logged as an ordinary attempt.
  refused boolean not null default false,

  created_at timestamptz not null default now()
);

alter table submission_attempts enable row level security;

-- The only query this table serves: "how many from this digest since then".
create index submission_attempts_ip_idx
  on submission_attempts (ip_hash, created_at desc);
-- Supports retention pruning and the admin's abuse view.
create index submission_attempts_created_idx
  on submission_attempts (created_at desc);

comment on table submission_attempts is
  'Rate limiting for the four public enquiry forms. Register item V58. Holds NO link to submissions — that is the point: an anonymous suggestion is rate limited without becoming attributable.';
comment on column submission_attempts.ip_hash is
  'HMAC of the client IP under the submission-ip prefix. Never the address itself.';
comment on column submission_attempts.refused is
  'A refused attempt is logged too. That is what makes the backoff escalate.';

-- ── RLS ─────────────────────────────────────────────────────────────────────
-- Sales and above may READ, to investigate a form being hammered. Nobody may
-- write from a session: the write path is the server action under service-role,
-- exactly as verification_attempts works. No anon policy exists anywhere here,
-- so anon is denied by default; 0031's revoke is repeated below because a new
-- table does not inherit the earlier one.
create policy submission_attempts_sales_read on submission_attempts
  for select to authenticated
  using (is_staff('sales'));

revoke all on table submission_attempts from anon;

-- ── Retention ───────────────────────────────────────────────────────────────
-- Nothing here is useful after a day, and CLAUDE.md §10 says no PII sits around
-- longer than it must. A keyed IP digest is not PII in the clear, but it is a
-- pseudonymous identifier under the DPA 2019, and keeping one for a year to
-- enforce an hourly limit is indefensible.
--
-- Called by the server action rather than by a scheduler: pg_cron is an
-- extension this project has not adopted, and adding one is a dependency
-- decision (CLAUDE.md §3.5). Deleting on write costs one cheap indexed delete
-- on a table that stays small, and it cannot silently stop running the way a
-- scheduled job can.
create or replace function prune_submission_attempts()
returns void
language sql
security definer
set search_path = public
as $$
  delete from submission_attempts where created_at < now() - interval '24 hours';
$$;

comment on function prune_submission_attempts is
  'Retention. Called from the enquiry server action, not from a scheduler — pg_cron is not adopted on this project.';
