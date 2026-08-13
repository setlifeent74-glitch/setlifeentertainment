"use client";

import { markSubmissionReviewed, deleteSubmission } from "@/app/actions/submissions-admin";
import type { Database } from "@/lib/supabase/types";

type Submission = Database["public"]["Tables"]["submissions"]["Row"];

export default function SubmissionRow({ submission }: { submission: Submission }) {
  return (
    <div className={`admin-submission-card${submission.reviewed ? " admin-submission-card--reviewed" : ""}`}>
      <div className="admin-submission-header">
        <h3>{submission.full_name}</h3>
        <span>{new Date(submission.created_at).toLocaleDateString()}</span>
      </div>
      <p className="admin-submission-meta">
        {submission.role && <span>{submission.role}</span>}
        <a href={`mailto:${submission.email}`}>{submission.email}</a>
        {submission.instagram && <span>{submission.instagram}</span>}
        {submission.portfolio_link && (
          <a href={submission.portfolio_link} target="_blank" rel="noopener">
            Portfolio
          </a>
        )}
      </p>
      {submission.project_title && <p className="admin-submission-project">{submission.project_title}</p>}
      <p className="admin-submission-story">{submission.story}</p>
      <div className="admin-submission-actions">
        <button
          type="button"
          className="btn"
          onClick={() => markSubmissionReviewed(submission.id, !submission.reviewed)}
        >
          {submission.reviewed ? "Mark Unreviewed" : "Mark Reviewed"}
        </button>
        <button
          type="button"
          className="admin-delete-btn"
          onClick={() => {
            if (confirm("Delete this submission permanently?")) deleteSubmission(submission.id);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
