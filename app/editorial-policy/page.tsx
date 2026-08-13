import type { Metadata } from "next";
import TopNav from "@/components/TopNav";

export const metadata: Metadata = {
  title: "Editorial Policy — Set Life Entertainment",
  description: "How Set Life Entertainment reports, corrects, and discloses conflicts of interest.",
};

export default function EditorialPolicyPage() {
  return (
    <>
      <TopNav active="/editorial-policy" />

      <section className="page-header">
        <div className="wrap">
          <p className="eyebrow">Legal</p>
          <h1 className="display">EDITORIAL POLICY</h1>
        </div>
      </section>

      <section className="section">
        <div className="wrap legal-body">
          <p className="legal-notice">
            <strong>Draft, not yet reviewed by the owner.</strong> This reflects the flat-access editorial model
            already built into the CMS (§44/§45), not a final, owner-approved editorial charter.
          </p>

          <h2>How stories get published</h2>
          <p>
            Any contributor with access to the shared editorial login can write, edit, and publish directly — there
            is no separate approval or review queue built into the CMS today. Editorial judgment about what runs is
            exercised by the contributor publishing it.
          </p>

          <h2>Corrections</h2>
          <p>
            If you spot an error in a published story, contact us via the <a href="/contact">contact page</a>.
            Corrections are made directly to the live article; the CMS keeps a revision history of every edit.
          </p>

          <h2>Conflicts of interest</h2>
          <p>
            Set Life Entertainment covers the independent film community its own contributors are often part of.
            Where a contributor has a direct personal or financial stake in a story&apos;s subject, that should be
            disclosed within the piece.
          </p>
        </div>
      </section>
    </>
  );
}
