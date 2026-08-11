import nextConfig from "eslint-config-next";

const eslintConfig = [
  ...nextConfig,
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "public/**",
      "test-results/**",
      "playwright-report/**",
      ".lighthouseci/**",
    ],
  },
];

export default eslintConfig;
