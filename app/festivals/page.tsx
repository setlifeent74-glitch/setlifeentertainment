import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import TopNav from "@/components/TopNav";
import { getUpcomingFestivals } from "@/lib/queries";
import type { PostWithAuthor } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Festival Circuit — Set Life Entertainment",
  description: "Where independent film meets the world. Upcoming festivals, submission deadlines, and coverage.",
};

function formatDateRange(start?: string, end?: string): string {
  if (!start) return "";
  const s = new Date(start);
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  if (!end) return s.toLocaleDateString("en-US", { ...opts, year: "numeric" });
  const e = new Date(end);
  if (s.getFullYear() === e.getFullYear()) {
    return `${s.toLocaleDateString("en-US", opts)} – ${e.toLocaleDateString("en-US", { ...opts, year: "numeric" })}`;
  }
  return `${s.toLocaleDateString("en-US", { ...opts, year: "numeric" })} – ${e.toLocaleDateString("en-US", { ...opts, year: "numeric" })}`;
}

function FestivalFeatured({ festival }: { festival: PostWithAuthor }) {
  const meta = festival.meta as {
    city?: string;
    startDate?: string;
    endDate?: string;
    submissionDeadline?: string;
  } | null;

  return (
    <div className="festival-featured">
      {festival.hero_image_url && (
        <div className="festival-featured-image">
          <Image
            src={festival.hero_image_url}
            alt={festival.title}
            fill
            sizes="(max-width: 767px) 100vw, 60vw"
            className="festival-featured-img"
          />
        </div>
      )}
      <div className="festival-featured-body">
        {meta?.city && <p className="eyebrow">{meta.city}</p>}
        <h2 className="festival-featured-name">{festival.title}</h2>
        {(meta?.startDate || meta?.endDate) && (
          <p className="festival-featured-dates">{formatDateRange(meta.startDate, meta.endDate)}</p>
        )}
        {meta?.submissionDeadline && (
          <p className="festival-featured-deadline">
            <span className="eyebrow">Submission Deadline</span>{" "}
            <span className="accent-gold">
              {new Date(meta.submissionDeadline).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </p>
        )}
        <Link href={`/story/${festival.slug}`} className="btn btn-primary" style={{ marginTop: "var(--space-16)" }}>
          Read Coverage
        </Link>
      </div>
    </div>
  );
}

/** §33 / §8 — full festival archive. Featured large block + chronological timeline. */
export default async function FestivalsPage() {
  const festivals = await getUpcomingFestivals();
  const [featured, ...rest] = festivals;

  return (
    <>
      <TopNav active="/festivals" />

      <section className="page-header">
        <div className="wrap">
          <p className="eyebrow">Festival Circuit</p>
          <h1 className="display">WHERE INDEPENDENT FILM MEETS THE WORLD</h1>
        </div>
      </section>

      {festivals.length === 0 ? (
        <section className="section">
          <div className="wrap">
            <p>No upcoming festivals listed right now — check back soon.</p>
          </div>
        </section>
      ) : (
        <>
          {featured && (
            <section className="section">
              <div className="wrap">
                <FestivalFeatured festival={featured} />
              </div>
            </section>
          )}

          {rest.length > 0 && (
            <section className="section">
              <div className="wrap">
                <h2 className="headline" style={{ marginBottom: "var(--space-32)" }}>
                  UPCOMING FESTIVALS
                </h2>
                <div className="festival-timeline">
                  {rest.map((festival) => {
                    const meta = festival.meta as {
                      city?: string;
                      startDate?: string;
                      endDate?: string;
                      submissionDeadline?: string;
                    } | null;
                    return (
                      <Link key={festival.id} href={`/story/${festival.slug}`} className="festival-timeline-item">
                        <div className="festival-timeline-date">
                          {meta?.startDate
                            ? new Date(meta.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                            : "—"}
                        </div>
                        <div className="festival-timeline-body">
                          <h3 className="festival-timeline-name">{festival.title}</h3>
                          <div className="festival-timeline-meta">
                            {meta?.city && <span>{meta.city}</span>}
                            {meta?.startDate && meta?.endDate && (
                              <span>{formatDateRange(meta.startDate, meta.endDate)}</span>
                            )}
                            {meta?.submissionDeadline && (
                              <span className="accent-gold">
                                Deadline:{" "}
                                {new Date(meta.submissionDeadline).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="festival-timeline-arrow" aria-hidden="true">→</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
}
