const path = require("node:path");
const { pathToFileURL } = require("node:url");

let playwrightTest;
try {
  playwrightTest = require("@playwright/test");
} catch {
  playwrightTest = require("playwright/test");
}

const { test, expect } = playwrightTest;

const appUrl = pathToFileURL(
  path.resolve(__dirname, "../fixed-app/index.html"),
).toString();

test.describe("配送状況トラッカーのAPI状態", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(appUrl);
  });

  test("success初期表示で荷物一覧が表示される", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "配送状況トラッカー" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "有機野菜セット" })).toBeVisible();
    await expect(page.getByText("5件 / 全5件")).toBeVisible();
  });

  test("検索語入力後にofflineへ切り替えても検索語と一覧を保持し、エラーと再試行を表示する", async ({
    page,
  }) => {
    const searchInput = page.getByRole("searchbox", {
      name: "検索",
    });

    await searchInput.fill("コーヒー");
    await expect(page.getByRole("heading", { name: "コーヒー豆 定期便" })).toBeVisible();

    await page.getByRole("button", { name: "offline" }).click();

    await expect(searchInput).toHaveValue("コーヒー");
    await expect(page.getByText("ネットワークに接続できません。")).toBeVisible();
    await expect(page.getByText("通信環境を確認し、接続が戻ったら再試行してください。")).toBeVisible();
    await expect(page.getByRole("button", { name: "再試行" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "コーヒー豆 定期便" })).toBeVisible();
    await expect(page.getByText("前回取得済み 1件 / 全5件を表示中")).toBeVisible();
  });

  test("timeoutへ切り替えるとタイムアウトの日本語文言が表示される", async ({ page }) => {
    await page.getByRole("button", { name: "timeout" }).click();

    await expect(page.getByText("配送APIの応答が時間内に返りませんでした。")).toBeVisible();
    await expect(page.getByText("少し待ってから再試行してください。")).toBeVisible();
  });

  test("server-errorへ切り替えるとサーバーエラーの日本語文言が表示される", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "server-error" }).click();

    await expect(page.getByText("配送APIでサーバーエラーが発生しました。")).toBeVisible();
    await expect(page.getByText("配送会社側の復旧を待つか")).toBeVisible();
  });

  test("emptyへ切り替えると空状態が表示される", async ({ page }) => {
    await page.getByRole("button", { name: "empty" }).click();

    await expect(page.getByText("表示できる荷物がありません。")).toBeVisible();
    await expect(page.getByText("API応答は0件です")).toBeVisible();
    await expect(page.getByRole("heading", { name: "有機野菜セット" })).toHaveCount(0);
  });

  test("successへ戻して再試行すると一覧が復帰する", async ({ page }) => {
    await page.getByRole("button", { name: "server-error" }).click();
    await expect(page.getByText("配送APIでサーバーエラーが発生しました。")).toBeVisible();

    await page.getByRole("button", { name: "success" }).click();
    await page.getByRole("button", { name: "再試行" }).click();

    await expect(page.getByRole("heading", { name: "有機野菜セット" })).toBeVisible();
    await expect(page.getByText("5件 / 全5件")).toBeVisible();
  });
});
