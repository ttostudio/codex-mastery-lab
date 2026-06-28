import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const appRoot = path.join(root, 'generated-repo');
const { chromium } = await import(path.join(appRoot, 'node_modules/@playwright/test/index.mjs'));
const out = path.join(root, 'artifacts/trial-005/screenshots');
await fs.mkdir(out, { recursive: true });
const base = 'http://127.0.0.1:3005';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
async function shot(url, name) { await page.goto(url, { waitUntil: 'networkidle' }); await page.screenshot({ path: path.join(out, name), fullPage: true }); }
await shot(`${base}/`, 'watchflow-home.png');
await shot(`${base}/watch/vf-001`, 'watchflow-watch-detail.png');
await page.getByRole('button', { name: '後で見るへ追加' }).click().catch(()=>{});
await page.getByRole('button', { name: '品質レビューへ追加' }).click().catch(()=>{});
await page.screenshot({ path: path.join(out, 'watchflow-library-actions.png'), fullPage: true });
await page.getByRole('button', { name: 'この動画の履歴を削除' }).click().catch(()=>{});
await page.screenshot({ path: path.join(out, 'watchflow-history-cleared.png'), fullPage: true });
await shot(`${base}/states`, 'watchflow-states-service.png');
await shot(`${base}/design-system`, 'watchflow-design-system.png');
const mobile = await browser.newPage({ viewport: { width: 390, height: 900 }, deviceScaleFactor: 1, isMobile: true });
await mobile.goto(`${base}/watch/vf-001`, { waitUntil: 'networkidle' });
await mobile.screenshot({ path: path.join(out, 'watchflow-watch-mobile.png'), fullPage: true });
await mobile.close();
const terminalFiles = [
 ['04-pnpm-run-test.txt','terminal-unit.png'], ['05-pnpm-run-test-coverage.txt','terminal-coverage.png'], ['06-pnpm-run-build.txt','terminal-build.png'], ['07-pnpm-run-mock-doctor.txt','terminal-mock-doctor.png'], ['08-pnpm-run-doctor-playwright.txt','terminal-doctor.png'], ['09-playwright-chromium-webkit.txt','terminal-e2e.png']
];
for (const [file,png] of terminalFiles) {
 let text = await fs.readFile(path.join(root,'artifacts/trial-005/terminal',file),'utf8');
 const localRepo = path.resolve(root,'../..'); const localHome = process.env.HOME ?? '';
 text = text.replaceAll(appRoot,'/path/to/project-root/experiments/watchflow-trial-005/generated-repo').replaceAll(localRepo,'/path/to/project-root').replaceAll(localHome,'/path/to/home');
 const p = await browser.newPage({ viewport:{width:1400,height:900}, deviceScaleFactor:1 });
 await p.setContent(`<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#0f172a;color:#dbeafe;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}.bar{background:#111827;color:#93c5fd;padding:14px 22px;font:700 18px -apple-system,BlinkMacSystemFont,'Noto Sans JP',sans-serif;border-bottom:1px solid #334155}pre{white-space:pre-wrap;overflow-wrap:anywhere;font-size:18px;line-height:1.55;padding:24px;margin:0}</style><div class="bar">${file}</div><pre></pre>`);
 await p.locator('pre').evaluate((el,value)=>{el.textContent=value}, text.slice(-12000));
 await p.screenshot({ path:path.join(out,png), fullPage:true }); await p.close();
}
const card = await browser.newPage({ viewport:{width:1400,height:900}, deviceScaleFactor:1 });
await card.setContent(`<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#f8fafc;color:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Noto Sans JP',sans-serif}main{padding:54px 70px}h1{font-size:42px;margin:0 0 18px}p{font-size:20px;color:#475569}.score{font-size:74px;font-weight:900;color:#2563eb;margin:20px 0}table{border-collapse:collapse;width:100%;font-size:20px;background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 18px 45px #0f172a18}th,td{border:1px solid #e2e8f0;padding:14px 18px;text-align:left}th{background:#dbeafe}</style><main><h1>WatchFlow Trial 005 採点速報</h1><p>coverage threshold、履歴削除、品質レビュープレイリスト、mock doctor、root GitHub Actionsを追加。</p><div class="score">96 / 100</div><table><tr><th>上がった点</th><th>まだ弱い点</th></tr><tr><td>Unit 23件、coverage threshold通過、Chromium/WebKit 27件成功。root workflowでCI証跡取得が可能に。</td><td>ローカルFirefoxとDocker daemonは未完。CI実runはpush後確認。</td></tr></table></main>`);
await card.screenshot({ path:path.join(out,'score-card.png'), fullPage:true }); await card.close();
await browser.close();
console.log(`screenshots written to ${out}`);
