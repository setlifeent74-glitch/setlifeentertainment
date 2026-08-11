import Link from "next/link";
import Image from "next/image";

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
              <a href="https://www.instagram.com/setlifeentertainment/" target="_blank" rel="noopener">
                IG
              </a>
              <a href="#">FB</a>
              <a href="#">TT</a>
            </div>
          </div>
          <div>
            <h4>Explore</h4>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/issues">Issues</Link></li>
              <li><Link href="/about">About</Link></li>
            </ul>
          </div>
          <div>
            <h4>Get Involved</h4>
            <ul>
              <li><Link href="/submit">Submit a Story</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/contact">Advertise</Link></li>
            </ul>
          </div>
          <div>
            <h4>Follow</h4>
            <ul>
              <li>
                <a href="https://www.instagram.com/setlifeentertainment/" target="_blank" rel="noopener">
                  Instagram
                </a>
              </li>
              <li><a href="#">Newsletter</a></li>
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
