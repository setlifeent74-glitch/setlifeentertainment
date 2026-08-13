import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

export type Post = Database["public"]["Tables"]["posts"]["Row"];
export type Author = Database["public"]["Tables"]["authors"]["Row"];
export type PostWithAuthor = Post & { authors: Author };
export type MagazineIssue = Database["public"]["Tables"]["magazine_issues"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type PostCategory = Database["public"]["Enums"]["post_category"];

export async function getPostBySlug(
  slug: string,
  opts?: { includeUnpublished?: boolean }
): Promise<PostWithAuthor | null> {
  const supabase = await createClient();
  let query = supabase.from("posts").select("*, authors(*)").eq("slug", slug);
  if (!opts?.includeUnpublished) {
    query = query.eq("status", "published");
  }
  const { data } = await query.single();
  return data as PostWithAuthor | null;
}

/** §8: a published slug that changed issues a 301 (308) from the old path. */
export async function getRedirectTargetSlug(oldSlug: string): Promise<string | null> {
  const supabase = await createClient();
  const { data: redirectRow } = await supabase
    .from("post_slug_redirects")
    .select("post_id")
    .eq("old_slug", oldSlug)
    .single();
  if (!redirectRow) return null;

  const { data: target } = await supabase
    .from("posts")
    .select("slug")
    .eq("id", redirectRow.post_id)
    .eq("status", "published")
    .single();
  return target?.slug ?? null;
}

/**
 * §46 related content — "related stories (same category, then same
 * author_id, then most recent)". Backfills each tier only as far as
 * needed to reach `limit`, so a category with few other posts still gets a
 * full rail rather than a short one.
 */
export async function getRelatedPosts(post: PostWithAuthor, limit = 4): Promise<PostWithAuthor[]> {
  const supabase = await createClient();
  const results: PostWithAuthor[] = [];
  const excludeIds = () => [post.id, ...results.map((r) => r.id)];

  const { data: sameCategory } = await supabase
    .from("posts")
    .select("*, authors(*)")
    .eq("status", "published")
    .eq("category", post.category)
    .not("id", "in", `(${excludeIds().join(",")})`)
    .order("published_at", { ascending: false })
    .limit(limit);
  results.push(...((sameCategory ?? []) as PostWithAuthor[]));

  if (results.length < limit) {
    const { data: sameAuthor } = await supabase
      .from("posts")
      .select("*, authors(*)")
      .eq("status", "published")
      .eq("author_id", post.author_id)
      .not("id", "in", `(${excludeIds().join(",")})`)
      .order("published_at", { ascending: false })
      .limit(limit - results.length);
    results.push(...((sameAuthor ?? []) as PostWithAuthor[]));
  }

  if (results.length < limit) {
    const { data: recent } = await supabase
      .from("posts")
      .select("*, authors(*)")
      .eq("status", "published")
      .not("id", "in", `(${excludeIds().join(",")})`)
      .order("published_at", { ascending: false })
      .limit(limit - results.length);
    results.push(...((recent ?? []) as PostWithAuthor[]));
  }

  return results;
}

/** §46 — "a next-article recommendation at the foot." Next-published-after this one; wraps to the most recent post otherwise. */
export async function getNextArticle(post: PostWithAuthor): Promise<PostWithAuthor | null> {
  const supabase = await createClient();
  if (post.published_at) {
    const { data: next } = await supabase
      .from("posts")
      .select("*, authors(*)")
      .eq("status", "published")
      .neq("id", post.id)
      .gt("published_at", post.published_at)
      .order("published_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (next) return next as PostWithAuthor;
  }

  const { data: fallback } = await supabase
    .from("posts")
    .select("*, authors(*)")
    .eq("status", "published")
    .neq("id", post.id)
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (fallback as PostWithAuthor | null) ?? null;
}

export async function getPostsByCategory(category: PostCategory): Promise<PostWithAuthor[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*, authors(*)")
    .eq("category", category)
    .eq("status", "published")
    .order("published_at", { ascending: false });
  return (data ?? []) as PostWithAuthor[];
}

/** §47 sitemap — every published post, lean columns only (slug + timestamps, not the full row). */
export async function getAllPublishedPostSlugs(): Promise<{ slug: string; updated_at: string }[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("slug, updated_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  return data ?? [];
}

export async function getAuthorBySlug(slug: string) {
  const supabase = await createClient();
  const { data: author } = await supabase.from("authors").select("*").eq("slug", slug).single();
  if (!author) return null;

  const { data: posts } = await supabase
    .from("posts")
    .select("*, authors(*)")
    .eq("author_id", author.id)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return { author, posts: (posts ?? []) as PostWithAuthor[] };
}

/** §47 sitemap — every author's slug (author profiles have no draft/published state). */
export async function getAllAuthorSlugs(): Promise<{ slug: string }[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("authors").select("slug").order("name", { ascending: true });
  return data ?? [];
}

export async function getAllIssues(): Promise<MagazineIssue[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("magazine_issues")
    .select("*")
    .order("issue_number", { ascending: false });
  return data ?? [];
}

export async function getIssueByNumber(issueNumber: number): Promise<MagazineIssue | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("magazine_issues")
    .select("*")
    .eq("issue_number", issueNumber)
    .single();
  return data;
}

export async function getPublishedProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();
  return data;
}

/**
 * `/opportunities` archive (§8) — every live opportunity by category, not
 * just the ones an editor has curated onto the homepage. §32's homepage
 * section is a separate, placement-scoped query below.
 */
export async function getLiveOpportunities(): Promise<PostWithAuthor[]> {
  const supabase = await createClient();
  const nowIso = new Date().toISOString();
  const { data } = await supabase
    .from("posts")
    .select("*, authors(*)")
    .eq("category", "opportunity")
    .eq("status", "published")
    .or(`meta->>deadline.is.null,meta->>deadline.gte.${nowIso}`)
    .order("published_at", { ascending: false });
  return (data ?? []) as PostWithAuthor[];
}

/** §32 Opportunities (homepage section) — placement=opportunity, deadline not expired, soonest first. */
export async function getOpportunitySectionPosts(): Promise<PostWithAuthor[]> {
  const supabase = await createClient();
  const nowIso = new Date().toISOString();
  const { data } = await supabase
    .from("posts")
    .select("*, authors(*)")
    .eq("placement", "opportunity")
    .eq("status", "published")
    .or(`meta->>deadline.is.null,meta->>deadline.gte.${nowIso}`)
    .order("meta->>deadline", { ascending: true });
  return (data ?? []) as PostWithAuthor[];
}

/** §22 Today on Set Life — placement=today, newest first. */
export async function getTodayPosts(): Promise<PostWithAuthor[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*, authors(*)")
    .eq("placement", "today")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(6);
  return (data ?? []) as PostWithAuthor[];
}

/** §23 Current Magazine Issue. */
export async function getCurrentIssue(): Promise<MagazineIssue | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("magazine_issues")
    .select("*")
    .eq("is_current", true)
    .limit(1)
    .maybeSingle();
  return data;
}

/** §24 Indie Spotlight — placement=spotlight_feature, the single deep profile. */
export async function getSpotlightFeature(): Promise<PostWithAuthor | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*, authors(*)")
    .eq("placement", "spotlight_feature")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data as PostWithAuthor | null;
}

/**
 * §25 The Call Sheet — placement=call_sheet, newest first. Caller checks
 * the staleness gate (§9: renders only if the newest item is within 14
 * days) against the first row's published_at, same source of truth
 * lib/gates.ts uses for the admin status page.
 */
export async function getCallSheetPosts(): Promise<PostWithAuthor[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*, authors(*)")
    .eq("placement", "call_sheet")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(8);
  return (data ?? []) as PostWithAuthor[];
}

/** §26 Below the Line — placement=below_the_line, newest first. */
export async function getBelowTheLinePosts(): Promise<PostWithAuthor[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*, authors(*)")
    .eq("placement", "below_the_line")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(6);
  return (data ?? []) as PostWithAuthor[];
}

/** §27 Fresh Faces — placement=fresh_face, newest first. */
export async function getFreshFacesPosts(): Promise<PostWithAuthor[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*, authors(*)")
    .eq("placement", "fresh_face")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(8);
  return (data ?? []) as PostWithAuthor[];
}

/** §28 Now in Production — placement=production. Filtering is client-side (§28 VERIFY: no full reload), so fetch the full set. */
export async function getProductionPosts(): Promise<PostWithAuthor[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*, authors(*)")
    .eq("placement", "production")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(24);
  return (data ?? []) as PostWithAuthor[];
}

/** §29 The Cut — placement=cut. Newest first; caller splits lead/secondary. */
export async function getReviewPosts(): Promise<PostWithAuthor[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*, authors(*)")
    .eq("placement", "cut")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(5);
  return (data ?? []) as PostWithAuthor[];
}

/** §30 The Screening Room — placement=screening_room, most recent. */
export async function getScreeningRoomVideo(): Promise<PostWithAuthor | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*, authors(*)")
    .eq("placement", "screening_room")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data as PostWithAuthor | null;
}

/** §31 Behind the Lens — placement=behind_the_lens, most recent qualifying post. */
export async function getBehindTheLensPost(): Promise<PostWithAuthor | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*, authors(*)")
    .eq("placement", "behind_the_lens")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data as PostWithAuthor | null;
}

/** §34 Set Life 100 — published honorees for the most recent list_year, ranked. */
export async function getCurrentHonorees(): Promise<Database["public"]["Tables"]["honorees"]["Row"][]> {
  const supabase = await createClient();
  const { data: latestYear } = await supabase
    .from("honorees")
    .select("list_year")
    .eq("published", true)
    .order("list_year", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!latestYear) return [];

  const { data } = await supabase
    .from("honorees")
    .select("*")
    .eq("published", true)
    .eq("list_year", latestYear.list_year)
    .order("rank", { ascending: true, nullsFirst: false });
  return data ?? [];
}

/** §34 gate — explicit admin enable, independent of honoree content. */
export async function isSetLife100Enabled(): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("set_life_100_enabled").eq("id", true).single();
  return data?.set_life_100_enabled ?? false;
}

/**
 * §9 global override — every minimum-to-render gate in lib/gates.ts checks
 * this before applying its threshold, so the whole content-readiness system
 * can be switched off in one place while there isn't yet enough staff/
 * content to hit each section's usual minimum. Defaults to true (gates
 * active) so a missing/unmigrated column fails toward the original
 * behavior, not toward accidentally publishing everything.
 *
 * Wrapped in React's `cache()` so the ~9 homepage sections that each call
 * this independently only hit the DB once per request, not once per
 * section — same request-level dedup React uses for `fetch`.
 */
export const isContentGatesEnabled = cache(async (): Promise<boolean> => {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("content_gates_enabled").eq("id", true).single();
  return data?.content_gates_enabled ?? true;
});

/**
 * §36 CMS fallback grid — recent published posts with a hero image, across
 * any placement. Used when the live Instagram Graph API isn't reachable
 * (no INSTAGRAM_ACCESS_TOKEN configured, or the call fails) — §9/§36:
 * "graceful degradation... never an empty region."
 */
export async function getInstagramFallbackPosts(): Promise<PostWithAuthor[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*, authors(*)")
    .eq("status", "published")
    .not("hero_image_url", "is", null)
    .order("published_at", { ascending: false })
    .limit(10);
  return (data ?? []) as PostWithAuthor[];
}

/**
 * §16 link map — minimal search scope: a single ilike query against
 * published posts and products, no filters, no ranking, no predictive
 * suggestions. The scaled-up successor is Growth Roadmap 1.3.
 */
export async function searchContent(query: string): Promise<{ posts: PostWithAuthor[]; products: Product[] }> {
  const trimmed = query.trim();
  if (!trimmed) return { posts: [], products: [] };

  const supabase = await createClient();
  const like = `%${trimmed}%`;

  const [{ data: posts }, { data: products }] = await Promise.all([
    supabase
      .from("posts")
      .select("*, authors(*)")
      .eq("status", "published")
      .or(`title.ilike.${like},dek.ilike.${like}`)
      .order("published_at", { ascending: false })
      .limit(24),
    supabase
      .from("products")
      .select("*")
      .eq("published", true)
      .ilike("name", like)
      .limit(24),
  ]);

  return { posts: (posts ?? []) as PostWithAuthor[], products: products ?? [] };
}

/**
 * `/festivals` archive (§8) — every upcoming festival by category. §33's
 * homepage section is a separate, placement-scoped query below.
 * Past festivals excluded or explicitly marked — excluded here.
 */
export async function getUpcomingFestivals(): Promise<PostWithAuthor[]> {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await supabase
    .from("posts")
    .select("*, authors(*)")
    .eq("category", "festival")
    .eq("status", "published")
    .or(`meta->>endDate.is.null,meta->>endDate.gte.${today}`)
    .order("meta->>startDate", { ascending: true });
  return (data ?? []) as PostWithAuthor[];
}

/** §33 Festival Circuit (homepage section) — placement=festival, chronological. */
export async function getFestivalSectionPosts(): Promise<PostWithAuthor[]> {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await supabase
    .from("posts")
    .select("*, authors(*)")
    .eq("placement", "festival")
    .eq("status", "published")
    .or(`meta->>endDate.is.null,meta->>endDate.gte.${today}`)
    .order("meta->>startDate", { ascending: true });
  return (data ?? []) as PostWithAuthor[];
}
