-- 0037  Trim one SEO description to the 155-character limit.
--
-- `what-is-an-anti-jamming-tracker` rendered at 156 characters against the
-- 140-155 range in docs/SEO_LLM_STRATEGY.md §1. One character over is still
-- over, and the limit exists because Google truncates past roughly 160.
--
-- ── A NOTE ON VERIFYING THIS ─────────────────────────────────────────────────
-- Migration 0036 corrected three seo_title values, and a full rebuild afterwards
-- still rendered the OLD values while the database held the new ones. The
-- freshly generated HTML in .next/server carried the previous title, so the
-- build read stale data rather than the page being served from an old artefact.
-- `.next/cache/fetch-cache` is the probable cause and was not cleared, so the
-- mechanism is inferred rather than proven. Recorded as V54.
--
-- The consequence for this migration: the value below is correct in the
-- database and will render on any build with a cold data cache, but it could not
-- be confirmed on the local build in which it was written.

update blog_posts
   set seo_description =
       'A GSM jammer makes a tracked vehicle go quiet, and silence looks like a flat battery. What an anti-jamming tracker does differently, and its limits.'
 where slug = 'what-is-an-anti-jamming-tracker';
