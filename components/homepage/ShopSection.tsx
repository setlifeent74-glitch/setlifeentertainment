import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import ProductCard from "@/components/ProductCard";
import { getPublishedProducts, isContentGatesEnabled } from "@/lib/queries";
import { SECTION_GATES } from "@/lib/gates";

/**
 * §35 The Set Life Shop — Gate: 1 published product (unless the §9 admin
 * override is on). Reuses ProductCard (built Phase 2) — one component, no
 * branching layout across physical, digital, and ticketed shapes, already
 * satisfying that half of VERIFY §35. "Buy reaches Stripe Checkout" is
 * §48/Phase 12 — the product page's own Buy button is already an honest
 * disabled state until then, not faked here either.
 */
export default async function ShopSection() {
  const [products, gatesEnabled] = await Promise.all([getPublishedProducts(), isContentGatesEnabled()]);
  if (gatesEnabled && products.length < SECTION_GATES.shop.minimum) return null;
  if (products.length === 0) return null;

  return (
    <ScrollReveal as="section" className="shop-section">
      <div className="wrap">
        <div className="shop-header">
          <h2 className="headline">THE SET LIFE SHOP</h2>
          <p>WEAR IT. PLAY IT. BE THERE.</p>
        </div>

        <div className="shop-grid">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="shop-cta">
          <Link href="/shop" className="btn btn-gold">
            Visit the Shop
          </Link>
        </div>
      </div>
    </ScrollReveal>
  );
}
