-- Per-homepage-section canvas/background color override. Mirrors the
-- per-article `meta.canvasColor` feature, but scoped to the 16 homepage
-- sections (SECTION_GATES ids + "newsletter"). Stored as a single JSONB
-- map of section id -> hex color string on the site_settings singleton so
-- it's editable from one admin panel without a table per section.
alter table public.site_settings
  add column section_colors jsonb not null default '{}'::jsonb;
