-- §9 Content Readiness Gates — global admin override. Each homepage
-- section's minimum-to-render threshold (lib/gates.ts SECTION_GATES) can be
-- bypassed site-wide with a single switch, so everything currently
-- published shows up right away even if a section hasn't hit its usual
-- staffing/content minimum yet. Same table/pattern as set_life_100_enabled.
alter table public.site_settings
  add column content_gates_enabled boolean not null default true;
