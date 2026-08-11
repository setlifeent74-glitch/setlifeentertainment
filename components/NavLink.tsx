"use client";

import Link from "next/link";
import { useRef, type MouseEvent, type ReactNode } from "react";

/**
 * Replicates script.js's nav-pulse click animation exactly: remove the
 * class, force a synchronous reflow, re-add it. Using React state instead
 * would collapse a rapid remove+add into a single batched update on
 * double-click and silently drop the restart — this must stay imperative.
 */
export default function NavLink({
  href,
  active,
  className,
  children,
}: {
  href: string;
  active?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const handleClick = (_e: MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    el.classList.remove("nav-pulse");
    void el.offsetWidth;
    el.classList.add("nav-pulse");
  };

  const classes = [active ? "active" : "", className ?? ""].filter(Boolean).join(" ");

  return (
    <Link ref={ref} href={href} className={classes || undefined} onClick={handleClick}>
      {children}
    </Link>
  );
}
