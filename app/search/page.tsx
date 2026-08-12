import type { Metadata } from "next";
import Link from "next/link";
import TopNav from "@/components/TopNav";
import ProductCard from "@/components/ProductCard";
import { searchContent } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Search — Set Life Entertainment",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q ?? "";
  const { posts, products } = query ? await searchContent(query) : { posts: [], products: [] };
  const hasResults = posts.length > 0 || products.length > 0;

  return (
    <>
      <TopNav active="/search" />

      <section className="page-header">
        <div className="wrap">
          <p className="eyebrow">Search</p>
          <h1 className="display">FIND A STORY</h1>
          <form action="/search" method="get" role="search" className="search-form">
            <label htmlFor="search-q" className="sr-only">
              Search Set Life Entertainment
            </label>
            <input
              id="search-q"
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Search stories, issues, shop…"
              autoFocus
            />
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          {!query && <p>Enter a search term above.</p>}

          {query && !hasResults && <p>No results for &quot;{query}&quot;.</p>}

          {posts.length > 0 && (
            <>
              <h2 className="headline">Stories</h2>
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
            </>
          )}

          {products.length > 0 && (
            <>
              <h2 className="headline" style={{ marginTop: "var(--space-48)" }}>
                Shop
              </h2>
              <div className="cover-grid">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
