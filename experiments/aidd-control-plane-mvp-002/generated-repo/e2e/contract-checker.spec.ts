import { expect, test } from "@playwright/test";

test("サンプル入力で全体statusが合格になる", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Contract Checker Dashboard" })).toBeVisible();
  await expect(page.getByLabel("AI Task Packet JSON")).toBeVisible();
  await page.getByRole("button", { name: "サンプルを入れる" }).click();

  await expect(page.getByTestId("overall-status")).toHaveText("合格");
  await expect(page.getByText("不足pathはありません。")).toBeVisible();
  await expect(page.getByText("JSON形式エラーはありません。")).toBeVisible();
});

test("必須項目を削るとmissing_requiredとpathが表示される", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "必須項目を1つ削って失敗を見る" }).click();

  await expect(page.getByTestId("overall-status")).toHaveText("missing_required");
  await expect(page.getByTestId("missing-paths")).toContainText("AI Task Packet.product_brief.user_problem");
  await expect(page.getByText("AI Task Packet: product_brief.user_problem を追加してください。")).toBeVisible();
});

test("壊れたJSONでinvalid_json stateが表示される", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "JSONを壊してinvalid_jsonを見る" }).click();

  await expect(page.getByTestId("overall-status")).toHaveText("invalid_json");
  await expect(page.getByTestId("json-errors")).toContainText("AI Task Packet");
  await expect(page.getByTestId("json-errors")).toContainText("JSONの形式が正しくありません");
});
