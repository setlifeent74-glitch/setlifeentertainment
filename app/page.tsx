import { headers } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import HeroVideo from "@/components/HeroVideo";
import { COVERS } from "@/lib/covers";

const LATEST_SLUGS = ["elijah-lamar", "ebony-tates", "kaamel-diezel-hasaun", "asia-clark"];

export default async function HomePage() {
  const headerList = await headers();
  const saveDataHeader = headerList.get("save-data") === "on";
  const latest = LATEST_SLUGS.map((slug) => COVERS.find((c) => c.slug === slug)!);

  return (
    <>
      <HeroVideo saveDataHeader={saveDataHeader} />

      <section className="hero-intro">
        <div className="wrap">
          <p className="eyebrow">The Voice. The Culture. The Future.</p>
          <h1 className="display">
            SET LIFE
            <br />
            <span className="accent-red">ENTERTAINMENT</span>
          </h1>
          <p className="hero-sub">
            Of indie actors &amp; filmmakers. We shine a spotlight on the indie film industry — celebrating rising
            talent, untold stories, and the creatives building the future of cinema from the ground up.
          </p>
          <div className="hero-actions">
            <Link href="/issues" className="btn btn-primary">
              Read the Latest Issue
            </Link>
            <Link href="/submit" className="btn">
              Submit Your Story
            </Link>
          </div>
        </div>
      </section>

      <section
        className="stat-strip wrap"
        style={{ borderLeft: "1px solid var(--line)", borderRight: "1px solid var(--line)" }}
      >
        <div className="stat">
          <div className="num">45+</div>
          <div className="label">Issues Published</div>
        </div>
        <div className="stat">
          <div className="num">20+</div>
          <div className="label">Cover Stories</div>
        </div>
        <div className="stat">
          <div className="num">1.1K+</div>
          <div className="label">Community Members</div>
        </div>
        <div className="stat">
          <div className="num">100%</div>
          <div className="label">Indie Film Focused</div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <h2 className="headline">Latest Cover Stories</h2>
              <p>Fresh off the press — the actors, directors, and storytellers making moves this season.</p>
            </div>
            <Link href="/issues" className="btn">
              View All Issues
            </Link>
          </div>
          <div className="cover-grid">
            {latest.map((cover) => (
              <Link key={cover.slug} className="cover-card has-img" href="/issues">
                <span className="issue-no">{cover.issueLabel}</span>
                <Image src={cover.image} alt={cover.alt} fill sizes="(max-width: 767px) 50vw, 25vw" />
                <div className="card-body">
                  <span className="card-name">
                    {cover.namePrefix}
                    <em>{cover.nameEm}</em>
                  </span>
                  <span className="card-role">{cover.role}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap two-col">
          <div className="panel panel-cover">
            <Image
              src="/assets/covers/mann-robinson.jpg"
              alt="Mann Robinson — Set Life Entertainment cover"
              fill
              sizes="(max-width: 767px) 90vw, 45vw"
            />
          </div>
          <div>
            <p className="eyebrow">Why Set Life</p>
            <h3 className="headline">A magazine built by set life, for set life.</h3>
            <p>
              Indie film doesn&apos;t always get the spotlight it deserves. Set Life Entertainment exists to change
              that — profiling the actors, directors, writers, and crews building their craft one production at a
              time.
            </p>
            <p>
              Every issue pairs editorial cover stories with real conversations about the grind: booking the role,
              financing the short, building a reel that gets noticed.
            </p>
            <Link href="/about" className="btn btn-gold">
              More About Us
            </Link>
          </div>
        </div>
      </section>

      <section className="quote-block wrap">
        <blockquote>&quot;Independent film isn&apos;t just a career — it&apos;s an ecosystem.&quot;</blockquote>
        <cite>— Mann Robinson, Founder, Set Life Entertainment</cite>
      </section>

      <section className="cta-band">
        <div className="wrap">
          <h2 className="headline">Know someone who deserves the cover?</h2>
          <p>We&apos;re always looking for the next rising talent, untold story, or breakout indie project to feature.</p>
          <Link href="/submit" className="btn">
            Submit a Story
          </Link>
        </div>
      </section>
    </>
  );
}
