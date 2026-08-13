import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./types";

/**
 * Refreshes the auth session on every request. Server Components can't set
 * cookies, so token refresh has to happen here, in middleware, which can.
 * Called from the project-root middleware.ts.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    // This runs on every single request site-wide, including pages that
    // don't touch Supabase at all. Before the project is provisioned (or if
    // env vars are ever missing in a deploy), failing here would 500 the
    // entire site, not just the pages that actually need a session —
    // confirmed by testing exactly this locally. Pass through unchanged.
    return supabaseResponse;
  }

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Required — do not remove. Calling getUser() (not getSession()) forces a
  // round-trip that validates the token and triggers refresh when needed;
  // skipping this silently lets expired sessions through.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // §45 VERIFY — "/admin while logged out redirects to login with no
  // content leakage." Every /admin/* route except the login page itself
  // requires a session; the flat-access model means any authenticated
  // user is enough (no role check), so this one guard covers all of them.
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/admin") && pathname !== "/admin/login" && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }
  if (pathname === "/admin/login" && user) {
    const adminUrl = request.nextUrl.clone();
    adminUrl.pathname = "/admin";
    adminUrl.search = "";
    return NextResponse.redirect(adminUrl);
  }

  return supabaseResponse;
}
