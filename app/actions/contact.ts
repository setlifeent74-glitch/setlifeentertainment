"use server";

import { createClient } from "@/lib/supabase/server";

export type ContactState = { ok: boolean; error?: string } | null;

/** §13 — real server-side contact form submission. Stores in `contact_messages` table. */
export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const name = String(formData.get("cname") ?? "").trim();
  const email = String(formData.get("cemail") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!name || !EMAIL_PATTERN.test(email) || !message) {
    return { ok: false, error: "Fill in your name, a valid email, and a message." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({
    name,
    email,
    subject: subject || null,
    message,
  });

  if (error) return { ok: false, error: "Something went wrong — please try again." };
  return { ok: true };
}
