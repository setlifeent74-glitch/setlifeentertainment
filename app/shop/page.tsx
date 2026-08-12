import type { Metadata } from "next";
import TopNav from "@/components/TopNav";
import ProductCard from "@/components/ProductCard";
import { getPublishedProducts } from "@/lib/queries";

export const metadata: Metadata = {
  title: "The Set Life Shop — Set Life Entertainment",
  description: "Wear it. Play it. Be there.",
};

export default async function ShopPage() {
  const products = await getPublishedProducts();

  return (
    <>
      <TopNav active="/shop" />

      <section className="page-header">
        <div className="wrap">
          <p className="eyebrow">The Set Life Shop</p>
          <h1 className="display">WEAR IT. PLAY IT. BE THERE.</h1>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          {products.length === 0 ? (
            <p>Nothing in the shop yet — check back soon.</p>
          ) : (
            <div className="cover-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
