import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import { getFestivalSectionPosts, isContentGatesEnabled, getSectionColors, cardImage } from "@/lib/queries";
import { cardImagePosition } from "@/lib/post-image";
import { SECTION_GATES } from "@/lib/gates";

type FestivalMeta = { city?: string; startDate?: string; endDate?: string; submissionDeadline?: string };

function formatDate(iso?: string) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** §33 Festival Circuit — Gate: 2 upcoming festivals, placement=festival, chronological (unless the §9 admin override is on). */
export default async function FestivalSection() {
  const [posts, gatesEnabled, colors] = await Promise.all([
    getFestivalSectionPosts(),
    isContentGatesEnabled(),
    getSectionColors(),
  ]);
  if (gatesEnabled && posts.length < SECTION_GATES.festival.minimum) return null;
  if (posts.length === 0) return null;

  const [featured, ...upcoming] = posts;
  const featuredMeta = (featured.meta ?? {}) as FestivalMeta;

  return (
    <ScrollReveal
      as="section"
      className="festival-section"
      style={colors.festival ? { backgroundColor: colors.festival } : undefined}
    >
      <div className="wrap">
        <div className="festival-header">
          <h2 className="headline mask-reveal"><span>FESTIVAL CIRCUIT</span></h2>
          <p>WHERE INDEPENDENT FILM MEETS THE WORLD</p>
        </div>

        <Link href={`/story/${featured.slug}`} className="festival-featured">
          {cardImage(featured) && (
            <Image
              src={cardImage(featured)!}
              alt=""
              fill
              sizes="(max-width: 767px) 100vw, 1200px"
              style={cardImagePosition(featured)}
            />
          )}
          <div className="festival-featured-overlay">
            <h3>{featured.title}</h3>
            <p>
              {[featuredMeta.city, formatDate(featuredMeta.startDate)].filter(Boolean).join(" · ")}
              {featuredMeta.submissionDeadline && ` — Submissions close ${formatDate(featuredMeta.submissionDeadline)}`}
            </p>
          </div>
        </Link>

        {upcoming.length > 0 && (
          <ol className="festival-timeline">
            {upcoming.slice(0, 8).map((post) => {
              const meta = (post.meta ?? {}) as FestivalMeta;
              return (
                <li key={post.id}>
                  <Link href={`/story/${post.slug}`}>
                    <time dateTime={meta.startDate}>{formatDate(meta.startDate)}</time>
                    <span className="festival-timeline-name">{post.title}</span>
                    {meta.city && <span className="festival-timeline-city">{meta.city}</span>}
                  </Link>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </ScrollReveal>
  );
}
