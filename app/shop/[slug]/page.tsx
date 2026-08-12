import { notFound } from "next/navigation";
import type { Metadata } from "next";
import TopNav from "@/components/TopNav";
import { getProductBySlug } from "@/lib/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return { title: `${product.name} — Set Life Shop` };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const isDigital = Boolean(product.digital_file_url);
  const isTicketed = Boolean(product.event_date);

  return (
    <>
      <TopNav active="/shop" />

      <section className="section">
        <div className="wrap two-col">
          <div className="panel panel-cover">
            {product.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.image_url} alt={product.name} />
            )}
          </div>
          <div>
            <p className="eyebrow">
              {isDigital ? "Digital Download" : isTicketed ? "Event" : "Merch"}
            </p>
            <h1 className="headline">{product.name}</h1>
            <p style={{ fontSize: "24px" }}>${(product.price / 100).toFixed(2)}</p>
            {product.description && <p>{product.description}</p>}
            {isTicketed && product.event_date && (
              <p>
                {new Date(product.event_date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
                {product.event_location ? ` · ${product.event_location}` : ""}
              </p>
            )}
            {/* Stripe Checkout wiring is §48 (Phase 12) — an honest disabled
                state until then, not a dead link. */}
            <button type="button" className="btn btn-primary" disabled title="Checkout coming soon">
              Buy — Coming Soon
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
