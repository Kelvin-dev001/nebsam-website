-- 0025  Products blocked by open audit items — SEEDED AS DRAFTS.
--
-- The Sprint 6 criterion is explicit: "Audit items A01-A07 resolved before the
-- affected pages ship." All seven are open, and each is a discrepancy between
-- what the printed brochure claims and what the write-up documents. Every one
-- is a question about what the product actually does, which is not something a
-- website may decide on the customer's behalf.
--
--   Hybrid Tracker
--     A01  brochure says "Mobile App"; the write-up never mentions it. Every
--          other tracker documents app access, so this is more likely an
--          extraction gap than a product difference — but "likely" is not a
--          basis for publishing a capability.
--     A02  brochure says "Global Tracking"; only the Standard Tracker documents
--          local vs international operation. If it does work internationally
--          that is a significant selling point missing from the page; if it does
--          not, the brochure being handed to customers is wrong.
--     A03  brochure says "No Credit Top up". That is a RECURRING COST statement
--          and brief 10.2 requires recurring costs on the product page. If
--          airtime top-up is genuinely not required, say so; if it is, the cost
--          must be published.
--
--   Standard Tracker
--     A04  as A01.
--     A05  as A03.
--     Note the brochure calls this the "Basic Tracker". The confirmed name is
--     Standard Tracker and the retired name must never reach rendered output.
--
--   Recovery Tracker
--     A06  brochure says "Playback"; the write-up documents live tracking,
--          configurable intervals and tracking modes but not route playback. On
--          a device sending one location per day, "playback" may mean something
--          materially different from playback on a live tracker. The published
--          vehicle-recovery solution page was written without the claim, and
--          this product page must not introduce it.
--
--   Hybrid Car Alarm
--     A07  brochure says "Comes complete with Hybrid Tracker package
--          (optional)". That is a BUNDLING AND PRICING claim rather than a
--          feature: it implies a package the shop must be able to sell and
--          price, and may need a bundle or kit concept in the data model before
--          Sprint 7. Also note the brochure's "Hybrid Alarm" is a retired name;
--          the confirmed name is Hybrid Car Alarm.
--
-- These rows exist so the slugs are reserved and Sprint 11's admin has
-- something to attach content to. They carry NO features and NO specs: there is
-- nothing to draft that would not be guesswork about the very facts under
-- question.
--
-- HOW THEY ARE KEPT OFF THE SITE, in three independent layers, exactly as the
-- school bus solution: status = 'draft' excludes them from public_products;
-- generateStaticParams reads that view so no route is built; and
-- dynamicParams = false makes the URLs hard 404s rather than on-demand renders.
--
-- TO PUBLISH: resolve the audit item, write the content, then change status.
-- Changing status alone publishes an empty page.

insert into products (slug, name, family, summary, category_id, price_kes, status)
select v.slug, v.name, v.family, null, c.id, null, 'draft'
from (values
  ('hybrid-tracker',    'Hybrid Tracker',    'Trackers',  'gps-trackers'),
  ('standard-tracker',  'Standard Tracker',  'Trackers',  'gps-trackers'),
  ('recovery-tracker',  'Recovery Tracker',  'Trackers',  'gps-trackers'),
  ('hybrid-car-alarm',  'Hybrid Car Alarm',  'Car alarms','car-alarms')
) as v(slug, name, family, category_slug)
join product_categories c on c.slug = v.category_slug;
