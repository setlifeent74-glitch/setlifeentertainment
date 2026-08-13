import nextConfig from "eslint-config-next";

const eslintConfig = [
  ...nextConfig,
  {
    ignores: [
      ".next/**",
      ".next_stale_*/**",
      "node_modules/**",
      "public/**",
      "test-results/**",
      "playwright-report/**",
      ".lighthouseci/**",
    ],
  },
];

export default eslintConfig;
