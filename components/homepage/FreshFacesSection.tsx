import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import FreshFacesRail from "./FreshFacesRail";
import { getFreshFacesPosts, isContentGatesEnabled, getSectionColors, cardImage } from "@/lib/queries";
import { SECTION_GATES } from "@/lib/gates";

/** §27 Fresh Faces — Gate: 4 spotlights, placement=fresh_face (unless the §9 admin override is on). */
export default async function FreshFacesSection() {
  const [posts, gatesEnabled, colors] = await Promise.all([
    getFreshFacesPosts(),
    isContentGatesEnabled(),
    getSectionColors(),
  ]);
  if (gatesEnabled && posts.length < SECTION_GATES.fresh_face.minimum) return null;
  if (posts.length === 0) return null;

  return (
    <ScrollReveal
      as="section"
      className="fresh-faces-section"
      style={colors.fresh_face ? { backgroundColor: colors.fresh_face } : undefined}
    >
      <div className="wrap">
        <div className="fresh-faces-header">
          <h2 className="headline mask-reveal"><span>FRESH FACES</span></h2>
          <p>THE NEXT NAMES YOU&apos;LL KNOW</p>
        </div>
      </div>

      <FreshFacesRail>
        {posts.map((post) => {
          const meta = (post.meta ?? {}) as { role_line?: string };
          return (
            <Link href={`/story/${post.slug}`} key={post.id} className="fresh-face-card">
              <div className="fresh-face-image">
                {cardImage(post) && (
                  <Image src={cardImage(post)!} alt="" fill sizes="(max-width: 767px) 78vw, 300px" />
                )}
              </div>
              <span className="fresh-face-name">{post.title}</span>
              {meta.role_line && <span className="fresh-face-credits">{meta.role_line}</span>}
            </Link>
          );
        })}
      </FreshFacesRail>
    </ScrollReveal>
  );
}
