import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const isCI = process.env.CI === "true";

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Override or add rules here:
  {
    rules: {
      "@next/next/no-html-link-for-pages": isCI ? "error" : "warn",
      "@typescript-eslint/no-explicit-any": isCI ? "error" : "warn",
    },
  },
];

export default eslintConfig;

