import { getAllSubmissions } from "@/lib/admin-queries";
import SubmissionRow from "@/components/admin/SubmissionRow";

export default async function AdminSubmissionsPage() {
  const submissions = await getAllSubmissions();

  return (
    <div className="admin-list-page">
      <div className="admin-list-header">
        <h1>Submissions</h1>
      </div>
      <div className="admin-submission-list">
        {submissions.map((submission) => (
          <SubmissionRow key={submission.id} submission={submission} />
        ))}
        {submissions.length === 0 && <p>No submissions yet.</p>}
      </div>
    </div>
  );
}
