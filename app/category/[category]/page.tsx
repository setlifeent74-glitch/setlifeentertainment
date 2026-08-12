import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import TopNav from "@/components/TopNav";
import { getPostsByCategory, type PostCategory } from "@/lib/queries";

const VALID_CATEGORIES: PostCategory[] = [
  "article", "news", "spotlight", "review", "opportunity", "festival",
  "below_the_line", "production", "video", "behind_the_lens",
];

const CATEGORY_LABELS: Record<PostCategory, string> = {
  article: "Articles",
  news: "News",
  spotlight: "Spotlights",
  review: "Reviews",
  opportunity: "Opportunities",
  festival: "Festivals",
  below_the_line: "Below the Line",
  production: "Now in Production",
  video: "Video",
  behind_the_lens: "Behind the Lens",
};

function isValidCategory(value: string): value is PostCategory {
  return (VALID_CATEGORIES as string[]).includes(value);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  if (!isValidCategory(category)) return {};
  return { title: `${CATEGORY_LABELS[category]} — Set Life Entertainment` };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  if (!isValidCategory(category)) notFound();

  const posts = await getPostsByCategory(category);

  return (
    <>
      <TopNav active="/category" />

      <section className="page-header">
        <div className="wrap">
          <p className="eyebrow">Category</p>
          <h1 className="display">{CATEGORY_LABELS[category].toUpperCase()}</h1>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          {posts.length === 0 ? (
            <p>No published stories in this category yet.</p>
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
