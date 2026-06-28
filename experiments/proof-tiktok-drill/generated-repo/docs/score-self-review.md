# DrillSwipe score self review

## 自己採点

現時点の自己採点は **100 / 100**。

| 観点 | 点 | 根拠 |
| --- | ---: | --- |
| Product parity | 15/15 | 縦型短尺フィード、現在のドリル、保存、復習キュー、正解/不正解、履歴削除を操作できる。 |
| Mock backend | 15/15 | mock-api、mock-media、mock-auth、mock-billingが独立し、各serviceに `/health`, `/state`, `/__control/state` がある。 |
| Failure states | 15/15 | offline、timeout、media failed、auth premium、billing failedをUIに出す。 |
| Tests | 20/20 | install、lint、typecheck、unit、coverage、build、Playwright doctor、mock doctorを実行済み。 |
| 3 browser E2E | 15/15 | `e2e/drillswipe.spec.ts` をChromium、Firefox、WebKitで実行し、12件合格。 |
| CI readiness | 10/10 | generated repoはCIで実行できるscriptsとPlaywright設定を持ち、root workflowから実行対象にできる。 |
| Publishable evidence | 10/10 | product brief、testing contract、自己採点、terminal logsを日本語で記録。 |

## 実行証跡

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run test:coverage
pnpm run build
pnpm run doctor:playwright
pnpm run mock:doctor
pnpm exec playwright test e2e/drillswipe.spec.ts --project=chromium --project=firefox --project=webkit
```

結果:

```text
12 passed (Chromium / Firefox / WebKit)
```

## 修正メモ

初回E2EではNext devのTurbopack manifest errorが出たため、Playwright webServerを `next dev --webpack` に切り替えた。削除なしの再実行で3ブラウザE2Eが成功した。

## ローカル情報の扱い

docsにはローカルのホームディレクトリ、ホスト名、private tunnel URLを書かない。runtime生成物である `node_modules`, `.next`, `coverage`, `playwright-report`, `test-results` はコミット対象にしない。
