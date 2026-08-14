/**
 * §41 video sections — a `videoUrl` can be either a direct file the admin
 * uploaded (mp4 etc., served from the `media` storage bucket) or a pasted
 * YouTube/Vimeo link. Both need to play inline on the public page: direct
 * files via a native <video>, embed links via an <iframe> pointed at the
 * platform's dedicated embed path. Pure/client-safe — no server imports.
 */
export function getVideoEmbedUrl(url: string): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsed.pathname === "/watch") {
        const id = parsed.searchParams.get("v");
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
      if (parsed.pathname.startsWith("/embed/")) return url;
      if (parsed.pathname.startsWith("/shorts/")) {
        const id = parsed.pathname.split("/")[2];
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
      return null;
    }

    if (host === "vimeo.com") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id && /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}` : null;
    }

    if (host === "player.vimeo.com") return url;

    return null;
  } catch {
    return null;
  }
}
