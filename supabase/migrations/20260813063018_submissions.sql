-- §45 admin submissions queue — backs /submit and /admin/submissions.
-- Inbound submissions never auto-publish (§48.1): this table is entirely
-- separate from `posts`, so a contributor must deliberately turn a
-- submission into an actual post through the normal editor.
create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  role text,
  email text not null,
  instagram text,
  project_title text,
  story text not null,
  portfolio_link text,
  reviewed boolean not null default false,
  created_at timestamptz not null default now()
);

create index submissions_reviewed_idx on public.submissions (reviewed, created_at desc);

alter table public.submissions enable row level security;

-- Public can submit (insert-only, no read), matching every other public
-- write path in this project (newsletter_subscribers follows the same
-- shape: anon inserts, only authenticated reads).
create policy "public submits story"
  on public.submissions for insert to anon
  with check (true);

create policy "authenticated manages submissions"
  on public.submissions for all to authenticated
  using (true)
  with check (true);

grant insert on public.submissions to anon;
grant select, insert, update, delete on public.submissions to authenticated;
