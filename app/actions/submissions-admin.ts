"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function markSubmissionReviewed(id: string, reviewed: boolean) {
  const supabase = await createClient();
  await supabase.from("submissions").update({ reviewed }).eq("id", id);
  revalidatePath("/admin/submissions");
}

export async function deleteSubmission(id: string) {
  const supabase = await createClient();
  await supabase.from("submissions").delete().eq("id", id);
  revalidatePath("/admin/submissions");
}
