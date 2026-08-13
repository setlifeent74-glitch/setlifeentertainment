import type { Metadata } from "next";
import TopNav from "@/components/TopNav";

export const metadata: Metadata = {
  title: "Review Policy — Set Life Entertainment",
  description: "How Set Life Entertainment scores and evaluates film and TV reviews in The Cut.",
};

export default function ReviewPolicyPage() {
  return (
    <>
      <TopNav active="/review-policy" />

      <section className="page-header">
        <div className="wrap">
          <p className="eyebrow">Legal</p>
          <h1 className="display">REVIEW POLICY</h1>
        </div>
      </section>

      <section className="section">
        <div className="wrap legal-body">
          <p className="legal-notice">
            <strong>Draft, not yet reviewed by the owner.</strong> This describes the scoring mechanic already built
            (§29 The Cut), not a final editorial standards document.
          </p>

          <h2>Scoring</h2>
          <p>
            Reviews carry a proprietary numeric score set by the reviewer — not an aggregated or algorithmic score,
            and not affiliated with any third-party review aggregator.
          </p>

          <h2>Independence</h2>
          <p>
            Screeners, review access, or press materials provided by a studio or production do not obligate a
            favorable review. Where a reviewer has a personal connection to a project&apos;s cast or crew, that
            should be disclosed in the piece.
          </p>

          <h2>Corrections</h2>
          <p>
            Factual errors in a published review can be reported via the <a href="/contact">contact page</a> and
            will be corrected on the live article.
          </p>
        </div>
      </section>
    </>
  );
}
