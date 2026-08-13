import type { PostCategory } from "@/lib/queries";

export type MetaFieldDef =
  | { key: string; label: string; type: "text" }
  | { key: string; label: string; type: "textarea" }
  | { key: string; label: string; type: "number" }
  | { key: string; label: string; type: "datetime" }
  | { key: string; label: string; type: "credits-list" }
  | { key: string; label: string; type: "badges" };

/**
 * §45 — category-specific `meta` fields, generically rendered
 * (MetaFieldsPanel.tsx) rather than one bespoke form per category. §44's
 * `meta` JSON column backs all of these; the field key is the exact
 * property name every homepage section component already reads.
 */
export const META_FIELDS_BY_CATEGORY: Partial<Record<PostCategory, MetaFieldDef[]>> = {
  spotlight: [
    { key: "role_line", label: "Role Line (e.g. \"Actress. Producer.\")", type: "text" },
    { key: "credits", label: "Credits / Filmography", type: "credits-list" },
    { key: "platformBadges", label: "Now Streaming On", type: "badges" },
  ],
  below_the_line: [{ key: "department", label: "Department (e.g. \"Gaffer\")", type: "text" }],
  review: [
    { key: "score", label: "Score", type: "number" },
    { key: "verdict", label: "Verdict", type: "text" },
  ],
  video: [
    { key: "videoUrl", label: "Video URL", type: "text" },
    { key: "captionsUrl", label: "Captions URL (WebVTT)", type: "text" },
    { key: "runtime", label: "Runtime", type: "text" },
    { key: "series", label: "Series", type: "text" },
  ],
  opportunity: [
    { key: "opportunityType", label: "Type (Casting/Crew/Jobs/Grants/Labs/Fellowships/Festivals)", type: "text" },
    { key: "organization", label: "Organization", type: "text" },
    { key: "location", label: "Location", type: "text" },
    { key: "compensation", label: "Compensation", type: "text" },
    { key: "deadline", label: "Deadline", type: "datetime" },
  ],
  festival: [
    { key: "city", label: "City", type: "text" },
    { key: "startDate", label: "Start Date", type: "datetime" },
    { key: "endDate", label: "End Date", type: "datetime" },
    { key: "submissionDeadline", label: "Submission Deadline", type: "datetime" },
  ],
  production: [
    { key: "stage", label: "Stage (Development/Pre-Production/Shooting/Post/Festival/Distribution)", type: "text" },
    { key: "director", label: "Director", type: "text" },
    { key: "company", label: "Production Company", type: "text" },
    { key: "location", label: "Location", type: "text" },
    { key: "genre", label: "Genre", type: "text" },
    { key: "logline", label: "Logline", type: "textarea" },
  ],
  news: [{ key: "newsCategory", label: "News Category (Casting/Development/In Production/Acquisition/Distribution/Awards/Streaming/Business)", type: "text" }],
  behind_the_lens: [
    { key: "camera", label: "Camera", type: "text" },
    { key: "frameNumber", label: "Frame / Aperture", type: "text" },
    { key: "fps", label: "FPS", type: "text" },
  ],
};

export const PLATFORM_OPTIONS = [
  "Tubi",
  "Prime Video",
  "Amazon",
  "Apple TV",
  "YouTube",
  "Roku",
  "Fire TV",
  "Samsung TV Plus",
  "LG Channels",
];
