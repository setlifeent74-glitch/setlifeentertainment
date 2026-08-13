import { headers } from "next/headers";
import HeroVideo from "@/components/HeroVideo";
import HeroIntro from "@/components/HeroIntro";
import TodaySection from "@/components/homepage/TodaySection";
import CurrentIssueSection from "@/components/homepage/CurrentIssueSection";
import SpotlightSection from "@/components/homepage/SpotlightSection";
import CallSheetSection from "@/components/homepage/CallSheetSection";
import BelowTheLineSection from "@/components/homepage/BelowTheLineSection";
import FreshFacesSection from "@/components/homepage/FreshFacesSection";
import ProductionSection from "@/components/homepage/ProductionSection";
import CutSection from "@/components/homepage/CutSection";
import ScreeningRoomSection from "@/components/homepage/ScreeningRoomSection";
import BehindTheLensSection from "@/components/homepage/BehindTheLensSection";
import OpportunitiesSection from "@/components/homepage/OpportunitiesSection";
import FestivalSection from "@/components/homepage/FestivalSection";
import SetLife100Section from "@/components/homepage/SetLife100Section";
import ShopSection from "@/components/homepage/ShopSection";
import InstagramSection from "@/components/homepage/InstagramSection";
import NewsletterSection from "@/components/homepage/NewsletterSection";

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
          its own minimum-content threshold (lib/gates.ts). */}
      <TodaySection />
      <CurrentIssueSection />
      <SpotlightSection />
      <CallSheetSection />
      <BelowTheLineSection />
      <FreshFacesSection />
      <ProductionSection />
      <CutSection />
      <ScreeningRoomSection />
      <BehindTheLensSection />
      <OpportunitiesSection />
      <FestivalSection />
      <SetLife100Section />
      <ShopSection />
      <InstagramSection />
      <NewsletterSection />
    </>
  );
}
