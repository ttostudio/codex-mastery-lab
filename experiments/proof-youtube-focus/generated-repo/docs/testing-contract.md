# StudyStream testing contract

## ローカルゲート

以下を完了条件の検証コマンドにする。

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

## mock backend contract

各serviceは `/health`, `/state`, `/__control/state` を持つ。

| service | port | state |
| --- | ---: | --- |
| mock-api | 4010 | `online`, `offline`, `timeout` |
| mock-media | 4020 | `normal`, `slow`, `not_found`, `failure`, `interrupted` |
| mock-auth | 4030 | `anonymous`, `logged_in`, `premium`, `session_expired` |
| mock-billing | 4040 | `free`, `premium`, `payment_failed` |

`pnpm run mock:start` はDocker Composeを優先し、失敗またはDocker未使用時はNode fallbackで4 serviceを起動する。`pnpm run mock:doctor` はNode fallback経路でhealth/state/controlを検証する。

## E2Eで確認すること

- ホームから動画詳細へ移動できる。
- 検索結果の空状態を表示できる。
- mock-mediaの失敗状態を動画詳細で表示できる。
- mock-apiのoffline/timeoutをUIへ表示できる。
- auth anonymous/premium/session_expired と billing payment_failed をUIへ表示できる。
- 保存、集中キュー、学習履歴削除がlocalStorage経由で操作できる。
- 主要ページでaxeの重大なアクセシビリティ違反がない。

## Playwright安定化

PlaywrightはChromium、Firefox、WebKitを対象にする。Firefoxを外さず、3ブラウザ連続実行では `timeout: 120_000` と `expect: { timeout: 90_000 }`、`workers: 1`、ローカル `retries: 1` で安定化する。
