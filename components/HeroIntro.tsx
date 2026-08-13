"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Cta = { href: string; label: string };

/**
 * §17.1 Hero Intro — Editorial Block Below the Video.
 *
 * All editorial copy lives here, in normal flow beneath the hero, never
 * over the video (§17: "This is absolute"). Choreography fires on
 * scroll-in via IntersectionObserver, once — not on load, not repeatedly
 * on scroll oscillation.
 */
export default function HeroIntro({
  eyebrow,
  headlineLines,
  accentLineIndex,
  deck,
  primaryCta,
  secondaryCta,
}: {
  eyebrow: string;
  headlineLines: string[];
  accentLineIndex?: number;
  deck: string;
  primaryCta: Cta;
  secondaryCta: Cta;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // See ScrollReveal.tsx for why this is double-rAF'd: this block
          // is almost always already on-screen at mount (it's right below
          // the hero video), so without forcing a real paint of the hidden
          // state first, the line-mask reveal pops instantly with no motion.
          requestAnimationFrame(() => requestAnimationFrame(() => setInView(true)));
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={`hero-intro${inView ? " is-in-view" : ""}`} ref={sectionRef}>
      <div className="wrap">
        <p className="hero-intro-eyebrow eyebrow">
          <span>{eyebrow}</span>
        </p>
        <h1 className="hero-intro-headline display">
          {headlineLines.map((line, i) => (
            <span className="line-mask" key={line} style={{ transitionDelay: `${100 + i * 90}ms` }}>
              <span className={`line${i === accentLineIndex ? " accent-red" : ""}`}>{line}</span>
            </span>
          ))}
        </h1>
        <p className="hero-intro-deck">{deck}</p>
        <div className="hero-intro-cta">
          <Link href={primaryCta.href} className="btn btn-primary">
            {primaryCta.label}
          </Link>
          <Link href={secondaryCta.href} className="btn btn-gold">
            {secondaryCta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
