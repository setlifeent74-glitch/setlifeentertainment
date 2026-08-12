-- Phase 5 (BUILD-SPEC.md §9) — a single-row settings table for admin-toggled
-- flags that aren't attached to any one content row. §34 Set Life 100 is the
-- only current consumer: "Gate: explicit admin enable."
create table public.site_settings (
  id boolean primary key default true,
  set_life_100_enabled boolean not null default false,
  constraint site_settings_singleton check (id)
);

insert into public.site_settings (id) values (true);

alter table public.site_settings enable row level security;

create policy "public reads site settings"
  on public.site_settings for select to anon, authenticated
  using (true);

create policy "authenticated manages site settings"
  on public.site_settings for update to authenticated
  using (true)
  with check (true);
