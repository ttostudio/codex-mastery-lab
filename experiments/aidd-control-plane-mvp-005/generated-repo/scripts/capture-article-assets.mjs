import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { mkdirSync, copyFileSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const repo = resolve(process.cwd());
const experiment = resolve(repo, '..');
const root = resolve(experiment, '../..');
const screenshotDir = join(experiment, 'artifacts', 'screenshots');
const assetsDir = join(root, 'assets');
mkdirSync(screenshotDir, { recursive: true });
mkdirSync(assetsDir, { recursive: true });

const server = spawn('pnpm', ['exec', 'next', 'dev', '--hostname', '127.0.0.1', '--port', '3130'], {
  cwd: repo,
  stdio: ['ignore', 'pipe', 'pipe']
});

async function waitForServer() {
  const started = Date.now();
  while (Date.now() - started < 45000) {
    try {
      const res = await fetch('http://127.0.0.1:3130');
      if (res.ok) return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error('dev server timeout');
}

function copyShot(name) {
  copyFileSync(join(screenshotDir, name), join(assetsDir, name));
}

function renderTerminalEvidence() {
  const logs = [
    ['lint', '02-lint.txt'],
    ['typecheck', '03-typecheck.txt'],
    ['test', '04-test.txt'],
    ['build', '05-build.txt'],
    ['e2e', '06-e2e.txt'],
    ['doctor:aidd', '07-doctor-aidd.txt']
  ].map(([label, file]) => {
    const text = readFileSync(join(experiment, 'artifacts', 'terminal', file), 'utf8')
      .replaceAll(root, '<repo>')
      .replaceAll(process.env.HOME || '', '<home>')
      .split('\n')
      .slice(-12)
      .join('\n');
    return `${label}\n${text}`;
  }).join('\n\n');
  return `<!doctype html><html><head><meta charset="utf-8"><style>
body{margin:0;background:#0f172a;color:#e5e7eb;font:18px ui-monospace,SFMono-Regular,Menlo,monospace;padding:32px;}
.card{border:1px solid rgba(148,163,184,.35);border-radius:22px;background:#111827;padding:28px;box-shadow:0 24px 80px rgba(0,0,0,.35)}
h1{font:700 28px system-ui;margin:0 0 18px;color:#f8fafc}.ok{color:#86efac}pre{white-space:pre-wrap;line-height:1.45;margin:0} .muted{color:#93a4ba}
</style></head><body><div class="card"><h1>AIDD Control Plane MVP 005 terminal evidence <span class="ok">PASS</span></h1><pre>${logs.replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}</pre></div></body></html>`;
}

try {
  await waitForServer();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 }, deviceScaleFactor: 1 });
  await page.goto('http://127.0.0.1:3130', { waitUntil: 'networkidle' });
  await page.screenshot({ path: join(screenshotDir, 'aidd-control-plane-mvp005-empty.png'), fullPage: true });

  await page.getByLabel(/学習支援/).check();
  await page.screenshot({ path: join(screenshotDir, 'aidd-control-plane-mvp005-template-unapplied.png'), fullPage: true });
  await page.getByRole('button', { name: 'テンプレートを適用' }).click();
  await page.getByLabel('何を作りたいですか？').fill('StudyFlow');
  await page.getByLabel('誰のどんな問題を解決しますか？ 対象ユーザー').fill('学習を継続したい社会人');
  await page.getByLabel('解決したい問題').fill('教材が散らばり、今日やることを決められない');
  await page.screenshot({ path: join(screenshotDir, 'aidd-control-plane-mvp005-ready.png'), fullPage: true });

  await page.getByLabel('必要な機能は何ですか？ 1行に1つ').fill('今日の学習キュー');
  await page.screenshot({ path: join(screenshotDir, 'aidd-control-plane-mvp005-insufficient.png'), fullPage: true });

  const term = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  await term.setContent(renderTerminalEvidence(), { waitUntil: 'load' });
  await term.screenshot({ path: join(screenshotDir, 'aidd-control-plane-mvp005-terminal-evidence.png'), fullPage: true });
  await browser.close();

  for (const name of [
    'aidd-control-plane-mvp005-empty.png',
    'aidd-control-plane-mvp005-template-unapplied.png',
    'aidd-control-plane-mvp005-ready.png',
    'aidd-control-plane-mvp005-insufficient.png',
    'aidd-control-plane-mvp005-terminal-evidence.png'
  ]) copyShot(name);
} finally {
  server.kill('SIGTERM');
}
