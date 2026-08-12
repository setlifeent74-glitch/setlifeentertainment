import { notFound } from "next/navigation";
import type { Metadata } from "next";
import TopNav from "@/components/TopNav";
import { getIssueByNumber } from "@/lib/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ number: string }>;
}): Promise<Metadata> {
  const issueNumber = Number(await (await params).number);
  if (!Number.isInteger(issueNumber)) return {};
  const issue = await getIssueByNumber(issueNumber);
  if (!issue) return {};
  return { title: `Issue ${issue.issue_number}: ${issue.title} — Set Life Entertainment` };
}

export default async function IssuePage({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  const issueNumber = Number(number);
  if (!Number.isInteger(issueNumber)) notFound();

  const issue = await getIssueByNumber(issueNumber);
  if (!issue) notFound();

  return (
    <>
      <TopNav active="/issues" />

      <section className="page-header">
        <div className="wrap">
          <p className="eyebrow">Issue {issue.issue_number}</p>
          <h1 className="display">{issue.title}</h1>
          {issue.summary && <p>{issue.summary}</p>}
        </div>
      </section>

      {issue.cover_image_url && (
        <section className="section">
          <div className="wrap two-col">
            <div className="panel panel-cover">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={issue.cover_image_url} alt={issue.title} />
            </div>
            <div>
              {issue.release_date && (
                <p className="eyebrow">
                  {new Date(issue.release_date).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              )}
              {issue.summary && <p>{issue.summary}</p>}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
