/**
 * §47 — canonical URLs, OG tags, sitemap, and JSON-LD all need one
 * absolute origin. `NEXT_PUBLIC_SITE_URL` is the explicit production
 * override (set once the real domain is live); falls back to Vercel's
 * own preview/production URL env var so preview deploys still produce
 * correct absolute URLs, then to the production domain as a last resort
 * so this never silently emits `undefined` into metadata.
 */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://setlifeentertainment.com";
}
