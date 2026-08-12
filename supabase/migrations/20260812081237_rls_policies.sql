-- Phase 2 (BUILD-SPEC.md §44 VERIFY) — Row Level Security on every table.
--
-- Flat access model: no roles, no profiles table, no per-user identity.
-- Access is binary — authenticated (the one shared CMS login) or not.
-- Anonymous clients read published content only. Anyone authenticated can
-- create, edit, publish, and delete any content in any section.

alter table public.authors enable row level security;
alter table public.posts enable row level security;
alter table public.post_revisions enable row level security;
alter table public.post_slug_redirects enable row level security;
alter table public.honorees enable row level security;
alter table public.magazine_issues enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.media enable row level security;

-- ---------------------------------------------------------------------------
-- authors — public byline pages (§46)
-- ---------------------------------------------------------------------------
create policy "public reads authors"
  on public.authors for select to anon, authenticated
  using (true);

create policy "authenticated manages authors"
  on public.authors for all to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------------
-- posts
-- ---------------------------------------------------------------------------
create policy "public reads published posts"
  on public.posts for select to anon, authenticated
  using (status = 'published');

create policy "authenticated reads all posts"
  on public.posts for select to authenticated
  using (true);

create policy "authenticated manages posts"
  on public.posts for all to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------------
-- post_revisions — recovery history, not access control
-- ---------------------------------------------------------------------------
create policy "authenticated reads revisions"
  on public.post_revisions for select to authenticated
  using (true);

create policy "authenticated inserts revisions"
  on public.post_revisions for insert to authenticated
  with check (true);

-- ---------------------------------------------------------------------------
-- post_slug_redirects — public read (server-side 301 lookups)
-- ---------------------------------------------------------------------------
create policy "public reads slug redirects"
  on public.post_slug_redirects for select to anon, authenticated
  using (true);

create policy "authenticated inserts slug redirects"
  on public.post_slug_redirects for insert to authenticated
  with check (true);

-- ---------------------------------------------------------------------------
-- honorees — §34
-- ---------------------------------------------------------------------------
create policy "public reads published honorees"
  on public.honorees for select to anon, authenticated
  using (published);

create policy "authenticated reads all honorees"
  on public.honorees for select to authenticated
  using (true);

create policy "authenticated manages honorees"
  on public.honorees for all to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------------
-- magazine_issues — public read
-- ---------------------------------------------------------------------------
create policy "public reads magazine issues"
  on public.magazine_issues for select to anon, authenticated
  using (true);

create policy "authenticated manages magazine issues"
  on public.magazine_issues for all to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------------
-- products — public reads published only
-- ---------------------------------------------------------------------------
create policy "public reads published products"
  on public.products for select to anon, authenticated
  using (published);

create policy "authenticated reads all products"
  on public.products for select to authenticated
  using (true);

create policy "authenticated manages products"
  on public.products for all to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------------
-- orders — no client-facing write policy at all. Written only by the
-- Stripe webhook handler using the service-role key, which bypasses RLS
-- entirely. Order rows carry customer email and payment status.
-- ---------------------------------------------------------------------------
create policy "authenticated reads orders"
  on public.orders for select to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- media — shared library (§45)
-- ---------------------------------------------------------------------------
create policy "authenticated reads media library"
  on public.media for select to authenticated
  using (true);

create policy "authenticated manages media"
  on public.media for all to authenticated
  using (true)
  with check (true);
