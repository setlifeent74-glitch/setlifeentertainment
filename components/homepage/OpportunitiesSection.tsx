import ScrollReveal from "@/components/ScrollReveal";
import OpportunitiesTabs from "./OpportunitiesTabs";
import { getOpportunitySectionPosts, isContentGatesEnabled, getSectionColors } from "@/lib/queries";
import { SECTION_GATES } from "@/lib/gates";

/**
 * §32 Opportunities — Gate: 3 live listings, placement=opportunity (unless
 * the §9 admin override is on).
 * No "Set Life Verified" indicator — the spec is explicit that affordance
 * requires a documented verification process that doesn't exist yet.
 */
export default async function OpportunitiesSection() {
  const [posts, gatesEnabled, colors] = await Promise.all([
    getOpportunitySectionPosts(),
    isContentGatesEnabled(),
    getSectionColors(),
  ]);
  if (gatesEnabled && posts.length < SECTION_GATES.opportunity.minimum) return null;
  if (posts.length === 0) return null;

  return (
    <ScrollReveal
      as="section"
      className="opportunities-section"
      style={colors.opportunity ? { backgroundColor: colors.opportunity } : undefined}
    >
      <div className="wrap">
        <div className="opportunities-header">
          <h2 className="headline mask-reveal"><span>OPPORTUNITIES</span></h2>
          <p>YOUR NEXT PROJECT MAY START HERE</p>
        </div>
        <OpportunitiesTabs posts={posts} />
      </div>
    </ScrollReveal>
  );
}
