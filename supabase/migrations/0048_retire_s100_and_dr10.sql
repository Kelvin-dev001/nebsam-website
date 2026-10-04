-- 0048  Retire the Inrico S-100 and the Inrico DR10 gateway.
--
-- On 4 October 2026 Kelvin said Nebsam is no longer selling either model and
-- asked for both to be removed from the site, with every reference to them.
--
--   inrico-s-100          seeded by 0024, linked by 0026 and 0029
--   inrico-dr10-gateway   seeded by 0045, corrected by 0046 and 0047
--
-- DELETED, NOT SET TO DRAFT. A draft row still shows in the admin catalogue,
-- and the next person to tidy that list could republish a radio Nebsam cannot
-- supply. Kelvin asked for the items to go, so they go. Their solution and
-- industry links cascade (0002). An order line that named either one keeps its
-- name and price snapshots, because order_items.product_id is "on delete set
-- null" (0005): an order records what the customer was shown, and deleting a
-- product must not rewrite that.
--
-- 0024, 0026, 0029, 0045, 0046 and 0047 still insert and edit these rows, and
-- they stay as they are. Migrations are an ordered ledger that runs everywhere,
-- including against production at cutover, so editing an applied file would
-- make the ledger lie about what this database went through. Running 0001 to
-- 0048 in order ends with neither product present, which is what matters.
--
-- NO REDIRECT. /products/inrico-s-100 and /products/inrico-dr10-gateway have
-- never been public: production still serves the CRA site until the Sprint 15
-- cutover, and the previews sit behind Vercel Authentication. There is no
-- ranking or inbound link to preserve, so both paths simply stop existing.
--
-- TWO DESCRIPTIONS MENTIONED THE GATEWAY and are reworded here:
--   the Radios category ("handsets and gateways", 0010), and the radio
--   proposal download ("the convergence gateway", 0034). The download is still
--   a draft and the PDF itself still describes the DR10, so it must not be
--   published until Nebsam supplies a revised proposal.
begin;

delete from products
where slug in ('inrico-s-100', 'inrico-dr10-gateway');

update product_categories
set description = 'Long-range PoC handsets and short-range frequency radios.'
where slug = 'radios';

update downloads
set description = 'Proposal covering long-range PoC radios and short-range radios.'
where slug = 'radio-communication-proposal';

commit;
