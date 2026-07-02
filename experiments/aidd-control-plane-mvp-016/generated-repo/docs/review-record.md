# Review Record

## MVP 016レビュー追加

- 対象: AIDD Control Plane MVP 016 CI Workflow Artifact Auditor
- workflow: `.github/workflows/aidd-control-plane.yml`
- required gates: `pnpm install --frozen-lockfile` / `pnpm run lint` / `pnpm run typecheck` / `pnpm run test` / `pnpm run build` / `pnpm run doctor:aidd` / `pnpm run mock:doctor` / `pnpm run test:e2e`
- artifact paths: `coverage` / `playwright-report` / `test-results` / `experiments/aidd-control-plane-mvp-016/artifacts/terminal`
- AIDD-Spec接続: Verification Evidence / Review Record / Learning Log / AI Task Packet Delta / AIDD-Spec更新候補
- failureでは不足artifactをReview Findingへ登録し、AI Task Packet DeltaとAIDD-Spec更新候補に戻す。
- `capture:mvp016`でempty / valid / failure / terminal evidenceの画面証跡を保存する。

## レビュー対象

- AIDD Control Plane MVP 015: fixture駆動Mock CI Service契約
- AIDD-Spec v0.1 / standards/aidd-control-plane-mvp-v0.1.md

## 判定基準

- UIが`NEXT_PUBLIC_MOCK_CI_SERVICE_URL`または`http://127.0.0.1:4314`の`/state`からCI証跡状態を取得する。
- `mocks/ci-service/fixtures/*.json`がempty / valid / failure / timeout / rate_limitの状態データを持つ。
- `mocks/ci-service/server.mjs`が`/health`、`/state`、`/__control/state`を提供する。
- Docker Compose経路とNode fallback経路が同一contractを返す。
- E2Eが`/__control/state`を叩いて`empty / valid / failure / timeout / rate_limit`を切り替える。
- `rate_limit`で待機時間、token scope見直し、手動証跡添付、次回AI Task Packet Deltaを表示する。
- `mock:start`、`mock:stop`、`mock:doctor`がPID管理と実HTTP検査を満たす。
- `doctor:aidd`がMVP 015表記、fixture、Docker Compose、docs、capture画像、AIDD-Spec接続、rate_limit文言を検査する。
- Chromium / Firefox / WebKitの3ブラウザE2Eが通る。
- capture scriptが記事用のempty、valid、failure、timeout、rate_limit、terminal evidence画像を生成する。

## 最終レビュー結果

- Status: pass
- `pnpm run lint`: pass
- `pnpm run typecheck`: pass
- `pnpm run test`: pass（22 tests）
- `pnpm run build`: pass
- `pnpm run doctor:aidd`: pass
- `pnpm run mock:doctor`: pass
- `pnpm run test:e2e`: pass（30 tests、Chromium / Firefox / WebKit）

## 修正した失敗

- 初期ログではlintが未使用importとNode globalsで失敗していたが、再実行時点では解消済み。
- buildは初期ログで途中終了していたため、再実行してNext.js production build成功を確認した。
- doctor:aiddは古いMVP番号とcapture script名を参照していたが、MVP 015契約へ更新済み。
- mock:doctorは既存Mock CI Serviceが`rate_limit`状態のままだと初期`empty`契約に失敗したため、`mock:stop`後に再実行してpassを確認した。

## Remaining risk

- 実GitHub API通信、token保存、artifact zip実ダウンロードは非ゴール。
- Dockerデーモン自体の起動可否はローカル環境依存のため、doctor:aiddではCompose定義を静的検査し、mock:doctorでNode fallbackのHTTP contractを検査する。

## AIDD-Spec接続

- Verification Evidence: terminal/e2e/mock doctor/screenshot証跡を保存する。
- Review Record: fixture駆動、Docker Compose経路、Node fallback経路、同一contract、CI証跡不足と修正指示を記録する。
- Learning Log: fixture分離と起動経路の選択で何が改善したかを残す。
- AI Task Packet: rate_limit、timeout、不足artifactを次回依頼のdeltaへ戻す。
