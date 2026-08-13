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
   '10000000-0000-0000-0000-0000000000aa', 'published', now() - interval '19 days', 2, '{"newsCategory":"Streaming"}'::jsonb, null),
  -- §28 Now in Production — three posts, meets the §9 gate.
  ('20000000-0000-0000-0000-0000000000e1', 'shadow-work-feature', 'Shadow Work', 'A grief drama shooting in Savannah.', 'production', 'production',
   '[{"type":"paragraph","text":"Seed content for route verification."}]'::jsonb,
   '10000000-0000-0000-0000-0000000000aa', 'published', now(), 2, '{"stage":"Shooting","director":"Amara Okonkwo","company":"Blackwater Films","location":"Savannah, GA","genre":"Drama","logline":"A daughter returns home to settle her mother''s affairs and confronts a past she buried."}'::jsonb, '/assets/covers/tray-chaney.jpg'),
  ('20000000-0000-0000-0000-0000000000e2', 'ninth-inning-feature', 'Ninth Inning', 'An indie sports comedy in post-production.', 'production', 'production',
   '[{"type":"paragraph","text":"Seed content for route verification."}]'::jsonb,
   '10000000-0000-0000-0000-0000000000aa', 'published', now() - interval '1 day', 2, '{"stage":"Post","director":"Miles Turner","company":"Set Life Pictures","location":"Atlanta, GA","genre":"Comedy","logline":"A washed-up little league coach gets one more shot at redemption."}'::jsonb, '/assets/covers/oshea-russell.jpg'),
  ('20000000-0000-0000-0000-0000000000e3', 'red-clay-feature', 'Red Clay', 'A period piece in early development.', 'production', 'production',
   '[{"type":"paragraph","text":"Seed content for route verification."}]'::jsonb,
   '10000000-0000-0000-0000-0000000000aa', 'published', now() - interval '2 days', 2, '{"stage":"Development","director":"Simone Blake","company":"Red Clay Collective","location":"Macon, GA","genre":"Period Drama","logline":"Three generations of a farming family navigate the 1960s South."}'::jsonb, null),
  -- §29 The Cut — two reviews, meets the §9 gate (1) with a secondary card too.
  ('20000000-0000-0000-0000-0000000000f1', 'shadow-work-review', 'Shadow Work Is a Quiet Gut-Punch', 'A24-caliber grief drama with a career-best lead performance.', 'review', 'cut',
   '[{"type":"paragraph","text":"Seed content for route verification."}]'::jsonb,
   '10000000-0000-0000-0000-0000000000aa', 'published', now(), 5, '{"score":88,"verdict":"A patient, devastating debut."}'::jsonb, '/assets/covers/asia-clark.jpg'),
  ('20000000-0000-0000-0000-0000000000f2', 'ninth-inning-review', 'Ninth Inning Swings and Mostly Connects', 'Formulaic but genuinely funny.', 'review', 'cut',
   '[{"type":"paragraph","text":"Seed content for route verification."}]'::jsonb,
   '10000000-0000-0000-0000-0000000000aa', 'published', now() - interval '1 day', 4, '{"score":71,"verdict":"Crowd-pleasing, if predictable."}'::jsonb, '/assets/covers/blue-kimble.jpg'),
  -- §30 The Screening Room — one video entry, meets the §9 gate.
  ('20000000-0000-0000-0000-0000000000f3', 'on-set-with-shadow-work', 'On Set with Shadow Work', 'Behind-the-scenes footage from the Savannah shoot.', 'video', 'screening_room',
   '[{"type":"paragraph","text":"Seed content for route verification."}]'::jsonb,
   '10000000-0000-0000-0000-0000000000aa', 'published', now(), 3, '{"videoUrl":"https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4","captionsUrl":"data:text/vtt,WEBVTT%0A%0A00:00:00.000 --> 00:00:04.000%0ABehind the scenes in Savannah.","runtime":"4:12","series":"On Set"}'::jsonb, '/assets/covers/diamond-starr.jpg'),
  -- §31 Behind the Lens — one qualifying post, meets the §9 gate.
  ('20000000-0000-0000-0000-0000000000f4', 'lighting-shadow-work', 'How Shadow Work''s DP Built Its Firelight Look', 'A conversation about bounce cards, practicals, and shooting on short ends.', 'behind_the_lens', 'behind_the_lens',
   '[{"type":"paragraph","text":"Seed content for route verification."}]'::jsonb,
   '10000000-0000-0000-0000-0000000000aa', 'published', now(), 6, '{"camera":"ARRI Alexa Mini","frameNumber":"f/2.0","fps":"24fps"}'::jsonb, '/assets/covers/ebony-tates.jpg'),
  -- §32 Opportunities (homepage) — two more, bringing placement=opportunity to 3.
  ('20000000-0000-0000-0000-0000000000f5', 'grant-indie-shorts-fund', 'Indie Shorts Production Grant', 'Up to $5,000 for shorts shooting in Georgia.', 'opportunity', 'opportunity',
   '[{"type":"paragraph","text":"Seed content for route verification."}]'::jsonb,
   '10000000-0000-0000-0000-0000000000aa', 'published', now(), 2, '{"opportunityType":"Grants","organization":"Georgia Film Fund","location":"Georgia","compensation":"Paid","deadline":"2027-02-15T00:00:00Z"}'::jsonb, null),
  ('20000000-0000-0000-0000-0000000000f6', 'casting-red-clay', 'Casting: Red Clay (Lead + Supporting)', 'Open casting for a 1960s-set period drama.', 'opportunity', 'opportunity',
   '[{"type":"paragraph","text":"Seed content for route verification."}]'::jsonb,
   '10000000-0000-0000-0000-0000000000aa', 'published', now() - interval '1 day', 2, '{"opportunityType":"Casting","organization":"Red Clay Collective","location":"Macon, GA","compensation":"Paid","deadline":"2027-03-01T00:00:00Z"}'::jsonb, null),
  -- §33 Festival Circuit (homepage) — one more, bringing placement=festival to 2.
  ('20000000-0000-0000-0000-0000000000f7', 'set-life-at-coastal-fest', 'Set Life at the Coastal Independent Festival', 'Coverage of an upcoming coastal festival.', 'festival', 'festival',
   '[{"type":"paragraph","text":"Seed content for route verification."}]'::jsonb,
   '10000000-0000-0000-0000-0000000000aa', 'published', now() - interval '1 day', 3, '{"city":"Savannah, GA","startDate":"2027-04-10","submissionDeadline":"2027-02-01"}'::jsonb, null)
on conflict do nothing;

-- §34 Set Life 100 — published honorees for the current list_year, plus the
-- explicit admin-enable flag (§9: "Gate: explicit admin enable").
insert into public.honorees (id, list_year, name, title, discipline, published, rank, portrait_url) values
  ('50000000-0000-0000-0000-0000000000a1', 2026, 'Amara Okonkwo', 'Director', 'Directing', true, 1, '/assets/covers/tray-chaney.jpg'),
  ('50000000-0000-0000-0000-0000000000a2', 2026, 'Simone Blake', 'Writer/Director', 'Directing', true, 2, '/assets/covers/asia-clark.jpg'),
  ('50000000-0000-0000-0000-0000000000a3', 2026, 'Miles Turner', 'Producer', 'Producing', true, 3, '/assets/covers/oshea-russell.jpg')
on conflict do nothing;

update public.site_settings set set_life_100_enabled = true where id = true;

insert into public.magazine_issues (id, issue_number, title, summary, release_date, is_current) values
  ('30000000-0000-0000-0000-0000000000aa', 46, 'The Below the Line Issue', 'Seed content for route verification.', '2026-09-01', true)
on conflict do nothing;

-- §35 The Set Life Shop — one of each product shape (physical, digital,
-- ticketed), all rendered by the same ProductCard component with no
-- branching layout (§35 VERIFY).
insert into public.products (id, slug, name, description, price, published, digital_file_url, image_url, event_date, event_location) values
  ('40000000-0000-0000-0000-0000000000aa', 'digital-issue-46', 'Issue 46 (Digital)', 'Seed content for route verification.', 500, true, 'https://example.com/issue46.pdf', '/assets/covers/tray-chaney.jpg', null, null),
  ('40000000-0000-0000-0000-0000000000ab', 'set-life-tee', 'Set Life Logo Tee', 'Seed content for route verification.', 2800, true, null, '/assets/covers/asia-clark.jpg', null, null),
  ('40000000-0000-0000-0000-0000000000ac', 'launch-party-ticket', 'Issue 46 Launch Party — General Admission', 'Seed content for route verification.', 3500, true, null, '/assets/covers/blue-kimble.jpg', '2027-01-15T19:00:00Z', 'Atlanta, GA')
on conflict do nothing;
