-- 0022  Solution: school-bus-management — SEEDED AS A DRAFT, DELIBERATELY.
--
-- THIS PAGE IS NOT PUBLISHED AND MUST NOT BE PUBLISHED BY ANYONE WHO HAS NOT
-- READ THIS COMMENT.
--
-- The Sprint 5 criterion for this solution is: "School bus: 8 items resolved
-- (V17-V24), SOURCE NOTES block deleted, legal review". At the time of writing,
-- ALL EIGHT of V17-V24 are OPEN and no legal review has taken place:
--
--   V17  payment gateway — is M-Pesa actually supported?
--   V18  biometric availability — which of face/fingerprint/iris ship today?
--   V19  alcohol sensor spec — type, threshold, calibration; evidential or not?
--   V20  driver facial verification fallback — what happens on a false negative?
--   V21  retention periods for in-bus video, attendance and biometric templates
--   V22  proximity alert timing — configurable? default?
--   V23  reference schools for a case study
--   V24  pricing model
--
-- CLAUDE.md §10 calls this "the highest legal-sensitivity content on the site".
-- It concerns children's personal data and optionally children's BIOMETRIC
-- data, which is sensitive personal data under the Data Protection Act 2019.
-- Publishing an unreviewed description of how a system handles a child's
-- biometric template is not a content risk, it is a legal one — and the people
-- who would rely on it are schools and parents.
--
-- V20 deserves separate mention because it is an operational safety question,
-- not a compliance one: if driver facial verification produces a false
-- negative, what actually happens? A page that does not know the answer must
-- not describe the feature, because the honest answer might be that a bus full
-- of children does not move.
--
-- WHY SEED IT AT ALL. The row exists so the slug is reserved, the sort order is
-- settled, and Sprint 11's admin has something to attach content to. It carries
-- NO sections and NO summary: there is nothing to draft yet that would not be
-- guesswork, and a half-written draft is exactly what gets published by
-- accident later.
--
-- HOW IT IS PREVENTED FROM SHIPPING, in three independent layers:
--   1. status = 'draft', so public_solutions (0009) excludes it entirely.
--   2. generateStaticParams reads that view, so no route is built.
--   3. dynamicParams = false, so /solutions/school-bus-management is a hard 404
--      rather than an on-demand render.
-- It is also therefore absent from the sitemap, because the sitemap reads the
-- same view.
--
-- TO PUBLISH: resolve V17-V24, obtain legal review, write the content, and only
-- then change the status. Changing the status alone would publish an empty page
-- about children's data.

insert into solutions (slug, name, summary, sections, sort_order, status)
values (
  'school-bus-management',
  'School bus management',
  null,
  '{}'::jsonb,
  6,
  'draft'
);
