import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import TopNav from "@/components/TopNav";

export const metadata: Metadata = {
  title: "About — Set Life Entertainment",
  description:
    "Set Life Entertainment shines a spotlight on the indie film industry, celebrating rising talent and untold stories across cinema.",
};

export default function AboutPage() {
  return (
    <>
      <TopNav active="/about" />

      <section className="page-header">
        <div className="wrap">
          <p className="eyebrow">Our Story</p>
          <h1 className="display">ABOUT SET LIFE</h1>
          <p>
            Set Life Entertainment shines a spotlight on the indie film industry — celebrating rising talent, untold
            stories, across cinema.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap two-col">
          <div>
            <p className="eyebrow">Our Mission</p>
            <h3 className="headline">Indie film deserves a magazine of its own.</h3>
            <p>
              The independent film world moves fast — new talent, new projects, new voices — but it rarely gets the
              editorial spotlight the mainstream industry enjoys. Set Life Entertainment was built to close that gap.
            </p>
            <p>
              Every issue is a cover story: a real conversation with an actor, director, writer, or producer about
              the work, the grind, and the craft behind it. No gatekeeping, no fluff — just set life, told by the
              people living it.
            </p>
          </div>
          <div className="panel panel-cover">
            <Image
              src="/assets/covers/tray-chaney.jpg"
              alt="Tray Chaney — Set Life Entertainment cover"
              fill
              sizes="(max-width: 767px) 90vw, 45vw"
              priority
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <h2 className="headline">What We Stand For</h2>
              <p>Three principles guide every issue we put out.</p>
            </div>
          </div>
          <div className="value-grid">
            <div className="value-card">
              <div className="num">01</div>
              <h4>Real Stories</h4>
              <p>We feature real conversations with working actors and filmmakers — not press-kit talking points.</p>
            </div>
            <div className="value-card">
              <div className="num">02</div>
              <h4>Open Doors</h4>
              <p>You don&apos;t need a publicist to get featured. If you&apos;re doing the work, we want to hear from you.</p>
            </div>
            <div className="value-card">
              <div className="num">03</div>
              <h4>Community First</h4>
              <p>Set Life is built on the people who show up for each other — cast, crew, and creatives alike.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <h2 className="headline">How We Got Here</h2>
              <p>From issue one to now — the short version.</p>
            </div>
          </div>
          <div className="timeline">
            <div className="tl-item">
              <span className="eyebrow">Year One</span>
              <h4>The First Cover</h4>
              <p>
                Set Life Entertainment publishes its first digital cover story, spotlighting a local indie actor
                breaking into the scene.
              </p>
            </div>
            <div className="tl-item">
              <span className="eyebrow">Growing Community</span>
              <h4>Past 1,000 Followers</h4>
              <p>Word spreads across the indie film community. Actors and filmmakers start reaching out directly to be featured.</p>
            </div>
            <div className="tl-item">
              <span className="eyebrow">Today</span>
              <h4>45+ Issues Strong</h4>
              <p>
                Set Life becomes a go-to platform for rising indie talent — director&apos;s editions, choice
                editions, and community spotlights every month.
              </p>
            </div>
            <div className="tl-item">
              <span className="eyebrow">What&apos;s Next</span>
              <h4>Building the Next Chapter</h4>
              <p>More features, more formats, and more ways for the indie film community to be seen. This site is where it starts.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap">
          <h2 className="headline">This is set life. Come be part of it.</h2>
          <p>Whether you&apos;re behind the camera or in front of it — we want to tell your story.</p>
          <Link href="/submit" className="btn">
            Submit Your Story
          </Link>
        </div>
      </section>
    </>
  );
}
