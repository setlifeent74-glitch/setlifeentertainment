-- Crop/position controls (see components/admin/ImageFitControl.tsx) for
-- every remaining single-image upload in the CMS: author avatars, magazine
-- issue covers, Set Life 100 honoree portraits, and shop product images.
-- Posts already carry the equivalent hero/card image settings inside
-- their JSONB `meta` column; these are dedicated columns since authors,
-- magazine_issues, honorees, and products have no meta column.
alter table public.authors
  add column avatar_fit text not null default 'cover',
  add column avatar_position text not null default 'center';

alter table public.magazine_issues
  add column cover_fit text not null default 'cover',
  add column cover_position text not null default 'center';

alter table public.honorees
  add column portrait_fit text not null default 'cover',
  add column portrait_position text not null default 'center';

alter table public.products
  add column image_fit text not null default 'cover',
  add column image_position text not null default 'center';
