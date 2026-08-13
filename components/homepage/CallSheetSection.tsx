import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import { getCallSheetPosts, isContentGatesEnabled, getSectionColors } from "@/lib/queries";
import { SECTION_GATES, ageInDays } from "@/lib/gates";

const CATEGORY_ACCENT: Record<string, "gold" | "red"> = {
  Casting: "gold",
  Development: "gold",
  "In Production": "gold",
  Acquisition: "red",
  Distribution: "red",
  Awards: "gold",
  Streaming: "red",
  Business: "gold",
};

/** §25 The Call Sheet — Gate: 5 posts, placement=call_sheet, newest within 14 days (unless the §9 admin override is on). */
export default async function CallSheetSection() {
  const [posts, gatesEnabled, colors] = await Promise.all([
    getCallSheetPosts(),
    isContentGatesEnabled(),
    getSectionColors(),
  ]);
  if (posts.length === 0) return null;
  if (gatesEnabled) {
    if (posts.length < SECTION_GATES.call_sheet.minimum) return null;
    const newest = posts[0];
    if (ageInDays(newest.published_at ?? newest.created_at) > SECTION_GATES.call_sheet.staleAfterDays) return null;
  }

  return (
    <ScrollReveal
      as="section"
      className="call-sheet-section"
      style={colors.call_sheet ? { backgroundColor: colors.call_sheet } : undefined}
    >
      <div className="wrap">
        <div className="call-sheet-header">
          <h2 className="headline mask-reveal"><span>THE CALL SHEET</span></h2>
          <p>WHAT&apos;S MOVING IN INDEPENDENT FILM TODAY</p>
        </div>

        <div className="call-sheet-box">
          <ul className="call-sheet-list">
            {posts.slice(0, 8).map((post) => {
              const meta = (post.meta ?? {}) as { newsCategory?: string };
              const label = meta.newsCategory ?? "News";
              const accent = CATEGORY_ACCENT[label] ?? "gold";
              return (
                <li key={post.id} className="call-sheet-row">
                  <Link href={`/story/${post.slug}`}>
                    <span className={`call-sheet-category call-sheet-category--${accent}`}>{label}</span>
                    <span className="call-sheet-headline">{post.title}</span>
                    <time className="call-sheet-time" dateTime={post.published_at ?? undefined}>
                      {post.published_at &&
                        new Date(post.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </time>
                    <span className="call-sheet-arrow" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </ScrollReveal>
  );
}
