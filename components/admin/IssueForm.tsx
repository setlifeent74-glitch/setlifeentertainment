"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import HeroImageUpload from "./HeroImageUpload";
import { saveIssue, deleteIssue } from "@/app/actions/issues";
import type { MagazineIssue } from "@/lib/queries";

export default function IssueForm({ issue }: { issue?: MagazineIssue }) {
  const router = useRouter();
  const [issueNumber, setIssueNumber] = useState(issue?.issue_number?.toString() ?? "");
  const [title, setTitle] = useState(issue?.title ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(issue?.cover_image_url ?? "");
  const [releaseDate, setReleaseDate] = useState(issue?.release_date ?? "");
  const [summary, setSummary] = useState(issue?.summary ?? "");
  const [isCurrent, setIsCurrent] = useState(issue?.is_current ?? false);
  const [status, setStatus] = useState<string | null>(null);

  const handleSave = async () => {
    setStatus("Saving…");
    const result = await saveIssue({
      id: issue?.id,
      issueNumber: Number(issueNumber),
      title,
      coverImageUrl,
      releaseDate,
      summary,
      isCurrent,
    });
    if (result.error) {
      setStatus(`Error: ${result.error}`);
      return;
    }
    setStatus("Saved");
    if (!issue) router.push(`/admin/issues/${result.id}`);
  };

  return (
    <div className="admin-editor">
      <div className="admin-editor-main">
        <input className="admin-editor-title" placeholder="Issue title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <div className="admin-field">
          <label htmlFor="issue-summary">Summary</label>
          <textarea id="issue-summary" rows={6} value={summary} onChange={(e) => setSummary(e.target.value)} />
        </div>
      </div>

      <div className="admin-editor-sidebar">
        <div className="admin-field">
          <label htmlFor="issue-number">Issue Number</label>
          <input id="issue-number" type="number" value={issueNumber} onChange={(e) => setIssueNumber(e.target.value)} />
        </div>
        <div className="admin-field">
          <label htmlFor="issue-release-date">Release Date</label>
          <input id="issue-release-date" type="date" value={releaseDate ?? ""} onChange={(e) => setReleaseDate(e.target.value)} />
        </div>
        <div className="admin-field">
          <label>Cover Image</label>
          <HeroImageUpload value={coverImageUrl ?? ""} onChange={setCoverImageUrl} />
        </div>
        <div className="admin-field">
          <label htmlFor="issue-current">
            <input id="issue-current" type="checkbox" checked={isCurrent} onChange={(e) => setIsCurrent(e.target.checked)} />
            {" "}Current Issue
          </label>
        </div>

        <div className="admin-editor-actions">
          <button type="button" className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
          {issue && (
            <button
              type="button"
              className="admin-delete-btn"
              onClick={() => {
                if (confirm("Delete this issue permanently?")) deleteIssue(issue.id);
              }}
            >
              Delete
            </button>
          )}
        </div>
        {status && <p className="admin-editor-status">{status}</p>}
      </div>
    </div>
  );
}
