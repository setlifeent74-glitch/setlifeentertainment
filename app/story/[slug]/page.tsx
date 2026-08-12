import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
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
 * section headers, full-width image blocks, pull quotes) is §46/Phase 10.
 * This just needs to not crash on whatever shape the eventual editor
 * produces, and render plain-text blocks reasonably.
 */
function PostBody({ body }: { body: unknown }) {
  if (!Array.isArray(body)) return null;
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
