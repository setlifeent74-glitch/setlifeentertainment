import { createClient } from "@/lib/supabase/client";

/** Uploads to the `media` storage bucket and records the asset in the `media` table for the §45 library. */
export class MediaUploadError extends Error {}

export async function uploadMedia(file: File, folder: "body" | "hero"): Promise<string | null> {
  const supabase = createClient();
  const ext = file.name.split(".").pop();
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error: uploadError } = await supabase.storage.from("media").upload(path, file);
  if (uploadError) {
    // Was previously swallowed entirely — a failed upload just looked like
    // nothing happened. Surface it so callers can show the admin a message
    // instead of silently no-op'ing (common cause: the `media` storage
    // bucket/RLS migration exists locally but was never pushed to the live
    // Supabase project).
    console.error("uploadMedia: storage upload failed", uploadError);
    throw new MediaUploadError(uploadError.message);
  }

  const { data } = supabase.storage.from("media").getPublicUrl(path);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { error: insertError } = await supabase.from("media").insert({
    url: data.publicUrl,
    filename: file.name,
    alt_text: "",
    uploaded_by: user?.email ?? user?.id ?? null,
  });
  if (insertError) {
    // The file itself made it to storage — don't fail the whole upload over
    // a metadata-row issue, but don't hide it either.
    console.error("uploadMedia: media table insert failed", insertError);
  }

  return data.publicUrl;
}

/**
 * Renders every page of a PDF to a JPEG, client-side, and uploads each page
 * through `uploadMedia` — the "embed a whole PDF as an inline article" admin
 * editor flow. The PDF's pages become an ordinary sequence of body images
 * rather than a new Tiptap node type, so the existing `image` case in the
 * public article renderer (app/story/[slug]/page.tsx) needs no changes.
 */
export async function uploadPdfAsImages(
  file: File,
  onProgress?: (current: number, total: number) => void
): Promise<string[]> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();

  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  const baseName = file.name.replace(/\.pdf$/i, "");
  const urls: string[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    onProgress?.(pageNum, pdf.numPages);
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) continue;
    await page.render({ canvasContext: ctx, viewport }).promise;

    const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
    if (!blob) continue;

    const pageFile = new File([blob], `${baseName}-page-${pageNum}.jpg`, { type: "image/jpeg" });
    const url = await uploadMedia(pageFile, "body");
    if (url) urls.push(url);
  }

  return urls;
}
