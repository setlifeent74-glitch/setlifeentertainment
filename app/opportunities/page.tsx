import type { Metadata } from "next";
import Link from "next/link";
import TopNav from "@/components/TopNav";
import { getLiveOpportunities } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Opportunities — Set Life Entertainment",
  description: "Casting, crew, jobs, grants, labs, and fellowships for independent film.",
};

export default async function OpportunitiesPage() {
  const opportunities = await getLiveOpportunities();

  return (
    <>
      <TopNav active="/opportunities" />

      <section className="page-header">
        <div className="wrap">
          <p className="eyebrow">Opportunities</p>
          <h1 className="display">YOUR NEXT PROJECT MAY START HERE</h1>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          {opportunities.length === 0 ? (
            <p>No live opportunities right now — check back soon.</p>
          ) : (
            <div className="cover-grid">
              {opportunities.map((post) => {
                const meta = post.meta as { deadline?: string; compensation?: string } | null;
                return (
                  <Link key={post.id} href={`/story/${post.slug}`} className="cover-card">
                    <div className="card-body">
                      <span className="card-name">{post.title}</span>
                      {meta?.deadline && (
                        <span className="card-role accent-gold">
                          Deadline:{" "}
                          {new Date(meta.deadline).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
