-- 0030  CMS-managed redirects.
--
-- The Sprint 9 criterion is "Slug locks after first save; changing one creates
-- a 301 automatically". The 301 map in next.config.mjs is a static array
-- compiled at build time, which is right for the legacy-site redirects settled
-- in Sprint 2 but cannot serve a redirect an editor creates at 3pm on a
-- Tuesday.
--
-- WHY THIS MATTERS MORE THAN IT LOOKS. CLAUDE.md §12 and §15 both name it: a
-- slug is permanent, and changing one without a redirect silently destroys
-- whatever ranking and inbound links that URL had. The redirect must not depend
-- on somebody remembering to add it — the CMS creates it as part of the rename,
-- which is the only version of this that survives contact with a busy editor.
--
-- `from_path` is unique so a path cannot redirect two ways. There is no
-- constraint preventing a chain (A -> B, then B -> C), because the honest fix
-- for that is to collapse chains when they are created rather than to forbid
-- the second rename.

create table redirects (
  id          uuid primary key default gen_random_uuid(),
  from_path   text not null unique,
  to_path     text not null,
  status_code integer not null default 301 check (status_code in (301, 302, 307, 308)),
  -- What produced it: 'cms' for an automatic slug rename, 'manual' for one an
  -- administrator added deliberately. Kept so a later audit can tell the
  -- difference between a rename and a decision.
  source      text not null default 'cms' check (source in ('cms', 'manual')),
  note        text,
  created_at  timestamptz not null default now()
);
alter table redirects enable row level security;

create index redirects_from_idx on redirects (from_path);

-- Redirect rows are not secret, but they are also not content: they are read by
-- the server, never by a browser. No public view is created, and the anon key
-- therefore cannot read them — consistent with every other operational table.
-- The service role reads them when resolving a request.

comment on table redirects is
  'CMS-managed 301s. A slug rename writes a row here automatically so the old URL keeps working. Static legacy redirects live in next.config.mjs.';
