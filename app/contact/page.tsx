import type { Metadata } from "next";
import TopNav from "@/components/TopNav";
import DemoForm from "@/components/DemoForm";

export const metadata: Metadata = {
  title: "Contact — Set Life Entertainment",
  description: "Get in touch with Set Life Entertainment for features, partnerships, and press inquiries.",
};

export default function ContactPage() {
  return (
    <>
      <TopNav active="/contact" />

      <section className="page-header">
        <div className="wrap">
          <p className="eyebrow">Let&apos;s Talk</p>
          <h1 className="display">CONTACT US</h1>
          <p>Press, partnerships, advertising, or just want to say what&apos;s up — reach out below.</p>
        </div>
      </section>

      <section className="section" style={{ borderBottom: "none" }}>
        <div className="wrap contact-grid">
          <div className="contact-info">
            <div className="info-item">
              <span className="eyebrow">General Inquiries</span>
              <a href="mailto:hello@setlifeentertainment.com">hello@setlifeentertainment.com</a>
            </div>
            <div className="info-item">
              <span className="eyebrow">Press &amp; Partnerships</span>
              <a href="mailto:press@setlifeentertainment.com">press@setlifeentertainment.com</a>
            </div>
            <div className="info-item">
              <span className="eyebrow">Instagram</span>
              <a href="https://www.instagram.com/setlifeentertainment/" target="_blank" rel="noopener">
                @setlifeentertainment
              </a>
            </div>
            <div className="info-item">
              <span className="eyebrow">Response Time</span>
              <span>We typically reply within 3–5 business days.</span>
            </div>
          </div>
          <div className="form-wrap">
            <DemoForm submitLabel="Send Message">
              <div className="field-row">
                <div className="field">
                  <label htmlFor="cname">Name</label>
                  <input type="text" id="cname" name="cname" required />
                </div>
                <div className="field">
                  <label htmlFor="cemail">Email</label>
                  <input type="email" id="cemail" name="cemail" required />
                </div>
              </div>
              <div className="field">
                <label htmlFor="subject">Subject</label>
                <select id="subject" name="subject" defaultValue="General Inquiry">
                  <option>General Inquiry</option>
                  <option>Press / Media</option>
                  <option>Advertising</option>
                  <option>Feature Follow-up</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" required></textarea>
              </div>
            </DemoForm>
          </div>
        </div>
      </section>
    </>
  );
}
