import Link from "next/link";
import type { PostWithAuthor } from "@/lib/queries";
import { cardImage } from "@/lib/queries";

/** §46 — related stories (same category, then author, then recent) plus a single next-article recommendation at the foot. Hides cleanly when empty. */
export default function RelatedContent({ related, next }: { related: PostWithAuthor[]; next: PostWithAuthor | null }) {
  if (related.length === 0 && !next) return null;

  return (
    <section className="related-content section">
      <div className="wrap">
        {related.length > 0 && (
          <>
            <p className="eyebrow">Related Stories</p>
            <div className="cover-grid">
              {related.map((post) => {
                const image = cardImage(post);
                return (
                  <Link key={post.id} href={`/story/${post.slug}`} className={`cover-card${image ? " has-img" : ""}`}>
                    {image ? (
                      <div className="cover-card-image">
                        {/* eslint-disable-next-line @next/next/no-img-element -- related-post thumbnail, arbitrary uploaded URL */}
                        <img src={image} alt="" />
                      </div>
                    ) : null}
                    <div className="card-body">
                      <span className="card-name">{post.title}</span>
                      {post.dek && <span className="card-role">{post.dek}</span>}
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}

        {next && (
          <Link href={`/story/${next.slug}`} className="next-article">
            <span className="eyebrow">Next Up</span>
            <span className="next-article-title">{next.title}</span>
          </Link>
        )}
      </div>
    </section>
  );
}
