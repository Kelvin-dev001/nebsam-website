-- 0034  The four prepared documents, seeded as NOT CLEARED.
--
-- ── Why seed rows that cannot be published ───────────────────────────────────
-- Because the clearance gate is only proven by a row that it blocks. An empty
-- `downloads` table and a working gate are indistinguishable from an empty
-- table and a broken one. After this migration the table holds four rows and
-- `/resources/downloads` shows none of them, which is the behaviour brief 9.4
-- asks for, demonstrated rather than asserted.
--
-- The gate is `public_downloads` (migration 0009):
--     where status = 'published' and cleared_for_publication
-- Both conditions, in the view. Every one of these rows fails both.
--
-- ── Why none of them is cleared ──────────────────────────────────────────────
-- Recorded in full in content-source/06-downloads/README.md. In summary, and
-- deliberately without reproducing any of the offending strings here:
--
--   1. Fuel monitoring proposal — carries the unpublished phone number and two
--      retired addresses, third-party platform branding in the dashboard
--      screenshots (V13), an unsubstantiated vendor claim about fuel theft, and
--      a list naming roughly 70 corporate clients whose permission is not held
--      (V12).
--   2. Vehicle tracking & security brochure — two retired product names
--      throughout, the wrong tagline, and a source file that declared
--      AI-generated content which has not been identified (brief PART 18).
--   3. Radio communication proposal — retired addresses in every page footer,
--      and an unpublishable range claim on page 2.
--   4. School bus solution — the highest legal sensitivity on the project:
--      children's personal data, optionally children's biometric data, and
--      driver alcohol screening. Eight open register items (V17-V24), an
--      undeclared AI-generated content flag, and no date or version.
--
-- A fifth document, the video telematics proposal, is NOT seeded because it is
-- not in the repository. It is register item V14 and carries the worst privacy
-- exposure on the project — customer plates, coordinates, device IDs and two
-- identifiable faces. It must be treated as NOT CLEARED on arrival.
--
-- ── file_path is NULL on purpose ─────────────────────────────────────────────
-- There is no storage bucket yet; uploads are Sprint 12. A path pointing at
-- nothing would be a broken download waiting for the day a row is cleared, so
-- the column stays null and the page renders no link when it is. Sizes are the
-- real post-compression byte counts of the prepared files, so the "size before
-- the click" requirement is exercised with true values the day clearance lands.
--
-- ── document_date is NULL on purpose ─────────────────────────────────────────
-- Two of the four are undated and two carry a year with no month or day. A date
-- column cannot hold "2023", and inventing 1 January would be fabricating a
-- fact about a document. Carrying a date and a version is itself one of the
-- clearance conditions, so null here is the accurate record of a failure, not
-- an omission to tidy up later.

insert into downloads
  (slug, title, description, file_path, file_type, file_size, category,
   document_date, version, cleared_for_publication, status)
values

('fuel-monitoring-solution-proposal',
 'Nebsam Fuel Monitoring Solution',
 'Nine-page proposal covering how the system works, its functions, the dashboard, four report types and five alert types.',
 null, 'application/pdf', 542163, 'Proposals',
 null, null, false, 'draft'),

('vehicle-tracking-and-security-brochure',
 'Nebsam Vehicle Tracking & Security Brochure',
 'Two-page product brochure covering the Hybrid Dashcam, Hybrid Car Alarm, Hybrid Tracker, Standard Tracker and Recovery Tracker.',
 null, 'application/pdf', 535176, 'Brochures',
 null, null, false, 'draft'),

('radio-communication-proposal',
 'Nebsam Radio Communication Proposal',
 'Twenty-eight page document covering long-range PoC radios, the convergence gateway and short-range radios.',
 null, 'application/pdf', 1803068, 'Proposals',
 null, null, false, 'draft'),

('school-bus-solution',
 'Nebsam School Bus Solution',
 'Twenty-two page proposal covering the administrator, parent and driver modules, attendance, route management and transport fee collection.',
 null, 'application/pdf', 3677863, 'Proposals',
 null, null, false, 'draft');

-- Belt and braces. The table's CHECK constraint already refuses a clearance
-- without cleared_by and cleared_at, so a clearance is always attributable —
-- but this comment is where someone reaching for a quick UPDATE will look.
comment on table downloads is
  'Clearance is a HUMAN decision, per document, recorded with who and when. Do not set '
  'cleared_for_publication in a migration. All four seeded rows fail content clearance; '
  'the reasons are in content-source/06-downloads/README.md.';
