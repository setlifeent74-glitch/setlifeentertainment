import type { Metadata } from "next";
import Link from "next/link";
import TopNav from "@/components/TopNav";
import IssuesGrid from "@/components/IssuesGrid";
import { getAllIssues } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Issues — Set Life Entertainment",
  description: "Browse every Set Life Entertainment cover story — indie actors, directors, and filmmakers on the rise.",
};

export default async function IssuesPage() {
  const issues = await getAllIssues();

  return (
    <>
      <TopNav active="/issues" />

      <section className="page-header">
        <div className="wrap">
          <p className="eyebrow">The Archive</p>
          <h1 className="display">ALL ISSUES</h1>
          <p>
            45+ issues and counting — every cover story, every rising talent, every untold story we&apos;ve had the
            honor to tell.
          </p>
        </div>
      </section>

      <section className="section" style={{ borderBottom: "none" }}>
        <div className="wrap">
          <IssuesGrid issues={issues} />
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap">
          <h2 className="headline">Want your work featured in the next issue?</h2>
          <p>We review submissions every month. Tell us about your project, your role, and your story.</p>
          <Link href="/submit" className="btn">
            Submit a Story
          </Link>
        </div>
      </section>
    </>
  );
}
