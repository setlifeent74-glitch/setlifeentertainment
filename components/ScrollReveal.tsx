"use client";

import { useCallback, useRef, useState, type ElementType, type ReactNode } from "react";

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
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  threshold?: number;
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
            setInView(true);
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
    <Tag ref={setRef} className={`${className ?? ""}${inView ? " is-in-view" : ""}`}>
      {children}
    </Tag>
  );
}
