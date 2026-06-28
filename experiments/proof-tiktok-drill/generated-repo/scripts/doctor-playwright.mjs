import { existsSync } from "node:fs";
import { join } from "node:path";

const cacheRoot = process.env.PLAYWRIGHT_BROWSERS_PATH || join(process.env.HOME || "", "Library", "Caches", "ms-playwright");
const expected = ["chromium", "firefox", "webkit"];
const missing = [];

for (const name of expected) {
  const ok = existsSync(cacheRoot) && (await import("node:fs")).readdirSync(cacheRoot).some((entry) => entry.includes(name));
  if (!ok) missing.push(name);
}

if (missing.length > 0) {
  console.error(`Playwright browser missing: ${missing.join(", ")}`);
  console.error("Run: pnpm exec playwright install --with-deps");
  process.exit(1);
}

console.log("Playwright browsers available: chromium, firefox, webkit");
