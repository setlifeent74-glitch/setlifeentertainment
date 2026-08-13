import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import { getTodayPosts, isContentGatesEnabled, getSectionColors } from "@/lib/queries";
import { SECTION_GATES } from "@/lib/gates";

/** §22 Today on the Set — Gate: 3 posts, placement=today (unless the §9 admin override is on). */
export default async function TodaySection() {
  const [posts, gatesEnabled, colors] = await Promise.all([getTodayPosts(), isContentGatesEnabled(), getSectionColors()]);
  if (gatesEnabled && posts.length < SECTION_GATES.today.minimum) return null;
  if (posts.length === 0) return null;

  const [primary, ...secondary] = posts;
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <ScrollReveal as="section" className="today-section" style={colors.today ? { backgroundColor: colors.today } : undefined}>
      <div className="wrap">
        <div className="today-header">
          <h2 className="headline mask-reveal"><span>TODAY ON THE SET</span></h2>
          <span className="today-date">{today}</span>
          <Link href="/category/news" className="today-view-all">
            View All Stories
          </Link>
        </div>

        <div className="today-grid">
          <div className="today-primary">
            <Link href={`/story/${primary.slug}`}>
              <div className="today-primary-image">
                {primary.hero_image_url ? (
                  <Image src={primary.hero_image_url} alt="" fill sizes="(max-width: 767px) 100vw, 58vw" />
                ) : (
                  // No hero image on the lead post yet — a branded placeholder
                  // so the slot never reads as broken/empty.
                  <div className="today-primary-image-placeholder" aria-hidden="true">
                    <span>SET LIFE</span>
                  </div>
                )}
              </div>
              <h3 className="today-primary-headline">{primary.title}</h3>
            </Link>
            <span className="today-byline">
              By <Link href={`/authors/${primary.authors.slug}`}>{primary.authors.name}</Link>
            </span>
          </div>

          <div className="today-secondary">
            {secondary.slice(0, 3).map((post) => (
              <Link href={`/story/${post.slug}`} key={post.id} className="today-secondary-item">
                <span className="today-secondary-category">{post.category.replace(/_/g, " ")}</span>
                <h4>{post.title}</h4>
                <span className="today-secondary-meta">
                  {post.reading_time ? `${post.reading_time} min read` : ""}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}
