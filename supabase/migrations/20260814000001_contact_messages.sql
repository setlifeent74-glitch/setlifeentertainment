-- §13 Phase 13 — contact form real persistence.
-- Mirrors the submissions table pattern: anon inserts, authenticated reads.
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  created_at timestamptz not null default now()
);

create index contact_messages_created_idx on public.contact_messages (created_at desc);

alter table public.contact_messages enable row level security;

create policy "public sends contact message"
  on public.contact_messages for insert to anon
  with check (true);

create policy "authenticated reads contact messages"
  on public.contact_messages for all to authenticated
  using (true)
  with check (true);

grant insert on public.contact_messages to anon;
grant select, insert, update, delete on public.contact_messages to authenticated;
