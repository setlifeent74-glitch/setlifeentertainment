-- §45 Admin editor — "Inline image upload via drag-and-drop, direct to
-- Supabase Storage." Public bucket (read is public so published articles'
-- images load without a signed URL); write is authenticated-only, matching
-- the flat-access model everywhere else in this project.
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "public reads media bucket"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'media');

create policy "authenticated uploads to media bucket"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media');

create policy "authenticated updates media bucket objects"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media')
  with check (bucket_id = 'media');

create policy "authenticated deletes media bucket objects"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media');
