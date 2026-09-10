-- ============================================================================
-- 0038 — Coordinates for the coverage map.
--
-- 0004 gave both tables lat/lng columns and 0010 left them null, because until
-- there was a map there was nothing to plot. /about/coverage is that map.
--
-- THESE ARE TOWN CENTRES, NOT OFFICES, INCLUDING FOR THE THREE BRANCHES.
--
-- That is deliberate and it is the honest reading. The Nairobi branch is on
-- Kiambu Road at Ridgeways and the Mombasa branch at the Makupa roundabout;
-- pinning either to street precision on a map of the whole country would be
-- false precision, and a coordinate is exactly the kind of value that later
-- gets reused somewhere it is trusted more than it deserves. The addresses a
-- visitor actually navigates by live in lib/company.ts and are printed on the
-- page. The page says the map shows towns.
--
-- For the same reason NOTHING emits these as schema.org `geo`. A LocalBusiness
-- geo property is read as the premises, and these are not the premises.
--
-- Coverage towns are agents and technicians, never offices (0004). Plotting one
-- does not make it a branch: the map draws the two with different marks, gives
-- them a legend, and lists them under different headings. Brief 3.4.
--
-- Idempotent: safe to re-run.
-- ============================================================================

update branches set lat = -1.286400, lng = 36.817200 where slug = 'nairobi';
update branches set lat = -4.043500, lng = 39.668200 where slug = 'mombasa';
update branches set lat = -0.303100, lng = 36.080000 where slug = 'nakuru';

update coverage_locations set lat = -0.681700, lng = 34.766700 where town = 'Kisii';
update coverage_locations set lat = -0.091700, lng = 34.768000 where town = 'Kisumu';
update coverage_locations set lat = -0.527300, lng = 34.457100 where town = 'Homa Bay';
update coverage_locations set lat =  0.514300, lng = 35.269800 where town = 'Eldoret';
update coverage_locations set lat = -3.217500, lng = 40.119100 where town = 'Malindi';
update coverage_locations set lat = -3.630500, lng = 39.849900 where town = 'Kilifi';
update coverage_locations set lat = -0.368900, lng = 35.286100 where town = 'Kericho';
update coverage_locations set lat = -1.033300, lng = 37.069300 where town = 'Thika';
update coverage_locations set lat =  0.354600, lng = 37.582200 where town = 'Isiolo';
update coverage_locations set lat =  0.050000, lng = 37.650000 where town = 'Meru';
update coverage_locations set lat =  2.328400, lng = 37.989900 where town = 'Marsabit';
update coverage_locations set lat =  3.119100, lng = 35.597300 where town = 'Lodwar';
update coverage_locations set lat =  0.460800, lng = 34.111500 where town = 'Busia';
update coverage_locations set lat = -0.456900, lng = 39.658300 where town = 'Garissa';
update coverage_locations set lat =  0.016700, lng = 37.073300 where town = 'Nanyuki';
update coverage_locations set lat = -0.531000, lng = 37.457500 where town = 'Embu';

comment on column branches.lat is
  'Town centre, not the premises. Never emitted as schema.org geo — see 0038.';
comment on column coverage_locations.lat is
  'Town centre. A coordinate here does not make the town an office — see 0004.';
