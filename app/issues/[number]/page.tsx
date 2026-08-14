import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import TopNav from "@/components/TopNav";
import JsonLd from "@/components/JsonLd";
import { getIssueByNumber } from "@/lib/queries";
import { creativeWorkJsonLd, breadcrumbJsonLd } from "@/lib/structured-data";
import { getSiteUrl } from "@/lib/site-url";
import { imageFitStyle } from "@/lib/image-fit";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ number: string }>;
}): Promise<Metadata> {
  const issueNumber = Number(await (await params).number);
  if (!Number.isInteger(issueNumber)) return {};
  const issue = await getIssueByNumber(issueNumber);
  if (!issue) return {};
  const title = `Issue ${issue.issue_number}: ${issue.title} — Set Life Entertainment`;
  const url = `${getSiteUrl()}/issues/${issue.issue_number}`;
  return {
    title,
    description: issue.summary ?? undefined,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: issue.summary ?? undefined,
      url,
      type: "article",
      images: issue.cover_image_url ? [{ url: issue.cover_image_url }] : undefined,
    },
  };
}

export default async function IssuePage({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  const issueNumber = Number(number);
  if (!Number.isInteger(issueNumber)) notFound();

  const issue = await getIssueByNumber(issueNumber);
  if (!issue) notFound();

  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/issues/${issue.issue_number}`;

  return (
    <>
      <TopNav active="/issues" />
      <JsonLd data={creativeWorkJsonLd(issue, url)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: siteUrl },
          { name: "Magazine", url: `${siteUrl}/issues` },
          { name: issue.title, url },
        ])}
      />

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
              <Image
                src={issue.cover_image_url}
                alt={issue.title}
                fill
                sizes="(max-width: 767px) 90vw, 45vw"
                style={imageFitStyle(issue.cover_fit, issue.cover_position)}
              />
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
