import { createClient } from "@/lib/supabase/server";
import type { PostWithAuthor, Author } from "@/lib/queries";

/** §45 admin — unlike the public queries, these intentionally see drafts too (RLS: "authenticated reads all posts"). */
export async function getAdminPostById(id: string): Promise<PostWithAuthor | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("posts").select("*, authors(*)").eq("id", id).single();
  return data as PostWithAuthor | null;
}

export async function getAllPostsAdmin(): Promise<PostWithAuthor[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("posts").select("*, authors(*)").order("updated_at", { ascending: false });
  return (data ?? []) as PostWithAuthor[];
}

export async function getAllAuthors(): Promise<Author[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("authors").select("*").order("name", { ascending: true });
  return data ?? [];
}

export async function getAdminAuthorById(id: string): Promise<Author | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("authors").select("*").eq("id", id).single();
  return data ?? null;
}

export async function getPostRevisions(postId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("post_revisions")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getAllMedia() {
  const supabase = await createClient();
  const { data } = await supabase.from("media").select("*").order("created_at", { ascending: false });
  return data ?? [];
}

export async function getAllProductsAdmin() {
  const supabase = await createClient();
  const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  return data ?? [];
}

export async function getAdminProductById(id: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("products").select("*").eq("id", id).single();
  return data ?? null;
}

export async function getAllIssuesAdmin() {
  const supabase = await createClient();
  const { data } = await supabase.from("magazine_issues").select("*").order("issue_number", { ascending: false });
  return data ?? [];
}

export async function getAdminIssueById(id: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("magazine_issues").select("*").eq("id", id).single();
  return data ?? null;
}

export async function getAllHonoreesAdmin() {
  const supabase = await createClient();
  const { data } = await supabase.from("honorees").select("*").order("list_year", { ascending: false }).order("rank", { ascending: true, nullsFirst: false });
  return data ?? [];
}

export async function getAdminHonoreeById(id: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("honorees").select("*").eq("id", id).single();
  return data ?? null;
}

export async function getAllSubmissions() {
  const supabase = await createClient();
  const { data } = await supabase.from("submissions").select("*").order("created_at", { ascending: false });
  return data ?? [];
}
