"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type IssueInsert = Database["public"]["Tables"]["magazine_issues"]["Insert"];

export type SaveIssueInput = {
  id?: string;
  issueNumber: number;
  title: string;
  coverImageUrl: string;
  releaseDate: string;
  summary: string;
  isCurrent: boolean;
  coverFit: "cover" | "contain";
  coverPosition: "top" | "center" | "bottom";
};

export async function saveIssue(input: SaveIssueInput): Promise<{ id: string; error?: string }> {
  const supabase = await createClient();
  const row: Partial<IssueInsert> = {
    issue_number: input.issueNumber,
    title: input.title,
    cover_image_url: input.coverImageUrl || null,
    cover_fit: input.coverFit,
    cover_position: input.coverPosition,
    release_date: input.releaseDate || null,
    summary: input.summary || null,
    is_current: input.isCurrent,
  };

  if (input.isCurrent) {
    await supabase.from("magazine_issues").update({ is_current: false }).eq("is_current", true);
  }

  if (input.id) {
    const { error } = await supabase.from("magazine_issues").update(row).eq("id", input.id);
    if (error) return { id: input.id, error: error.message };
    revalidatePath("/admin/issues");
    revalidatePath("/");
    revalidatePath("/issues");
    return { id: input.id };
  }

  const { data, error } = await supabase.from("magazine_issues").insert(row as IssueInsert).select("id").single();
  if (error || !data) return { id: "", error: error?.message ?? "Could not create issue." };
  revalidatePath("/admin/issues");
  revalidatePath("/");
  return { id: data.id };
}

export async function deleteIssue(id: string) {
  const supabase = await createClient();
  await supabase.from("magazine_issues").delete().eq("id", id);
  revalidatePath("/admin/issues");
  redirect("/admin/issues");
}
