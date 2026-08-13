import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import TopNav from "@/components/TopNav";
import ReadingProgress from "@/components/story/ReadingProgress";
import ShareActions from "@/components/story/ShareActions";
import CreditsList from "@/components/story/CreditsList";
import PlatformBadges from "@/components/story/PlatformBadges";
import CalloutBox from "@/components/story/CalloutBox";
import RelatedContent from "@/components/story/RelatedContent";
import { getPostBySlug, getRedirectTargetSlug, getRelatedPosts, getNextArticle } from "@/lib/queries";
import { getSiteUrl } from "@/lib/site-url";
import ArticleJsonLd from "@/components/story/ArticleJsonLd";
import { createClient } from "@/lib/supabase/server";

/**
 * §8: all post types (article, spotlight, review, news, ...) share one
 * canonical route, discriminated by `category`, not a route per type.
 * §46 — the full magazine reading experience.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const title = post.seo_title || `${post.title} — Set Life Entertainment`;
  const description = post.seo_description || post.dek || undefined;
  const image = post.og_image_url || post.hero_image_url || undefined;
  const url = `${getSiteUrl()}/story/${post.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: image ? [{ url: image }] : undefined,
      publishedTime: post.published_at ?? undefined,
      authors: [post.authors.name],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

type Credit = { title: string; year: string; tag?: string };
type Callout = { heading: string; icon?: string; items: string[] };
type ArticleMeta = {
  role_line?: string;
  credits?: Credit[];
  platformBadges?: string[];
  callout?: Callout;
  videoUrl?: string;
  captionsUrl?: string;
};

export default async function StoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { slug } = await params;
  const { preview } = await searchParams;

  // Draft preview: only honored for a signed-in admin user, so a bare
  // `?preview=1` on a link never exposes unpublished content to anyone else.
  let isPreviewingDraft = false;
  let post = await getPostBySlug(slug);
  if (!post && preview === "1") {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      post = await getPostBySlug(slug, { includeUnpublished: true });
      if (post && post.status !== "published") isPreviewingDraft = true;
    }
  }

  if (!post) {
    const targetSlug = await getRedirectTargetSlug(slug);
    if (targetSlug) permanentRedirect(`/story/${targetSlug}`);
    notFound();
  }

  const meta = (post.meta ?? {}) as ArticleMeta;
  const [related, next] = await Promise.all([getRelatedPosts(post), getNextArticle(post)]);
  const url = `${getSiteUrl()}/story/${post.slug}`;

  return (
    <>
      {isPreviewingDraft && (
        <div className="preview-draft-banner">
          Draft preview — not published. Only visible to signed-in admins.
        </div>
      )}
      <TopNav active="/story" />
      <ArticleJsonLd post={post} url={url} />
      <ReadingProgress targetId="article-body" />

      <article>
        <section className="article-header">
          <div className="wrap">
            <p className="eyebrow">{post.category.replace(/_/g, " ")}</p>

            {/* §46 spotlight header block — role_line only on spotlight posts, never an empty line. */}
            {meta.role_line && <p className="spotlight-role-line">{meta.role_line}</p>}

            <h1 className="article-headline">{post.title}</h1>
            {post.dek && <p className="article-dek">{post.dek}</p>}

            <p className="article-byline">
              By{" "}
              <Link href={`/authors/${post.authors.slug}`} className="accent-gold">
                {post.authors.name}
              </Link>
              {post.published_at && (
                <>
                  {" "}
                  ·{" "}
                  {new Date(post.published_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </>
              )}
              {post.reading_time && <> · {post.reading_time} min read</>}
            </p>
          </div>
        </section>

        {post.hero_image_url && (
          // eslint-disable-next-line @next/next/no-img-element -- hero image, arbitrary uploaded URL
          <img src={post.hero_image_url} alt={post.title} className="article-hero-image" />
        )}

        <div className="article-layout wrap">
          <div id="article-body" className="article-body">
            <PostBody body={post.body} />

            {post.category === "video" && meta.videoUrl && (
              <div className="article-video-embed">
                <video controls poster={post.hero_image_url ?? undefined} preload="none">
                  <source src={meta.videoUrl} type="video/mp4" />
                  {meta.captionsUrl && <track kind="captions" src={meta.captionsUrl} label="English" default />}
                </video>
              </div>
            )}

            <CreditsList credits={meta.credits ?? []} />
            <PlatformBadges platforms={meta.platformBadges ?? []} />
            <CalloutBox callout={meta.callout} />

            <ShareActions title={post.title} url={url} />
          </div>
        </div>
      </article>

      <RelatedContent related={related} next={next} />
    </>
  );
}

/**
 * Walks Tiptap's ProseMirror JSON in reading order. Also handles the
 * legacy simplified array (`seed.sql`'s pre-Phase-9 convention).
 *
 * Known, disclosed scope simplification (Phase 9 outcome note, still true
 * here): credits/badges/callout are separate `meta` fields, not custom
 * Tiptap node types, so they render in a fixed position after the body
 * rather than truly interleaved wherever the contributor placed them in
 * the block sequence, as §46 literally describes. Rebuilding them as
 * first-class ProseMirror node types (custom NodeViews) is a materially
 * larger lift than this pass scoped.
 */
function PostBody({ body }: { body: unknown }) {
  if (!body || typeof body !== "object") return null;

  if (Array.isArray(body)) {
    return (
      <>
        {body.map((block, i) => {
          if (block && typeof block === "object" && "text" in block && typeof block.text === "string") {
            return <p key={i}>{block.text}</p>;
          }
          return null;
        })}
      </>
    );
  }

  const doc = body as { type?: string; content?: TiptapNodeShape[] };
  if (doc.type !== "doc" || !Array.isArray(doc.content)) return null;
  return <>{doc.content.map((node, i) => <TiptapNode key={i} node={node} />)}</>;
}

type TiptapNodeShape = {
  type?: string;
  attrs?: {
    level?: number;
    src?: string;
    alt?: string;
    variant?: string;
    color?: string;
    opacity?: number;
    label?: string;
  };
  content?: TiptapNodeShape[];
  text?: string;
  marks?: { type?: string; attrs?: { color?: string } }[];
};

function tiptapInlineText(nodes?: TiptapNodeShape[]): ReactNode {
  if (!nodes) return null;
  return nodes.map((node, i) => {
    // Non-text inline nodes (currently just the pill atom) render through
    // the block-level switch instead of being treated as text.
    if (node.type && node.type !== "text") return <TiptapNode key={i} node={node} />;

    const marks = node.marks ?? [];
    let el: ReactNode = node.text ?? "";
    if (marks.some((m) => m.type === "italic")) el = <em>{el}</em>;
    if (marks.some((m) => m.type === "bold")) el = <strong>{el}</strong>;
    const color = marks.find((m) => m.type === "textStyle")?.attrs?.color;
    if (color) el = <span style={{ color }}>{el}</span>;
    return <span key={i}>{el}</span>;
  });
}

function TiptapNode({ node }: { node: TiptapNodeShape }) {
  switch (node.type) {
    case "paragraph":
      return <p>{tiptapInlineText(node.content)}</p>;
    case "heading": {
      const level = node.attrs?.level ?? 2;
      const Tag = (level === 3 ? "h3" : "h2") as "h2" | "h3";
      return <Tag className="article-section-header">{tiptapInlineText(node.content)}</Tag>;
    }
    case "blockquote":
      return <blockquote className="article-pull-quote">{node.content?.map((child, i) => <TiptapNode key={i} node={child} />)}</blockquote>;
    case "styledBox": {
      const variant = node.attrs?.variant ?? "panel";
      const color = node.attrs?.color ?? "#d9a441";
      const opacity = node.attrs?.opacity ?? 0.12;
      const boxStyle = { "--box-color": color, "--box-opacity": String(opacity) } as CSSProperties;
      return (
        <div className={`article-styled-box article-styled-box--${variant}`} style={boxStyle}>
          {node.content?.map((child, i) => <TiptapNode key={i} node={child} />)}
        </div>
      );
    }
    case "pill": {
      const pillStyle = { "--pill-color": node.attrs?.color ?? "#d9a441" } as CSSProperties;
      return <span className="article-pill" style={pillStyle}>{node.attrs?.label ?? ""}</span>;
    }
    case "bulletList":
      return <ul>{node.content?.map((child, i) => <TiptapNode key={i} node={child} />)}</ul>;
    case "orderedList":
      return <ol>{node.content?.map((child, i) => <TiptapNode key={i} node={child} />)}</ol>;
    case "listItem":
      return <li>{node.content?.map((child, i) => <TiptapNode key={i} node={child} />)}</li>;
    case "image":
      // Alt text stays on the <img> for screen readers only — it used to
      // also render as a visible <figcaption>, which meant every image
      // (especially multi-page PDF uploads) showed its accessibility text
      // as an ugly caption underneath. There's no separate visible-caption
      // field, so nothing is shown here now.
      return node.attrs?.src ? (
        <figure className="article-image-block">
          {/* eslint-disable-next-line @next/next/no-img-element -- article body image, arbitrary uploaded URL */}
          <img src={node.attrs.src} alt={node.attrs.alt ?? ""} />
        </figure>
      ) : null;
    default:
      return null;
  }
}
