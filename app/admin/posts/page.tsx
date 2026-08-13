import Link from "next/link";
import { getAllPostsAdmin } from "@/lib/admin-queries";

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; category?: string }>;
}) {
  const { status, category } = await searchParams;
  const posts = await getAllPostsAdmin();

  const filtered = posts.filter((post) => {
    if (status && post.status !== status) return false;
    if (category && post.category !== category) return false;
    return true;
  });

  const categories = Array.from(new Set(posts.map((post) => post.category))).sort();

  return (
    <div className="admin-list-page">
      <div className="admin-list-header">
        <h1>Posts</h1>
        <Link href="/admin/posts/new" className="btn btn-primary">
          + New Post
        </Link>
      </div>

      <div className="admin-list-filters">
        <Link href="/admin/posts" className={!status ? "active" : ""}>
          All
        </Link>
        <Link href="/admin/posts?status=published" className={status === "published" ? "active" : ""}>
          Published
        </Link>
        <Link href="/admin/posts?status=draft" className={status === "draft" ? "active" : ""}>
          Draft
        </Link>
        {categories.map((c) => (
          <Link
            key={c}
            href={`/admin/posts?category=${c}`}
            className={category === c ? "active" : ""}
          >
            {c.replace(/_/g, " ")}
          </Link>
        ))}
      </div>

      <table className="admin-list-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Placement</th>
            <th>Author</th>
            <th>Status</th>
            <th>Updated</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((post) => (
            <tr key={post.id}>
              <td>
                <Link href={`/admin/posts/${post.id}`}>{post.title || "(untitled)"}</Link>
              </td>
              <td>{post.category.replace(/_/g, " ")}</td>
              <td>{post.placement ? post.placement.replace(/_/g, " ") : "—"}</td>
              <td>{post.authors?.name ?? "—"}</td>
              <td>
                <span className={`admin-status-badge${post.status === "published" ? " admin-status-badge--live" : ""}`}>
                  {post.status}
                </span>
              </td>
              <td>{new Date(post.updated_at).toLocaleDateString()}</td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={6}>No posts match this filter.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
