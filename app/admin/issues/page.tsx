import Link from "next/link";
import { getAllIssuesAdmin } from "@/lib/admin-queries";

export default async function AdminIssuesPage() {
  const issues = await getAllIssuesAdmin();

  return (
    <div className="admin-list-page">
      <div className="admin-list-header">
        <h1>Magazine Issues</h1>
        <Link href="/admin/issues/new" className="btn btn-primary">
          + New Issue
        </Link>
      </div>

      <table className="admin-list-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Release Date</th>
            <th>Current</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => (
            <tr key={issue.id}>
              <td>
                <Link href={`/admin/issues/${issue.id}`}>{issue.issue_number}</Link>
              </td>
              <td>{issue.title}</td>
              <td>{issue.release_date ?? "—"}</td>
              <td>{issue.is_current ? "Yes" : ""}</td>
            </tr>
          ))}
          {issues.length === 0 && (
            <tr>
              <td colSpan={4}>No issues yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
