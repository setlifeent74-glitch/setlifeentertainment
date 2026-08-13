"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Database, Json } from "@/lib/supabase/types";

type PostInsert = Database["public"]["Tables"]["posts"]["Insert"];

export type SavePostInput = {
  id?: string;
  title: string;
  slug: string;
  dek: string;
  category: Database["public"]["Enums"]["post_category"];
  placement: Database["public"]["Enums"]["post_placement"] | "";
  authorId: string;
  heroImageUrl: string;
  /**
   * JSON-encoded string, not a raw nested object. Confirmed directly: the
   * Tiptap doc's `content[].attrs` sub-objects (e.g. an image node's
   * `{src, alt, ...}`) are silently dropped somewhere in Next.js 16's
   * Server Action argument serialization for this specific nested shape —
   * the browser sends the full data (verified via network capture), the
   * server receives `attrs` missing entirely (verified via server-side
   * log). Encoding to a string before crossing the action boundary and
   * decoding here sidesteps it; a plain string round-trips correctly.
   */
  bodyJson: string;
  meta: Json;
  seoTitle: string;
  seoDescription: string;
};

function readingTimeFrom(body: Json): number {
  const text = JSON.stringify(body ?? "");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** §45 — revision history captures every save, whether it's a new draft or an edit. */
async function recordRevision(postId: string, title: string, body: Json, editedBy: string) {
  const supabase = await createClient();
  await supabase.from("post_revisions").insert({ post_id: postId, title, body, edited_by: editedBy });
}

export async function savePost(input: SavePostInput): Promise<{ id: string; error?: string }> {
  const body = JSON.parse(input.bodyJson) as Json;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { id: "", error: "Not signed in." };

  const row: Partial<PostInsert> = {
    title: input.title,
    slug: input.slug,
    dek: input.dek || null,
    category: input.category,
    placement: input.placement || null,
    author_id: input.authorId,
    hero_image_url: input.heroImageUrl || null,
    body,
    meta: input.meta,
    seo_title: input.seoTitle || null,
    seo_description: input.seoDescription || null,
    reading_time: readingTimeFrom(body),
  };

  if (input.id) {
    const { error } = await supabase.from("posts").update(row).eq("id", input.id);
    if (error) return { id: input.id, error: error.message };
    await recordRevision(input.id, input.title, body, user.email ?? user.id);
    revalidatePath("/");
    revalidatePath(`/story/${input.slug}`);
    revalidatePath("/admin");
    return { id: input.id };
  }

  const { data, error } = await supabase
    .from("posts")
    .insert({ ...row, status: "draft" } as PostInsert)
    .select("id")
    .single();
  if (error || !data) return { id: "", error: error?.message ?? "Could not create post." };
  await recordRevision(data.id, input.title, body, user.email ?? user.id);
  revalidatePath("/admin");
  return { id: data.id };
}

export async function publishPost(id: string, slug: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("posts")
    .update({ status: "published", published_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath(`/story/${slug}`);
  revalidatePath("/admin");
  return {};
}

export async function unpublishPost(id: string, slug: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("posts").update({ status: "draft" }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath(`/story/${slug}`);
  revalidatePath("/admin");
  return {};
}

export async function deletePost(id: string) {
  const supabase = await createClient();
  await supabase.from("posts").delete().eq("id", id);
  revalidatePath("/admin");
  redirect("/admin/posts");
}
