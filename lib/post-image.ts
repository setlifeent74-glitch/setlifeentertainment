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
