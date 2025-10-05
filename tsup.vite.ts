import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/vite/index.ts"],
  format: ["esm", "cjs"],
  outDir: "dist/vite",
  dts: {
    entry: "src/vite/index.ts",
    // resolve: true,
  },
  target: "node20",
  external: ["fs", "path", "vite"],
  splitting: false,
  clean: true,
});
