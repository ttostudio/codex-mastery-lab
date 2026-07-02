# Verification Plan

対象はAIDD-Spec v0.1とstandards/aidd-control-plane-mvp-v0.1.mdに接続するAIDD Control Plane MVP 014: 独立Mock CI Service契約。

## 静的ゲート

- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run doctor:aidd`
- `pnpm run mock:doctor`

## E2Eゲート

- `pnpm run test:e2e`
- PlaywrightはChromium / Firefox / WebKitを対象にする。
- E2EはMock CI Serviceの`/__control/state`へPOSTし、`empty / valid / failure / timeout / rate_limit`を決定的に切り替える。

## Mock CI Service契約

- `mocks/ci-service/server.mjs`はNode標準モジュールのみで動く。
- `/health`はservice名、version、現在scenarioを返す。
- `/state`は現在scenarioとCI証跡payloadを返す。
- `/__control/state`はE2Eとcapture scriptからscenarioを変更できる。
- CORS headerを返し、UIから直接参照できる。

## UI検証観点

- 初期`empty`でCI run URL未入力と不足証跡が表示される。
- `valid`で必須CI証跡、jobs、artifacts、Review Record、Learning Logが揃う。
- `failure`で不足artifact、短いcommit SHA、失敗jobをEvidence Gap Repair Plannerへ戻す。
- `timeout`で手動Evidence Binder fallbackとterminal evidence添付方針を表示する。
- `rate_limit`で60秒待機、`actions:read / contents:read`、手動証跡添付、次回AI Task Packet Deltaを表示する。

## 必須証跡

- terminal evidence
- empty screenshot
- valid screenshot
- failure screenshot
- timeout screenshot
- rate_limit screenshot
- Playwright 3ブラウザE2Eログ
- mock:doctorログ

## Capture

`pnpm run capture:mvp014`で次の画像を保存する。

- `aidd-control-plane-mvp014-empty.png`
- `aidd-control-plane-mvp014-valid.png`
- `aidd-control-plane-mvp014-failure.png`
- `aidd-control-plane-mvp014-timeout.png`
- `aidd-control-plane-mvp014-rate_limit.png`
- `aidd-control-plane-mvp014-terminal-evidence.png`
