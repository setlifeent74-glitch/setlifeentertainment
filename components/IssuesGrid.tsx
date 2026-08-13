"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { MagazineIssue } from "@/lib/queries";

/** §41 archive — replaces the pre-CMS static demo grid (fake `href="#"` cards over hardcoded cover people) with real `magazine_issues` rows and links to `/issues/[number]`. */
export default function IssuesGrid({ issues }: { issues: MagazineIssue[] }) {
  const [query, setQuery] = useState("");

  const visibleIssues = issues.filter(
    (issue) => !query.trim() || issue.title.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <>
      <div className="filter-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search issues by title…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search issues by title"
          />
        </div>
      </div>

      {issues.length === 0 ? (
        <p>No issues published yet.</p>
      ) : visibleIssues.length === 0 ? (
        <p>No issues match &quot;{query}&quot;.</p>
      ) : (
        <div className="cover-grid">
          {visibleIssues.map((issue) => (
            <Link
              key={issue.id}
              className={`cover-card${issue.cover_image_url ? " has-img" : ""}`}
              href={`/issues/${issue.issue_number}`}
            >
              {issue.cover_image_url ? (
                <>
                  {/* Image is its own clean block — no text ever renders on top of it. */}
                  <div className="cover-card-image">
                    <Image src={issue.cover_image_url} alt={issue.title} fill sizes="(max-width: 767px) 50vw, 25vw" />
                  </div>
                  <div className="card-body">
                    <span className="issue-no">
                      {issue.is_current ? "Current Issue" : `Issue ${issue.issue_number}`}
                    </span>
                    <span className="card-name">{issue.title}</span>
                    {issue.release_date && (
                      <span className="card-role">
                        {new Date(issue.release_date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <span className="issue-no">
                    {issue.is_current ? "Current Issue" : `Issue ${issue.issue_number}`}
                  </span>
                  <div className="card-body">
                    <span className="card-name">{issue.title}</span>
                    {issue.release_date && (
                      <span className="card-role">
                        {new Date(issue.release_date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                      </span>
                    )}
                  </div>
                </>
              )}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
