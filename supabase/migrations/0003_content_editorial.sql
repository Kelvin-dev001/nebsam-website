-- ============================================================================
-- 0003 — Blog, authors, FAQs.
--
-- The blog is the acquisition engine (brief 13.5): weekly cadence, published by
-- non-technical staff. Everything here exists to make that survivable — real
-- bylines, scheduling, and revision history.
-- ============================================================================

create table authors (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  role       text,
  bio        text,
  avatar     text,
  links      jsonb not null default '{}'::jsonb,
  -- Optional link to a staff account; an author need not be a system user.
  profile_id uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger authors_set_updated_at before update on authors
  for each row execute function set_updated_at();
alter table authors enable row level security;

comment on table authors is
  'Real names, roles and photos. Anonymous "admin" bylines weaken E-E-A-T and how an assistant assesses the source (V09).';

create table blog_categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  description text,
  -- Categories map to solutions (brief 13.5) so every article has a route home.
  solution_id uuid references solutions (id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger blog_categories_set_updated_at before update on blog_categories
  for each row execute function set_updated_at();
alter table blog_categories enable row level security;

create table blog_posts (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  title           text not null,
  excerpt         text,
  body            text,
  featured_image  text,
  author_id       uuid references authors         (id) on delete set null,
  category_id     uuid references blog_categories (id) on delete set null,
  status          content_status not null default 'draft',

  -- Real dates. Article schema needs genuine datePublished/dateModified
  -- (brief 13.3); a future published_at is how scheduled publishing works.
  published_at    timestamptz,
  reading_time    integer,

  seo_title       text,
  seo_description text,
  seo_image       text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  -- A published post without a date would emit invalid Article schema.
  constraint published_needs_date
    check (status <> 'published' or published_at is not null)
);
create trigger blog_posts_set_updated_at before update on blog_posts
  for each row execute function set_updated_at();
alter table blog_posts enable row level security;

create index blog_posts_status_published_idx on blog_posts (status, published_at desc);
create index blog_posts_category_idx         on blog_posts (category_id);

-- ── Revision history ────────────────────────────────────────────────────────
-- Brief 11.2: "a staff member who loses 40 minutes of writing stops using the
-- CMS." Losing work once is usually enough to lose the user permanently, and
-- the blog dies quietly after that. This is the cheapest possible insurance.
create table blog_post_revisions (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references blog_posts (id) on delete cascade,
  title      text,
  body       text,
  excerpt    text,
  author_id  uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now()
);
alter table blog_post_revisions enable row level security;

create index blog_post_revisions_post_idx on blog_post_revisions (post_id, created_at desc);

-- ── FAQs ────────────────────────────────────────────────────────────────────
-- Scoped so the same table serves the global FAQ page and the per-page FAQPage
-- schema blocks on solutions, products and industries.
create table faqs (
  id         uuid primary key default gen_random_uuid(),
  question   text not null,
  answer     text not null,
  scope      text not null default 'global'
             check (scope in ('global', 'solution', 'product', 'industry')),
  scope_id   uuid,
  sort_order integer not null default 0,
  status     content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint scoped_faq_needs_target
    check (scope = 'global' or scope_id is not null)
);
create trigger faqs_set_updated_at before update on faqs
  for each row execute function set_updated_at();
alter table faqs enable row level security;

create index faqs_scope_idx on faqs (scope, scope_id);
