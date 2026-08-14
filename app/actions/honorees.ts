"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type HonoreeInsert = Database["public"]["Tables"]["honorees"]["Insert"];

export type SaveHonoreeInput = {
  id?: string;
  listYear: number;
  rank: string;
  name: string;
  title: string;
  discipline: string;
  portraitUrl: string;
  citation: string;
  relatedPostId: string;
  published: boolean;
  portraitFit: "cover" | "contain";
  portraitPosition: "top" | "center" | "bottom";
};

export async function saveHonoree(input: SaveHonoreeInput): Promise<{ id: string; error?: string }> {
  const supabase = await createClient();
  const row: Partial<HonoreeInsert> = {
    list_year: input.listYear,
    rank: input.rank === "" ? null : Number(input.rank),
    name: input.name,
    title: input.title || null,
    discipline: input.discipline || null,
    portrait_url: input.portraitUrl || null,
    portrait_fit: input.portraitFit,
    portrait_position: input.portraitPosition,
    citation: input.citation || null,
    related_post_id: input.relatedPostId || null,
    published: input.published,
  };

  if (input.id) {
    const { error } = await supabase.from("honorees").update(row).eq("id", input.id);
    if (error) return { id: input.id, error: error.message };
    revalidatePath("/admin/honorees");
    revalidatePath("/");
    return { id: input.id };
  }

  const { data, error } = await supabase.from("honorees").insert(row as HonoreeInsert).select("id").single();
  if (error || !data) return { id: "", error: error?.message ?? "Could not create honoree." };
  revalidatePath("/admin/honorees");
  revalidatePath("/");
  return { id: data.id };
}

export async function deleteHonoree(id: string) {
  const supabase = await createClient();
  await supabase.from("honorees").delete().eq("id", id);
  revalidatePath("/admin/honorees");
  redirect("/admin/honorees");
}
