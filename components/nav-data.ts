/**
 * §16 Global Navigation — link map, single source of truth for both the
 * main nav and the footer columns (§38).
 */
export type NavLeaf = { href: string; label: string };
export type NavItem = NavLeaf | { label: string; mega: NavLeaf[] };

export const PRIMARY_NAV: NavItem[] = [
  { href: "/issues", label: "Magazine" },
  { href: "/category/article", label: "Film & TV" },
  { href: "/category/spotlight", label: "Spotlights" },
  { href: "/category/review", label: "Reviews" },
  { href: "/category/video", label: "Watch" },
  {
    label: "Industry",
    mega: [
      { href: "/category/news", label: "Industry News" },
      { href: "/opportunities", label: "Opportunities" },
      { href: "/festivals", label: "Festivals" },
      { href: "/category/production", label: "Production" },
    ],
  },
  // Shop deliberately appears in both the primary taxonomy and the
  // persistent right-side utility row (§16: "intentional, not a duplicate
  // bug; commerce gets two paths to entry").
  { href: "/shop", label: "Shop" },
];

export const UTILITY_NAV: NavLeaf[] = [
  { href: "/search", label: "Search" },
  { href: "/submit", label: "Submit" },
  { href: "/shop", label: "Shop" },
];

export function isNavLeaf(item: NavItem): item is NavLeaf {
  return "href" in item;
}

/**
 * §38 Editorial Footer — "Every label above resolves per the link map in
 * §16. All five links share that single source of truth with the main
 * nav." Explore/Industry are derived directly from PRIMARY_NAV rather than
 * re-declared, so the two surfaces can't drift apart.
 */
export const FOOTER_EXPLORE: NavLeaf[] = PRIMARY_NAV.filter(isNavLeaf).slice(0, 5);
export const FOOTER_INDUSTRY: NavLeaf[] = (PRIMARY_NAV.find((item) => !isNavLeaf(item) && item.label === "Industry") as Extract<NavItem, { mega: NavLeaf[] }>).mega;

export const FOOTER_SET_LIFE: NavLeaf[] = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/shop", label: "Shop" },
  { href: "/submit", label: "Submit" },
];

export const FOOTER_LEGAL: NavLeaf[] = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/editorial-policy", label: "Editorial Policy" },
  { href: "/review-policy", label: "Review Policy" },
  { href: "/accessibility", label: "Accessibility" },
];
