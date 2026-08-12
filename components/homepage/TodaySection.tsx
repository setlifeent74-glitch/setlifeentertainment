import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import { getTodayPosts } from "@/lib/queries";
import { SECTION_GATES } from "@/lib/gates";

/** §22 Today on Set Life — Gate: 3 posts, placement=today. */
export default async function TodaySection() {
  const posts = await getTodayPosts();
  if (posts.length < SECTION_GATES.today.minimum) return null;

  const [primary, ...secondary] = posts;
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <ScrollReveal as="section" className="today-section">
      <div className="wrap">
        <div className="today-header">
          <h2 className="headline">TODAY ON SET LIFE</h2>
          <span className="today-date">{today}</span>
          <Link href="/category/news" className="today-view-all">
            View All Stories
          </Link>
        </div>

        <div className="today-grid">
          <div className="today-primary">
            <Link href={`/story/${primary.slug}`}>
              {primary.hero_image_url && (
                <div className="today-primary-image">
                  <Image src={primary.hero_image_url} alt="" fill sizes="(max-width: 767px) 100vw, 58vw" />
                </div>
              )}
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
