# Verification Plan

対象はAIDD-Spec v0.1とstandards/aidd-control-plane-mvp-v0.1.mdに接続するAIDD Control Plane MVP 015: fixture駆動Mock CI Service契約。

## MVP 016 CI Workflow Artifact Auditor

- `.github/workflows/aidd-control-plane.yml`がrepo rootに存在する。
- workflowは`pnpm install --frozen-lockfile`、`pnpm run lint`、`pnpm run typecheck`、`pnpm run test`、`pnpm run build`、`pnpm run doctor:aidd`、`pnpm run mock:doctor`、`pnpm run test:e2e`を実行する。
- CIでは`pnpm exec playwright install --with-deps`を実行する。
- artifact pathsとして`coverage`、`playwright-report`、`test-results`、`experiments/aidd-control-plane-mvp-016/artifacts/terminal`を保存する。
- UIのCI Workflow Artifact Auditorでempty / valid / failureを切り替え、failureでは不足artifactをReview Finding、AI Task Packet Delta、AIDD-Spec更新候補に変換する。
- `doctor:aidd`はworkflow存在、required gates、artifact paths、AIDD-Spec接続、`capture:mvp016`を検査する。
- `pnpm run capture:mvp016`で`aidd-control-plane-mvp016-empty.png`、`aidd-control-plane-mvp016-valid.png`、`aidd-control-plane-mvp016-failure.png`、`aidd-control-plane-mvp016-terminal-evidence.png`を`../artifacts/screenshots/`へ保存する。

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

- `mocks/ci-service/fixtures/*.json`を状態データの単一ソースにする。
- `mocks/ci-service/server.mjs`はNode標準モジュールのみで動き、fixture JSONを読む。
- `/health`はservice名、version、現在scenarioを返す。
- `/state`は現在scenarioとCI証跡payloadを返す。
- `/__control/state`はE2Eとcapture scriptからscenarioを変更できる。
- CORS headerを返し、UIから直接参照できる。
- Docker Compose経路は`docker compose up mock-ci-service`で同じcontractを公開する。
- Node fallback経路は`pnpm run mock:start` / `pnpm run mock:stop` / `pnpm run mock:doctor`で同じcontractを公開する。

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

`pnpm run capture:mvp015`で次の画像を保存する。

- `aidd-control-plane-mvp015-empty.png`
- `aidd-control-plane-mvp015-valid.png`
- `aidd-control-plane-mvp015-failure.png`
- `aidd-control-plane-mvp015-timeout.png`
- `aidd-control-plane-mvp015-rate_limit.png`
- `aidd-control-plane-mvp015-terminal-evidence.png`

## AIDD-Spec接続

- Verification Evidence: lint/typecheck/test/build/e2e/doctor:aidd/mock:doctorとcapture画像を紐づける。
- Review Record: fixture駆動、Docker Compose経路、Node fallback経路、同一contractの検査結果を記録する。
- Learning Log: timeout / rate_limit / 証跡不足の再依頼条件を次回AI Task Packet Deltaへ戻す。
