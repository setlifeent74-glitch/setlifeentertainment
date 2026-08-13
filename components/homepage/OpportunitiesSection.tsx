import ScrollReveal from "@/components/ScrollReveal";
import OpportunitiesTabs from "./OpportunitiesTabs";
import { getOpportunitySectionPosts } from "@/lib/queries";
import { SECTION_GATES } from "@/lib/gates";

/**
 * §32 Opportunities — Gate: 3 live listings, placement=opportunity.
 * No "Set Life Verified" indicator — the spec is explicit that affordance
 * requires a documented verification process that doesn't exist yet.
 */
export default async function OpportunitiesSection() {
  const posts = await getOpportunitySectionPosts();
  if (posts.length < SECTION_GATES.opportunity.minimum) return null;

  return (
    <ScrollReveal as="section" className="opportunities-section">
      <div className="wrap">
        <div className="opportunities-header">
          <h2 className="headline">OPPORTUNITIES</h2>
          <p>YOUR NEXT PROJECT MAY START HERE</p>
        </div>
        <OpportunitiesTabs posts={posts} />
      </div>
    </ScrollReveal>
  );
}
