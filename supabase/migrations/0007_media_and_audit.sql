-- ============================================================================
-- 0007 — Media library and the audit log.
-- ============================================================================

create table media (
  id     uuid primary key default gen_random_uuid(),
  path   text not null unique,

  -- NOT NULL at the DATABASE level, on purpose. Brief 11.1 makes alt text
  -- required; a nullable column with a "required" form field is a rule that
  -- lasts until the first hurried upload.
  alt_text text not null check (length(trim(alt_text)) > 0),

  width       integer,
  height      integer,
  bytes       bigint,
  mime        text,
  uploaded_by uuid references profiles (id) on delete set null,

  -- Brief 3.6: treat every supplied screenshot as suspect until checked for
  -- plates, names, faces, coordinates and device IDs. The upload moment is the
  -- only point where that check reliably happens, so the answer is recorded.
  privacy_checked   boolean not null default false,
  privacy_check_note text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger media_set_updated_at before update on media
  for each row execute function set_updated_at();
alter table media enable row level security;

comment on column media.alt_text is
  'Required at the database level. Written for a human, never "image".';

-- ── Audit log ───────────────────────────────────────────────────────────────
-- APPEND-ONLY. No update or delete policy exists for anyone, including admin —
-- a log an administrator can edit is not a log. Enforced twice: by the absence
-- of policies in 0008, and by the triggers below, so a future migration that
-- adds a policy by mistake still cannot mutate history.
create table audit_log (
  id        uuid primary key default gen_random_uuid(),
  actor_id  uuid references profiles (id) on delete set null,
  action    text not null,
  entity    text not null,
  entity_id uuid,
  diff      jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table audit_log enable row level security;

create index audit_log_created_idx on audit_log (created_at desc);
create index audit_log_entity_idx  on audit_log (entity, entity_id);

create or replace function reject_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception 'audit_log is append-only';
end;
$$;

create trigger audit_log_no_update
  before update on audit_log
  for each row execute function reject_mutation();

create trigger audit_log_no_delete
  before delete on audit_log
  for each row execute function reject_mutation();

comment on table audit_log is
  'Append-only. Every admin create/update/delete. Protected by triggers as well as by the absence of policies.';
