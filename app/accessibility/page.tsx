import type { Metadata } from "next";
import TopNav from "@/components/TopNav";

export const metadata: Metadata = {
  title: "Accessibility — Set Life Entertainment",
  description: "The accessibility standard Set Life Entertainment builds to, and how to report an issue.",
};

export default function AccessibilityPage() {
  return (
    <>
      <TopNav active="/accessibility" />

      <section className="page-header">
        <div className="wrap">
          <p className="eyebrow">Legal</p>
          <h1 className="display">ACCESSIBILITY</h1>
        </div>
      </section>

      <section className="section">
        <div className="wrap legal-body">
          <p className="legal-notice">
            <strong>Draft, not yet reviewed by the owner.</strong> This describes the accessibility standard already
            enforced in this build&apos;s CI (§40), not a formal conformance statement.
          </p>

          <h2>Our standard</h2>
          <p>
            Every route in this build is checked against WCAG 2.1 AA on every change — keyboard navigation, visible
            focus states, semantic heading structure, ARIA labeling, color contrast, and full{" "}
            <code>prefers-reduced-motion</code> support are all part of the automated test suite, not a one-time
            audit.
          </p>

          <h2>Known limitations</h2>
          <p>
            This site is under active development. If you encounter a barrier — a control that doesn&apos;t work
            with a keyboard or screen reader, text that&apos;s hard to read, or motion that can&apos;t be reduced —
            please tell us.
          </p>

          <h2>Reporting an issue</h2>
          <p>
            Use the <a href="/contact">contact page</a> to report an accessibility problem. Include the page URL and
            what assistive technology you were using, if applicable.
          </p>
        </div>
      </section>
    </>
  );
}
