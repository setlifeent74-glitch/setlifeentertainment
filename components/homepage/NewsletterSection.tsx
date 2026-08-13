import ScrollReveal from "@/components/ScrollReveal";
import NewsletterForm from "./NewsletterForm";
import { getSectionColors } from "@/lib/queries";

/** §37 The Call Sheet — Newsletter. Always renders — no content gate (§9's table doesn't list one for this section). */
export default async function NewsletterSection() {
  const colors = await getSectionColors();
  return (
    <ScrollReveal
      as="section"
      className="newsletter-section cta-band"
      style={colors.newsletter ? { backgroundColor: colors.newsletter } : undefined}
    >
      <div className="wrap">
        <h2 className="headline mask-reveal">
          <span>KNOW WHAT&apos;S HAPPENING BEFORE THE SET GOES LIVE</span>
        </h2>
        <NewsletterForm />
      </div>
    </ScrollReveal>
  );
}
