import Link from "next/link";
import Image from "next/image";
import { FOOTER_EXPLORE, FOOTER_INDUSTRY, FOOTER_SET_LIFE, FOOTER_LEGAL } from "./nav-data";

/**
 * §38 Editorial Footer. Explore/Industry columns are derived from
 * PRIMARY_NAV (nav-data.ts) — the single source of truth shared with §16's
 * main nav, not re-declared here. Only Instagram is a live channel; no
 * placeholder icons for inactive ones (§38: "Only active channels").
 */
export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="logo">
              {/* Intrinsic source is 500x358; rendered size is the CSS-driven
                  height:26px (.footer-brand .logo img) — pass the rendered
                  size, not the source's, or next/image serves a 1080px-wide
                  variant for a 26px-tall logo. */}
              <Image src="/assets/logo-nav.png" alt="Set Life Entertainment" width={36} height={26} />
            </Link>
            <p>Spotlighting the indie film industry — rising talent, untold stories, across cinema.</p>
            <div className="social-row">
              <a href="https://www.instagram.com/setlifeentertainment/" target="_blank" rel="noopener" aria-label="Set Life Entertainment on Instagram">
                IG
              </a>
            </div>
          </div>

          <div>
            <h4>Explore</h4>
            <ul>
              {FOOTER_EXPLORE.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Industry</h4>
            <ul>
              {FOOTER_INDUSTRY.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Set Life</h4>
            <ul>
              {FOOTER_SET_LIFE.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Legal</h4>
            <ul>
              {FOOTER_LEGAL.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Set Life Entertainment. All rights reserved.</span>
          <span>The Voice. The Culture. The Future.</span>
          <span className="powered-by">Powered by Hughes Technologies</span>
        </div>
      </div>
    </footer>
  );
}
