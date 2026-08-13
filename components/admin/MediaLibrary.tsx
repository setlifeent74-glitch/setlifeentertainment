"use client";

import { useState } from "react";
import { uploadMedia } from "@/lib/admin-media";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type MediaRow = Database["public"]["Tables"]["media"]["Row"];

export default function MediaLibrary({ initialMedia }: { initialMedia: MediaRow[] }) {
  const [media, setMedia] = useState(initialMedia);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    const url = await uploadMedia(file, "body");
    setIsUploading(false);
    if (!url) return;
    const supabase = createClient();
    const { data } = await supabase.from("media").select("*").order("created_at", { ascending: false }).limit(1);
    if (data?.[0]) setMedia((prev) => [data[0], ...prev]);
  };

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this asset from the library? The uploaded file itself is left in storage.")) return;
    const supabase = createClient();
    await supabase.from("media").delete().eq("id", id);
    setMedia((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div>
      <label className="btn">
        {isUploading ? "Uploading…" : "Upload Image"}
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) handleUpload(file);
          }}
        />
      </label>

      <div className="admin-media-grid">
        {media.map((item) => (
          <div key={item.id} className="admin-media-item">
            {/* eslint-disable-next-line @next/next/no-img-element -- admin-only thumbnail of an arbitrary uploaded URL */}
            <img src={item.url} alt={item.alt_text} />
            <p className="admin-media-filename">{item.filename}</p>
            <div className="admin-media-actions">
              <button type="button" className="btn" onClick={() => handleCopy(item.id, item.url)}>
                {copiedId === item.id ? "Copied ✓" : "Copy URL"}
              </button>
              <button type="button" className="admin-delete-btn" onClick={() => handleDelete(item.id)}>
                Remove
              </button>
            </div>
          </div>
        ))}
        {media.length === 0 && <p>No media uploaded yet.</p>}
      </div>
    </div>
  );
}
