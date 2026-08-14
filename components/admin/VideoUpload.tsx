"use client";

import { useState } from "react";
import { uploadMedia } from "@/lib/admin-media";
import { getVideoEmbedUrl } from "@/lib/video-embed";

/** §41 — lets an editor either upload a video file directly or paste a YouTube/Vimeo link, both writing the same `videoUrl` meta field. */
export default function VideoUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlDraft, setUrlDraft] = useState(value ?? "");

  const isEmbed = !!getVideoEmbedUrl(value ?? "");

  const handleFile = async (file: File) => {
    setIsUploading(true);
    setError(null);
    try {
      const url = await uploadMedia(file, "video");
      if (url) {
        onChange(url);
        setUrlDraft(url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="admin-video-upload">
      {value && (
        <p className="admin-editor-hint" style={{ padding: 0 }}>
          {isEmbed ? "Embed link set — plays inline via YouTube/Vimeo." : "Video file set."}{" "}
          <a href={value} target="_blank" rel="noopener noreferrer">
            View current
          </a>
        </p>
      )}

      <label className="btn">
        {isUploading ? "Uploading…" : "Upload Video File"}
        <input
          type="file"
          accept="video/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) handleFile(file);
          }}
        />
      </label>

      <div className="admin-video-url-row">
        <input
          type="text"
          placeholder="…or paste a YouTube / Vimeo URL"
          value={urlDraft}
          onChange={(e) => setUrlDraft(e.target.value)}
        />
        <button type="button" className="btn" onClick={() => onChange(urlDraft.trim())}>
          Use Link
        </button>
      </div>

      {error && <p className="admin-upload-error">{error}</p>}
    </div>
  );
}
