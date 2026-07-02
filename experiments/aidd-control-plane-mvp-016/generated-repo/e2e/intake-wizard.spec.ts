import { expect, test } from "@playwright/test";

const mockCiServiceUrl = process.env.NEXT_PUBLIC_MOCK_CI_SERVICE_URL ?? "http://127.0.0.1:4314";

test.beforeEach(async ({ request }) => {
  await request.post(`${mockCiServiceUrl}/__control/state`, { data: { scenario: "empty" } });
});

test("MVP 016の初期empty stateとworkflow artifact監査が表示される", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "CI workflowとartifact保存を静的監査し、証跡不足を次回依頼へ戻すSaaS" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "CI Workflow Artifact Auditor: empty" })).toBeVisible();
  await expect(page.getByText("不足項目: 19件")).toBeVisible();
  await expect(page.getByText("gate未設定")).toBeVisible();
  await expect(page.getByText("artifact path未設定")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Review Finding", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "AI Task Packet Delta", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "AIDD-Spec更新候補", exact: true })).toBeVisible();
  await expect(page.getByText("Docker Compose経路").first()).toBeVisible();
  await expect(page.getByText("Node fallback経路").first()).toBeVisible();
  await expect(page.getByText("同一contract").first()).toBeVisible();
  await expect(page.getByText("mock service接続中")).toBeVisible();
  await expect(page.getByRole("heading", { name: "empty: 入力待ち" })).toBeVisible();
  await expect(page.getByText("readiness score: 0").first()).toBeVisible();
  await expect(page.getByText("テンプレート未選択").first()).toBeVisible();
  await expect(page.getByText("アプリ名")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Verification Run Tracker" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Review & Learning Log" })).toBeVisible();
  await expect(page.getByText("review fail: 次回依頼へ戻す項目があります")).toBeVisible();
  await expect(page.getByText("Next AI Task Packet Delta")).toBeVisible();
  await expect(page.getByText("not ready: failure stateがあります")).toBeVisible();
  await expect(page.getByLabel("lint 未実行")).toBeVisible();
  await expect(page.getByLabel("terminal evidence", { exact: true }).getByText("terminal evidence不足", { exact: true })).toBeVisible();
  await expect(page.getByLabel("screenshot evidence", { exact: true }).getByText("screenshot evidence不足", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Artifact Evidence Binder: empty" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "CI Artifact Importer: empty" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Evidence Gap Repair Planner: empty" })).toBeVisible();
  await expect(page.getByText("不足証跡: 7件")).toBeVisible();
  await expect(page.getByLabel("Artifact Evidence Binder issues").getByText("Artifact Evidence Binder: CI run URLが壊れています")).toBeVisible();
  await expect(page.getByRole("button", { name: "emptyサンプルを適用" })).toBeVisible();
});

test("CI Workflow Artifact Auditorでvalidとfailureを切り替え、不足artifactを次回依頼へ変換できる", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "auditor valid" }).click();
  await expect(page.getByRole("heading", { name: "CI Workflow Artifact Auditor: valid" })).toBeVisible();
  await expect(page.getByText("workflow artifact監査はvalidです")).toBeVisible();
  await expect(page.getByText("pnpm install --frozen-lockfile", { exact: true })).toBeVisible();
  await expect(page.getByText("pnpm run mock:doctor", { exact: true })).toBeVisible();
  await expect(page.getByText("experiments/aidd-control-plane-mvp-016/artifacts/terminal", { exact: true })).toBeVisible();
  await expect(page.getByText("coverage / playwright-report / test-results / experiments terminal evidence相当")).toBeVisible();

  await page.getByRole("button", { name: "auditor failure" }).click();
  await expect(page.getByRole("heading", { name: "CI Workflow Artifact Auditor: failure" })).toBeVisible();
  await expect(page.getByText("pnpm run doctor:aidd gateがworkflowから不足").first()).toBeVisible();
  await expect(page.getByText("playwright-report artifact保存が不足").first()).toBeVisible();
  await expect(page.getByText("test-results artifact保存が不足").first()).toBeVisible();
  await expect(page.getByText("actions/upload-artifact", { exact: false }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "AIDD-Spec更新候補", exact: true })).toBeVisible();
  await expect(page.getByText("Screen Inventory").first()).toBeVisible();
});

test("fixture駆動Mock CI Serviceでvalid failure timeoutを切り替えられる", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /Mock CI Service: empty/ })).toBeVisible();
  await page.getByRole("button", { name: "証跡が揃った状態" }).click();
  await expect(page.getByRole("heading", { name: /valid: 必須CI証跡が揃っています/ })).toBeVisible();
  await expect(page.getByText("15015").first()).toBeVisible();
  await page.getByRole("button", { name: "証跡不足", exact: true }).click();
  await expect(page.getByRole("heading", { name: /failure: CI証跡不足/ })).toBeVisible();
  await expect(page.getByText("commit SHAも短すぎます")).toBeVisible();
  await page.getByRole("button", { name: "取得タイムアウト" }).click();
  await expect(page.getByRole("heading", { name: /timeout: CI取得タイムアウト/ })).toBeVisible();
  await expect(page.getByText("手動Artifact Evidence Binderへterminal evidence")).toBeVisible();
});

test("E2Eからmock CI serviceのcontrol endpointを叩いてUI反映を確認する", async ({ page, request }) => {
  await request.post(`${mockCiServiceUrl}/__control/state`, { data: { scenario: "rate_limit" } });
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /Mock CI Service: rate_limit: CI API制限中/ })).toBeVisible();
  await expect(page.getByLabel("rate_limit対応").getByText("60秒待機してからCI APIを再取得します。")).toBeVisible();
  await expect(page.getByLabel("rate_limit対応").getByText("actions:read", { exact: true })).toBeVisible();
  await expect(page.getByLabel("rate_limit対応").getByText("contents:read", { exact: true })).toBeVisible();
  await expect(page.getByLabel("rate_limit対応").getByText("terminal-evidence", { exact: true })).toBeVisible();
  await expect(page.getByLabel("rate_limit対応").getByText("次回AI Task Packet Delta")).toBeVisible();

  await request.post(`${mockCiServiceUrl}/__control/state`, { data: { scenario: "valid" } });
  await page.reload();
  await expect(page.getByRole("heading", { name: /Mock CI Service: valid: 必須CI証跡が揃っています/ })).toBeVisible();
  await expect(page.getByText("mock:doctor: 成功")).toBeVisible();
});

test("テンプレートを選択して未適用failure stateを表示できる", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("radio", { name: /学習支援/ }).check({ force: true });

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

test("validサンプルを適用すると全ゲート成功と3ブラウザE2E成功と証跡が表示される", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "validサンプルを適用" }).click();

  await expect(page.getByText("ready: 必要証跡が揃っています")).toBeVisible();
  await expect(page.getByText("review pass: 次回改善案を確認できます")).toBeVisible();
  await expect(page.getByText("review score: 100")).toBeVisible();
  await expect(page.getByLabel("lint 成功")).toBeVisible();
  await expect(page.getByLabel("doctor:aidd 成功")).toBeVisible();
  await expect(page.getByText("Chromium: 成功")).toBeVisible();
  await expect(page.getByText("Firefox: 成功")).toBeVisible();
  await expect(page.getByText("WebKit: 成功")).toBeVisible();
  await expect(page.getByLabel("terminal evidence").getByText("experiments/aidd-control-plane-mvp-006/artifacts/terminal/e2e.txt")).toBeVisible();
  await expect(page.getByLabel("screenshot evidence").getByText("assets/aidd-control-plane-mvp011-valid.png")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Evidence Gap Repair Planner: valid" })).toBeVisible();
  await expect(page.getByText("不足証跡: 0件")).toBeVisible();
  await expect(page.getByText("Evidence Gap Repair Plannerは不足0件です")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Artifact Evidence Binder: valid" })).toBeVisible();
  await expect(page.getByText("Artifact Evidence Binderはvalidです")).toBeVisible();
  await expect(page.getByLabel("binder ci links").getByText("https://github.local/aidd-lab/aidd-control-plane/actions/runs/9010", { exact: true })).toBeVisible();
  await expect(page.getByLabel("binder ci links").getByText("https://reports.local/aidd-control-plane-mvp-010/playwright/index.html", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "CI Artifact Importer: valid" })).toBeVisible();
  await expect(page.getByLabel("CI Artifact Importer summary").getByText("9f4c2d1a8b7e6c5d4a3b2c1d0e9f8a7b6c5d4e3f")).toBeVisible();
  await expect(page.getByRole("heading", { name: "GitHub Actions Artifact Fetch Plan: valid" })).toBeVisible();
  await expect(page.getByLabel("GitHub Actions Artifact Fetch Plan summary").getByText("9010", { exact: true })).toBeVisible();
  await expect(page.getByText("actions:read", { exact: true })).toBeVisible();
  await expect(page.getByText("playwright-report", { exact: true }).first()).toBeVisible();
});

test("failureサンプルを適用すると壊れたURLと古いログをReview Findingへ戻す", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "failureサンプルを適用" }).click();

  await expect(page.getByText("not ready: failure stateがあります")).toBeVisible();
  await expect(page.getByText("review fail: 次回依頼へ戻す項目があります")).toBeVisible();
  await expect(page.getByLabel("Next AI Task Packet Delta").getByText("次回のCodex Prompt Delta")).toBeVisible();
  await expect(page.getByLabel("e2e 失敗")).toBeVisible();
  await expect(page.getByLabel("doctor:aidd 失敗")).toBeVisible();
  await expect(page.getByText("WebKit: 失敗")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Artifact Evidence Binder: failure" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Evidence Gap Repair Planner: failure" })).toBeVisible();
  await expect(page.getByText(/不足証跡: [4-9]件/)).toBeVisible();
  await expect(page.getByLabel("Evidence Gap Repair Planner repairs").getByText("playwright-report不足", { exact: false })).toBeVisible();
  await expect(page.getByLabel("Evidence Gap Repair Planner repairs").getByText("影響するAIDD-Spec artifact: Verification Evidence / Browser E2E Report")).toBeVisible();
  await expect(page.getByLabel("Evidence Gap Repair Planner repairs").getByText("再実行コマンド: pnpm run test:e2e").first()).toBeVisible();
  await expect(page.getByLabel("Evidence Gap Repair Planner repairs").getByText("Codex prompt delta:", { exact: false }).first()).toBeVisible();
  await expect(page.getByLabel("Artifact Evidence Binder issues").getByText("Artifact Evidence Binder: CI run URLが壊れています")).toBeVisible();
  await expect(page.getByLabel("Artifact Evidence Binder issues").getByText("Artifact Evidence Binder: CI artifact URLが不足または壊れています")).toBeVisible();
  await expect(page.getByLabel("Artifact Evidence Binder issues").getByText("Artifact Evidence Binder: terminal evidenceが古いログです")).toBeVisible();
  await expect(page.getByLabel("Artifact Evidence Binder issues").getByText("CI Artifact Importer: commit SHAが短すぎます")).toBeVisible();
  await expect(page.getByLabel("Artifact Evidence Binder issues").getByText("GitHub Actions Fetch Plan: run idが未抽出です")).toBeVisible();
  await expect(page.getByLabel("Artifact Evidence Binder issues").getByText("GitHub Actions Fetch Plan: actions:read token scopeが不足しています")).toBeVisible();
  await expect(page.getByRole("heading", { name: "GitHub Actions Artifact Fetch Plan: failure" })).toBeVisible();
  await expect(page.getByLabel("Artifact Evidence Binder issues").getByText("CI Artifact Importer: test jobが失敗")).toBeVisible();
  await expect(page.getByLabel("Next AI Task Packet Delta").getByText("commit SHA", { exact: false }).first()).toBeVisible();
});

test("証跡不足サンプルを適用するとコマンド成功後もreadyではない", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "証跡不足サンプルを適用" }).click({ force: true });

  await expect(page.getByText("not ready: failure stateがあります")).toBeVisible();
  await expect(page.getByLabel("e2e 証跡不足")).toBeVisible();
  await expect(page.getByText("evidence file").first()).toBeVisible();
  await expect(page.getByText("未登録").first()).toBeVisible();
  await expect(page.getByLabel("terminal evidence", { exact: true }).getByText("terminal evidence不足", { exact: true })).toBeVisible();
});

async function fillSampleApp(page: import("@playwright/test").Page) {
  await applyLearningTemplate(page);
  await page.getByRole("button", { name: "validサンプルを適用" }).click();
  await page.getByLabel("何を作りたいですか？").fill("StudyFlow");
  await page.getByLabel("誰のどんな問題を解決しますか？ 対象ユーザー").fill("学習を継続したい社会人");
  await page.getByLabel("解決したい問題").fill("教材が散らばり、今日やることを決められない");
}

async function applyLearningTemplate(page: import("@playwright/test").Page) {
  await page.getByRole("radio", { name: /学習支援/ }).check({ force: true });
  await page.getByRole("button", { name: "テンプレートを適用" }).click();
}
