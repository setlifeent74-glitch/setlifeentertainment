"use client";

import Link from "next/link";
import { useState } from "react";
import type { PostWithAuthor } from "@/lib/queries";
import { cardImage } from "@/lib/post-image";

const STAGES = ["Development", "Pre-Production", "Shooting", "Post", "Festival", "Distribution"] as const;

const STATUS_LABEL: Record<string, string> = {
  Development: "In Production",
  "Pre-Production": "In Production",
  Shooting: "In Production",
  Post: "Post-Production",
  Festival: "Seeking Distribution",
  Distribution: "Seeking Distribution",
};

type ProductionMeta = {
  stage?: (typeof STAGES)[number];
  director?: string;
  company?: string;
  location?: string;
  genre?: string;
  logline?: string;
};

/** §28 VERIFY — filters update the result set without a full reload; active pill reflects state; empty result gets a designed empty state. */
export default function ProductionFilter({ posts }: { posts: PostWithAuthor[] }) {
  const [active, setActive] = useState<(typeof STAGES)[number] | "All">("All");

  const filtered = active === "All" ? posts : posts.filter((p) => (p.meta as ProductionMeta)?.stage === active);

  return (
    <>
      <div className="pill-row" role="group" aria-label="Filter by production stage">
        <button
          type="button"
          className={`pill${active === "All" ? " active" : ""}`}
          aria-pressed={active === "All"}
          onClick={() => setActive("All")}
        >
          All
        </button>
        {STAGES.map((stage) => (
          <button
            key={stage}
            type="button"
            className={`pill${active === stage ? " active" : ""}`}
            aria-pressed={active === stage}
            onClick={() => setActive(stage)}
          >
            {stage}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="production-empty">No productions at this stage right now — check another filter.</p>
      ) : (
        <div className="production-grid">
          {filtered.map((post) => {
            const meta = (post.meta ?? {}) as ProductionMeta;
            const statusLabel = meta.stage ? STATUS_LABEL[meta.stage] : "In Production";
            return (
              <Link href={`/story/${post.slug}`} key={post.id} className="production-card">
                <div className="production-card-image">
                  {/* eslint-disable-next-line @next/next/no-img-element -- card image, natural aspect ratio, no crop */}
                  {cardImage(post) && <img src={cardImage(post)!} alt="" />}
                  <span className="production-status">{statusLabel}</span>
                </div>
                <h3>{post.title}</h3>
                {meta.director && <p className="production-director">Dir. {meta.director}</p>}
                <p className="production-meta">{[meta.company, meta.location].filter(Boolean).join(" · ")}</p>
                {meta.genre && <p className="production-genre">{meta.genre}</p>}
                {meta.logline && <p className="production-logline">{meta.logline}</p>}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
