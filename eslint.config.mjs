import { FlatCompat } from "@eslint/eslintrc";

import baseConfig, { restrictEnvAccess } from "./tools/eslint/base.mjs";
import nextConfig from "./tools/eslint/nextjs.mjs";
import reactConfig from "./tools/eslint/react.mjs";

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...nextConfig,
  ...reactConfig,
  ...restrictEnvAccess,
  ...compat.extends("plugin:drizzle/recommended"),
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];
