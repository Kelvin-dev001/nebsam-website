-- ============================================================================
-- 0009 — Public read-only views.
--
-- THIS IS THE ONLY THING THE ANON KEY MAY READ. Base tables are unreachable
-- from a browser (0008); every public page reads through a view here.
--
-- Two things that buys us:
--
--   1. The WHERE clause is the publication gate, in one reviewable place. A
--      draft, an unconfirmed permission or an uncleared download cannot leak
--      because a component forgot a filter.
--   2. Column selection is explicit, so internal columns (notes, cleared_by,
--      privacy_check_note, permission_requested_at) never reach a client even
--      by accident.
--
-- security_invoker = off (the default for views) means these run with the
-- view owner's rights, which is what lets anon read them while the underlying
-- tables stay closed. That is the intended mechanism, not a loophole.
-- ============================================================================

-- ── Content ─────────────────────────────────────────────────────────────────
create view public_solutions as
  select id, slug, name, summary, body, hero_image, sort_order,
         last_reviewed_at, seo_title, seo_description, seo_image, updated_at
  from solutions
  where status = 'published';

create view public_products as
  select p.id, p.slug, p.name, p.family, p.summary, p.body,
         p.specs, p.features, p.gallery,
         p.category_id, c.slug as category_slug, c.name as category_name,
         p.sku,
         -- NULL price is meaningful: the page renders "Request price", omits
         -- add-to-cart, and emits Product schema WITHOUT an Offer.
         case when p.price_visible then p.price_kes else null end as price_kes,
         p.price_visible, p.availability, p.featured,
         p.recurring_fee_kes, p.recurring_fee_period, p.recurring_fee_note,
         p.installation_terms,
         p.seo_title, p.seo_description, p.seo_image, p.updated_at
  from products p
  left join product_categories c on c.id = p.category_id
  where p.status = 'published';

create view public_product_categories as
  select id, slug, name, description, sort_order from product_categories;

create view public_industries as
  select id, slug, name, summary, body, hero_image, sort_order,
         seo_title, seo_description, seo_image, updated_at
  from industries
  where status = 'published';

create view public_product_solutions as
  select ps.product_id, ps.solution_id
  from product_solutions ps
  join products  p on p.id = ps.product_id  and p.status = 'published'
  join solutions s on s.id = ps.solution_id and s.status = 'published';

create view public_product_industries as
  select pi.product_id, pi.industry_id
  from product_industries pi
  join products   p on p.id = pi.product_id  and p.status = 'published'
  join industries i on i.id = pi.industry_id and i.status = 'published';

create view public_solution_industries as
  select si.solution_id, si.industry_id
  from solution_industries si
  join solutions  s on s.id = si.solution_id and s.status = 'published'
  join industries i on i.id = si.industry_id and i.status = 'published';

-- ── Editorial ───────────────────────────────────────────────────────────────
-- published_at <= now() is what makes scheduled publishing work: a future date
-- is a scheduled post and stays invisible until its moment.
create view public_blog_posts as
  select b.id, b.slug, b.title, b.excerpt, b.body, b.featured_image,
         b.published_at, b.updated_at, b.reading_time,
         b.seo_title, b.seo_description, b.seo_image,
         a.id as author_id, a.name as author_name, a.role as author_role,
         a.avatar as author_avatar,
         c.id as category_id, c.slug as category_slug, c.name as category_name
  from blog_posts b
  left join authors         a on a.id = b.author_id
  left join blog_categories c on c.id = b.category_id
  where b.status = 'published'
    and b.published_at is not null
    and b.published_at <= now();

create view public_blog_categories as
  select id, slug, name, description, solution_id from blog_categories;

create view public_authors as
  select id, name, role, bio, avatar, links from authors;

create view public_faqs as
  select id, question, answer, scope, scope_id, sort_order
  from faqs
  where status = 'published';

-- ── Trust ───────────────────────────────────────────────────────────────────
-- Brief 3.5: the site must NEVER display a lapsed permit. Three of six
-- registrations have already lapsed (V27–V30), so this filter is load-bearing
-- rather than defensive. A NULL expiry is treated as NOT displayable: an
-- unrecorded expiry on a regulatory instrument is not evidence it is current.
create view public_certifications as
  select id, name, issuer, description, reference_number,
         document_path, image, effective_on, expires_on, scope_note, sort_order
  from certifications
  where expires_on is not null
    and expires_on > current_date;

-- Both permission gates are in the WHERE clause. Naming or logo-ing an
-- individual client requires that client's permission (V12, V15); the
-- aggregate "70+ corporate clients" claim does not live in this table.
create view public_testimonials as
  select id, author_name, company, industry, quote, logo, sort_order
  from testimonials
  where status = 'published' and permission_confirmed;

create view public_client_logos as
  select id, name, logo_path, sector, sort_order
  from client_logos
  where permission_confirmed;

-- BOTH conditions, always. Uploading a file must not make it downloadable.
create view public_downloads as
  select id, slug, title, description, file_path, file_type, file_size,
         category, thumbnail, document_date, version
  from downloads
  where status = 'published' and cleared_for_publication;

-- ── Operations ──────────────────────────────────────────────────────────────
create view public_branches as
  select id, slug, name, address, town, county, phones, maps_url, hours,
         lat, lng, sort_order
  from branches;

create view public_coverage_locations as
  select id, town, county, type, lat, lng
  from coverage_locations
  where active;

-- ── Grants ──────────────────────────────────────────────────────────────────
-- SELECT only. There is no public view over orders, submissions, media,
-- profiles, audit_log, installation_certificates or verification_attempts, and
-- there must never be one.
grant select on
  public_solutions, public_products, public_product_categories, public_industries,
  public_product_solutions, public_product_industries, public_solution_industries,
  public_blog_posts, public_blog_categories, public_authors, public_faqs,
  public_certifications, public_testimonials, public_client_logos, public_downloads,
  public_branches, public_coverage_locations
to anon, authenticated;
