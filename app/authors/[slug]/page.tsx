import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import TopNav from "@/components/TopNav";
import { getAuthorBySlug } from "@/lib/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getAuthorBySlug(slug);
  if (!result) return {};
  return { title: `${result.author.name} — Set Life Entertainment` };
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getAuthorBySlug(slug);
  if (!result) notFound();
  const { author, posts } = result;

  return (
    <>
      <TopNav active="/authors" />

      <section className="page-header">
        <div className="wrap">
          <p className="eyebrow">Contributor</p>
          <h1 className="display">{author.name}</h1>
          {author.title && <p>{author.title}</p>}
          {author.bio && <p>{author.bio}</p>}
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <h2 className="headline">Stories by {author.name}</h2>
            </div>
          </div>
          {posts.length === 0 ? (
            <p>No published stories yet.</p>
          ) : (
            <div className="cover-grid">
              {posts.map((post) => (
                <Link key={post.id} href={`/story/${post.slug}`} className="cover-card">
                  <div className="card-body">
                    <span className="card-name">{post.title}</span>
                    {post.dek && <span className="card-role">{post.dek}</span>}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
