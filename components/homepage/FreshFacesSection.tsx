import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import FreshFacesRail from "./FreshFacesRail";
import { getFreshFacesPosts } from "@/lib/queries";
import { SECTION_GATES } from "@/lib/gates";

/** §27 Fresh Faces — Gate: 4 spotlights, placement=fresh_face. */
export default async function FreshFacesSection() {
  const posts = await getFreshFacesPosts();
  if (posts.length < SECTION_GATES.fresh_face.minimum) return null;

  return (
    <ScrollReveal as="section" className="fresh-faces-section">
      <div className="wrap">
        <div className="fresh-faces-header">
          <h2 className="headline">FRESH FACES</h2>
          <p>THE NEXT NAMES YOU&apos;LL KNOW</p>
        </div>
      </div>

      <FreshFacesRail>
        {posts.map((post) => {
          const meta = (post.meta ?? {}) as { role_line?: string };
          return (
            <Link href={`/story/${post.slug}`} key={post.id} className="fresh-face-card">
              <div className="fresh-face-image">
                {post.hero_image_url && (
                  <Image src={post.hero_image_url} alt="" fill sizes="(max-width: 767px) 78vw, 300px" />
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
