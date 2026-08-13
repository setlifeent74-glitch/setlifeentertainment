"use client";

import { usePathname } from "next/navigation";
import Marquee from "./Marquee";

/**
 * §16/§17: "No separate bar above the video" / "Everything on top of the
 * embedded hero video should be pushed down to under the video" — the
 * marquee is a separate bar and must not sit above the hero on the
 * homepage. It's unaffected on every interior page.
 *
 * Also hidden under /admin — §45: the admin back office is its own
 * self-contained interface, not the public magazine chrome.
 */
export default function ConditionalMarquee() {
  const pathname = usePathname();
  if (pathname === "/" || pathname.startsWith("/admin")) return null;
  return <Marquee />;
}
