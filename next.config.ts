import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // An unrelated package-lock.json in ~ (outside this repo) otherwise makes
  // Turbopack warn about ambiguous workspace-root detection on every build.
  turbopack: {
    root: import.meta.dirname,
  },
  images: {
    // §41/§45 — editorial images uploaded through the admin editor live in
    // Supabase Storage, not /public. Both the hosted (*.supabase.co) and
    // local CLI (127.0.0.1) forms are allowed so this works in every
    // environment this project runs in without per-env config.
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
      { protocol: "http", hostname: "127.0.0.1", pathname: "/storage/v1/object/public/**" },
    ],
  },
};

export default nextConfig;
