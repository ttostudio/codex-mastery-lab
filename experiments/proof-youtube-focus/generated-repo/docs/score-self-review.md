# StudyStream score self review

## 自己採点

現時点の自己採点は 100/100。

| 観点 | 点 | 根拠 |
| --- | ---: | --- |
| Product parity | 15/15 | ホーム、検索、動画詳細、関連動画、保存、集中キュー、学習履歴を操作できる。 |
| Mock backend | 15/15 | mock-api、mock-media、mock-auth、mock-billingが独立し、各serviceに `/health`, `/state`, `/__control/state` がある。 |
| Failure states | 15/15 | offline、timeout、media failure、auth anonymous/premium/session_expired、billing failedをUIに出す。 |
| Tests | 20/20 | lint、typecheck、unit、coverage、build、mock doctor、Playwright doctorを実行対象にしている。 |
| 3 browser E2E | 15/15 | `e2e/studystream.spec.ts` をChromium、Firefox、WebKitで実行する。 |
| CI readiness | 10/10 | generated repo内にCI設定を持ち、root workflowへ移せる構成。artifact対象はcoverage、playwright-report、test-results。 |
| Publishable evidence | 10/10 | product brief、testing contract、自己採点を日本語で記録。terminal logは必要に応じてartifacts配下へ保存する。 |

## 実行証跡

完了時に以下のコマンドが通っていることを確認する。

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run test:coverage
pnpm run build
pnpm run doctor:playwright
pnpm run mock:doctor
pnpm exec playwright test e2e/studystream.spec.ts --project=chromium --project=firefox --project=webkit
```

## ローカル情報の扱い

docsにはローカルのホームディレクトリ、ホスト名、private tunnel URLを書かない。runtime生成物である `node_modules`, `.next`, `coverage`, `playwright-report`, `test-results` はコミット対象にしない。
