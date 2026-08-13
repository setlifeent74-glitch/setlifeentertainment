import { createClient } from "@/lib/supabase/client";

/** Uploads to the `media` storage bucket and records the asset in the `media` table for the §45 library. */
export async function uploadMedia(file: File, folder: "body" | "hero"): Promise<string | null> {
  const supabase = createClient();
  const ext = file.name.split(".").pop();
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error: uploadError } = await supabase.storage.from("media").upload(path, file);
  if (uploadError) return null;

  const { data } = supabase.storage.from("media").getPublicUrl(path);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  await supabase.from("media").insert({
    url: data.publicUrl,
    filename: file.name,
    alt_text: "",
    uploaded_by: user?.email ?? user?.id ?? null,
  });

  return data.publicUrl;
}
