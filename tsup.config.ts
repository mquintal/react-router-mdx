import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server/index.ts"],
  format: ["esm", "cjs"],
  outDir: "dist/server",
  dts: {
    entry: "src/server/index.ts",
    resolve: true,
  },
  target: "node20",
  external: ["fs", "path", "@react-router/dev/routes"],
  splitting: false,
  clean: true,
});
