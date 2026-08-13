"use client";

import { useCallback, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";

/**
 * Generic once-only scroll-in reveal wrapper, shared by every homepage
 * section (§22-§38). Fires via IntersectionObserver on first intersection
 * and disconnects — never re-fires on scroll oscillation. Each section's
 * own CSS keys its choreography off the resulting `.is-in-view` class.
 */
export default function ScrollReveal({
  children,
  className,
  as: Tag = "div",
  threshold = 0.15,
  style,
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  threshold?: number;
  style?: CSSProperties;
}) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [inView, setInView] = useState(false);

  const setRef = useCallback(
    (el: Element | null) => {
      observerRef.current?.disconnect();
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            // For anything already on-screen at mount (common — most
            // sections aren't fully below the fold on a tall monitor),
            // IntersectionObserver's first callback can fire before the
            // browser has painted the hidden starting state even once.
            // Flipping the class in that same tick means there's no "from"
            // frame for the CSS transition to animate from, so it just
            // pops straight to visible with zero motion. Two nested rAFs
            // guarantee a real paint of the hidden state happens first.
            requestAnimationFrame(() => requestAnimationFrame(() => setInView(true)));
            observer.disconnect();
          }
        },
        { threshold }
      );
      observer.observe(el);
      observerRef.current = observer;
    },
    [threshold]
  );

  return (
    <Tag ref={setRef} className={`${className ?? ""}${inView ? " is-in-view" : ""}`} style={style}>
      {children}
    </Tag>
  );
}
