import type { Metadata } from "next";
import TopNav from "@/components/TopNav";
import OpportunitiesList from "@/components/OpportunitiesList";
import { getLiveOpportunities } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Opportunities — Set Life Entertainment",
  description: "Casting, crew, jobs, grants, labs, fellowships, and festival calls for independent film.",
};

/** §32 / §8 — full opportunities archive. Server-side expiry filter (§32 VERIFY). */
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

      <section className="section" style={{ borderBottom: "none" }}>
        <div className="wrap">
          <OpportunitiesList opportunities={opportunities} />
        </div>
      </section>
    </>
  );
}
