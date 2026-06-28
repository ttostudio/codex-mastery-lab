import { chromium, firefox, webkit } from "@playwright/test";

const browsers = [
  ["Chromium", chromium],
  ["Firefox", firefox],
  ["WebKit", webkit]
];

const missing = [];

for (const [name, browserType] of browsers) {
  try {
    const executablePath = browserType.executablePath();
    const browser = await browserType.launch({ headless: true });
    await browser.close();
    console.log(`OK: ${name} が利用できます (${executablePath})`);
  } catch (error) {
    missing.push(name);
    console.error(`NG: ${name} を起動できませんでした。`);
    if (error instanceof Error) console.error(error.message.split("\n")[0]);
  }
}

if (missing.length > 0) {
  console.error("");
  console.error(`不足ブラウザ: ${missing.join(", ")}`);
  console.error("次のコマンドでブラウザをインストールしてください:");
  console.error("pnpm exec playwright install");
  process.exit(1);
}

console.log("Playwright の Chromium / Firefox / WebKit はすべて利用できます。");
