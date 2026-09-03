-- 0031  Close a grant gap that widens with every future migration.
--
-- WHAT WENT WRONG. Migration 0008 ends with:
--
--     revoke all on all tables in schema public from anon;
--
-- That is a ONE-TIME statement. It revokes from the tables that existed when it
-- ran, and has no effect on any table created afterwards. `redirects` (0030)
-- was the first table added after 0008, and it therefore kept Supabase's
-- default SELECT grant to `anon`.
--
-- HOW BAD WAS IT. Not a data leak: RLS is enabled on `redirects` with no
-- policy, so `anon` received an empty result rather than rows, and writes were
-- refused with 42501. Verified both. But it was a real difference in posture —
-- every other table answers `anon` with "permission denied", and this one
-- answered with an empty set. Defence in depth means the grant should not be
-- there to be relied on.
--
-- HOW IT WAS FOUND. `npm run verify:db` flagged it the moment `redirects` was
-- added to its table list — "LEAK — anon can READ base table(s): redirects".
-- That check was written in Sprint 3 precisely because a static read of the SQL
-- cannot see a grant the platform adds by default.
--
-- THE FIX IS IN TWO PARTS, and the second is the important one:
--   1. Revoke on everything that exists now, which covers `redirects`.
--   2. ALTER DEFAULT PRIVILEGES, so a table created by a future migration is
--      born without the grant instead of needing to be remembered.
--
-- Without part 2 this same gap reopens on the next `create table`, and the next
-- person to notice would be whoever adds a table holding something that matters.

revoke all on all tables in schema public from anon;
revoke all on all sequences in schema public from anon;
revoke all on all functions in schema public from anon;

-- Future objects. `postgres` is the role migrations run as, so this covers
-- anything `supabase db push` creates from here on.
alter default privileges in schema public revoke all on tables from anon;
alter default privileges in schema public revoke all on sequences from anon;
alter default privileges in schema public revoke all on functions from anon;

-- The public views are the ONLY public read surface and must keep their grant,
-- which the blanket revoke above has just removed. Re-granting explicitly is
-- deliberate: it means the set of things `anon` can read is written down in one
-- place rather than being whatever the default happened to allow.
grant select on
  public_solutions, public_products, public_product_categories, public_industries,
  public_blog_posts, public_blog_categories, public_authors, public_faqs,
  public_certifications, public_testimonials, public_client_logos, public_downloads,
  public_branches, public_coverage_locations,
  public_product_solutions, public_product_industries, public_solution_industries
to anon, authenticated;
