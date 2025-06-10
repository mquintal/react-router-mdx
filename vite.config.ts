import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      tsconfigPath: "./tsconfig.client.json",
      entryRoot: "src/client",
      outDir: "dist/types/client",
    }),
  ],
  build: {
    lib: {
      entry: "src/client/index.ts",
      name: "ClientHooks",
      fileName: "client",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["react", "react-router-dom", "react-router"],
    },
    outDir: "dist/client",
  },
});
