import ScrollReveal from "@/components/ScrollReveal";
import ProductionFilter from "./ProductionFilter";
import { getProductionPosts, isContentGatesEnabled } from "@/lib/queries";
import { SECTION_GATES } from "@/lib/gates";

/** §28 Now in Production — Gate: 3 entries, placement=production (unless the §9 admin override is on). */
export default async function ProductionSection() {
  const [posts, gatesEnabled] = await Promise.all([getProductionPosts(), isContentGatesEnabled()]);
  if (gatesEnabled && posts.length < SECTION_GATES.production.minimum) return null;
  if (posts.length === 0) return null;

  return (
    <ScrollReveal as="section" className="production-section">
      <div className="wrap">
        <div className="production-header">
          <h2 className="headline">NOW IN PRODUCTION</h2>
        </div>
        <ProductionFilter posts={posts} />
      </div>
    </ScrollReveal>
  );
}
