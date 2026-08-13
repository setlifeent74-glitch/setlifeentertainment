import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import TopNav from "@/components/TopNav";
import { getPostBySlug, getRedirectTargetSlug } from "@/lib/queries";

/**
 * §8: all post types (article, spotlight, review, news, ...) share one
 * canonical route, discriminated by `category`, not a route per type.
 * Full editorial rendering (§46) is Phase 10 scope — this establishes the
 * route, data-fetching, 301-on-slug-change, and 404 behavior correctly.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.seo_title || `${post.title} — Set Life Entertainment`,
    description: post.seo_description || post.dek || undefined,
    openGraph: post.og_image_url ? { images: [post.og_image_url] } : undefined,
  };
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    const targetSlug = await getRedirectTargetSlug(slug);
    if (targetSlug) permanentRedirect(`/story/${targetSlug}`);
    notFound();
  }

  return (
    <>
      <TopNav active="/story" />

      <article>
        <section className="page-header">
          <div className="wrap">
            <p className="eyebrow">{post.category.replace(/_/g, " ")}</p>
            <h1 className="display">{post.title}</h1>
            {post.dek && <p>{post.dek}</p>}
            <p style={{ marginTop: "16px" }}>
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
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.hero_image_url}
            alt={post.title}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        )}

        <section className="section">
          <div className="wrap" style={{ maxWidth: "760px" }}>
            <PostBody body={post.body} />
          </div>
        </section>
      </article>
    </>
  );
}

/**
 * Minimal block renderer — the real editorial rendering system (oversized
 * section headers, full-width image blocks, pull quotes, spotlight
 * role_line/credits/badges) is §46/Phase 10. This just needs to not crash
 * on whatever shape the content is in, and render it in reading order.
 *
 * Handles two shapes: the legacy simplified array (`seed.sql`'s
 * `[{type:"paragraph",text:"..."}]` convention, predating Phase 9) and
 * Tiptap's native ProseMirror JSON (`{type:"doc",content:[...]}`, what the
 * §45 admin editor now saves — Phase 9 outcome note). Both are walked here
 * rather than picking one, since existing seed content and new
 * editor-authored content coexist until seed.sql is migrated in Phase 10.
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
  attrs?: { level?: number; src?: string; alt?: string };
  content?: TiptapNodeShape[];
  text?: string;
  marks?: { type?: string }[];
};

function tiptapInlineText(nodes?: TiptapNodeShape[]): ReactNode {
  if (!nodes) return null;
  return nodes.map((node, i) => {
    const text = node.text ?? "";
    if (node.marks?.some((m) => m.type === "bold")) return <strong key={i}>{text}</strong>;
    if (node.marks?.some((m) => m.type === "italic")) return <em key={i}>{text}</em>;
    return text;
  });
}

function TiptapNode({ node }: { node: TiptapNodeShape }) {
  switch (node.type) {
    case "paragraph":
      return <p>{tiptapInlineText(node.content)}</p>;
    case "heading": {
      const level = node.attrs?.level ?? 2;
      const Tag = (level === 3 ? "h3" : "h2") as "h2" | "h3";
      return <Tag>{tiptapInlineText(node.content)}</Tag>;
    }
    case "blockquote":
      return <blockquote>{node.content?.map((child, i) => <TiptapNode key={i} node={child} />)}</blockquote>;
    case "bulletList":
      return <ul>{node.content?.map((child, i) => <TiptapNode key={i} node={child} />)}</ul>;
    case "orderedList":
      return <ol>{node.content?.map((child, i) => <TiptapNode key={i} node={child} />)}</ol>;
    case "listItem":
      return <li>{node.content?.map((child, i) => <TiptapNode key={i} node={child} />)}</li>;
    case "image":
      return node.attrs?.src ? (
        // eslint-disable-next-line @next/next/no-img-element -- article body image, arbitrary uploaded URL
        <img src={node.attrs.src} alt={node.attrs.alt ?? ""} style={{ width: "100%", height: "auto", margin: "24px 0" }} />
      ) : null;
    default:
      return null;
  }
}
