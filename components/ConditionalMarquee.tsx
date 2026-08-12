"use client";

import { usePathname } from "next/navigation";
import Marquee from "./Marquee";

/**
 * §16/§17: "No separate bar above the video" / "Everything on top of the
 * embedded hero video should be pushed down to under the video" — the
 * marquee is a separate bar and must not sit above the hero on the
 * homepage. It's unaffected on every interior page.
 */
export default function ConditionalMarquee() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <Marquee />;
}
