import { expect, test } from "@playwright/test";

test.describe("WatchFlow Visual Regression", () => {
  test("ホーム画面の基準スクリーンショット", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveScreenshot("home.png", { fullPage: true });
  });

  test("動画詳細画面の基準スクリーンショット", async ({ page }) => {
    await page.goto("/watch/vf-001");
    await expect(page).toHaveScreenshot("watch-detail.png", { fullPage: true, maxDiffPixelRatio: 0.02 });
  });

  test("モバイルホーム画面の基準スクリーンショット", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await expect(page).toHaveScreenshot("home-mobile.png", { fullPage: true, maxDiffPixelRatio: 0.02 });
  });

  test("検索空状態の基準スクリーンショット", async ({ page }) => {
    await page.goto("/search?q=存在しない動画");
    await expect(page).toHaveScreenshot("search-empty.png", { fullPage: true, maxDiffPixelRatio: 0.02 });
  });

  test("エラー状態の基準スクリーンショット", async ({ page }) => {
    await page.goto("/states?auth=session_expired&billing=payment_failed&network=offline");
    await expect(page).toHaveScreenshot("state-error.png", { fullPage: false, maxDiffPixelRatio: 0.02 });
  });
});
