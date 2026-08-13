-- Separate image for the homepage section card/thumbnail, distinct from the
-- article page's hero banner (hero_image_url). Optional — when unset, every
-- homepage section falls back to hero_image_url exactly as before, so
-- existing posts render unchanged.
alter table public.posts
  add column card_image_url text;
