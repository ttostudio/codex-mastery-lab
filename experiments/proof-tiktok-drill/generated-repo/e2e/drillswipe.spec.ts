import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const controls = {
  api: "http://127.0.0.1:4110/__control/state",
  media: "http://127.0.0.1:4111/__control/state",
  auth: "http://127.0.0.1:4112/__control/state",
  billing: "http://127.0.0.1:4113/__control/state"
};

test.beforeEach(async ({ request, page }) => {
  for (const url of Object.values(controls)) {
    await request.post(url, { data: { reset: true } });
  }
  await page.goto("/");
});

test("フィード遷移、保存、復習キュー、正解、不正解、履歴削除ができる", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "DrillSwipe" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "英語アクセント 15秒" })).toBeVisible();

  await page.getByRole("button", { name: "保存" }).click();
  await expect(page.locator(".metric").filter({ hasText: "保存" })).toContainText("1");

  await page.getByRole("button", { name: "復習キュー" }).click();
  await expect(page.getByTestId("review-list")).toContainText("英語アクセント 15秒");

  await page.getByRole("button", { name: "PHO" }).click();
  await expect(page.getByTestId("answer-result")).toContainText("正解");

  await page.getByRole("button", { name: "次のドリル" }).click();
  await expect(page.getByRole("heading", { name: "漢字読み替え" })).toBeVisible();
  await page.getByRole("button", { name: "じゅうふく" }).click();
  await expect(page.getByTestId("answer-result")).toContainText("不正解");
  await expect(page.getByTestId("history-list")).toContainText("漢字読み替え");

  await page.getByRole("button", { name: "履歴削除" }).click();
  await expect(page.getByTestId("history-list")).toContainText("履歴はありません");
});

test("mock状態をUIに反映できる", async ({ request, page }) => {
  await request.post(controls.media, { data: { media: "failed" } });
  await request.post(controls.auth, { data: { auth: "premium" } });
  await request.post(controls.billing, { data: { billing: "failed" } });
  await page.reload();

  await expect(page.getByText("premium").first()).toBeVisible();
  await expect(page.getByText("課金失敗")).toBeVisible();
  await expect(page.getByText("動画プレースホルダーを読み込めません")).toBeVisible();
});

test("offline と timeout をUIに出せる", async ({ request, page }) => {
  await request.post(controls.api, { data: { mode: "offline" } });
  await page.reload();
  await expect(page.getByText("オフライン表示")).toBeVisible();

  await request.post(controls.api, { data: { mode: "timeout" } });
  await page.reload();
  await expect(page.getByText("タイムアウト表示")).toBeVisible();
});

test("主要画面に重大なアクセシビリティ違反がない", async ({ page }) => {
  const results = await new AxeBuilder({ page }).disableRules(["color-contrast"]).analyze();
  expect(results.violations).toEqual([]);
});
