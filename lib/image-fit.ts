import type { CSSProperties } from "react";

/**
 * Shared with components/admin/ImageFitControl.tsx — turns a saved
 * fit/position pair into the inline style for an <img>. Pure, no server
 * imports, safe to use from client components.
 */
export function imageFitStyle(
  fit: string | null | undefined,
  position: string | null | undefined
): CSSProperties {
  return {
    objectFit: fit === "contain" ? "contain" : "cover",
    objectPosition: fit === "contain" ? "center" : position || "center",
  };
}
