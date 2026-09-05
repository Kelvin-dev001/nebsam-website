-- 0036  Lengthen three article SEO titles that fell short of the 50-60 range.
--
-- docs/SEO_LLM_STRATEGY.md §1 sets the title budget at 50-60 characters,
-- INCLUDING the " | Nebsam" suffix that buildMetadata appends. Three of the
-- seven definitional articles seeded in 0035 rendered at 36-41 characters, which
-- does not truncate but wastes most of a snippet line on the one page type whose
-- whole job is to be found by someone typing the question.
--
-- Measured on the rendered pages, not estimated from the source:
--   what-is-an-anti-jamming-tracker   41 -> 59
--   how-fuel-siphoning-is-detected    40 -> 56
--   what-is-a-container-e-seal        36 -> 60
--
-- A separate migration rather than an edit to 0035, because 0035 has already
-- been applied. Editing an applied migration leaves the file and the database
-- disagreeing for anyone who runs the set from scratch.

update blog_posts
   set seo_title = 'What is an anti-jamming tracker? Jamming explained'
 where slug = 'what-is-an-anti-jamming-tracker';

update blog_posts
   set seo_title = 'How is fuel siphoning detected? Tank monitoring'
 where slug = 'how-fuel-siphoning-is-detected';

update blog_posts
   set seo_title = 'What is a container e-seal? Cargo security in Kenya'
 where slug = 'what-is-a-container-e-seal';
