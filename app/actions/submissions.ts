"use server";

import { createClient } from "@/lib/supabase/server";

export type SubmitState = { ok: boolean; error?: string } | null;

/** §45/§48.1 — real server-side validation; submissions never auto-publish, only land in the admin queue. */
export async function submitStory(_prev: SubmitState, formData: FormData): Promise<SubmitState> {
  const fullName = String(formData.get("fname") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const instagram = String(formData.get("ig") ?? "").trim();
  const projectTitle = String(formData.get("project") ?? "").trim();
  const story = String(formData.get("story") ?? "").trim();
  const portfolioLink = String(formData.get("link") ?? "").trim();

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!fullName || !EMAIL_PATTERN.test(email) || !story) {
    return { ok: false, error: "Fill in your name, a valid email, and your story." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("submissions").insert({
    full_name: fullName,
    role: role || null,
    email,
    instagram: instagram || null,
    project_title: projectTitle || null,
    story,
    portfolio_link: portfolioLink || null,
  });

  if (error) return { ok: false, error: "Something went wrong — please try again." };
  return { ok: true };
}
