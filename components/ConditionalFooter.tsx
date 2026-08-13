"use client";

import { usePathname } from "next/navigation";
import SiteFooter from "./SiteFooter";

/** §45 — the admin back office is its own self-contained interface, not the public magazine chrome. */
export default function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <SiteFooter />;
}
