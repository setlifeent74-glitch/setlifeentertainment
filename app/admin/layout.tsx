import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/actions/admin-auth";
import Link from "next/link";

/** §47 — noindex the entire admin tree from one place (Next.js metadata inheritance applies this to every child route); robots.txt's `disallow: /admin` is the crawl-blocking half, this is the indexing half. */
export const metadata: Metadata = { robots: { index: false, follow: false } };

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/posts", label: "Posts" },
  { href: "/admin/issues", label: "Issues" },
  { href: "/admin/products", label: "Store" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/authors", label: "Authors" },
  { href: "/admin/honorees", label: "Set Life 100" },
  { href: "/admin/submissions", label: "Submissions" },
];

/**
 * §45 Admin Back Office. Flat access — whoever is logged in sees the same
 * nav and can do everything; there's no role check here or anywhere else
 * in the admin surface.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // The middleware already enforces this redirect for every /admin/*
    // route except /admin/login — this is just the login page itself,
    // rendered without the authenticated shell.
    return <div className="admin-shell admin-shell--login">{children}</div>;
  }

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <Link href="/admin" className="admin-brand">
          Set Life Admin
        </Link>
        <nav className="admin-nav">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={logout}>
          <button type="submit" className="admin-logout">
            Log Out
          </button>
        </form>
      </header>
      <main className="admin-main">{children}</main>
    </div>
  );
}
