"use client";

import { useEffect, useRef } from "react";

/**
 * §23 "numeral parallaxes at 60-70% scroll rate... disabled under reduced
 * motion." Reads its own position each scroll frame (rAF-throttled) and
 * writes a CSS var the numeral's transform consumes — never attaches the
 * listener at all when the visitor has reduced motion set.
 */
export default function ParallaxNumeral({
  children,
  className,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = ref.current;
        if (!el) return;
        const rect = el.parentElement!.getBoundingClientRect();
        const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        const offset = (progress - 0.5) * 0.35 * rect.height; // ~65% scroll rate
        el.style.setProperty("--parallax-y", `${offset}px`);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className={className} {...rest}>
      {children}
    </div>
  );
}
