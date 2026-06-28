import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const requiredFiles = [
  "package.json",
  "app/page.tsx",
  "app/globals.css",
  "src/lib/contracts.ts",
  "src/lib/samples.ts",
  "tests/contracts.test.ts",
  "e2e/contract-checker.spec.ts",
  "playwright.config.ts",
  "docs/product-brief.md",
  "docs/review-record.md",
  "docs/learning-log.md",
  "docs/verification-evidence.md"
];
const requiredScripts = ["lint", "typecheck", "test", "build", "test:e2e", "doctor:aidd"];
const requiredCopy = [
  "Contract Checker Dashboard",
  "Artifact JSON Editors",
  "Schema Requirements",
  "Validation Results",
  "AI Task Packet",
  "Verification Evidence",
  "Review Record",
  "Learning Log",
  "サンプルを入れる",
  "必須項目を1つ削って失敗を見る",
  "JSONを壊してinvalid_jsonを見る",
  "リセット",
  "overall status",
  "artifact-by-artifact status",
  "missing required paths",
  "invalid JSON errors",
  "improvement suggestions",
  "外部API未接続",
  "ログイン不要"
];
const requiredStates = ["empty", "valid", "invalid_json", "missing_required", "warning", "offline"];
const forbiddenPatterns = [
  { label: "fetch", pattern: /\bfetch\s*\(/ },
  { label: "XMLHttpRequest", pattern: /\bXMLHttpRequest\b/ },
  { label: "WebSocket", pattern: /\bWebSocket\b/ },
  { label: "localStorage", pattern: /\blocalStorage\b/ },
  { label: "sessionStorage", pattern: /\bsessionStorage\b/ }
];
const ignoredDirs = new Set(["node_modules", ".next", "coverage", "playwright-report", "test-results"]);
const scannedExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".md", ".json"]);
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
  for (const script of requiredScripts) {
    if (!packageJson.scripts?.[script]) fail(`missing script: ${script}`);
  }
}

const files = walk(root);
const combined = files.map((file) => readFileSync(file, "utf8")).join("\n");
const implementationFiles = files.filter((file) => {
  const relativePath = path.relative(root, file);
  return relativePath.startsWith("app/") || relativePath.startsWith("src/") || relativePath.startsWith("tests/") || relativePath.startsWith("e2e/");
});

for (const copy of requiredCopy) {
  if (!combined.includes(copy)) fail(`missing UI token: ${copy}`);
}

for (const state of requiredStates) {
  if (!combined.includes(state)) fail(`missing state token: ${state}`);
}

for (const file of implementationFiles) {
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
