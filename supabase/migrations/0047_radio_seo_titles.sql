-- 0047  Shorter SEO titles for the five radios from 0045.
--
-- buildMetadata (lib/seo/metadata.ts) appends " | Nebsam" to every title, and
-- the 50–60 character rule (CLAUDE.md §7) applies to the RENDERED title. 0045
-- held the stored titles to 50–60 instead, so the rendered ones came out at
-- 61–64. A stored title must be 41–51 characters. Each one below renders at
-- 55–60, and keeps the model name first because that is what a buyer types.
begin;

update products set seo_title = v.title
from (values
  ('inrico-dr10-gateway', 'Inrico DR10 Gateway | DMR, Analogue and PoC Radios'),
  ('baofeng-uv-82',       'Baofeng UV-82 Dual-Band Radio | Dual Push-to-Talk'),
  ('kenwood-tk-3000',     'Kenwood TK-3000 | 16-Channel UHF Radio, 440–480 MHz'),
  ('baofeng-bf-888s',     'Baofeng BF-888s | 16-Channel UHF Walkie-Talkie'),
  ('baofeng-uv-5r',       'Baofeng UV-5R Radio | Dual-Band, 128 Channels, 5W')
) as v(slug, title)
where products.slug = v.slug;

commit;
