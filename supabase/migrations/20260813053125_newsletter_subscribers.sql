-- §37 Newsletter — real persistence for signups, not a UI mock. No ESP
-- (Mailchimp/etc) integration is wired up yet; this table is the durable
-- source of truth an ESP integration reads from once one exists.
create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  preferences text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;

-- Anonymous visitors can subscribe (insert) — never read, update, or
-- delete from this table, so there's no way to enumerate other
-- subscribers' emails. The post-signup preferences step (app/actions/
-- newsletter.ts's saveNewsletterPreferences) deliberately does NOT get an
-- anon UPDATE policy here: confirmed directly that `UPDATE ... WHERE id =
-- $1` requires SELECT privilege to evaluate the WHERE clause even with
-- UPDATE granted, and granting anon SELECT would let it enumerate every
-- subscriber's email. That write goes through the service-role client
-- instead (lib/supabase/service.ts), from trusted server-only code, keyed
-- by the row's own unguessable uuid (returned to the client once, at
-- signup) rather than by email.
create policy "anyone can subscribe"
  on public.newsletter_subscribers for insert to anon, authenticated
  with check (true);

create policy "authenticated reads subscribers"
  on public.newsletter_subscribers for select to authenticated
  using (true);

grant select, insert, update on public.newsletter_subscribers to authenticated;
grant insert on public.newsletter_subscribers to anon;

-- The Phase 5 grants migration's `grant all on all tables ... to
-- service_role` was a snapshot at that point in time, not a standing
-- default — it doesn't cover tables created afterward. Confirmed directly:
-- a service-role read against this table failed with "permission denied"
-- until this line was added. Every future migration that creates a table
-- needs its own service_role grant for the same reason.
grant all on public.newsletter_subscribers to service_role;
