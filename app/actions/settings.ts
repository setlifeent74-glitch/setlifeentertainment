"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { SectionColorId } from "@/lib/section-colors";

/**
 * §9 global content-gates override — flips site_settings.content_gates_enabled.
 * Same auth model as the rest of the admin surface (any authenticated user,
 * flat access, no role check) — see app/actions/posts.ts.
 */
export async function setContentGatesEnabled(enabled: boolean): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const { error } = await supabase.from("site_settings").update({ content_gates_enabled: enabled }).eq("id", true);
  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/gates");
  return {};
}

/**
 * Per-section canvas color (see lib/section-colors.ts). `color: null` clears
 * the override so the section falls back to its normal CSS background.
 * Read-modify-write on the single JSONB blob since Supabase's client
 * doesn't expose a partial-jsonb-merge update.
 */
export async function setSectionColor(sectionId: SectionColorId, color: string | null): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const { data: current } = await supabase.from("site_settings").select("section_colors").eq("id", true).single();
  const colors = { ...((current?.section_colors as Record<string, string> | null) ?? {}) };
  if (color) {
    colors[sectionId] = color;
  } else {
    delete colors[sectionId];
  }

  const { error } = await supabase.from("site_settings").update({ section_colors: colors }).eq("id", true);
  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/gates");
  return {};
}
