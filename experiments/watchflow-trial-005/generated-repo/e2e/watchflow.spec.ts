import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("WatchFlow E2E", () => {
  test.beforeEach(async ({ request }) => {
    await Promise.all([
      request.post("http://127.0.0.1:4010/__control/state", { data: { state: "online" } }),
      request.post("http://127.0.0.1:4020/__control/state", { data: { state: "normal" } }),
      request.post("http://127.0.0.1:4030/__control/state", { data: { state: "anonymous" } }),
      request.post("http://127.0.0.1:4040/__control/state", { data: { state: "free" } })
    ]);
  });

  test("ホームから動画詳細へ移動できる", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "いま見たい動画" })).toBeVisible();
    await page.getByRole("link", { name: /小さな動画サービスを設計する/ }).first().click();
    await expect(page.getByRole("heading", { name: /小さな動画サービスを設計する/ })).toBeVisible();
    await expect(
      page.getByRole("button", { name: /再生|一時停止/ }).or(page.getByRole("button", { name: /再試行/ })).first()
    ).toBeVisible();
  });

  test("検索結果の空状態を表示できる", async ({ page }) => {
    await page.goto("/search?q=存在しない動画");
    await expect(page.getByRole("heading", { name: "該当する動画がありません" })).toBeVisible();
  });

  test("動画取得失敗時にリトライ導線を表示する", async ({ page }) => {
    await page.goto("/watch/vf-001?media=failure");
    await expect(page.getByRole("heading", { name: "動画を取得できませんでした" })).toBeVisible();
    await expect(page.getByRole("button", { name: /再試行/ })).toBeVisible();
  });

  test("認証と課金の失敗状態を表示できる", async ({ page }) => {
    await page.goto("/states?auth=session_expired&billing=payment_failed");
    await expect(page.getByRole("heading", { name: "セッション期限切れ" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "支払い確認が必要" })).toBeVisible();
  });

  test("独立mock serviceの状態変更が画面に反映される", async ({ page, request }) => {
    await expect(await request.get("http://127.0.0.1:4020/state")).toBeOK();
    await request.post("http://127.0.0.1:4030/__control/state", { data: { state: "premium" } });
    await request.post("http://127.0.0.1:4040/__control/state", { data: { state: "payment_failed" } });
    await request.post("http://127.0.0.1:4010/__control/state", { data: { state: "offline" } });

    await page.goto("/states");
    await expect(page.getByRole("heading", { name: "プレミアム会員" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "支払い確認が必要" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "ネットワークに接続できません" })).toBeVisible();
  });

  test("mock-mediaの失敗状態を動画画面で表示できる", async ({ page, request }) => {
    await request.post("http://127.0.0.1:4020/__control/state", { data: { state: "failure" } });
    await page.goto("/watch/vf-001");
    await expect(page.getByRole("heading", { name: "動画を取得できませんでした" })).toBeVisible();
    await expect(page.getByRole("button", { name: /再試行/ })).toBeVisible();
  });

  test("後で見るリストへ追加と解除ができる", async ({ page }) => {
    await page.goto("/watch/vf-001");
    const addButton = page.getByRole("button", { name: "後で見るへ追加" });
    await addButton.click();
    await expect(page.getByRole("button", { name: "後で見るに追加済み" })).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: "後で見るに追加済み" }).click();
    await expect(page.getByRole("button", { name: "後で見るへ追加" })).toHaveAttribute("aria-pressed", "false");
  });

  test("視聴履歴を表示して削除できる", async ({ page }) => {
    await page.goto("/watch/vf-001");
    const library = page.getByLabel("ライブラリ操作");
    await expect(library.getByRole("heading", { name: "最近の視聴履歴" })).toBeVisible();
    await expect(library.getByText("小さな動画サービスを設計する")).toBeVisible();
    await page.getByRole("button", { name: "この動画の履歴を削除" }).click();
    await expect(library.getByText("視聴履歴はありません。")).toBeVisible();
  });

  test("品質レビュープレイリストへ追加と削除ができる", async ({ page }) => {
    await page.goto("/watch/vf-001");
    await page.getByRole("button", { name: "品質レビューへ追加" }).click();
    await expect(page.getByRole("button", { name: "品質レビューから削除" })).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: "品質レビューから削除" }).click();
    await expect(page.getByRole("button", { name: "品質レビューへ追加" })).toHaveAttribute("aria-pressed", "false");
  });

  test("オフライン状態とタイムアウト状態を表示できる", async ({ page }) => {
    await page.goto("/search?state=offline");
    await expect(page.getByRole("heading", { name: "ネットワークに接続できません" })).toBeVisible();
    await page.goto("/search?state=timeout");
    await expect(page.getByRole("heading", { name: "応答が時間内に完了しませんでした" })).toBeVisible();
  });

  test("基本ページで axe 違反がない", async ({ page }) => {
    for (const path of ["/", "/search?q=TypeScript", "/watch/vf-001", "/states?auth=anonymous&billing=free"]) {
      await page.goto(path);
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    }
  });
});
