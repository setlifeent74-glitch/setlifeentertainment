import type { Metadata } from "next";
import TopNav from "@/components/TopNav";

export const metadata: Metadata = {
  title: "Privacy Policy — Set Life Entertainment",
  description: "How Set Life Entertainment collects, uses, and protects visitor and customer data.",
};

export default function PrivacyPage() {
  return (
    <>
      <TopNav active="/privacy" />

      <section className="page-header">
        <div className="wrap">
          <p className="eyebrow">Legal</p>
          <h1 className="display">PRIVACY POLICY</h1>
        </div>
      </section>

      <section className="section">
        <div className="wrap legal-body">
          <p className="legal-notice">
            <strong>Draft, not yet reviewed by counsel.</strong> This page describes current site behavior honestly
            and is safe to publish as a starting point, but it has not had a legal review. It needs one before Phase
            12 (Shop checkout) goes live and real payment/customer data starts flowing through the site.
          </p>

          <h2>What we collect</h2>
          <p>
            Story submissions (§ Submit a Story) collect the name, email, and story details you provide. Newsletter
            signup collects an email address and the preference categories you select. Shop orders, once checkout
            launches, will collect a customer email and payment details processed by Stripe — Set Life Entertainment
            does not store card numbers.
          </p>

          <h2>How we use it</h2>
          <p>
            Submission and contact data is used to follow up about your story or inquiry. Newsletter data is used
            only to send the content categories you opted into. We do not sell visitor or subscriber data to third
            parties.
          </p>

          <h2>Cookies and analytics</h2>
          <p>This site does not currently run third-party advertising or tracking cookies.</p>

          <h2>Your rights</h2>
          <p>
            To request a copy of your data or ask that it be deleted, use the{" "}
            <a href="/contact">contact page</a>.
          </p>
        </div>
      </section>
    </>
  );
}
