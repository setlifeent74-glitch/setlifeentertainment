/**
 * The 16 homepage content sections (everything inside `.homepage-sections`
 * in app/page.tsx, i.e. not the hero) that support a per-section canvas
 * color override. Shared between the admin picker UI and each section
 * component so the id strings only live in one place.
 */
export const SECTION_COLOR_IDS = [
  "today",
  "current_issue",
  "spotlight_feature",
  "call_sheet",
  "below_the_line",
  "fresh_face",
  "production",
  "cut",
  "screening_room",
  "behind_the_lens",
  "opportunity",
  "festival",
  "set_life_100",
  "shop",
  "instagram",
  "newsletter",
] as const;

export type SectionColorId = (typeof SECTION_COLOR_IDS)[number];

export const SECTION_COLOR_LABELS: Record<SectionColorId, string> = {
  today: "Today on the Set",
  current_issue: "Current Magazine Issue",
  spotlight_feature: "Indie Spotlight",
  call_sheet: "The Call Sheet",
  below_the_line: "Below the Line",
  fresh_face: "Fresh Faces",
  production: "Now in Production",
  cut: "The Cut",
  screening_room: "The Screening Room",
  behind_the_lens: "Behind the Lens",
  opportunity: "Opportunities",
  festival: "Festival Circuit",
  set_life_100: "Set Life 100",
  shop: "The Set Life Shop",
  instagram: "From @setlifeentertainment",
  newsletter: "Newsletter Signup",
};
