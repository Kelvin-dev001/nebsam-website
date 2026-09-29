-- 0046  Kelvin's answers of 29 September 2026 on the new radio pages (V85).
--
-- (a) DR10 RENEWAL: KES 3,000 per gateway. This CORRECTS the KES 6,000 given
--     on 28 September. The period is annual: the 4 September answers (0032 §3)
--     made every recurring fee annual, per device and reviewed each year, with
--     radios at KES 3,000 a year, and this is that fee applied per gateway. It
--     now has a period, so it moves into the fee columns (which the
--     recurring_fee_needs_period constraint allows), and the overview sentence
--     0045 used in their place goes.
--
-- (b) DR10 FREQUENCIES: supports both UHF and VHF. DMR tier support is still
--     not stated, so the page names the bands and still asks anyone running DMR
--     radios for their make and model.
--
-- (c) DR10 REPEATER: no separate licence is needed to run it, so the function
--     0045 held back is published. The page describes what it does and makes no
--     licensing statement either way.
--
-- (d) TK-3000: there is no VHF version. The page already describes the UHF
--     model at 4W, so nothing changes; the source's "5W (VHF)" was an error.
--
-- ONE TRANSACTION, as 0045, so the row changes whole or not at all.
begin;

update products
set
  summary = 'A gateway that joins conventional DMR and analogue two-way radios to a PoC network, so a user on a frequency radio and a user on a PoC radio can talk to each other. It can also act as a repeater for an existing frequency network.',
  body = 'Most organisations that move to PoC radios already own conventional frequency radios. The DR10 connects the two into a single communications network, so the radios already in service stay in service alongside the new ones. It works with radios on both UHF and VHF frequencies; if you run DMR radios, send us the make and model before you buy. The PoC side reaches as far as the network does, subject to network coverage and service availability. It has no battery, so it runs from a power supply where it is installed.',
  -- Second in the list: after "Frequency and PoC radios on one network",
  -- because it is the other half of what the gateway is for.
  features = jsonb_insert(
    features, '{1}',
    jsonb_build_object('title', 'Repeater for your existing network', 'detail', 'It can extend the range of an existing frequency two-way radio network, so radios that would otherwise be out of range of each other can communicate.')
  ),
  specs = specs || jsonb_build_object('Frequency bands', 'UHF and VHF'),
  recurring_fee_kes = 3000,
  recurring_fee_period = 'year',
  recurring_fee_note = 'Annual renewal per gateway. Reviewed annually.',
  seo_description = 'Gateway joining UHF and VHF, DMR and analogue radios to a PoC network, and a repeater for your existing one. 4G, Wi-Fi, LAN, GPS. KES 350,000 excl. VAT.'
where slug = 'inrico-dr10-gateway';

commit;
