"use client";

import { useState } from "react";
import Image from "next/image";
import { COVERS, type Category } from "@/lib/covers";

const FILTERS: { key: Category | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "actor", label: "Actors" },
  { key: "director", label: "Directors" },
  { key: "producer", label: "Producers" },
];

export default function IssuesGrid() {
  const [filter, setFilter] = useState<Category | "all">("all");
  const [query, setQuery] = useState("");

  return (
    <>
      <div className="filter-bar">
        <div className="pill-row" style={{ marginBottom: 0 }}>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`pill${filter === f.key ? " active" : ""}`}
              data-filter={f.key}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="cover-grid">
        {COVERS.map((cover) => {
          const name = `${cover.namePrefix} ${cover.nameEm}`.toLowerCase();
          const matchesCategory = filter === "all" || cover.category === filter;
          const matchesSearch = !query.trim() || name.includes(query.trim().toLowerCase());
          const visible = matchesCategory && matchesSearch;
          return (
            <a
              key={cover.slug}
              className="cover-card has-img"
              href="#"
              data-category={cover.category}
              data-name={`${cover.namePrefix} ${cover.nameEm}`}
              style={{ display: visible ? "" : "none" }}
            >
              <span className="issue-no">{cover.issueLabel}</span>
              <Image src={cover.image} alt={cover.alt} fill sizes="(max-width: 767px) 50vw, 25vw" />
              <div className="card-body">
                <span className="card-name">
                  {cover.namePrefix}
                  <em>{cover.nameEm}</em>
                </span>
                <span className="card-role">{cover.role}</span>
              </div>
            </a>
          );
        })}
      </div>
    </>
  );
}
