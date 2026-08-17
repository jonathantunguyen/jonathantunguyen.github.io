import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // The 2022 static site that still lives at the repo root. Its vendored
    // jQuery and theme scripts aren't ours to fix, and linting them buries
    // real findings under ~90 vendor complaints.
    "assets/**",
  ]),
]);

export default eslintConfig;
