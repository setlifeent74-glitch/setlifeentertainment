import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import ParallaxNumeral from "./ParallaxNumeral";
import { getCurrentIssue } from "@/lib/queries";

function seasonFromDate(dateStr: string | null): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const month = date.getUTCMonth();
  const season = month <= 1 || month === 11 ? "Winter" : month <= 4 ? "Spring" : month <= 7 ? "Summer" : "Fall";
  return `${season} ${date.getUTCFullYear()}`;
}

/** §23 Current Magazine Issue — Gate: 1 current issue. */
export default async function CurrentIssueSection() {
  const issue = await getCurrentIssue();
  if (!issue) return null;

  return (
    <ScrollReveal as="section" className="current-issue-section">
      <ParallaxNumeral className="current-issue-numeral" aria-hidden="true">
        {issue.issue_number}
      </ParallaxNumeral>

      <div className="wrap current-issue-grid">
        <div className="current-issue-cover">
          {issue.cover_image_url && (
            <Image src={issue.cover_image_url} alt={`Issue ${issue.issue_number} cover — ${issue.title}`} fill sizes="(max-width: 767px) 80vw, 480px" />
          )}
        </div>
        <div className="current-issue-details">
          <p className="eyebrow">Current Issue</p>
          <p className="current-issue-meta">
            Issue {issue.issue_number} · {seasonFromDate(issue.release_date)}
          </p>
          <h2 className="current-issue-title display">{issue.title}</h2>
          {issue.summary && <p className="current-issue-summary">{issue.summary}</p>}
          <div className="current-issue-cta">
            <Link href={`/issues/${issue.issue_number}`} className="btn btn-primary">
              Explore Issue
            </Link>
            <Link href="/issues" className="btn btn-gold">
              View Archive
            </Link>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}
