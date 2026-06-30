import { expect, test } from "@playwright/test";

test("初期empty stateが表示される", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "アプリ種別テンプレートから、開発ブリーフとAI依頼書と検証計画を作るSaaS" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "empty: 入力待ち" })).toBeVisible();
  await expect(page.getByText("readiness score: 0").first()).toBeVisible();
  await expect(page.getByText("テンプレート未選択").first()).toBeVisible();
  await expect(page.getByText("アプリ名")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Verification Run Tracker" })).toBeVisible();
  await expect(page.getByText("not ready: failure stateがあります")).toBeVisible();
  await expect(page.getByLabel("lint 未実行")).toBeVisible();
  await expect(page.getByLabel("terminal evidence").getByText("terminal evidence不足", { exact: true })).toBeVisible();
  await expect(page.getByLabel("screenshot evidence").getByText("screenshot evidence不足", { exact: true })).toBeVisible();
});

test("テンプレートを選択して未適用failure stateを表示できる", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel(/学習支援/).check();

  await expect(page.getByText("テンプレート未適用").first()).toBeVisible();
  await expect(page.getByText("選択したテンプレートを適用して初期値を反映しますか？")).toBeVisible();
});

test("テンプレートを適用すると初期値と生成結果にリスクと証跡要件が入る", async ({ page }) => {
  await page.goto("/");

  await applyLearningTemplate(page);

  await expect(page.getByRole("combobox", { name: "アプリ種別" })).toHaveValue("Webアプリ");
  await expect(page.getByLabel("必要な機能は何ですか？ 1行に1つ")).toHaveValue(/今日の学習キュー/);
  await expect(page.getByLabel("作らないものを決める 1行に1つ")).toHaveValue(/外部AI API呼び出し/);
  await expect(page.getByLabel("外部連携はありますか？ 1行に1つ")).toHaveValue(/mock auth service/);
  await expect(page.getByText("テンプレート適用済み").first()).toBeVisible();

  await expect(page.getByRole("heading", { name: "Generated Product Brief" })).toBeVisible();
  await expect(page.getByText("学習支援").first()).toBeVisible();
  await expect(page.getByText("offline時の進捗保存方針").first()).toBeVisible();
  await expect(page.getByText("offline / timeout状態の画面証跡").first()).toBeVisible();
});

test("サンプルアプリを入力するとready stateになり生成結果が表示される", async ({ page }) => {
  await page.goto("/");
  await fillSampleApp(page);

  await expect(page.getByRole("heading", { name: "ready: AIへ渡せます" })).toBeVisible();
  await expect(page.getByText("readiness score: 100").first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Generated Product Brief" })).toBeVisible();
  await expect(page.getByText("StudyFlow").first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Generated AI Task Packet" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Verification Plan" })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "コピーできるCodex Prompt" })).toContainText("品質ゲート");
  await expect(page.getByRole("textbox", { name: "コピーできるCodex Prompt" })).toContainText("Verification Run");
});

test("主要機能を削除するとinsufficient stateとmissing fieldsが表示される", async ({ page }) => {
  await page.goto("/");
  await fillSampleApp(page);

  await page.getByLabel("必要な機能は何ですか？ 1行に1つ").fill("");

  await expect(page.getByRole("heading", { name: "insufficient: 必須項目が不足" })).toBeVisible();
  await expect(page.getByText("主要機能を2件以上")).toBeVisible();
});

test("成功サンプルを適用すると全ゲート成功と3ブラウザE2E成功と証跡が表示される", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "成功サンプルを適用" }).click();

  await expect(page.getByText("ready: 必要証跡が揃っています")).toBeVisible();
  await expect(page.getByLabel("lint 成功")).toBeVisible();
  await expect(page.getByLabel("doctor:aidd 成功")).toBeVisible();
  await expect(page.getByText("Chromium: 成功")).toBeVisible();
  await expect(page.getByText("Firefox: 成功")).toBeVisible();
  await expect(page.getByText("WebKit: 成功")).toBeVisible();
  await expect(page.getByLabel("terminal evidence").getByText("experiments/aidd-control-plane-mvp-006/artifacts/terminal/e2e.txt")).toBeVisible();
  await expect(page.getByLabel("screenshot evidence").getByText("assets/aidd-control-plane-mvp006-ready.png")).toBeVisible();
});

test("失敗サンプルを適用するとe2eまたはdoctor:aiddが失敗しreadyではない", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "失敗サンプルを適用" }).click();

  await expect(page.getByText("not ready: failure stateがあります")).toBeVisible();
  await expect(page.getByLabel("e2e 失敗")).toBeVisible();
  await expect(page.getByLabel("doctor:aidd 失敗")).toBeVisible();
  await expect(page.getByText("WebKit: 失敗")).toBeVisible();
});

test("証跡不足サンプルを適用するとコマンド成功後もreadyではない", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "証跡不足サンプルを適用" }).click();

  await expect(page.getByText("not ready: failure stateがあります")).toBeVisible();
  await expect(page.getByLabel("e2e 証跡不足")).toBeVisible();
  await expect(page.getByText("evidence file").first()).toBeVisible();
  await expect(page.getByText("未登録").first()).toBeVisible();
  await expect(page.getByLabel("terminal evidence").getByText("terminal evidence不足", { exact: true })).toBeVisible();
});

async function fillSampleApp(page: import("@playwright/test").Page) {
  await applyLearningTemplate(page);
  await page.getByRole("button", { name: "成功サンプルを適用" }).click();
  await page.getByLabel("何を作りたいですか？").fill("StudyFlow");
  await page.getByLabel("誰のどんな問題を解決しますか？ 対象ユーザー").fill("学習を継続したい社会人");
  await page.getByLabel("解決したい問題").fill("教材が散らばり、今日やることを決められない");
}

async function applyLearningTemplate(page: import("@playwright/test").Page) {
  await page.getByLabel(/学習支援/).check();
  await page.getByRole("button", { name: "テンプレートを適用" }).click();
}
