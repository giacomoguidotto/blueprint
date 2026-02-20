import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@/": new URL("./src/", import.meta.url).pathname,
      "convex/_generated": new URL("./convex/_generated", import.meta.url)
        .pathname,
    },
  },
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./vitest.setup.ts"],
    typecheck: {
      tsconfig: "./tsconfig.test.json",
    },
    projects: [
      {
        resolve: {
          alias: {
            "@/": new URL("./src/", import.meta.url).pathname,
            "convex/_generated": new URL("./convex/_generated", import.meta.url)
              .pathname,
          },
        },
        test: {
          name: "unit",
          include: ["src/**/*.test.{ts,tsx}"],
          environment: "happy-dom",
          globals: true,
          setupFiles: ["./vitest.setup.ts"],
        },
      },
      {
        resolve: {
          alias: {
            "convex/_generated": new URL("./convex/_generated", import.meta.url)
              .pathname,
          },
        },
        test: {
          name: "convex",
          include: ["convex/**/*.test.ts"],
          environment: "node",
          globals: true,
          server: { deps: { inline: ["convex-test"] } },
        },
      },
    ],
  },
});
