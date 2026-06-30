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
  "docs/learning-log.md"
];
const requiredScripts = ["lint", "typecheck", "test", "build", "test:e2e", "doctor:aidd"];
const requiredCopy = [
  "何を作りたいですか？",
  "誰のどんな問題を解決しますか？",
  "作らないものを決める",
  "必要な検証を選ぶ",
  "AIに渡す依頼書を生成",
  "App Type Templates",
  "テンプレートを選ぶ",
  "テンプレートを適用",
  "テンプレート未選択",
  "テンプレート未適用",
  "リスク",
  "証跡要件",
  "Generated Product Brief",
  "Generated AI Task Packet",
  "Verification Plan",
  "Codex Prompt",
  "Readiness Review"
];
const requiredStates = ["empty", "loading", "success", "error", "offline", "timeout", "auth", "billing", "media_error"];
const requiredTemplateNames = ["動画サービス風", "学習支援", "予約管理", "社内申請"];
const requiredGates = ["lint", "typecheck", "test", "build"];
const forbiddenPatterns = [
  { label: "browser storage local", pattern: /\blocalStorage\b/ },
  { label: "browser storage session", pattern: /\bsessionStorage\b/ },
  { label: "network primitive one", pattern: /\bfetch\s*\(/ },
  { label: "network primitive two", pattern: /\bXMLHttpRequest\b/ },
  { label: "network primitive three", pattern: /\bWebSocket\b/ },
  { label: "external URL", pattern: /https?:\/\// }
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
  if (packageJson.name !== "aidd-control-plane-mvp-005") fail(`unexpected package name: ${packageJson.name}`);
  for (const script of requiredScripts) {
    if (!packageJson.scripts?.[script]) fail(`missing script: ${script}`);
  }
}

const files = walk(root);
const combined = files.map((file) => readFileSync(file, "utf8")).join("\n");
const appSourceFiles = files.filter((file) => {
  const relativePath = path.relative(root, file);
  return relativePath.startsWith("app/") || relativePath.startsWith("src/");
});

for (const copy of requiredCopy) {
  if (!combined.includes(copy)) fail(`missing UI copy token: ${copy}`);
}

for (const state of requiredStates) {
  if (!combined.includes(state)) fail(`missing state contract token: ${state}`);
}

for (const templateName of requiredTemplateNames) {
  if (!combined.includes(templateName)) fail(`missing app type template: ${templateName}`);
}

const intakeSourcePath = path.join(root, "src/lib/intake.ts");
if (existsSync(intakeSourcePath)) {
  const intakeSource = readFileSync(intakeSourcePath, "utf8");
  const templateIdCount = (intakeSource.match(/id: "/g) ?? []).length;
  if (templateIdCount < 4) fail(`expected at least 4 app type templates, found ${templateIdCount}`);
  for (const gate of requiredGates) {
    const gateCount = (intakeSource.match(new RegExp(`"${gate}"`, "g")) ?? []).length;
    if (gateCount < 5) fail(`required gate is not present in every template and baseline: ${gate}`);
  }
  for (const token of ["recommendedFeatures", "stateContract", "qualityGates", "risks", "evidenceRequirements"]) {
    if (!intakeSource.includes(token)) fail(`missing template contract token: ${token}`);
  }
}

const e2eSpecPath = path.join(root, "e2e/intake-wizard.spec.ts");
if (existsSync(e2eSpecPath)) {
  const e2eSource = readFileSync(e2eSpecPath, "utf8");
  for (const token of ["テンプレート未選択", "テンプレート未適用", "テンプレートを適用", "offline / timeout状態の画面証跡"]) {
    if (!e2eSource.includes(token)) fail(`missing e2e template assertion: ${token}`);
  }
}

const playwrightConfigPath = path.join(root, "playwright.config.ts");
if (existsSync(playwrightConfigPath)) {
  const playwrightConfig = readFileSync(playwrightConfigPath, "utf8");
  for (const browser of ["chromium", "firefox", "webkit"]) {
    if (!playwrightConfig.includes(`name: "${browser}"`)) fail(`missing Playwright browser project: ${browser}`);
  }
  for (const token of ["timeout: 120_000", "expect: { timeout: 90_000 }", "workers: 1"]) {
    if (!playwrightConfig.includes(token)) fail(`missing Playwright stability setting: ${token}`);
  }
}

for (const file of appSourceFiles) {
  const relativePath = path.relative(root, file);
  const text = readFileSync(file, "utf8");
  for (const item of forbiddenPatterns) {
    if (item.pattern.test(text)) fail(`forbidden ${item.label}: ${relativePath}`);
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
console.log(`checked states: ${requiredStates.join(", ")}`);
console.log(`checked templates: ${requiredTemplateNames.join(", ")}`);
