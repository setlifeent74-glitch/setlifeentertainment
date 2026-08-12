-- Local-dev sample data, applied automatically by `supabase db reset`.
-- Never applied to a real project — Supabase only runs seed.sql locally,
-- not against a linked remote database.

insert into public.authors (id, slug, name, title, bio) values
  ('10000000-0000-0000-0000-0000000000aa', 'jordan-reyes', 'Jordan Reyes', 'Staff Writer', 'Covers below-the-line crew across the Atlanta production hub.')
on conflict do nothing;

insert into public.posts (id, slug, title, dek, category, placement, body, author_id, status, published_at, reading_time, meta) values
  ('20000000-0000-0000-0000-0000000000aa', 'gaffer-behind-the-glow', 'The Gaffer Behind the Glow', 'How one lighting veteran shapes the look of indie productions.', 'below_the_line', 'below_the_line',
   '[{"type":"paragraph","text":"Seed content for route verification."}]'::jsonb,
   '10000000-0000-0000-0000-0000000000aa', 'published', now(), 4, '{}'::jsonb),
  ('20000000-0000-0000-0000-0000000000ab', 'crew-call-open-atlanta', 'Crew Call: Open Positions in Atlanta', 'A production is staffing up for a spring shoot.', 'opportunity', 'opportunity',
   '[{"type":"paragraph","text":"Seed content for route verification."}]'::jsonb,
   '10000000-0000-0000-0000-0000000000aa', 'published', now(), 2, '{"deadline":"2027-01-01T00:00:00Z","compensation":"Paid"}'::jsonb),
  ('20000000-0000-0000-0000-0000000000ac', 'set-life-at-regional-fest', 'Set Life at the Regional Fest', 'Coverage of an upcoming regional festival.', 'festival', 'festival',
   '[{"type":"paragraph","text":"Seed content for route verification."}]'::jsonb,
   '10000000-0000-0000-0000-0000000000aa', 'published', now(), 3, '{"city":"Atlanta, GA","startDate":"2027-03-01"}'::jsonb)
on conflict do nothing;

insert into public.magazine_issues (id, issue_number, title, summary, release_date, is_current) values
  ('30000000-0000-0000-0000-0000000000aa', 46, 'The Below the Line Issue', 'Seed content for route verification.', '2026-09-01', true)
on conflict do nothing;

insert into public.products (id, slug, name, description, price, published, digital_file_url) values
  ('40000000-0000-0000-0000-0000000000aa', 'digital-issue-46', 'Issue 46 (Digital)', 'Seed content for route verification.', 500, true, 'https://example.com/issue46.pdf')
on conflict do nothing;
