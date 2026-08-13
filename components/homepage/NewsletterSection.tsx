import ScrollReveal from "@/components/ScrollReveal";
import NewsletterForm from "./NewsletterForm";

/** §37 The Call Sheet — Newsletter. Always renders — no content gate (§9's table doesn't list one for this section). */
export default function NewsletterSection() {
  return (
    <ScrollReveal as="section" className="newsletter-section cta-band">
      <div className="wrap">
        <h2 className="headline">KNOW WHAT&apos;S HAPPENING BEFORE THE SET GOES LIVE</h2>
        <NewsletterForm />
      </div>
    </ScrollReveal>
  );
}
