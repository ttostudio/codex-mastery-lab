# DrillSwipe testing contract

## コマンド

- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run test:coverage`
- `pnpm run build`
- `pnpm run doctor:playwright`
- `pnpm run mock:doctor`
- `pnpm run test:e2e`

## Mock backend contract

各サービスは `/health`, `/state`, `/__control/state` を持つ。

| service | port | state |
| --- | ---: | --- |
| mock-api | 4110 | `{ "mode": "online" | "offline" | "timeout" }` |
| mock-media | 4111 | `{ "media": "ok" | "failed" }` |
| mock-auth | 4112 | `{ "auth": "anonymous" | "premium" }` |
| mock-billing | 4113 | `{ "billing": "ok" | "failed" }` |

`mock:start` は Docker Compose を優先し、使えない場合は Node fallback で4サービスを起動する。`mock:doctor` は起動、health確認、停止を行う。

## E2E coverage

`e2e/drillswipe.spec.ts` は Chromium / Firefox / WebKit で実行する。

- フィード遷移
- 保存
- 復習キュー追加/解除
- 正解/不正解
- 視聴履歴削除
- media failure
- auth anonymous / premium
- billing failed
- offline / timeout
- axe による重大アクセシビリティ違反確認
