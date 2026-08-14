import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import { getInstagramFallbackPosts, getSectionColors, cardImage } from "@/lib/queries";
import { cardImagePosition } from "@/lib/post-image";

type GridItem = { href: string; imageUrl: string; caption: string; isInstagram: boolean; position: string };

/**
 * §36 From @setlifeentertainment — Gate: API reachable or CMS fallback
 * populated. No INSTAGRAM_ACCESS_TOKEN is configured in this environment,
 * so this always takes the fallback path today — that's the honest
 * "confirm access during this phase; fall back if unavailable" outcome,
 * not a placeholder. Swap in a real Graph API call here once a token
 * exists; the fallback path stays as the degradation target either way.
 */
async function getGridItems(): Promise<{ items: GridItem[]; isLive: boolean }> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (token) {
    try {
      const res = await fetch(
        `https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink&access_token=${token}`,
        { next: { revalidate: 3600 } }
      );
      if (res.ok) {
        const json = await res.json();
        const items: GridItem[] = (json.data ?? []).slice(0, 5).map((m: { id: string; permalink: string; media_url: string; caption?: string }) => ({
          href: m.permalink,
          imageUrl: m.media_url,
          caption: m.caption ?? "",
          isInstagram: true,
          position: "center",
        }));
        if (items.length > 0) return { items, isLive: true };
      }
    } catch {
      // Falls through to the CMS fallback below.
    }
  }

  const posts = await getInstagramFallbackPosts();
  return {
    items: posts.map((post) => ({
      href: `/story/${post.slug}`,
      imageUrl: cardImage(post)!,
      caption: post.dek ?? post.title,
      isInstagram: false,
      position: String(cardImagePosition(post).objectPosition ?? "center"),
    })),
    isLive: false,
  };
}

export default async function InstagramSection() {
  const [{ items }, colors] = await Promise.all([getGridItems(), getSectionColors()]);
  if (items.length === 0) return null;

  return (
    <ScrollReveal
      as="section"
      className="instagram-section"
      style={colors.instagram ? { backgroundColor: colors.instagram } : undefined}
    >
      <div className="wrap">
        <div className="instagram-header">
          <h2 className="headline mask-reveal"><span>FROM @SETLIFEENTERTAINMENT</span></h2>
          <a href="https://www.instagram.com/setlifeentertainment/" target="_blank" rel="noopener">
            Follow on Instagram
          </a>
        </div>

        <div className="instagram-grid">
          {items.slice(0, 5).map((item, i) => (
            <Link
              href={item.href}
              key={item.href + i}
              className="instagram-item"
              target={item.isInstagram ? "_blank" : undefined}
              rel={item.isInstagram ? "noopener" : undefined}
            >
              <Image
                src={item.imageUrl}
                alt=""
                fill
                sizes="(max-width: 767px) 50vw, 20vw"
                style={{ objectFit: "cover", objectPosition: item.position }}
              />
              <div className="instagram-item-overlay">
                <span className="instagram-mark" aria-hidden="true">
                  {item.isInstagram ? "IG" : "SLE"}
                </span>
                {item.caption && <span className="instagram-caption">{item.caption}</span>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}
