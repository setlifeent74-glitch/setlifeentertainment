import Link from "next/link";
import type { Product } from "@/lib/queries";
import { imageFitStyle } from "@/lib/image-fit";

/**
 * §35 VERIFY — one component, no branching layout per product shape.
 * A product's nature is entirely which optional fields are populated.
 */
export default function ProductCard({ product }: { product: Product }) {
  const isDigital = Boolean(product.digital_file_url);
  const isTicketed = Boolean(product.event_date);

  return (
    <Link href={`/shop/${product.slug}`} className={`cover-card${product.image_url ? " has-img" : ""}`}>
      {product.image_url && (
        <div className="cover-card-image">
          {/* eslint-disable-next-line @next/next/no-img-element -- product image, arbitrary uploaded URL */}
          <img src={product.image_url} alt="" style={imageFitStyle(product.image_fit, product.image_position)} />
        </div>
      )}
      <div className="card-body">
        <span className="card-name">{product.name}</span>
        <span className="card-role">${(product.price / 100).toFixed(2)}</span>
        {isDigital && <span className="card-role accent-gold">Digital Download</span>}
        {isTicketed && product.event_date && (
          <span className="card-role accent-gold">
            {new Date(product.event_date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
            {product.event_location ? ` · ${product.event_location}` : ""}
          </span>
        )}
      </div>
    </Link>
  );
}
