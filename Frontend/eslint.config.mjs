import nextPlugin from "@next/eslint-plugin-next";
import tsEslint from "typescript-eslint";
import globals from "globals";
import js from "@eslint/js";

export default [
  {
    ignores: [".next/**", "node_modules/**"],
  },
  js.configs.recommended,
  ...tsEslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    plugins: {
      "@next/next": nextPlugin,
    },
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    rules: {
      ...nextPlugin.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": "warn",
      "@next/next/no-img-element": "off",
    },
  },
];
