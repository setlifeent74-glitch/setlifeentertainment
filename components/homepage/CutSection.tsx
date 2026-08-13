import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import { getReviewPosts, isContentGatesEnabled, getSectionColors, cardImage } from "@/lib/queries";
import { SECTION_GATES } from "@/lib/gates";

type ReviewMeta = { score?: number; verdict?: string };

/** §29 The Cut — Reviews. Gate: 1 review, placement=cut (unless the §9 admin override is on). */
export default async function CutSection() {
  const [posts, gatesEnabled, colors] = await Promise.all([
    getReviewPosts(),
    isContentGatesEnabled(),
    getSectionColors(),
  ]);
  if (gatesEnabled && posts.length < SECTION_GATES.cut.minimum) return null;
  if (posts.length === 0) return null;

  const [lead, ...secondary] = posts;
  const leadMeta = (lead.meta ?? {}) as ReviewMeta;

  return (
    <ScrollReveal as="section" className="cut-section" style={colors.cut ? { backgroundColor: colors.cut } : undefined}>
      <div className="wrap">
        <div className="cut-header">
          <p className="eyebrow">The Cut</p>
          <h2 className="headline mask-reveal"><span>SET LIFE REVIEWS</span></h2>
        </div>

        <div className="cut-lead">
          <div className="cut-lead-image">
            {cardImage(lead) && <Image src={cardImage(lead)!} alt="" fill sizes="(max-width: 767px) 100vw, 800px" />}
          </div>
          <div className="cut-lead-body">
            {typeof leadMeta.score === "number" && <span className="cut-score">{leadMeta.score}</span>}
            {leadMeta.verdict && <p className="cut-verdict">{leadMeta.verdict}</p>}
            <h3>{lead.title}</h3>
            <span className="cut-byline">By {lead.authors.name}</span>
            <div className="cut-cta">
              <Link href={`/story/${lead.slug}`} className="btn btn-primary">
                Read the Review
              </Link>
            </div>
          </div>
        </div>

        {secondary.length > 0 && (
          <div className="cut-secondary">
            {secondary.slice(0, 4).map((post) => {
              const meta = (post.meta ?? {}) as ReviewMeta;
              return (
                <Link href={`/story/${post.slug}`} key={post.id} className="cut-secondary-card">
                  {cardImage(post) && (
                    <div className="cut-secondary-image">
                      <Image src={cardImage(post)!} alt="" fill sizes="(max-width: 767px) 100vw, 25vw" />
                    </div>
                  )}
                  {typeof meta.score === "number" && <span className="cut-secondary-score">{meta.score}</span>}
                  <h4>{post.title}</h4>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </ScrollReveal>
  );
}
