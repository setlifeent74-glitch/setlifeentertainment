import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import { getBehindTheLensPost } from "@/lib/queries";

type LensMeta = { camera?: string; frameNumber?: string; fps?: string };

/**
 * §31 Behind the Lens — Gate: 1 qualifying post, placement=behind_the_lens.
 * §31 VERIFY: DOM reading order matches visual order at both breakpoints —
 * source order here (still, headline, portrait+byline, text) is exactly
 * the mobile stacking order the spec calls for; desktop is a two-column
 * split of that same order, not a reordering of it.
 */
export default async function BehindTheLensSection() {
  const post = await getBehindTheLensPost();
  if (!post) return null;

  const meta = (post.meta ?? {}) as LensMeta;
  const technical = [meta.frameNumber, meta.camera, meta.fps].filter(Boolean).join(" · ");

  return (
    <ScrollReveal as="section" className="lens-section">
      <div className="wrap lens-grid">
        <div className="lens-still">
          {post.hero_image_url && <Image src={post.hero_image_url} alt="" fill sizes="(max-width: 767px) 100vw, 58vw" />}
        </div>

        <div className="lens-content">
          <p className="eyebrow">Behind the Lens</p>
          <h2 className="headline lens-title">DIRECTORS, CINEMATOGRAPHERS &amp; THE LANGUAGE OF FILM</h2>

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
