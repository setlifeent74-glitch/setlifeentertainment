"use client";

import { useState } from "react";

/** §46 — "Share actions... accessible without hover" (mobile). Native share sheet where available, copy-link everywhere. */
export default function ShareActions({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // user cancelled the native share sheet — fall through to nothing
        return;
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="share-actions">
      <span className="eyebrow">Share</span>
      <button type="button" className="btn" onClick={handleShare}>
        {copied ? "Link Copied ✓" : "Share This Story"}
      </button>
    </div>
  );
}
