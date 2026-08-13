import type { MetadataRoute } from "next";
import {
  getAllPublishedPostSlugs,
  getAllAuthorSlugs,
  getAllIssues,
  getPublishedProducts,
} from "@/lib/queries";
import { getSiteUrl } from "@/lib/site-url";

const STATIC_ROUTES = [
  "",
  "/about",
  "/submit",
  "/contact",
  "/issues",
  "/shop",
  "/search",
  "/opportunities",
  "/festivals",
  "/privacy",
  "/terms",
  "/editorial-policy",
  "/review-policy",
  "/accessibility",
];

const CATEGORIES = [
  "article",
  "news",
  "spotlight",
  "review",
  "opportunity",
  "festival",
  "below_the_line",
  "production",
  "video",
  "behind_the_lens",
];

/** §47 — "auto-generated and updated on publish" (regenerated on every request via dynamic rendering, not a build-time snapshot). Drafts never appear — every query here filters status="published". */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const [posts, authors, issues, products] = await Promise.all([
    getAllPublishedPostSlugs(),
    getAllAuthorSlugs(),
    getAllIssues(),
    getPublishedProducts(),
  ]);

  return [
    ...STATIC_ROUTES.map((path) => ({ url: `${siteUrl}${path}`, changeFrequency: "daily" as const })),
    ...CATEGORIES.map((category) => ({ url: `${siteUrl}/category/${category}`, changeFrequency: "daily" as const })),
    ...posts.map((post) => ({
      url: `${siteUrl}/story/${post.slug}`,
      lastModified: post.updated_at,
      changeFrequency: "weekly" as const,
    })),
    ...authors.map((author) => ({ url: `${siteUrl}/authors/${author.slug}`, changeFrequency: "weekly" as const })),
    ...issues.map((issue) => ({ url: `${siteUrl}/issues/${issue.issue_number}`, changeFrequency: "monthly" as const })),
    ...products.map((product) => ({ url: `${siteUrl}/shop/${product.slug}`, changeFrequency: "weekly" as const })),
  ];
}
