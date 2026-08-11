export type Category = "actor" | "director" | "producer";

export type Cover = {
  slug: string;
  namePrefix: string;
  nameEm: string;
  role: string;
  issueLabel: string;
  category: Category;
  image: string;
  alt: string;
};

// Order and content match issues.html exactly (§7 Phase 1 — zero visual change).
export const COVERS: Cover[] = [
  { slug: "kaamel-diezel-hasaun", namePrefix: "Kaamel Diezel", nameEm: "Hasaun", role: "Detroit Raised. Legacy in Motion.", issueLabel: "Cover Story", category: "actor", image: "/assets/covers/kaamel-diezel-hasaun.jpg", alt: "Kaamel Diezel Hasaun — Set Life Entertainment cover" },
  { slug: "asia-clark", namePrefix: "Asia", nameEm: "Clark", role: "Actress. Writer. Director.", issueLabel: "Cover Story", category: "director", image: "/assets/covers/asia-clark.jpg", alt: "Asia Clark — Set Life Entertainment cover" },
  { slug: "oshea-russell", namePrefix: "Oshea", nameEm: "Russell", role: "Actor. Athlete. Authentic.", issueLabel: "Cover Story", category: "actor", image: "/assets/covers/oshea-russell.jpg", alt: "Oshea Russell — Set Life Entertainment cover" },
  { slug: "tray-chaney", namePrefix: "Tray", nameEm: "Chaney", role: "Survivor. Father. Visionary.", issueLabel: "Cover Story", category: "actor", image: "/assets/covers/tray-chaney.jpg", alt: "Tray Chaney — Set Life Entertainment cover" },
  { slug: "elijah-lamar", namePrefix: "Elijah", nameEm: "Lamar", role: "The New Face of Independent Cinema", issueLabel: "Issue 45", category: "actor", image: "/assets/covers/elijah-lamar.jpg", alt: "Elijah Lamar — Set Life Entertainment cover" },
  { slug: "jurian-isabelle", namePrefix: "Jurian", nameEm: "Isabelle", role: "Vision. Purpose. Storytelling.", issueLabel: "Issue 43", category: "director", image: "/assets/covers/jurian-isabelle.jpg", alt: "Jurian Isabelle — Set Life Entertainment cover" },
  { slug: "ebony-tates", namePrefix: "Ebony", nameEm: "Tates", role: "Fearless. Versatile. Unstoppable.", issueLabel: "Issue 42", category: "actor", image: "/assets/covers/ebony-tates.jpg", alt: "Ebony Tates — Set Life Entertainment cover" },
  { slug: "leslie-sheri", namePrefix: "Leslie", nameEm: "Sheri", role: "Turning Passion Into Purpose", issueLabel: "Issue 39", category: "actor", image: "/assets/covers/leslie-sheri.jpg", alt: "Leslie Sheri — Set Life Entertainment cover" },
  { slug: "marion-hamm-iii", namePrefix: "Marion", nameEm: "Hamm III", role: "Commanding the Screen", issueLabel: "Issue 38", category: "actor", image: "/assets/covers/marion-hamm-iii.jpg", alt: "Marion Hamm III — Set Life Entertainment cover" },
  { slug: "benet-embry", namePrefix: "Benét", nameEm: "Embry", role: "Vision. Purpose. Impact.", issueLabel: "Issue 36", category: "director", image: "/assets/covers/benet-embry.jpg", alt: "Benét Embry — Set Life Entertainment cover" },
  { slug: "diamond-starr", namePrefix: "Diamond", nameEm: "Starr", role: "Building Her Legacy", issueLabel: "Issue 35", category: "actor", image: "/assets/covers/diamond-starr.jpg", alt: "Diamond Starr — Set Life Entertainment cover" },
  { slug: "aequila-smith", namePrefix: "Aequila", nameEm: "Smith", role: "Crafting Stories That Connect", issueLabel: "Issue 34", category: "director", image: "/assets/covers/aequila-smith.jpg", alt: "Aequila Smith — Set Life Entertainment cover" },
  { slug: "dennis-la-white", namePrefix: "Dennis L.A.", nameEm: "White", role: "Built for the Moment", issueLabel: "Issue 32", category: "actor", image: "/assets/covers/dennis-la-white.jpg", alt: "Dennis L.A. White — Set Life Entertainment cover" },
  { slug: "blue-kimble", namePrefix: "Blue", nameEm: "Kimble", role: "Leading With Purpose", issueLabel: "Issue 31", category: "actor", image: "/assets/covers/blue-kimble.jpg", alt: "Blue Kimble — Set Life Entertainment cover" },
  { slug: "ripp-parker", namePrefix: 'Robert "Ripp"', nameEm: "Parker", role: "Turning Vision Into Cinema", issueLabel: "Issue 30", category: "director", image: "/assets/covers/ripp-parker.jpg", alt: "Robert Ripp Parker — Set Life Entertainment cover" },
  { slug: "taylor-latham", namePrefix: "Taylor", nameEm: "Latham", role: "The Next Chapter of Indie Cinema", issueLabel: "Issue 29", category: "actor", image: "/assets/covers/taylor-latham.jpg", alt: "Taylor Latham — Set Life Entertainment cover" },
  { slug: "nunu-thurman", namePrefix: "Nunu", nameEm: "Thurman", role: "Leading With Grace", issueLabel: "Issue 28", category: "actor", image: "/assets/covers/nunu-thurman.jpg", alt: "Nunu Thurman — Set Life Entertainment cover" },
  { slug: "anthony-clark", namePrefix: "Anthony", nameEm: "Clark", role: "Building Legacies Through Storytelling", issueLabel: "Issue 27", category: "producer", image: "/assets/covers/anthony-clark.jpg", alt: "Anthony Clark — Set Life Entertainment cover" },
  { slug: "silk-white", namePrefix: "Silk", nameEm: "White", role: "The Storyteller Who Built an Empire", issueLabel: "Issue 25", category: "director", image: "/assets/covers/silk-white.jpg", alt: "Silk White — Set Life Entertainment cover" },
  { slug: "mann-robinson", namePrefix: "Mann", nameEm: "Robinson", role: "The Architect of Independent Film", issueLabel: "Issue 13", category: "director", image: "/assets/covers/mann-robinson.jpg", alt: "Mann Robinson — Set Life Entertainment cover" },
  { slug: "michael-james-sewell-jr", namePrefix: "Michael James", nameEm: "Sewell Jr", role: "The New Leading Man", issueLabel: "Issue 12", category: "actor", image: "/assets/covers/michael-james-sewell-jr.jpg", alt: "Michael James Sewell Jr — Set Life Entertainment cover" },
];

export function coverBySlug(slug: string): Cover | undefined {
  return COVERS.find((c) => c.slug === slug);
}
