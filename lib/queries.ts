import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

export type Post = Database["public"]["Tables"]["posts"]["Row"];
export type Author = Database["public"]["Tables"]["authors"]["Row"];
export type PostWithAuthor = Post & { authors: Author };
export type MagazineIssue = Database["public"]["Tables"]["magazine_issues"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type PostCategory = Database["public"]["Enums"]["post_category"];

export async function getPostBySlug(slug: string): Promise<PostWithAuthor | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*, authors(*)")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
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

/** §32: expiry logic runs server-side, not client-only — filtered in the query, not after the fact in a component. */
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

/** §33: past festivals excluded or explicitly marked — excluded here. */
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
