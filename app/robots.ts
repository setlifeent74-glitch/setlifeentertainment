import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

/** §47 — the admin back office is disallowed (no-index, and the login page's own `robots: {index:false}` doubles up here). */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
