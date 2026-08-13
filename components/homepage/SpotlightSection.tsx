import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import { getSpotlightFeature, getSectionColors, cardImage } from "@/lib/queries";

/** §24 Indie Spotlight — Gate: 1 spotlight, placement=spotlight_feature. */
export default async function SpotlightSection() {
  const [post, colors] = await Promise.all([getSpotlightFeature(), getSectionColors()]);
  if (!post) return null;

  const meta = (post.meta ?? {}) as { role_line?: string };

  return (
    <ScrollReveal
      as="section"
      className="spotlight-section"
      style={colors.spotlight_feature ? { backgroundColor: colors.spotlight_feature } : undefined}
    >
      <div className="spotlight-portrait">
        <span className="spotlight-bg-word spotlight-bg-word--top" aria-hidden="true">
          INDIE
        </span>
        {cardImage(post) && (
          <Image src={cardImage(post)!} alt="" fill sizes="(max-width: 767px) 100vw, 58vw" priority={false} />
        )}
        <span className="spotlight-bg-word spotlight-bg-word--bottom" aria-hidden="true">
          SPOTLIGHT
        </span>
      </div>

      <div className="spotlight-copy">
        <p className="eyebrow">Indie Spotlight</p>
        <h2 className="spotlight-name display mask-reveal"><span>{post.title}</span></h2>
        {meta.role_line && <p className="spotlight-profession">{meta.role_line}</p>}
        {post.dek && <blockquote className="spotlight-quote">&ldquo;{post.dek}&rdquo;</blockquote>}
        <div className="spotlight-cta">
          <Link href={`/story/${post.slug}`} className="btn btn-primary">
            Read Profile
          </Link>
        </div>
      </div>
    </ScrollReveal>
  );
}
