-- 0012  Structured prose sections for solution pages.
--
-- WHY A COLUMN RATHER THAN MARKDOWN IN `body`
--
-- The solution page model is ELEVEN FIXED SECTIONS in a fixed order (brief 9.4
-- / CONTENT_ARCHITECTURE §1.1). Because the shape is known, it can be typed,
-- and typing it buys three things a markdown or HTML blob does not:
--
--   1. No renderer dependency. Markdown or sanitised HTML would each add a
--      runtime library to a route budget of 180 KB gzipped, for an audience on
--      metered mobile data.
--   2. The design system holds. CMS_ARCHITECTURE §3 asks for "rich text with a
--      constrained toolbar — no arbitrary HTML", precisely so an editor cannot
--      break the tokens one page at a time. Named sections rendered by the
--      template make that structural rather than a matter of editor discipline.
--   3. The Sprint 11 admin becomes per-section fields, which a non-technical
--      editor can fill in confidently, instead of one freeform box that invites
--      a wall of pasted deck copy.
--
-- WHAT IS *NOT* IN HERE. Only the prose sections. The rest of the eleven are
-- already modelled and must not be duplicated into JSON, or they will drift:
--
--   6  Hardware options  -> product_solutions join
--   8  Coverage          -> branches + coverage_locations
--   9  FAQs              -> faqs where scope = 'solution'
--   10 Related           -> the join tables
--   11 Conversion block  -> the template
--
-- SHAPE (all keys optional; a missing section simply does not render):
--
--   {
--     "what_it_is":           ["paragraph", ...],
--     "problem":              ["paragraph", ...],
--     "who_its_for":          [{ "label": "...", "detail": "..." }, ...],
--     "how_it_works":         [{ "title": "...", "detail": "..." }, ...],
--     "what_you_get":         [{ "group": "...",
--                                "items": [{ "title": "...", "detail": "..." }] }, ...],
--     "installation_support": ["paragraph", ...]
--   }
--
-- `body` is kept, unused for now, rather than dropped: it is referenced by the
-- generated types and by the access layer, and removing a column is the kind of
-- irreversible change that should not ride along with an additive one.

alter table solutions
  add column if not exists sections jsonb not null default '{}'::jsonb;

-- An object, never an array or a bare scalar. Cheap to enforce, and it stops a
-- malformed import from reaching the template as something it cannot render.
alter table solutions
  add constraint solutions_sections_is_object
  check (jsonb_typeof(sections) = 'object');

comment on column solutions.sections is
  'Structured prose for the eleven-section solution model. Keys: what_it_is, problem, who_its_for, how_it_works, what_you_get, installation_support. Hardware, coverage, FAQs and related come from their own tables.';

-- The public view selects explicit columns, so it has to be recreated to carry
-- the new one. Dropped and recreated rather than altered: Postgres will not add
-- a column to an existing view definition.
drop view if exists public_solutions;

create view public_solutions as
  select id, slug, name, summary, body, sections, hero_image, sort_order,
         last_reviewed_at, seo_title, seo_description, seo_image, updated_at
  from solutions
  where status = 'published';

-- Recreating the view drops its grants with it. Restoring them is not optional:
-- without this the anon key gets "permission denied for view public_solutions"
-- and every solution page renders empty.
grant select on public_solutions to anon, authenticated;
