import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // An unrelated package-lock.json in ~ (outside this repo) otherwise makes
  // Turbopack warn about ambiguous workspace-root detection on every build.
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
