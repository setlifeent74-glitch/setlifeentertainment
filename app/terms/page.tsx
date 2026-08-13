import type { Metadata } from "next";
import TopNav from "@/components/TopNav";

export const metadata: Metadata = {
  title: "Terms of Use — Set Life Entertainment",
  description: "The terms governing use of the Set Life Entertainment website and shop.",
};

export default function TermsPage() {
  return (
    <>
      <TopNav active="/terms" />

      <section className="page-header">
        <div className="wrap">
          <p className="eyebrow">Legal</p>
          <h1 className="display">TERMS OF USE</h1>
        </div>
      </section>

      <section className="section">
        <div className="wrap legal-body">
          <p className="legal-notice">
            <strong>Draft, not yet reviewed by counsel.</strong> This page needs a legal review before Phase 12 (Shop
            checkout) goes live.
          </p>

          <h2>Using this site</h2>
          <p>
            Set Life Entertainment&apos;s editorial content is for personal, non-commercial reading. Reproducing or
            redistributing articles, photography, or cover art without permission is not allowed — reach out via the{" "}
            <a href="/contact">contact page</a> for licensing questions.
          </p>

          <h2>Story submissions</h2>
          <p>
            Submitting a story does not guarantee publication. By submitting, you confirm the information provided
            is accurate and that you have the right to share it.
          </p>

          <h2>Shop purchases</h2>
          <p>
            Digital, physical, and ticketed products are sold through Stripe Checkout. Refund terms will be detailed
            at checkout once the shop is live; nothing is being sold through this site yet.
          </p>

          <h2>Changes</h2>
          <p>These terms may be updated as the site and shop develop. Material changes will be reflected here.</p>
        </div>
      </section>
    </>
  );
}
