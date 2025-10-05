import tsParser from "@typescript-eslint/parser";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["./dist/**"]),
  eslintPluginPrettierRecommended,
  {
    files: ["src/**/*.ts", "src/**/*.tsx", "src/**/*.js"],
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      "prettier/prettier": [
        "error",
        {
          singleQuote: true,
          semi: false,
          trailingComma: "es5",
          printWidth: 100,
          tabWidth: 2,
          arrowParens: "avoid",
        },
      ],
    },
  },
]);
