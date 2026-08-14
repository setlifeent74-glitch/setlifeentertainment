import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import { getBehindTheLensPost, getSectionColors, cardImage } from "@/lib/queries";

type LensMeta = { camera?: string; frameNumber?: string; fps?: string };

/**
 * §31 Behind the Lens — Gate: 1 qualifying post, placement=behind_the_lens.
 * §31 VERIFY: DOM reading order matches visual order at both breakpoints —
 * source order here (still, headline, portrait+byline, text) is exactly
 * the mobile stacking order the spec calls for; desktop is a two-column
 * split of that same order, not a reordering of it.
 */
export default async function BehindTheLensSection() {
  const [post, colors] = await Promise.all([getBehindTheLensPost(), getSectionColors()]);
  if (!post) return null;

  const meta = (post.meta ?? {}) as LensMeta;
  const technical = [meta.frameNumber, meta.camera, meta.fps].filter(Boolean).join(" · ");

  return (
    <ScrollReveal
      as="section"
      className="lens-section"
      style={colors.behind_the_lens ? { backgroundColor: colors.behind_the_lens } : undefined}
    >
      <div className="wrap lens-grid">
        <div className="lens-still">
          {/* eslint-disable-next-line @next/next/no-img-element -- card image, natural aspect ratio, no crop */}
          {cardImage(post) && <img src={cardImage(post)!} alt="" />}
        </div>

        <div className="lens-content">
          <p className="eyebrow">Behind the Lens</p>
          <h2 className="headline lens-title mask-reveal">
            <span>DIRECTORS, CINEMATOGRAPHERS &amp; THE LANGUAGE OF FILM</span>
          </h2>

          <div className="lens-byline">
            <span className="lens-name">{post.title}</span>
            <span className="lens-author">By {post.authors.name}</span>
          </div>

          {post.dek && <p className="lens-text">{post.dek}</p>}
          {technical && <p className="lens-technical">{technical}</p>}

          <Link href={`/story/${post.slug}`} className="btn btn-gold">
            Read the Feature
          </Link>
        </div>
      </div>
    </ScrollReveal>
  );
}
