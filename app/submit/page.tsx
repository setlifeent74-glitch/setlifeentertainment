import type { Metadata } from "next";
import TopNav from "@/components/TopNav";
import DemoForm from "@/components/DemoForm";

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
            <DemoForm submitLabel="Submit for Review">
              <div className="field-row">
                <div className="field">
                  <label htmlFor="fname">Full Name</label>
                  <input type="text" id="fname" name="fname" required />
                </div>
                <div className="field">
                  <label htmlFor="role">Primary Role</label>
                  <select id="role" name="role" required defaultValue="">
                    <option value="">Select one</option>
                    <option>Actor</option>
                    <option>Director</option>
                    <option>Producer</option>
                    <option>Writer</option>
                    <option>Cinematographer</option>
                    <option>Other Crew</option>
                  </select>
                </div>
              </div>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" required />
                </div>
                <div className="field">
                  <label htmlFor="ig">Instagram Handle</label>
                  <input type="text" id="ig" name="ig" placeholder="@yourhandle" />
                </div>
              </div>
              <div className="field">
                <label htmlFor="project">Project Title</label>
                <input type="text" id="project" name="project" placeholder="Film, series, or project name" />
              </div>
              <div className="field">
                <label htmlFor="story">Tell Us Your Story</label>
                <textarea
                  id="story"
                  name="story"
                  placeholder="What's the project about? Why does it matter to you? What should readers know?"
                  required
                ></textarea>
              </div>
              <div className="field">
                <label htmlFor="link">Reel / Portfolio Link</label>
                <input type="url" id="link" name="link" placeholder="https://" />
              </div>
            </DemoForm>
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
