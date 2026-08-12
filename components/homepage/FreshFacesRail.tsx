"use client";

import { useRef, type KeyboardEvent, type ReactNode } from "react";

/**
 * §27 VERIFY — "Rail scrolls by keyboard arrows without trapping page
 * scroll." Only ArrowLeft/ArrowRight are intercepted; every other key
 * (including anything that would scroll the page vertically) passes
 * through untouched.
 */
export default function FreshFacesRail({ children }: { children: ReactNode }) {
  const railRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const rail = railRef.current;
    if (!rail) return;
    const cardWidth = rail.querySelector<HTMLElement>(".fresh-face-card")?.offsetWidth ?? 300;
    // Not `behavior: "smooth"` — CSS scroll-snap-type on this element
    // fights the CSSOM smooth-scroll API and silently no-ops it (confirmed
    // directly; instant scrollBy is unaffected and still lands on a snap
    // point immediately). Native touch/mouse-drag scrolling is untouched
    // by this and keeps its normal snap behavior.
    rail.scrollBy({ left: e.key === "ArrowRight" ? cardWidth + 20 : -(cardWidth + 20), behavior: "instant" });
  };

  return (
    <div
      ref={railRef}
      className="fresh-faces-rail"
      role="region"
      aria-label="Fresh Faces — scrollable"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
}
