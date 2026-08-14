import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import TopNav from "@/components/TopNav";
import JsonLd from "@/components/JsonLd";
import { getAuthorBySlug } from "@/lib/queries";
import { personJsonLd, breadcrumbJsonLd } from "@/lib/structured-data";
import { getSiteUrl } from "@/lib/site-url";
import { imageFitStyle } from "@/lib/image-fit";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getAuthorBySlug(slug);
  if (!result) return {};
  const { author } = result;
  const title = `${author.name} — Set Life Entertainment`;
  const url = `${getSiteUrl()}/authors/${author.slug}`;
  return {
    title,
    description: author.bio ?? undefined,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: author.bio ?? undefined,
      url,
      type: "profile",
      images: author.avatar_url ? [{ url: author.avatar_url }] : undefined,
    },
  };
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getAuthorBySlug(slug);
  if (!result) notFound();
  const { author, posts } = result;
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/authors/${author.slug}`;

  return (
    <>
      <TopNav active="/authors" />
      <JsonLd data={personJsonLd(author, url)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: siteUrl },
          { name: author.name, url },
        ])}
      />

      <section className="page-header">
        <div className="wrap author-header">
          {author.avatar_url && (
            <div className="author-avatar">
              {/* eslint-disable-next-line @next/next/no-img-element -- author avatar, arbitrary uploaded URL */}
              <img
                src={author.avatar_url}
                alt={author.name}
                style={imageFitStyle(author.avatar_fit, author.avatar_position)}
              />
            </div>
          )}
          <div>
            <p className="eyebrow">Contributor</p>
            <h1 className="display">{author.name}</h1>
            {author.title && <p>{author.title}</p>}
            {author.bio && <p>{author.bio}</p>}
          </div>
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
