-- ============================================================================
-- 0008 — Row Level Security policies. Applied last so they can reference every
--        table.
--
-- THE MODEL, in one paragraph:
--
--   The anon key gets NO policy on any base table. Public reading happens
--   exclusively through the read-only views in 0009, which expose published
--   rows and public columns only. Writes go through server actions using the
--   service-role key, which bypasses RLS by design and is never shipped to a
--   client. So the policies below govern AUTHENTICATED STAFF, and the absence
--   of an anon policy is what protects everything else.
--
-- Every table had RLS enabled at creation. A table with RLS on and no matching
-- policy denies everything — forgetting a policy fails CLOSED, not open. That
-- is deliberate and it is the reason this file grants narrowly rather than
-- revoking broadly.
--
-- Roles: admin > editor > sales > viewer, resolved by is_staff() from 0001.
-- ============================================================================

-- ── profiles ────────────────────────────────────────────────────────────────
-- A user may read their own row. Admins may read and manage all.
create policy profiles_self_select on profiles
  for select to authenticated
  using (id = auth.uid());

create policy profiles_admin_select on profiles
  for select to authenticated
  using (is_staff('admin'));

create policy profiles_admin_write on profiles
  for all to authenticated
  using (is_staff('admin'))
  with check (is_staff('admin'));

-- ── Content: editors and above ──────────────────────────────────────────────
-- Staff read drafts too, which is what makes preview-before-publish work.
do $$
declare
  t text;
begin
  foreach t in array array[
    'solutions', 'products', 'product_categories', 'industries',
    'product_solutions', 'product_industries', 'solution_industries',
    'blog_posts', 'blog_categories', 'authors', 'blog_post_revisions', 'faqs'
  ]
  loop
    execute format(
      'create policy %1$s_staff_read on %1$s for select to authenticated using (is_staff(''viewer''))', t
    );
    execute format(
      'create policy %1$s_editor_write on %1$s for all to authenticated
         using (is_staff(''editor'')) with check (is_staff(''editor''))', t
    );
  end loop;
end;
$$;

-- ── Trust and operations ────────────────────────────────────────────────────
-- Readable by any staff member; writable by admin only. These carry the
-- permission and clearance flags, so a wrong write here publishes something
-- that must not be published.
do $$
declare
  t text;
begin
  foreach t in array array[
    'branches', 'coverage_locations', 'certifications',
    'testimonials', 'client_logos', 'downloads'
  ]
  loop
    execute format(
      'create policy %1$s_staff_read on %1$s for select to authenticated using (is_staff(''viewer''))', t
    );
    execute format(
      'create policy %1$s_admin_write on %1$s for all to authenticated
         using (is_staff(''admin'')) with check (is_staff(''admin''))', t
    );
  end loop;
end;
$$;

-- Editors may maintain download metadata, but NOT the clearance gate.
-- The gate is admin-only and is additionally attributable by the CHECK
-- constraint in 0004.
create policy downloads_editor_write on downloads
  for update to authenticated
  using (is_staff('editor'))
  with check (is_staff('editor') and cleared_for_publication = false);

-- ── Commerce: sales and above ───────────────────────────────────────────────
do $$
declare
  t text;
begin
  foreach t in array array['orders', 'order_items', 'submissions']
  loop
    execute format(
      'create policy %1$s_sales_read on %1$s for select to authenticated using (is_staff(''sales''))', t
    );
    execute format(
      'create policy %1$s_sales_write on %1$s for all to authenticated
         using (is_staff(''sales'')) with check (is_staff(''sales''))', t
    );
  end loop;
end;
$$;

-- Prepared-but-unused payment tables: admin only, so an accidental write is
-- impossible before the flow is actually designed.
do $$
declare
  t text;
begin
  foreach t in array array['payments', 'payment_intents', 'shipments']
  loop
    execute format(
      'create policy %1$s_admin_all on %1$s for all to authenticated
         using (is_staff(''admin'')) with check (is_staff(''admin''))', t
    );
  end loop;
end;
$$;

-- ── Verification: the tightest surface on the project ───────────────────────
--
-- NOTE WHAT IS ABSENT. There is no SELECT policy for `authenticated` on
-- installation_certificates. Not for admin, not for anyone. The lookup runs
-- server-side under the service-role key, and no browser session — staff or
-- otherwise — can read this table or page through it. Admin management happens
-- through server actions that audit what they did.
create policy installation_certificates_admin_write on installation_certificates
  for all to authenticated
  using (is_staff('admin'))
  with check (is_staff('admin'));

create policy installation_plates_restricted_admin on installation_plates_restricted
  for all to authenticated
  using (is_staff('admin'))
  with check (is_staff('admin'));

-- Admins may READ the attempt log to investigate a spike. Nobody may edit it —
-- the write path is the server action, under service-role.
create policy verification_attempts_admin_read on verification_attempts
  for select to authenticated
  using (is_staff('admin'));

-- ── Media ───────────────────────────────────────────────────────────────────
create policy media_staff_read on media
  for select to authenticated
  using (is_staff('viewer'));

create policy media_editor_write on media
  for all to authenticated
  using (is_staff('editor'))
  with check (is_staff('editor'));

-- ── Audit log: read-only, admin only ────────────────────────────────────────
-- ONLY a select policy exists. No insert policy either: the log is written
-- server-side under service-role, so a staff session cannot forge an entry.
-- No update or delete policy exists for anyone, and the triggers in 0007
-- reject those operations even if a future migration adds one by mistake.
create policy audit_log_admin_read on audit_log
  for select to authenticated
  using (is_staff('admin'));

-- ── Belt and braces on the anon role ────────────────────────────────────────
-- No anon policy is defined anywhere above, so anon is already denied. This
-- makes it explicit and survives someone later adding a permissive policy
-- without thinking about the anon case.
revoke all on all tables in schema public from anon;
revoke all on all sequences in schema public from anon;
revoke all on all functions in schema public from anon;
