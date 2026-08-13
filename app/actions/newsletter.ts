"use server";

import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type SubscribeState = { ok: boolean; error?: string; id?: string } | null;

/**
 * §37 VERIFY — real server-side validation, not just client-side.
 *
 * The id is generated here and included in the insert, rather than
 * requested back via `.insert().select()` — PostgREST needs SELECT
 * privilege on the table to return the inserted row, and anon deliberately
 * has none (migration comment: "never read the table at all"). Confirmed
 * directly: `.select()` here failed with "permission denied for table
 * newsletter_subscribers" even though the insert itself succeeded.
 */
export async function subscribeToNewsletter(_prev: SubscribeState, formData: FormData): Promise<SubscribeState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email || !EMAIL_PATTERN.test(email)) {
    return { ok: false, error: "Enter a valid email address." };
  }

  const id = randomUUID();
  const supabase = await createClient();
  const { error } = await supabase.from("newsletter_subscribers").insert({ id, email });

  if (!error) return { ok: true, id };

  // 23505 = unique_violation — already subscribed reads as success, not an
  // error, but there's no id to return for the preferences step since we
  // don't look up the existing row (no anon select policy).
  if (error.code === "23505") return { ok: true };

  return { ok: false, error: "Something went wrong — please try again." };
}

/**
 * §37 "Post-signup preferences" — a second step after the initial signup.
 * Keyed by the row's own uuid (returned to the client once, at signup),
 * not by email — see the migration's RLS comment for why.
 *
 * Uses the service-role client, not the anon-scoped one: confirmed
 * directly that `UPDATE ... WHERE id = $1` needs SELECT privilege to
 * evaluate the WHERE clause, even with UPDATE already granted — anon
 * doesn't have SELECT on this table (that's what stops it from
 * enumerating every subscriber's email), so the update silently matched
 * zero rows and returned no error until this was moved to service-role.
 */
export async function saveNewsletterPreferences(id: string, preferences: string[]): Promise<{ ok: boolean }> {
  if (!id) return { ok: false };
  const supabase = createServiceClient();
  const { error } = await supabase.from("newsletter_subscribers").update({ preferences }).eq("id", id);
  return { ok: !error };
}
