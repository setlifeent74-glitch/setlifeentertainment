import type { Metadata } from "next";
import TopNav from "@/components/TopNav";
import ContactForm from "@/components/ContactForm";

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
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
