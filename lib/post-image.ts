import type { CSSProperties } from "react";
import type { Database } from "@/lib/supabase/types";

type Post = Database["public"]["Tables"]["posts"]["Row"];

/**
 * Homepage sections/cards show `card_image_url` when a contributor set one
 * (distinct from the article page's own `hero_image_url` banner), falling
 * back to the hero image so existing posts render exactly as before.
 *
 * Deliberately its own file, not part of lib/queries.ts: queries.ts pulls in
 * lib/supabase/server (next/headers, server-only), which breaks any client
 * component that needs this helper (e.g. ProductionFilter.tsx's "use
 * client" filter UI) if imported from there.
 */
export function cardImage(post: Post): string | null {
  return post.card_image_url || post.hero_image_url;
}

/**
 * For the handful of homepage sections that keep a uniform, always-cropped
 * card box (Spotlight, Festival Circuit, Below the Line, Fresh Faces,
 * Instagram fallback grid) — those don't offer the Crop/Show-Full toggle
 * (cropping is required there for the layout to work), only a focal-point
 * position, stored in `meta.cardPosition`.
 */
export function cardImagePosition(post: Post): CSSProperties {
  const meta = (post.meta ?? {}) as { cardPosition?: string };
  return { objectFit: "cover", objectPosition: meta.cardPosition || "center" };
}
