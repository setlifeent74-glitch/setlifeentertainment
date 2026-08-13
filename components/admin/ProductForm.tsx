"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import HeroImageUpload from "./HeroImageUpload";
import { saveProduct, deleteProduct } from "@/app/actions/products";
import type { Product } from "@/lib/queries";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(product));
  const [description, setDescription] = useState(product?.description ?? "");
  const [priceDollars, setPriceDollars] = useState(product ? (product.price / 100).toString() : "");
  const [imageUrl, setImageUrl] = useState(product?.image_url ?? "");
  const [stripePriceId, setStripePriceId] = useState(product?.stripe_price_id ?? "");
  const [inventory, setInventory] = useState(product?.inventory?.toString() ?? "");
  const [digitalFileUrl, setDigitalFileUrl] = useState(product?.digital_file_url ?? "");
  const [eventDate, setEventDate] = useState(product?.event_date ?? "");
  const [eventLocation, setEventLocation] = useState(product?.event_location ?? "");
  const [published, setPublished] = useState(product?.published ?? false);
  const [status, setStatus] = useState<string | null>(null);

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const handleSave = async () => {
    setStatus("Saving…");
    const result = await saveProduct({
      id: product?.id,
      slug,
      name,
      description,
      priceDollars: Number(priceDollars) || 0,
      imageUrl,
      stripePriceId,
      inventory,
      digitalFileUrl,
      eventDate,
      eventLocation,
      published,
    });
    if (result.error) {
      setStatus(`Error: ${result.error}`);
      return;
    }
    setStatus("Saved");
    if (!product) router.push(`/admin/products/${result.id}`);
  };

  return (
    <div className="admin-editor">
      <div className="admin-editor-main">
        <input className="admin-editor-title" placeholder="Product name" value={name} onChange={(e) => handleNameChange(e.target.value)} />
        <div className="admin-field">
          <label htmlFor="product-slug">Slug</label>
          <input
            id="product-slug"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
          />
        </div>
        <div className="admin-field">
          <label htmlFor="product-description">Description</label>
          <textarea id="product-description" rows={6} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
      </div>

      <div className="admin-editor-sidebar">
        <div className="admin-field">
          <label htmlFor="product-price">Price (USD)</label>
          <input id="product-price" type="number" step="0.01" value={priceDollars} onChange={(e) => setPriceDollars(e.target.value)} />
        </div>
        <div className="admin-field">
          <label>Image</label>
          <HeroImageUpload value={imageUrl ?? ""} onChange={setImageUrl} />
        </div>
        <div className="admin-field">
          <label htmlFor="product-stripe-price">Stripe Price ID</label>
          <input id="product-stripe-price" placeholder="price_..." value={stripePriceId ?? ""} onChange={(e) => setStripePriceId(e.target.value)} />
        </div>
        <div className="admin-field">
          <label htmlFor="product-inventory">Inventory (blank = unlimited)</label>
          <input id="product-inventory" type="number" value={inventory} onChange={(e) => setInventory(e.target.value)} />
        </div>
        <div className="admin-field">
          <label htmlFor="product-digital-file">Digital File URL</label>
          <input id="product-digital-file" value={digitalFileUrl ?? ""} onChange={(e) => setDigitalFileUrl(e.target.value)} />
        </div>
        <div className="admin-field">
          <label htmlFor="product-event-date">Event Date (ticketed items)</label>
          <input id="product-event-date" type="datetime-local" value={eventDate ?? ""} onChange={(e) => setEventDate(e.target.value)} />
        </div>
        <div className="admin-field">
          <label htmlFor="product-event-location">Event Location</label>
          <input id="product-event-location" value={eventLocation ?? ""} onChange={(e) => setEventLocation(e.target.value)} />
        </div>
        <div className="admin-field">
          <label htmlFor="product-published">
            <input id="product-published" type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
            {" "}Published
          </label>
        </div>

        <div className="admin-editor-actions">
          <button type="button" className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
          {product && (
            <button
              type="button"
              className="admin-delete-btn"
              onClick={() => {
                if (confirm("Delete this product permanently?")) deleteProduct(product.id);
              }}
            >
              Delete
            </button>
          )}
        </div>
        {status && <p className="admin-editor-status">{status}</p>}
      </div>
    </div>
  );
}
