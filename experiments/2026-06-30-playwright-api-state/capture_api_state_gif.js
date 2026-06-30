const { chromium } = require('playwright');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }

async function frame(page, dir, idx, label) {
  await page.screenshot({ path: path.join(dir, `frame-${String(idx).padStart(3, '0')}-${label}.png`), fullPage: false });
}

async function main() {
  const appDir = process.argv[2];
  const outGif = process.argv[3];
  if (!appDir || !outGif) {
    console.error('Usage: node capture_api_state_gif.js <app-dir> <out.gif>');
    process.exit(2);
  }
  const index = path.resolve(appDir, 'index.html');
  fs.mkdirSync(path.dirname(path.resolve(outGif)), { recursive: true });
  const frameDir = fs.mkdtempSync(path.join(os.tmpdir(), 'aidd-api-state-'));
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  const messages = [];
  page.on('console', (msg) => messages.push(`${msg.type()}: ${msg.text()}`));
  page.on('pageerror', (err) => messages.push(`pageerror: ${err.message}`));
  await page.goto('file://' + index, { waitUntil: 'load' });
  let i = 1;
  await sleep(700);
  await frame(page, frameDir, i++, 'initial-success');

  const search = page.locator('input[type="search"]').first();
  if (await search.count()) {
    await search.fill('');
    await search.type('コーヒー', { delay: 120 });
    await sleep(600);
    await frame(page, frameDir, i++, 'search-coffee');
  }

  for (const name of ['offline', 'timeout', 'server-error', 'empty', 'success']) {
    const button = page.getByRole('button', { name });
    if (await button.count()) {
      await button.click();
      await sleep(name === 'timeout' ? 900 : 650);
      await frame(page, frameDir, i++, `scenario-${name}`);
    }
  }

  const retry = page.getByRole('button', { name: '再試行' });
  if (await retry.count()) {
    await retry.click();
    await sleep(650);
    await frame(page, frameDir, i++, 'retry-success');
  }

  await browser.close();
  fs.writeFileSync(path.resolve(outGif).replace(/\.gif$/i, '.console.txt'), messages.join('\n') || 'No console messages captured.');
  const pattern = path.join(frameDir, 'frame-*.png');
  const palette = path.join(frameDir, 'palette.png');
  execFileSync('ffmpeg', ['-y', '-framerate', '1', '-pattern_type', 'glob', '-i', pattern, '-vf', 'scale=720:-1:flags=lanczos,palettegen', palette], { stdio: 'ignore' });
  execFileSync('ffmpeg', ['-y', '-framerate', '1', '-pattern_type', 'glob', '-i', pattern, '-i', palette, '-lavfi', 'scale=720:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=3', outGif], { stdio: 'ignore' });
  console.log(`GIF: ${outGif}`);
  console.log(`Console log: ${path.resolve(outGif).replace(/\.gif$/i, '.console.txt')}`);
  console.log(`Frames: ${frameDir}`);
}

main().catch((error) => { console.error(error); process.exit(1); });
