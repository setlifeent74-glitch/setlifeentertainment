"use client";

import { useState } from "react";
import Link from "next/link";
import type { PostWithAuthor } from "@/lib/queries";

const TABS = [
  { label: "All", value: "" },
  { label: "Casting", value: "casting" },
  { label: "Crew", value: "crew" },
  { label: "Jobs", value: "jobs" },
  { label: "Grants", value: "grants" },
  { label: "Labs", value: "labs" },
  { label: "Fellowships", value: "fellowships" },
  { label: "Festivals", value: "festivals" },
] as const;

type TabValue = (typeof TABS)[number]["value"];

function formatDeadline(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function OpportunitiesList({ opportunities }: { opportunities: PostWithAuthor[] }) {
  const [activeTab, setActiveTab] = useState<TabValue>("");

  const filtered = activeTab
    ? opportunities.filter((p) => {
        const type = ((p.meta as Record<string, string> | null)?.opportunityType ?? "").toLowerCase();
        return type.includes(activeTab);
      })
    : opportunities;

  return (
    <>
      {/* §32 filter tabs */}
      <div
        className="pill-row"
        role="group"
        aria-label="Filter opportunities by type"
        style={{ marginBottom: "var(--space-32)" }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            className={`pill${activeTab === tab.value ? " pill--active" : ""}`}
            aria-pressed={activeTab === tab.value}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p>No opportunities match this filter right now — check back soon.</p>
      ) : (
        <div className="opportunity-list">
          {filtered.map((post) => {
            const meta = post.meta as {
              opportunityType?: string;
              organization?: string;
              location?: string;
              compensation?: string;
              deadline?: string;
            } | null;
            return (
              <Link key={post.id} href={`/story/${post.slug}`} className="opportunity-row">
                <div className="opportunity-meta">
                  {meta?.opportunityType && (
                    <span className="eyebrow">{meta.opportunityType}</span>
                  )}
                  <h3 className="opportunity-title">{post.title}</h3>
                  <div className="opportunity-details">
                    {meta?.organization && <span>{meta.organization}</span>}
                    {meta?.location && <span>{meta.location}</span>}
                    {meta?.compensation && <span>{meta.compensation}</span>}
                  </div>
                </div>
                <div className="opportunity-deadline">
                  {meta?.deadline ? (
                    <>
                      <span className="eyebrow">Deadline</span>
                      <span className="accent-gold">{formatDeadline(meta.deadline)}</span>
                    </>
                  ) : (
                    <span className="eyebrow">Open</span>
                  )}
                  <span className="opportunity-arrow" aria-hidden="true">→</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
