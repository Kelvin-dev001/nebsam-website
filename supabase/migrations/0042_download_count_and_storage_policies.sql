-- ============================================================================
-- 0042 — The download counter, and storage policies for the uploads bucket.
--
-- Two small things Sprint 12 needs, neither of which changes a table.
-- ============================================================================

-- ── The download counter ────────────────────────────────────────────────────
--
-- `downloads.download_count` has existed since 0004 and nothing has ever
-- incremented it. Brief PART 9.4 wants the count surfaced in admin so staff can
-- see which documents are actually wanted.
--
-- WHY A FUNCTION AND NOT AN UPDATE. PostgREST cannot express
-- `count = count + 1` — it sends a literal value — so the route would have to
-- read the current count and write it back. Two people downloading the same
-- brochure in the same second would then both read 41 and both write 42, and
-- the count would drift downward from reality forever. One statement in the
-- database cannot lose a count.
--
-- SECURITY DEFINER because the caller is anonymous. It is scoped as tightly as
-- a function can be: it takes an id, it can only ever add one to one integer
-- column on one table, and it returns nothing. It cannot be used to read a row,
-- and it cannot set a count to an arbitrary value.
--
-- It deliberately does NOT check whether the download is published and cleared.
-- The route already reads through `public_downloads`, which enforces both, and
-- duplicating the condition here would mean two places to keep in step. The
-- worst an attacker achieves by calling this directly with a guessed uuid is
-- inflating a vanity metric.
create or replace function increment_download_count(p_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update downloads set download_count = download_count + 1 where id = p_id;
$$;

revoke all on function increment_download_count(uuid) from public;
grant execute on function increment_download_count(uuid) to anon, authenticated;

comment on function increment_download_count is
  'Atomic +1 on downloads.download_count. A read-then-write from the route would lose concurrent counts.';

-- ── Storage policies for the private `uploads` bucket ───────────────────────
--
-- The bucket is created by `npm run storage:init`, which sets public=false, the
-- 8 MB size cap and the MIME allowlist. That makes it unreadable WITHOUT a
-- signed URL, which is the property the upload design rests on.
--
-- These policies are belt and braces on top of it. `storage.objects` has RLS
-- enabled by Supabase, and with no policy at all the `anon` and `authenticated`
-- roles can do nothing — which is already correct. What is added here is one
-- explicit read policy for staff, so a future developer reaching for the
-- storage API from a session-bound client is not mystified, and so the
-- intention is recorded in SQL rather than only in a script.
--
-- NOTE WHAT IS ABSENT. There is no insert, update or delete policy for any
-- role. Every write goes through a server action under the service-role key,
-- after the byte-level checks in `lib/admin/uploads.ts`. A staff session cannot
-- put an object in this bucket directly, which means the sniffing cannot be
-- bypassed by talking to the storage API instead of the form.
do $$
begin
  if exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'uploads_staff_read'
  ) then
    drop policy uploads_staff_read on storage.objects;
  end if;

  create policy uploads_staff_read on storage.objects
    for select to authenticated
    using (bucket_id = 'uploads' and is_staff('viewer'));
exception
  -- Some Supabase projects do not grant the migration role ownership of
  -- storage.objects. The bucket's own `public = false` flag is what actually
  -- denies access, so a failure here is a missing convenience rather than a
  -- missing control, and it must not stop the migration.
  when insufficient_privilege then
    raise notice 'storage.objects policy skipped — insufficient privilege. The bucket is private regardless.';
end;
$$;
