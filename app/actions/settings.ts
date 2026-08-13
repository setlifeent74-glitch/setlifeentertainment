"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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
