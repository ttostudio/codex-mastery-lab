import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const requiredFiles = [
  "package.json",
  "app/page.tsx",
  "app/globals.css",
  "src/lib/intake.ts",
  "tests/intake.test.ts",
  "e2e/intake-wizard.spec.ts",
  "playwright.config.ts",
  "docs/product-brief.md",
  "docs/verification-plan.md",
  "docs/review-record.md",
  "docs/learning-log.md",
  "mocks/ci-service/server.mjs",
  "scripts/mock-start.mjs",
  "scripts/mock-stop.mjs",
  "scripts/mock-doctor.mjs",
  "scripts/capture-mvp014.mjs"
];
const requiredScripts = ["lint", "typecheck", "test", "build", "test:e2e", "doctor:aidd", "mock:start", "mock:stop", "mock:doctor", "capture:mvp014"];
const requiredCopy = [
  "AIDD Control Plane MVP 014",
  "独立Mock CI Service",
  "Mock CI Service",
  "NEXT_PUBLIC_MOCK_CI_SERVICE_URL",
  "http://127.0.0.1:4314",
  "手動Evidence Binder fallback",
  "手動Artifact Evidence Binder",
  "empty",
  "valid",
  "failure",
  "timeout",
  "rate_limit",
  "待機時間",
  "token scope見直し",
  "手動証跡添付",
  "次回AI Task Packet Delta",
  "Verification Run Tracker",
  "Artifact Evidence Binder",
  "CI Artifact Importer",
  "GitHub Actions Artifact Fetch Plan",
  "Evidence Gap Repair Planner",
  "Review Record",
  "Learning Log"
];
const requiredMockTokens = [
  "/health",
  "/state",
  "/__control/state",
  "access-control-allow-origin",
  "empty",
  "valid",
  "failure",
  "timeout",
  "rate_limit",
  "retryAfterSeconds",
  "actions:read",
  "contents:read"
];
const requiredDocsTokens = [
  "MVP 014",
  "独立Mock CI Service",
  "/health",
  "/state",
  "/__control/state",
  "mock:doctor",
  "rate_limit",
  "AIDD-Spec v0.1",
  "Verification Evidence",
  "Review Record",
  "Learning Log"
];
const ignoredDirs = new Set(["node_modules", ".next", "coverage", "playwright-report", "test-results"]);
const scannedExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".md", ".json", ".css"]);
const failures = [];

function fail(message) {
  failures.push(message);
}

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    if (ignoredDirs.has(entry)) return [];
    const fullPath = path.join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) return walk(fullPath);
    if (!scannedExtensions.has(path.extname(entry))) return [];
    return [fullPath];
  });
}

for (const file of requiredFiles) {
  if (!existsSync(path.join(root, file))) fail(`missing file: ${file}`);
}

const packagePath = path.join(root, "package.json");
if (existsSync(packagePath)) {
  const packageJson = JSON.parse(readFileSync(packagePath, "utf8"));
  if (packageJson.name !== "aidd-control-plane-mvp-014") fail(`unexpected package name: ${packageJson.name}`);
  for (const script of requiredScripts) {
    if (!packageJson.scripts?.[script]) fail(`missing script: ${script}`);
  }
}

const files = walk(root);
const combined = files.map((file) => readFileSync(file, "utf8")).join("\n");

for (const copy of requiredCopy) {
  if (!combined.includes(copy)) fail(`missing required copy/token: ${copy}`);
}

const mockServerPath = path.join(root, "mocks/ci-service/server.mjs");
if (existsSync(mockServerPath)) {
  const mockSource = readFileSync(mockServerPath, "utf8");
  for (const token of requiredMockTokens) {
    if (!mockSource.includes(token)) fail(`missing mock service contract token: ${token}`);
  }
}

const appPath = path.join(root, "app/page.tsx");
if (existsSync(appPath)) {
  const appSource = readFileSync(appPath, "utf8");
  for (const token of ["fetch(`${mockCiServiceUrl}/state`", "fetch(`${mockCiServiceUrl}/__control/state`", "setMockCiConnection(\"fallback\")", "rate_limit対応"]) {
    if (!appSource.includes(token)) fail(`missing UI mock integration token: ${token}`);
  }
}

const e2ePath = path.join(root, "e2e/intake-wizard.spec.ts");
if (existsSync(e2ePath)) {
  const e2eSource = readFileSync(e2ePath, "utf8");
  for (const token of ["/__control/state", "rate_limit", "Mock CI Service: valid", "60秒待機"]) {
    if (!e2eSource.includes(token)) fail(`missing E2E mock control assertion: ${token}`);
  }
}

const playwrightConfigPath = path.join(root, "playwright.config.ts");
if (existsSync(playwrightConfigPath)) {
  const playwrightConfig = readFileSync(playwrightConfigPath, "utf8");
  for (const browser of ["chromium", "firefox", "webkit"]) {
    if (!playwrightConfig.includes(`name: "${browser}"`)) fail(`missing Playwright browser project: ${browser}`);
  }
  for (const token of ["timeout: 120_000", "expect: { timeout: 90_000 }", "workers: 1", "mocks/ci-service/server.mjs"]) {
    if (!playwrightConfig.includes(token)) fail(`missing Playwright stability/mock setting: ${token}`);
  }
}

for (const doc of ["docs/product-brief.md", "docs/learning-log.md"]) {
  const docPath = path.join(root, doc);
  if (!existsSync(docPath)) continue;
  const text = readFileSync(docPath, "utf8");
  for (const token of requiredDocsTokens) {
    if (!text.includes(token)) fail(`missing docs MVP 014 token in ${doc}: ${token}`);
  }
}

const capturePath = path.join(root, "scripts/capture-mvp014.mjs");
if (existsSync(capturePath)) {
  const captureSource = readFileSync(capturePath, "utf8");
  for (const token of ["artifacts", "screenshots", "empty", "valid", "failure", "timeout", "rate_limit", "terminal-evidence"]) {
    if (!captureSource.includes(token)) fail(`missing capture:mvp014 token: ${token}`);
  }
}

if (failures.length > 0) {
  console.error("doctor:aidd failed");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("doctor:aidd passed");
console.log(`checked files: ${requiredFiles.length}`);
console.log(`checked scripts: ${requiredScripts.join(", ")}`);
console.log("checked mock scenarios: empty, valid, failure, timeout, rate_limit");
