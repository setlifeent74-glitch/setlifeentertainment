-- Phase 2 (BUILD-SPEC.md §44) — editorial and commerce schema.
--
-- Flat access model (§2, §44, §45): one shared CMS login, no roles, no
-- approval workflow. `authors` is a byline roster, not a user-account
-- table — there is no per-person Supabase Auth identity to hang it on.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- authors — public byline / contributor profile pages (§46). Editorial
-- data the contributor picks or types, not derived from who's signed in.
-- ---------------------------------------------------------------------------
create table public.authors (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  title text, -- e.g. "Contributing Writer, Atlanta"
  bio text,
  avatar_url text,
  location text,
  social_links jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- posts — one content type, category + placement discriminators (§44).
-- ---------------------------------------------------------------------------
create type public.post_category as enum (
  'article', 'news', 'spotlight', 'review', 'opportunity', 'festival',
  'below_the_line', 'production', 'video', 'behind_the_lens'
);

create type public.post_placement as enum (
  'today', 'spotlight_feature', 'fresh_face', 'call_sheet', 'below_the_line',
  'production', 'cut', 'screening_room', 'behind_the_lens', 'opportunity',
  'festival'
);

-- No 'in_review' — flat access means no approval gate to sit in.
-- 'scheduled' is set explicitly alongside a future scheduled_for; nothing
-- currently auto-flips it to 'published' (no cron/edge function scoped yet).
create type public.post_status as enum ('draft', 'scheduled', 'published');

create table public.magazine_issues (
  id uuid primary key default gen_random_uuid(),
  issue_number integer not null unique,
  title text not null,
  cover_image_url text,
  release_date date,
  summary text,
  is_current boolean not null default false,
  created_at timestamptz not null default now()
);

-- At most one current issue (§23: "renders from magazine_issues where
-- is_current = true", implying a single current issue drives the section).
create unique index magazine_issues_one_current
  on public.magazine_issues (is_current)
  where is_current;

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  dek text,
  category public.post_category not null,
  placement public.post_placement,
  body jsonb not null default '[]'::jsonb,
  hero_image_url text,
  author_id uuid not null references public.authors (id),
  status public.post_status not null default 'draft',
  published_at timestamptz,
  scheduled_for timestamptz,
  featured boolean not null default false,
  related_issue_id uuid references public.magazine_issues (id),
  seo_title text,
  seo_description text,
  og_image_url text,
  reading_time integer,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index posts_status_idx on public.posts (status);
create index posts_placement_idx on public.posts (placement) where placement is not null;
create index posts_category_idx on public.posts (category);
create index posts_published_at_idx on public.posts (published_at desc) where status = 'published';

-- §8: changing a published slug issues a 301 from the old path.
create table public.post_slug_redirects (
  old_slug text primary key,
  post_id uuid not null references public.posts (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.post_revisions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  body jsonb not null,
  title text not null,
  edited_by text, -- free text — whatever the contributor enters, not an enforced identity
  created_at timestamptz not null default now()
);

create index post_revisions_post_id_idx on public.post_revisions (post_id, created_at desc);

-- ---------------------------------------------------------------------------
-- honorees — backs §34 Set Life 100.
-- ---------------------------------------------------------------------------
create table public.honorees (
  id uuid primary key default gen_random_uuid(),
  list_year integer not null,
  rank integer,
  name text not null,
  title text,
  discipline text,
  portrait_url text,
  citation text,
  related_post_id uuid references public.posts (id),
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create index honorees_list_year_idx on public.honorees (list_year) where published;

-- ---------------------------------------------------------------------------
-- products / orders — commerce (§44, §48). One flexible product type.
-- ---------------------------------------------------------------------------
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  price integer not null, -- cents
  image_url text,
  stripe_price_id text,
  inventory integer,
  digital_file_url text,
  event_date timestamptz,
  event_location text,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text not null unique,
  product_id uuid not null references public.products (id),
  customer_email text not null,
  amount integer not null,
  status text not null default 'pending',
  download_token uuid,
  ticket_code text unique,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- media — shared library for concurrent multi-contributor uploads (§45).
-- ---------------------------------------------------------------------------
create table public.media (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  filename text not null,
  alt_text text not null,
  uploaded_by text, -- free text, optional
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- updated_at bookkeeping
-- ---------------------------------------------------------------------------
create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();
