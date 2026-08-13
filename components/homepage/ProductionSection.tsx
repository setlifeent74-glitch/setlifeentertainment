import ScrollReveal from "@/components/ScrollReveal";
import ProductionFilter from "./ProductionFilter";
import { getProductionPosts, isContentGatesEnabled, getSectionColors } from "@/lib/queries";
import { SECTION_GATES } from "@/lib/gates";

/** §28 Now in Production — Gate: 3 entries, placement=production (unless the §9 admin override is on). */
export default async function ProductionSection() {
  const [posts, gatesEnabled, colors] = await Promise.all([
    getProductionPosts(),
    isContentGatesEnabled(),
    getSectionColors(),
  ]);
  if (gatesEnabled && posts.length < SECTION_GATES.production.minimum) return null;
  if (posts.length === 0) return null;

  return (
    <ScrollReveal
      as="section"
      className="production-section"
      style={colors.production ? { backgroundColor: colors.production } : undefined}
    >
      <div className="wrap">
        <div className="production-header">
          <h2 className="headline mask-reveal"><span>NOW IN PRODUCTION</span></h2>
        </div>
        <ProductionFilter posts={posts} />
      </div>
    </ScrollReveal>
  );
}
