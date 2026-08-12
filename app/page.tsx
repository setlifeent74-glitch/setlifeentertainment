import { headers } from "next/headers";
import HeroVideo from "@/components/HeroVideo";
import HeroIntro from "@/components/HeroIntro";
import TodaySection from "@/components/homepage/TodaySection";
import CurrentIssueSection from "@/components/homepage/CurrentIssueSection";
import SpotlightSection from "@/components/homepage/SpotlightSection";
import CallSheetSection from "@/components/homepage/CallSheetSection";
import BelowTheLineSection from "@/components/homepage/BelowTheLineSection";
import FreshFacesSection from "@/components/homepage/FreshFacesSection";

export default async function HomePage() {
  const headerList = await headers();
  const saveDataHeader = headerList.get("save-data") === "on";

  return (
    <>
      <HeroVideo saveDataHeader={saveDataHeader} />

      <HeroIntro
        eyebrow="The Voice. The Culture. The Future."
        headlineLines={["SET LIFE", "ENTERTAINMENT"]}
        accentLineIndex={1}
        deck="Of indie actors & filmmakers. We shine a spotlight on the indie film industry — celebrating rising talent, untold stories, and the creatives building the future of cinema from the ground up."
        primaryCta={{ href: "/issues", label: "Read the Latest Issue" }}
        secondaryCta={{ href: "/submit", label: "Submit Your Story" }}
      />

      {/* §9 content readiness gates — each section below renders only above
          its own minimum-content threshold (lib/gates.ts). §28-38
          (Phase 7-8) continue this sequence. */}
      <TodaySection />
      <CurrentIssueSection />
      <SpotlightSection />
      <CallSheetSection />
      <BelowTheLineSection />
      <FreshFacesSection />
    </>
  );
}
