import type { Metadata } from "next";
import TopNav from "@/components/TopNav";
import SubmitForm from "@/components/SubmitForm";

export const metadata: Metadata = {
  title: "Submit Your Story — Set Life Entertainment",
  description: "Submit your indie film story to be featured in an upcoming Set Life Entertainment issue.",
};

export default function SubmitPage() {
  return (
    <>
      <TopNav active="/submit" />

      <section className="page-header">
        <div className="wrap">
          <p className="eyebrow">Get Featured</p>
          <h1 className="display">SUBMIT YOUR STORY</h1>
          <p>Tell us about you, your project, and why it belongs in the next issue. We review submissions every month.</p>
        </div>
      </section>

      <section className="section" style={{ borderBottom: "none" }}>
        <div className="wrap two-col" style={{ alignItems: "flex-start" }}>
          <div className="form-wrap">
            <SubmitForm />
          </div>
          <div>
            <p className="eyebrow">What Happens Next</p>
            <h3 className="headline" style={{ fontSize: "32px" }}>
              The process is simple.
            </h3>
            <div className="timeline" style={{ marginTop: "28px" }}>
              <div className="tl-item">
                <span className="eyebrow">Step 1</span>
                <h4>You Submit</h4>
                <p>Fill out the form with your story, project, and links. No publicist required.</p>
              </div>
              <div className="tl-item">
                <span className="eyebrow">Step 2</span>
                <h4>We Review</h4>
                <p>Our team reads every submission and reaches out within 2–3 weeks if it&apos;s a fit.</p>
              </div>
              <div className="tl-item">
                <span className="eyebrow">Step 3</span>
                <h4>You Get Featured</h4>
                <p>Selected stories are scheduled for an upcoming issue — cover story or spotlight feature.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
