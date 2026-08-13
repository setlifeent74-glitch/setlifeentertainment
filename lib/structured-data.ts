import type { PostWithAuthor, Author, MagazineIssue, Product } from "@/lib/queries";
import { getSiteUrl } from "@/lib/site-url";
import { extractPlainText } from "@/lib/tiptap-text";

/** §47 — JSON-LD builders, one per page type in the spec's schema table. */

export function organizationJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Set Life Entertainment",
    url: siteUrl,
    logo: `${siteUrl}/assets/logo-nav.png`,
    sameAs: ["https://www.instagram.com/setlifeentertainment/"],
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

type ArticleMeta = { score?: number; verdict?: string; videoUrl?: string; city?: string; startDate?: string; endDate?: string };

export function articleJsonLd(post: PostWithAuthor, url: string) {
  const siteUrl = getSiteUrl();
  const image = post.og_image_url || post.hero_image_url;
  const meta = (post.meta ?? {}) as ArticleMeta;

  const base: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.seo_description || post.dek || undefined,
    image: image ? [image] : undefined,
    datePublished: post.published_at ?? undefined,
    dateModified: post.updated_at ?? post.published_at ?? undefined,
    author: { "@type": "Person", name: post.authors.name, url: `${siteUrl}/authors/${post.authors.slug}` },
    publisher: { "@type": "Organization", name: "Set Life Entertainment", url: siteUrl },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  if (post.category === "review" && (meta.score !== undefined || meta.verdict)) {
    return {
      ...base,
      "@type": "Review",
      // §29 The Cut's own score convention is 0-100 (seed data: 88, 71 — not decimals), confirmed against CutSection.tsx.
      reviewRating: meta.score !== undefined ? { "@type": "Rating", ratingValue: meta.score, bestRating: 100 } : undefined,
      reviewBody: meta.verdict || extractPlainText(post.body).slice(0, 500),
    };
  }

  if (post.category === "festival" && (meta.city || meta.startDate)) {
    return {
      "@context": "https://schema.org",
      "@type": "Event",
      name: post.title,
      description: post.dek ?? undefined,
      image: image ? [image] : undefined,
      startDate: meta.startDate ?? undefined,
      endDate: meta.endDate ?? undefined,
      location: meta.city ? { "@type": "Place", name: meta.city } : undefined,
      organizer: { "@type": "Organization", name: "Set Life Entertainment", url: siteUrl },
    };
  }

  if (post.category === "video" && meta.videoUrl) {
    return {
      ...base,
      "@type": "VideoObject",
      name: post.title,
      description: post.seo_description || post.dek || post.title,
      thumbnailUrl: image ? [image] : undefined,
      uploadDate: post.published_at ?? undefined,
      contentUrl: meta.videoUrl,
    };
  }

  return base;
}

export function personJsonLd(author: Author, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    description: author.bio ?? undefined,
    image: author.avatar_url ?? undefined,
    jobTitle: author.title ?? undefined,
    url,
  };
}

export function creativeWorkJsonLd(issue: MagazineIssue, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: issue.title,
    description: issue.summary ?? undefined,
    image: issue.cover_image_url ?? undefined,
    datePublished: issue.release_date ?? undefined,
    url,
    publisher: { "@type": "Organization", name: "Set Life Entertainment" },
  };
}

export function productJsonLd(product: Product, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description ?? undefined,
    image: product.image_url ?? undefined,
    url,
    offers: {
      "@type": "Offer",
      price: (product.price / 100).toFixed(2),
      priceCurrency: "USD",
      availability:
        product.inventory === null || product.inventory > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url,
    },
  };
}
