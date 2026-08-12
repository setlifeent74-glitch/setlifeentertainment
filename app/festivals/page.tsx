import type { Metadata } from "next";
import Link from "next/link";
import TopNav from "@/components/TopNav";
import { getUpcomingFestivals } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Festival Circuit — Set Life Entertainment",
  description: "Where independent film meets the world.",
};

export default async function FestivalsPage() {
  const festivals = await getUpcomingFestivals();

  return (
    <>
      <TopNav active="/festivals" />

      <section className="page-header">
        <div className="wrap">
          <p className="eyebrow">Festival Circuit</p>
          <h1 className="display">WHERE INDEPENDENT FILM MEETS THE WORLD</h1>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          {festivals.length === 0 ? (
            <p>No upcoming festivals listed right now.</p>
          ) : (
            <div className="cover-grid">
              {festivals.map((post) => {
                const meta = post.meta as { city?: string; startDate?: string } | null;
                return (
                  <Link key={post.id} href={`/story/${post.slug}`} className="cover-card">
                    <div className="card-body">
                      <span className="card-name">{post.title}</span>
                      <span className="card-role">
                        {[meta?.city, meta?.startDate ? new Date(meta.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : null]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
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
