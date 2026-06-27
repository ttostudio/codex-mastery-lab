const { chromium } = require('playwright');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function shQuote(s) { return String(s).replace(/'/g, "'\\''"); }

async function safeCount(locator) {
  try { return await locator.count(); } catch { return 0; }
}

async function captureFrame(page, dir, idx, label) {
  await page.screenshot({ path: path.join(dir, `frame-${String(idx).padStart(3,'0')}-${label}.png`), fullPage: false });
}

async function interact(page, frameDir) {
  let idx = 1;
  await captureFrame(page, frameDir, idx++, 'initial');
  await sleep(700);

  const search = page.locator('input[type="search"], input[placeholder*="Search" i], input[placeholder*="検索" i]').first();
  if (await safeCount(search)) {
    await search.click();
    await sleep(400);
    await search.fill('');
    await search.type('security', { delay: 110 });
    await sleep(900);
    await captureFrame(page, frameDir, idx++, 'search-security');
    await search.press(process.platform === 'darwin' ? 'Meta+A' : 'Control+A');
    await search.type('zzzz-not-found', { delay: 90 });
    await sleep(900);
    await captureFrame(page, frameDir, idx++, 'search-empty');
    await search.press(process.platform === 'darwin' ? 'Meta+A' : 'Control+A');
    await search.press('Backspace');
    await sleep(600);
  }

  const details = page.locator('summary').first();
  if (await safeCount(details)) {
    await details.click();
    await sleep(700);
    await captureFrame(page, frameDir, idx++, 'details-open');
  }

  const buttons = page.locator('button').filter({ hasText: /All|Security|Analytics|Growth|すべて|送信|Submit|Demo|Request|Filter/i });
  const buttonCount = Math.min(await safeCount(buttons), 3);
  for (let i = 0; i < buttonCount; i++) {
    try {
      await buttons.nth(i).click();
      await sleep(700);
      await captureFrame(page, frameDir, idx++, `button-${i}`);
    } catch {}
  }

  const textInputs = await page.locator('input:not([type="search"]):not([type="hidden"]), textarea, select').count();
  if (textInputs > 0) {
    const fields = page.locator('input:not([type="search"]):not([type="hidden"]), textarea');
    const fieldCount = await fields.count();
    const samples = ['山田 太郎', 'taro@example.com', '50-100名', '月50万円', 'AI開発プロセスの相談をしたいです'];
    for (let i = 0; i < Math.min(fieldCount, samples.length); i++) {
      try {
        await fields.nth(i).click();
        await fields.nth(i).fill('');
        await fields.nth(i).type(samples[i], { delay: 70 });
        await sleep(250);
      } catch {}
    }
    const selects = page.locator('select');
    if (await safeCount(selects)) {
      try { await selects.first().selectOption({ index: 1 }); } catch {}
    }
    await sleep(700);
    await captureFrame(page, frameDir, idx++, 'form-filled');
    const submit = page.locator('button[type="submit"], input[type="submit"], button').last();
    if (await safeCount(submit)) {
      try { await submit.click(); await sleep(900); await captureFrame(page, frameDir, idx++, 'form-submit'); } catch {}
    }
  }

  await page.keyboard.press('Tab');
  await sleep(400);
  await page.keyboard.press('Tab');
  await sleep(500);
  await captureFrame(page, frameDir, idx++, 'keyboard-focus');
}

async function main() {
  const appDir = process.argv[2];
  const outGif = process.argv[3];
  if (!appDir || !outGif) {
    console.error('Usage: node scripts/capture_app_gif.js <app-dir> <out.gif>');
    process.exit(2);
  }
  const index = path.resolve(appDir, 'index.html');
  if (!fs.existsSync(index)) throw new Error(`index.html not found: ${index}`);
  fs.mkdirSync(path.dirname(path.resolve(outGif)), { recursive: true });
  const frameDir = fs.mkdtempSync(path.join(os.tmpdir(), 'aidd-gif-'));
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
  const consoleMessages = [];
  page.on('console', msg => consoleMessages.push(`${msg.type()}: ${msg.text()}`));
  page.on('pageerror', err => consoleMessages.push(`pageerror: ${err.message}`));
  await page.goto('file://' + index, { waitUntil: 'load' });
  await interact(page, frameDir);
  await browser.close();
  fs.writeFileSync(path.resolve(outGif).replace(/\.gif$/i, '.console.txt'), consoleMessages.join('\n') || 'No console messages captured.');

  const pattern = path.join(frameDir, 'frame-*.png');
  const palette = path.join(frameDir, 'palette.png');
  execFileSync('ffmpeg', ['-y', '-framerate', '1', '-pattern_type', 'glob', '-i', pattern, '-vf', 'scale=960:-1:flags=lanczos,palettegen', palette], { stdio: 'ignore' });
  execFileSync('ffmpeg', ['-y', '-framerate', '1', '-pattern_type', 'glob', '-i', pattern, '-i', palette, '-lavfi', 'scale=960:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=3', outGif], { stdio: 'ignore' });
  console.log(`GIF: ${outGif}`);
  console.log(`Console log: ${path.resolve(outGif).replace(/\.gif$/i, '.console.txt')}`);
  console.log(`Frames: ${frameDir}`);
}

main().catch(err => { console.error(err); process.exit(1); });
