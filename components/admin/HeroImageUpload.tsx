"use client";

import { useState } from "react";
import { uploadMedia } from "@/lib/admin-media";

export default function HeroImageUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setIsUploading(true);
    setError(null);
    try {
      const url = await uploadMedia(file, "hero");
      if (url) onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="admin-hero-upload">
      {value && (
        // eslint-disable-next-line @next/next/no-img-element -- admin-only preview of an arbitrary uploaded URL
        <img src={value} alt="" className="admin-hero-preview" />
      )}
      <label className="btn">
        {isUploading ? "Uploading…" : value ? "Replace Image" : "Upload Hero Image"}
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) handleFile(file);
          }}
        />
      </label>
      {error && <p className="admin-upload-error">{error}</p>}
    </div>
  );
}
