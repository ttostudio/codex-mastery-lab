import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    css: true,
    include: ["**/*.test.ts", "**/*.test.tsx"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary"],
      thresholds: {
        statements: 65,
        branches: 60,
        functions: 50,
        lines: 68
      }
    }
  },
  resolve: {
    alias: {
      "@": new URL(".", import.meta.url).pathname
    }
  }
});
