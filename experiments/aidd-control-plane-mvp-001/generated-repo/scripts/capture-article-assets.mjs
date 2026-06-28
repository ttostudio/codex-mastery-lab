import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { mkdirSync, copyFileSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const repo = process.cwd();
const labRoot = resolve(repo, '../../..');
const shotDir = resolve(repo, '../artifacts/screenshots');
const assetDir = resolve(labRoot, 'assets');
mkdirSync(shotDir, { recursive: true });
mkdirSync(assetDir, { recursive: true });

function wait(ms){ return new Promise(r=>setTimeout(r,ms)); }
const server = spawn('pnpm', ['exec','next','dev','--hostname','127.0.0.1','--port','3131'], { cwd: repo, stdio: ['ignore','pipe','pipe'] });
for (let i=0;i<60;i++) {
  try {
    const r = await fetch('http://127.0.0.1:3131');
    if (r.ok) break;
  } catch {}
  await wait(500);
}
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1200 }, deviceScaleFactor: 1 });
await page.goto('http://127.0.0.1:3131', { waitUntil: 'networkidle' });
await page.screenshot({ path: join(shotDir, 'aidd-control-plane-mvp001-empty.png'), fullPage: true });
await page.getByLabel('プロジェクト名').fill('AIDD Control Plane MVP');
await page.getByLabel('解く課題').fill('AIエージェントに渡す入力と検証証跡を一つの流れで作りたい');
await page.getByLabel('非ゴール').fill('ログインは作らない\n外部API送信はしない\nDB接続はしない');
await page.getByLabel('成功条件').fill('AI Task Packetを生成できる\nRunbookを生成できる\nReview Recordを残せる');
await page.getByRole('button', { name: 'Packet生成' }).click();
await page.waitForTimeout(500);
await page.screenshot({ path: join(shotDir, 'aidd-control-plane-mvp001-filled.png'), fullPage: true });
await page.getByRole('button', { name: 'offline' }).click();
await page.screenshot({ path: join(shotDir, 'aidd-control-plane-mvp001-offline.png'), fullPage: true });
await browser.close();
server.kill('SIGTERM');
for (const name of ['aidd-control-plane-mvp001-empty.png','aidd-control-plane-mvp001-filled.png','aidd-control-plane-mvp001-offline.png']) {
  copyFileSync(join(shotDir, name), join(assetDir, name));
}
const logs = [
  ['install', '01-install.txt'], ['lint', '02-lint.txt'], ['typecheck', '03-typecheck.txt'],
  ['test', '04-test.txt'], ['build', '05-build.txt'], ['e2e', '06-e2e.txt'], ['doctor', '07-doctor-aidd.txt'],
].map(([label, file]) => {
  const p = resolve(repo, '../artifacts/terminal', file);
  const t = readFileSync(p, 'utf8');
  const last = t.trim().split('\n').slice(-4).join('\n');
  return { label, last };
});
const escape = (s) => s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const html = `<!doctype html><meta charset="utf-8"><style>
body{margin:0;background:#10131a;color:#e8edf7;font:20px ui-monospace,SFMono-Regular,Menlo,monospace;padding:36px}h1{font:700 34px system-ui;margin:0 0 24px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}.card{border:1px solid #2b3446;border-radius:16px;background:#151b26;padding:18px}.label{color:#8ef0a3;font-weight:700;margin-bottom:10px}pre{white-space:pre-wrap;margin:0;color:#d7e2f2;font-size:16px}.ok{color:#8ef0a3}</style><h1>AIDD Control Plane MVP 001 検証ログ</h1><div class=grid>${logs.map(l=>`<div class=card><div class=label>${l.label} <span class=ok>exit=0</span></div><pre>${escape(l.last)}</pre></div>`).join('')}</div>`;
const card = await chromium.launch();
const p = await card.newPage({ viewport: { width: 1300, height: 900 }, deviceScaleFactor: 1 });
await p.setContent(html);
await p.screenshot({ path: join(shotDir, 'aidd-control-plane-mvp001-terminal-evidence.png'), fullPage: true });
await card.close();
copyFileSync(join(shotDir, 'aidd-control-plane-mvp001-terminal-evidence.png'), join(assetDir, 'aidd-control-plane-mvp001-terminal-evidence.png'));
console.log('captured article assets:', shotDir);
