"use client";

import Link from "next/link";
import { useState } from "react";
import type { PostWithAuthor } from "@/lib/queries";

const TYPES = ["Casting", "Crew", "Jobs", "Grants", "Labs", "Fellowships", "Festivals"] as const;

type OpportunityMeta = {
  opportunityType?: (typeof TYPES)[number];
  organization?: string;
  location?: string;
  compensation?: string;
  deadline?: string;
};

function formatDeadline(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** §32 VERIFY: deadline announced with full date context, not a bare date fragment. */
export default function OpportunitiesTabs({ posts }: { posts: PostWithAuthor[] }) {
  const [active, setActive] = useState<(typeof TYPES)[number] | "All">("All");
  const filtered =
    active === "All" ? posts : posts.filter((p) => (p.meta as OpportunityMeta)?.opportunityType === active);

  return (
    <>
      <div className="pill-row" role="group" aria-label="Filter by opportunity type">
        <button type="button" className={`pill${active === "All" ? " active" : ""}`} aria-pressed={active === "All"} onClick={() => setActive("All")}>
          All
        </button>
        {TYPES.map((type) => (
          <button
            key={type}
            type="button"
            className={`pill${active === type ? " active" : ""}`}
            aria-pressed={active === type}
            onClick={() => setActive(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="opportunities-empty">No {active === "All" ? "" : active.toLowerCase()} opportunities live right now.</p>
      ) : (
        <ul className="opportunities-list">
          {filtered.map((post) => {
            const meta = (post.meta ?? {}) as OpportunityMeta;
            return (
              <li key={post.id} className="opportunities-row">
                <Link href={`/story/${post.slug}`}>
                  <span className="opportunities-type">{meta.opportunityType ?? "Opportunity"}</span>
                  <span className="opportunities-title">{post.title}</span>
                  <span className="opportunities-org">{[meta.organization, meta.location].filter(Boolean).join(" · ")}</span>
                  {meta.compensation && <span className="opportunities-paid">{meta.compensation}</span>}
                  {meta.deadline && (
                    <span className="opportunities-deadline" aria-label={`Deadline: ${formatDeadline(meta.deadline)}`}>
                      {formatDeadline(meta.deadline)}
                    </span>
                  )}
                  <span className="opportunities-arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
