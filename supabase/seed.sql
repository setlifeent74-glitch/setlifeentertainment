-- Local-dev sample data, applied automatically by `supabase db reset`.
-- Never applied to a real project — Supabase only runs seed.sql locally,
-- not against a linked remote database.

insert into public.authors (id, slug, name, title, bio) values
  ('10000000-0000-0000-0000-0000000000aa', 'jordan-reyes', 'Jordan Reyes', 'Staff Writer', 'Covers below-the-line crew across the Atlanta production hub.')
on conflict do nothing;

insert into public.posts (id, slug, title, dek, category, placement, body, author_id, status, published_at, reading_time, meta, hero_image_url) values
  -- Below the Line `title` is the crew member's name (same convention as
  -- §24/§27 spotlight posts) — `dek` carries the headline-style description,
  -- `meta.department` the job title.
  ('20000000-0000-0000-0000-0000000000aa', 'gaffer-behind-the-glow', 'Marcus Webb', 'The Gaffer Behind the Glow — how one lighting veteran shapes the look of indie productions.', 'below_the_line', 'below_the_line',
   '[{"type":"paragraph","text":"Seed content for route verification."}]'::jsonb,
   '10000000-0000-0000-0000-0000000000aa', 'published', now(), 4, '{"department":"Gaffer"}'::jsonb, '/assets/covers/elijah-lamar.jpg'),
  ('20000000-0000-0000-0000-0000000000ab', 'crew-call-open-atlanta', 'Crew Call: Open Positions in Atlanta', 'A production is staffing up for a spring shoot.', 'opportunity', 'opportunity',
   '[{"type":"paragraph","text":"Seed content for route verification."}]'::jsonb,
   '10000000-0000-0000-0000-0000000000aa', 'published', now(), 2, '{"deadline":"2027-01-01T00:00:00Z","compensation":"Paid"}'::jsonb, null),
  ('20000000-0000-0000-0000-0000000000ac', 'set-life-at-regional-fest', 'Set Life at the Regional Fest', 'Coverage of an upcoming regional festival.', 'festival', 'festival',
   '[{"type":"paragraph","text":"Seed content for route verification."}]'::jsonb,
   '10000000-0000-0000-0000-0000000000aa', 'published', now(), 3, '{"city":"Atlanta, GA","startDate":"2027-03-01"}'::jsonb, null),
  -- §26 Below the Line — two more crew profiles, bringing placement=below_the_line to 3 (meets the §9 gate).
  ('20000000-0000-0000-0000-0000000000ad', 'the-sound-mixer-nobody-sees', 'Renee Ford', 'The Sound Mixer Nobody Sees — field recording on a five-person crew, in her own words.', 'below_the_line', 'below_the_line',
   '[{"type":"paragraph","text":"Seed content for route verification."}]'::jsonb,
   '10000000-0000-0000-0000-0000000000aa', 'published', now() - interval '1 day', 5, '{"department":"Sound Mixer"}'::jsonb, '/assets/covers/asia-clark.jpg'),
  ('20000000-0000-0000-0000-0000000000ae', 'production-design-on-a-shoestring', 'Devon Okafor', 'Production Design on a Shoestring — building a period set for under $2,000.', 'below_the_line', 'below_the_line',
   '[{"type":"paragraph","text":"Seed content for route verification."}]'::jsonb,
   '10000000-0000-0000-0000-0000000000aa', 'published', now() - interval '2 days', 6, '{"department":"Production Designer"}'::jsonb, '/assets/covers/blue-kimble.jpg'),
  -- §22 Today on Set Life — three posts, meets the §9 gate.
  ('20000000-0000-0000-0000-0000000000b1', 'today-casting-call-atlanta', 'Open Casting Call Draws Record Turnout in Atlanta', 'Local production sees its biggest casting day yet.', 'news', 'today',
   '[{"type":"paragraph","text":"Seed content for route verification."}]'::jsonb,
   '10000000-0000-0000-0000-0000000000aa', 'published', now(), 3, '{}'::jsonb, '/assets/covers/anthony-clark.jpg'),
  ('20000000-0000-0000-0000-0000000000b2', 'today-indie-fund-launch', 'New Micro-Grant Fund Opens for Indie Shorts', 'A regional arts council is funding ten short films this cycle.', 'news', 'today',
   '[{"type":"paragraph","text":"Seed content for route verification."}]'::jsonb,
   '10000000-0000-0000-0000-0000000000aa', 'published', now(), 2, '{}'::jsonb, null),
  ('20000000-0000-0000-0000-0000000000b3', 'today-wrap-party-recap', 'Inside Last Night''s Wrap Party for The Below the Line Issue', 'Cast and crew celebrate the end of principal photography.', 'news', 'today',
   '[{"type":"paragraph","text":"Seed content for route verification."}]'::jsonb,
   '10000000-0000-0000-0000-0000000000aa', 'published', now(), 2, '{}'::jsonb, null),
  -- §27 Fresh Faces — four spotlights, meets the §9 gate. `title` is the
  -- featured person's name here, same convention as §24/§45's spotlight
  -- posts (BUILD-SPEC.md §44/§45 amendment) — not a headline.
  ('20000000-0000-0000-0000-0000000000c1', 'diamond-starr-fresh-face', 'Diamond Starr', 'Rising talent.', 'spotlight', 'fresh_face',
   '[{"type":"paragraph","text":"Seed content for route verification."}]'::jsonb,
   '10000000-0000-0000-0000-0000000000aa', 'published', now(), 2, '{"role_line":"Actress. Producer."}'::jsonb, '/assets/covers/diamond-starr.jpg'),
  ('20000000-0000-0000-0000-0000000000c2', 'ebony-tates-fresh-face', 'Ebony Tates', 'Rising talent.', 'spotlight', 'fresh_face',
   '[{"type":"paragraph","text":"Seed content for route verification."}]'::jsonb,
   '10000000-0000-0000-0000-0000000000aa', 'published', now(), 2, '{"role_line":"Director. Writer."}'::jsonb, '/assets/covers/ebony-tates.jpg'),
  ('20000000-0000-0000-0000-0000000000c3', 'jurian-isabelle-fresh-face', 'Jurian Isabelle', 'Rising talent.', 'spotlight', 'fresh_face',
   '[{"type":"paragraph","text":"Seed content for route verification."}]'::jsonb,
   '10000000-0000-0000-0000-0000000000aa', 'published', now(), 2, '{"role_line":"Actor."}'::jsonb, '/assets/covers/jurian-isabelle.jpg'),
  ('20000000-0000-0000-0000-0000000000c4', 'benet-embry-fresh-face', 'Benet Embry', 'Rising talent.', 'spotlight', 'fresh_face',
   '[{"type":"paragraph","text":"Seed content for route verification."}]'::jsonb,
   '10000000-0000-0000-0000-0000000000aa', 'published', now(), 2, '{"role_line":"Cinematographer."}'::jsonb, '/assets/covers/benet-embry.jpg'),
  -- §25 The Call Sheet — five posts (meets the count gate) but the newest
  -- is 15 days old, past the 14-day staleness limit — §9 VERIFY §25 exists
  -- specifically to prove count-met-but-stale still doesn't render.
  ('20000000-0000-0000-0000-0000000000d1', 'call-sheet-stale-one', 'Stale Call Sheet Item One', 'Seed content for staleness-gate verification.', 'news', 'call_sheet',
   '[{"type":"paragraph","text":"Seed content for route verification."}]'::jsonb,
   '10000000-0000-0000-0000-0000000000aa', 'published', now() - interval '15 days', 2, '{"newsCategory":"Casting"}'::jsonb, null),
  ('20000000-0000-0000-0000-0000000000d2', 'call-sheet-stale-two', 'Stale Call Sheet Item Two', 'Seed content for staleness-gate verification.', 'news', 'call_sheet',
   '[{"type":"paragraph","text":"Seed content for route verification."}]'::jsonb,
   '10000000-0000-0000-0000-0000000000aa', 'published', now() - interval '16 days', 2, '{"newsCategory":"Development"}'::jsonb, null),
  ('20000000-0000-0000-0000-0000000000d3', 'call-sheet-stale-three', 'Stale Call Sheet Item Three', 'Seed content for staleness-gate verification.', 'news', 'call_sheet',
   '[{"type":"paragraph","text":"Seed content for route verification."}]'::jsonb,
   '10000000-0000-0000-0000-0000000000aa', 'published', now() - interval '17 days', 2, '{"newsCategory":"Acquisition"}'::jsonb, null),
  ('20000000-0000-0000-0000-0000000000d4', 'call-sheet-stale-four', 'Stale Call Sheet Item Four', 'Seed content for staleness-gate verification.', 'news', 'call_sheet',
   '[{"type":"paragraph","text":"Seed content for route verification."}]'::jsonb,
   '10000000-0000-0000-0000-0000000000aa', 'published', now() - interval '18 days', 2, '{"newsCategory":"Awards"}'::jsonb, null),
  ('20000000-0000-0000-0000-0000000000d5', 'call-sheet-stale-five', 'Stale Call Sheet Item Five', 'Seed content for staleness-gate verification.', 'news', 'call_sheet',
   '[{"type":"paragraph","text":"Seed content for route verification."}]'::jsonb,
   '10000000-0000-0000-0000-0000000000aa', 'published', now() - interval '19 days', 2, '{"newsCategory":"Streaming"}'::jsonb, null)
on conflict do nothing;

insert into public.magazine_issues (id, issue_number, title, summary, release_date, is_current) values
  ('30000000-0000-0000-0000-0000000000aa', 46, 'The Below the Line Issue', 'Seed content for route verification.', '2026-09-01', true)
on conflict do nothing;

insert into public.products (id, slug, name, description, price, published, digital_file_url) values
  ('40000000-0000-0000-0000-0000000000aa', 'digital-issue-46', 'Issue 46 (Digital)', 'Seed content for route verification.', 500, true, 'https://example.com/issue46.pdf')
on conflict do nothing;
