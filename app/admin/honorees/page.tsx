import Link from "next/link";
import { getAllHonoreesAdmin } from "@/lib/admin-queries";

export default async function AdminHonoreesPage() {
  const honorees = await getAllHonoreesAdmin();

  return (
    <div className="admin-list-page">
      <div className="admin-list-header">
        <h1>Set Life 100</h1>
        <Link href="/admin/honorees/new" className="btn btn-primary">
          + New Honoree
        </Link>
      </div>

      <table className="admin-list-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Year</th>
            <th>Rank</th>
            <th>Published</th>
          </tr>
        </thead>
        <tbody>
          {honorees.map((honoree) => (
            <tr key={honoree.id}>
              <td>
                <Link href={`/admin/honorees/${honoree.id}`}>{honoree.name}</Link>
              </td>
              <td>{honoree.list_year}</td>
              <td>{honoree.rank ?? "—"}</td>
              <td>{honoree.published ? "Yes" : ""}</td>
            </tr>
          ))}
          {honorees.length === 0 && (
            <tr>
              <td colSpan={4}>No honorees yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
