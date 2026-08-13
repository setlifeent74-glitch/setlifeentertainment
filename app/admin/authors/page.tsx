import Link from "next/link";
import { getAllAuthors } from "@/lib/admin-queries";

export default async function AdminAuthorsPage() {
  const authors = await getAllAuthors();

  return (
    <div className="admin-list-page">
      <div className="admin-list-header">
        <h1>Authors</h1>
        <Link href="/admin/authors/new" className="btn btn-primary">
          + New Author
        </Link>
      </div>

      <table className="admin-list-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Title</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {authors.map((author) => (
            <tr key={author.id}>
              <td>
                <Link href={`/admin/authors/${author.id}`}>{author.name}</Link>
              </td>
              <td>{author.title ?? "—"}</td>
              <td>{author.location ?? "—"}</td>
            </tr>
          ))}
          {authors.length === 0 && (
            <tr>
              <td colSpan={3}>No authors yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
