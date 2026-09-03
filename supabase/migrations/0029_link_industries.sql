-- 0029  solution_industries and product_industries — the cross-linking.
--
-- The Sprint 8 criterion is "No orphan pages: solution <-> product <-> industry
-- all linked", which restates CONTENT_ARCHITECTURE §1: "A page with no inbound
-- internal link does not exist."
--
-- Both views filter BOTH sides to published, so a draft on either end cannot
-- create a link to a 404. That matters here: school-bus-management is a draft
-- solution, and four products are drafts under A01-A07.
--
-- LINKS ARE MADE WHERE THE SOURCE SUPPORTS THEM, not everywhere they would be
-- plausible. Every solution write-up has a "use cases" or "ideal for" section
-- naming the sectors it serves, and those namings are what these rows encode.
-- Linking every solution to all thirteen industries would satisfy the letter of
-- the criterion and destroy its purpose — an industry page that lists
-- everything tells a reader nothing about their sector.
--
-- SCHOOL TRANSPORT is deliberately linked only to speed-governors and
-- vehicle-tracking. The speed governor write-up names school buses explicitly.
-- The school bus solution is a draft and would not link anyway, but the
-- restraint is intentional rather than incidental.

insert into solution_industries (solution_id, industry_id)
select s.id, i.id
from (values
  -- Logistics: named in the cargo, radio, fuel and tracking write-ups.
  ('container-e-seal',        'logistics-and-transport'),
  ('vehicle-tracking',        'logistics-and-transport'),
  ('fuel-monitoring',         'logistics-and-transport'),
  ('radio-communication',     'logistics-and-transport'),
  ('ai-video-telematics',     'logistics-and-transport'),
  ('speed-governors',         'logistics-and-transport'),
  -- PSV: speed governors name buses and matatus; video telematics names PSVs.
  ('speed-governors',         'public-service-vehicles'),
  ('vehicle-tracking',        'public-service-vehicles'),
  ('vehicle-security',        'public-service-vehicles'),
  ('ai-video-telematics',     'public-service-vehicles'),
  -- Security companies: the radio write-up names them first.
  ('radio-communication',     'security-companies'),
  ('vehicle-tracking',        'security-companies'),
  ('vehicle-recovery',        'security-companies'),
  -- Cross-border: the cargo and radio write-ups both address it directly.
  ('container-e-seal',        'cross-border-transport'),
  ('vehicle-tracking',        'cross-border-transport'),
  ('radio-communication',     'cross-border-transport'),
  -- Fuel and hazardous.
  ('fuel-monitoring',         'fuel-and-hazardous-transport'),
  ('speed-governors',         'fuel-and-hazardous-transport'),
  ('vehicle-tracking',        'fuel-and-hazardous-transport'),
  -- Construction: named in the radio and recovery write-ups.
  ('vehicle-recovery',        'construction-and-heavy-equipment'),
  ('radio-communication',     'construction-and-heavy-equipment'),
  ('fuel-monitoring',         'construction-and-heavy-equipment'),
  ('vehicle-tracking',        'construction-and-heavy-equipment'),
  -- School transport: the speed governor write-up names school buses.
  ('speed-governors',         'school-transport'),
  ('vehicle-tracking',        'school-transport'),
  -- Corporate fleets.
  ('vehicle-tracking',        'corporate-fleets'),
  ('vehicle-security',        'corporate-fleets'),
  ('speed-governors',         'corporate-fleets'),
  -- Government and institutions: named in the speed governor and cargo write-ups.
  ('speed-governors',         'government-and-institutions'),
  ('vehicle-tracking',        'government-and-institutions'),
  ('container-e-seal',        'government-and-institutions'),
  -- NGOs: the cargo write-up names humanitarian consignments.
  ('container-e-seal',        'ngos-and-humanitarian'),
  ('vehicle-tracking',        'ngos-and-humanitarian'),
  ('radio-communication',     'ngos-and-humanitarian'),
  -- Car hire.
  ('vehicle-tracking',        'car-hire-and-rental'),
  ('vehicle-security',        'car-hire-and-rental'),
  ('vehicle-recovery',        'car-hire-and-rental'),
  -- Agriculture.
  ('vehicle-tracking',        'agriculture'),
  ('fuel-monitoring',         'agriculture'),
  ('vehicle-recovery',        'agriculture'),
  -- Mining.
  ('vehicle-tracking',        'mining'),
  ('fuel-monitoring',         'mining'),
  ('vehicle-recovery',        'mining'),
  ('radio-communication',     'mining')
) as v(solution_slug, industry_slug)
join solutions  s on s.slug = v.solution_slug  and s.status = 'published'
join industries i on i.slug = v.industry_slug  and i.status = 'published'
on conflict do nothing;

-- Products to industries. Only published products, and only where the product's
-- own capability is what the sector needs — the radios to the sectors whose
-- write-ups name radio use, the anti-jamming hardware to the theft-exposed
-- sectors.
insert into product_industries (product_id, industry_id)
select p.id, i.id
from (values
  ('inrico-t-521',                 'security-companies'),
  ('inrico-s-100',                 'security-companies'),
  ('inrico-s-200',                 'security-companies'),
  ('inrico-tm-7',                  'security-companies'),
  ('inrico-t-521',                 'construction-and-heavy-equipment'),
  ('inrico-s-100',                 'construction-and-heavy-equipment'),
  ('inrico-tm-7',                  'logistics-and-transport'),
  ('inrico-t-521',                 'logistics-and-transport'),
  ('anti-jammer-tracker',          'logistics-and-transport'),
  ('anti-jammer-tracker',          'public-service-vehicles'),
  ('anti-jammer-tracker',          'car-hire-and-rental'),
  ('hybrid-pro-max-tracker',       'car-hire-and-rental'),
  ('hybrid-pro-max-tracker',       'corporate-fleets'),
  ('hybrid-promax-plus-car-alarm', 'corporate-fleets'),
  ('hybrid-promax-car-alarm',      'car-hire-and-rental'),
  ('hybrid-plus-car-alarm',        'corporate-fleets'),
  ('hybrid-pro-plus-car-alarm',    'public-service-vehicles')
) as v(product_slug, industry_slug)
join products   p on p.slug = v.product_slug  and p.status = 'published'
join industries i on i.slug = v.industry_slug and i.status = 'published'
on conflict do nothing;
