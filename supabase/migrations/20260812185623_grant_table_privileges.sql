-- Explicit table-level GRANTs for anon/authenticated.
--
-- Real finding (Phase 5): a from-scratch `supabase start` denies every
-- anon/authenticated query with "permission denied for table X", even
-- though RLS policies for those exact roles already exist and are correct.
-- RLS only ever narrows access that the underlying Postgres GRANT already
-- allows — it was never a substitute for the GRANT, and this project's
-- migrations never issued one, relying on implicit role bootstrapping that
-- isn't guaranteed across Postgres/PostgREST image versions. This is the
-- standard baseline every hosted Supabase project ships with; making it
-- explicit here removes the dependency on that implicit behavior locally,
-- in CI, and on the real remote project alike.
--
-- RLS policies (supabase/migrations/*_rls_policies.sql) remain the actual
-- access-control layer — granting broadly here is safe precisely because
-- every table already has row-level security enabled with default-deny.
grant usage on schema public to anon, authenticated;

grant select on
  public.authors,
  public.posts,
  public.post_slug_redirects,
  public.magazine_issues,
  public.products,
  public.honorees,
  public.site_settings
to anon;

grant select, insert, update, delete on
  public.authors,
  public.posts,
  public.post_revisions,
  public.post_slug_redirects,
  public.magazine_issues,
  public.products,
  public.honorees,
  public.media
to authenticated;

grant select, update on public.site_settings to authenticated;
grant select on public.orders to authenticated;

-- service_role bypasses RLS by design (Stripe webhook, this project's own
-- test fixtures), but bypassing RLS doesn't imply the base GRANT — same
-- "permission denied" surfaced for it as for anon/authenticated above.
grant usage on schema public to service_role;
grant all on all tables in schema public to service_role;

grant usage on all sequences in schema public to anon, authenticated, service_role;
