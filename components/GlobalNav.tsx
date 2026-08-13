"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import NavLink from "./NavLink";
import { PRIMARY_NAV, UTILITY_NAV, isNavLeaf } from "./nav-data";

/**
 * §16 Global Navigation.
 *
 * `overlay` is true only on the homepage, where the nav is layered
 * transparently over the hero video and transitions to an opaque `--black`
 * ground on scroll. Every interior page renders it permanently in the
 * "scrolled" (opaque, 72px) state — there is no video behind it to be
 * transparent over.
 */
const SCROLL_TRANSITION_START = 85; // §16: "begins 70-100px"
const SCROLL_TRANSITION_END = 180; // §16: "complete by 160-200px"

export default function GlobalNav({ activePath, overlay = false }: { activePath: string; overlay?: boolean }) {
  const [scrolled, setScrolled] = useState(!overlay);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const megaTriggerRef = useRef<HTMLButtonElement>(null);
  const megaPanelRef = useRef<HTMLDivElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);

  // Scroll-linked, not time-based: the transition tracks scroll position
  // directly (§16 "begins 70-100px; complete by 160-200px") rather than
  // firing a fixed-duration CSS transition off a boolean threshold. Written
  // straight to the DOM via a CSS custom property to avoid a React
  // re-render on every scroll frame.
  useEffect(() => {
    if (!overlay) return;
    let raf = 0;
    const apply = () => {
      const y = window.scrollY;
      const progress = Math.min(
        1,
        Math.max(0, (y - SCROLL_TRANSITION_START) / (SCROLL_TRANSITION_END - SCROLL_TRANSITION_START))
      );
      headerRef.current?.style.setProperty("--nav-scroll", String(progress));
      setScrolled(y > SCROLL_TRANSITION_START);
    };
    apply(); // synchronous on mount — no rAF wait for the initial (hero) state
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        apply();
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [overlay]);

  // Mega menu: Escape closes and returns focus; click outside closes; Tab is trapped while open.
  useEffect(() => {
    if (!megaOpen) return;
    const panel = megaPanelRef.current;
    const focusable = panel?.querySelectorAll<HTMLElement>("a[href]");
    focusable?.[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMegaOpen(false);
        megaTriggerRef.current?.focus();
        return;
      }
      if (e.key === "Tab" && focusable && focusable.length > 0) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    const onClickOutside = (e: MouseEvent) => {
      if (panel && !panel.contains(e.target as Node) && e.target !== megaTriggerRef.current) {
        setMegaOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [megaOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        mobileToggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  const isIndustryActive = PRIMARY_NAV.some(
    (item) => !isNavLeaf(item) && item.mega.some((leaf) => leaf.href === activePath)
  );

  const navClasses = [
    "top-nav",
    overlay ? "top-nav--overlay" : "top-nav--solid",
    scrolled ? "top-nav--scrolled" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <header ref={headerRef} className={navClasses} data-testid="global-nav">
        <div className="top-nav-inner wrap">
          <Link href="/" className="nav-logo" aria-label="Set Life Entertainment — home">
            <Image src="/assets/logo-nav.png" alt="" width={64} height={46} priority={overlay} />
          </Link>

          <nav className="nav-primary" aria-label="Primary">
            {PRIMARY_NAV.map((item) =>
              isNavLeaf(item) ? (
                <NavLink key={item.href} href={item.href} active={item.href === activePath}>
                  {item.label}
                </NavLink>
              ) : (
                <div className="nav-mega-wrap" key={item.label}>
                  <button
                    ref={megaTriggerRef}
                    type="button"
                    className={`nav-mega-trigger${isIndustryActive ? " active" : ""}`}
                    aria-expanded={megaOpen}
                    aria-haspopup="true"
                    onClick={() => setMegaOpen((v) => !v)}
                  >
                    {item.label}
                  </button>
                  {megaOpen && (
                    <div className="nav-mega-panel" ref={megaPanelRef}>
                      <div className="nav-mega-panel-inner wrap">
                        <ul>
                          {item.mega.map((leaf) => (
                            <li key={leaf.href}>
                              <NavLink href={leaf.href} active={leaf.href === activePath}>
                                {leaf.label}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )
            )}
          </nav>

          <div className="nav-utility">
            {UTILITY_NAV.map((link) => (
              <NavLink key={link.href} href={link.href} active={link.href === activePath} className="nav-utility-link">
                {link.label}
              </NavLink>
            ))}
          </div>

          <button
            ref={mobileToggleRef}
            type="button"
            className="nav-mobile-toggle"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-panel"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span className={`nav-mobile-icon${mobileOpen ? " is-open" : ""}`} />
          </button>
        </div>
      </header>

      {/* §16.1 — Mobile menu panel is a sibling of <header>, not a child.
          A fixed-position element inside a positioned ancestor that establishes
          a stacking context (position + z-index) is contained within that
          ancestor rather than escaping to the viewport — the backdrop never
          covers the full screen height. Rendering outside <header> makes
          `position:fixed; inset:0` work as specified. Desktop hides this
          panel via @media (min-width: 768px) { display: none }. */}
      <div id="mobile-nav-panel" className="nav-mobile-panel" ref={mobilePanelRef} hidden={!mobileOpen}>
        <nav aria-label="Mobile">
          <ul className="nav-mobile-editorial">
            {PRIMARY_NAV.flatMap((item) => (isNavLeaf(item) ? [item] : item.mega)).map((leaf) => (
              <li key={leaf.href}>
                <NavLink href={leaf.href} active={leaf.href === activePath} className="nav-mobile-link">
                  {leaf.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <ul className="nav-mobile-utility">
            <li>
              <NavLink href="/search" active={activePath === "/search"} className="nav-mobile-utility-link">
                Search
              </NavLink>
            </li>
            <li>
              <NavLink href="/submit" active={activePath === "/submit"} className="nav-mobile-utility-link">
                Submit
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
