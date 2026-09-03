-- 0026  product_solutions — the join that fills section 6 on solution pages.
--
-- Section 6 of the eleven-section model is "Hardware options — the actual
-- products that deliver it". It has been rendering nothing since Sprint 5
-- because the join was empty. These rows fill it, and the solution pages pick
-- them up with no code change.
--
-- This is also what CONTENT_ARCHITECTURE §1 calls the relationship rule: "no
-- orphan pages. Every solution links to its products... every product links to
-- its solutions." Until now the nine solution pages had no outbound link to any
-- product, which made them exactly the orphans that rule exists to prevent.
--
-- ONLY PUBLISHED PRODUCTS ARE LINKED, and only where the pairing is supported
-- by the source material rather than merely plausible. The four blocked drafts are
-- deliberately not joined: a link to a draft would resolve to a 404, and
-- linking a product whose capabilities are under audit would put the disputed
-- claim back on a published page by the back door.
--
-- The insert is written as a join against slugs so it cannot silently attach to
-- the wrong row, and `on conflict do nothing` makes it safe to re-run.

insert into product_solutions (product_id, solution_id)
select p.id, s.id
from (values
  -- Anti-jamming is the defining capability of both of these solutions.
  ('anti-jammer-tracker',    'vehicle-tracking'),
  ('anti-jammer-tracker',    'vehicle-security'),
  -- The Hybrid Pro Max is a tracker AND an alarm — six active security layers
  -- beginning at the door — so it belongs to both, not to one.
  ('hybrid-pro-max-tracker', 'vehicle-tracking'),
  ('hybrid-pro-max-tracker', 'vehicle-security'),
  -- The PoC handsets and the base station are the radio-communication range.
  ('inrico-t-521',           'radio-communication'),
  ('inrico-s-100',           'radio-communication'),
  ('inrico-s-200',           'radio-communication'),
  ('inrico-tm-7',            'radio-communication')
) as v(product_slug, solution_slug)
join products  p on p.slug = v.product_slug and p.status = 'published'
join solutions s on s.slug = v.solution_slug and s.status = 'published'
on conflict do nothing;
