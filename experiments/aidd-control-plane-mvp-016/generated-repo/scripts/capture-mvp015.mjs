import { chromium } from "@playwright/test";
import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const expRoot = path.resolve(root, "..");
const screenshotDir = path.join(expRoot, "artifacts", "screenshots");
const assetsDir = path.resolve(root, "..", "..", "..", "assets");
const mockCiServiceUrl = process.env.NEXT_PUBLIC_MOCK_CI_SERVICE_URL ?? "http://127.0.0.1:4314";
const appUrl = process.env.AIDD_MVP015_APP_URL ?? "http://127.0.0.1:3014";
mkdirSync(screenshotDir, { recursive: true });
mkdirSync(assetsDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1200 }, deviceScaleFactor: 1 });

async function setScenario(scenario) {
  await fetch(`${mockCiServiceUrl}/__control/state`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ scenario })
  });
  await page.goto(appUrl, { waitUntil: "networkidle" });
}

async function shot(name) {
  const file = path.join(screenshotDir, name);
  await page.screenshot({ path: file, fullPage: true });
  copyFileSync(file, path.join(assetsDir, name));
}

for (const scenario of ["empty", "valid", "failure", "timeout", "rate_limit"]) {
  await setScenario(scenario);
  await shot(`aidd-control-plane-mvp015-${scenario}.png`);
}

const terminalLogPath = path.join(expRoot, "artifacts", "terminal", "verification-summary.txt");
const terminalText = (existsSync(terminalLogPath)
  ? readFileSync(terminalLogPath, "utf8")
  : "pnpm run lint\npnpm run typecheck\npnpm run test\npnpm run build\npnpm run doctor:aidd\npnpm run mock:doctor\npnpm run test:e2e")
  .replaceAll(process.env.HOME ?? "", "WORKSPACE")
  .replace(/\/Users\/[^/\s]+/g, "WORKSPACE")
  .split("\n")
  .slice(-80)
  .join("\n");
const escaped = terminalText.replace(/[&<>]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[character] ?? character);
await page.setContent(`<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#0f172a;color:#e2e8f0;font:22px/1.55 ui-monospace,Menlo,monospace}.card{padding:36px}h1{font:800 32px system-ui;margin:0 0 20px;color:#bfdbfe}.ok{color:#bbf7d0}pre{white-space:pre-wrap;overflow-wrap:anywhere}</style><div class="card"><h1>AIDD Control Plane MVP 015 terminal evidence</h1><p class="ok">fixture駆動Mock CI Service契約の検証ログ。</p><pre>${escaped}</pre></div>`);
await shot("aidd-control-plane-mvp015-terminal-evidence.png");
await browser.close();
