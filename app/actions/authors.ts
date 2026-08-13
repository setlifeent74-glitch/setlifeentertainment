"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type AuthorInsert = Database["public"]["Tables"]["authors"]["Insert"];

export type SaveAuthorInput = {
  id?: string;
  slug: string;
  name: string;
  title: string;
  bio: string;
  avatarUrl: string;
  location: string;
  instagram: string;
  twitter: string;
  website: string;
};

export async function saveAuthor(input: SaveAuthorInput): Promise<{ id: string; error?: string }> {
  const supabase = await createClient();
  const row: Partial<AuthorInsert> = {
    slug: input.slug,
    name: input.name,
    title: input.title || null,
    bio: input.bio || null,
    avatar_url: input.avatarUrl || null,
    location: input.location || null,
    social_links: {
      instagram: input.instagram || undefined,
      twitter: input.twitter || undefined,
      website: input.website || undefined,
    },
  };

  if (input.id) {
    const { error } = await supabase.from("authors").update(row).eq("id", input.id);
    if (error) return { id: input.id, error: error.message };
    revalidatePath("/admin/authors");
    revalidatePath(`/authors/${input.slug}`);
    return { id: input.id };
  }

  const { data, error } = await supabase.from("authors").insert(row as AuthorInsert).select("id").single();
  if (error || !data) return { id: "", error: error?.message ?? "Could not create author." };
  revalidatePath("/admin/authors");
  return { id: data.id };
}

export async function deleteAuthor(id: string) {
  const supabase = await createClient();
  await supabase.from("authors").delete().eq("id", id);
  revalidatePath("/admin/authors");
  redirect("/admin/authors");
}
