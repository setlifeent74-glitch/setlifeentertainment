import { notFound } from "next/navigation";
import type { Metadata } from "next";
import TopNav from "@/components/TopNav";
import JsonLd from "@/components/JsonLd";
import { getProductBySlug } from "@/lib/queries";
import { productJsonLd, breadcrumbJsonLd } from "@/lib/structured-data";
import { getSiteUrl } from "@/lib/site-url";
import { imageFitStyle } from "@/lib/image-fit";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  const title = `${product.name} — Set Life Shop`;
  const url = `${getSiteUrl()}/shop/${product.slug}`;
  return {
    title,
    description: product.description ?? undefined,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: product.description ?? undefined,
      url,
      type: "website",
      images: product.image_url ? [{ url: product.image_url }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const isDigital = Boolean(product.digital_file_url);
  const isTicketed = Boolean(product.event_date);
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/shop/${product.slug}`;

  return (
    <>
      <TopNav active="/shop" />
      <JsonLd data={productJsonLd(product, url)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: siteUrl },
          { name: "Shop", url: `${siteUrl}/shop` },
          { name: product.name, url },
        ])}
      />

      <section className="section">
        <div className="wrap two-col">
          <div className="panel panel-cover">
            {product.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.image_url}
                alt={product.name}
                style={imageFitStyle(product.image_fit, product.image_position)}
              />
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
