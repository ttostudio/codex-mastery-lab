# Review Record

## レビュー対象

- AIDD Control Plane MVP 014: 独立Mock CI Service契約
- AIDD-Spec v0.1 / standards/aidd-control-plane-mvp-v0.1.md

## 判定基準

- UIが`NEXT_PUBLIC_MOCK_CI_SERVICE_URL`または`http://127.0.0.1:4314`の`/state`からCI証跡状態を取得する。
- `mocks/ci-service/server.mjs`が`/health`、`/state`、`/__control/state`を提供する。
- E2Eが`/__control/state`を叩いて`empty / valid / failure / timeout / rate_limit`を切り替える。
- `rate_limit`で待機時間、token scope見直し、手動証跡添付、次回AI Task Packet Deltaを表示する。
- `mock:start`、`mock:stop`、`mock:doctor`がPID管理と実HTTP検査を満たす。
- `doctor:aidd`がMVP 014表記、mock service契約、capture script、docs、rate_limit文言を検査する。
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
- doctor:aiddは古いMVP番号とcapture script名を参照していたが、MVP 014契約へ更新済み。
- mock:doctorは既存Mock CI Serviceが`rate_limit`状態のままだと初期`empty`契約に失敗したため、`mock:stop`後に再実行してpassを確認した。

## Remaining risk

- Docker Compose経路は未実装で、Node fallbackのみ。
- 実GitHub API通信、token保存、artifact zip実ダウンロードは非ゴール。
- mock serviceのfixtureはまだファイル分離されていない。

## AIDD-Spec接続

- Verification Evidence: terminal/e2e/mock doctor/screenshot証跡を保存する。
- Review Record: CI証跡不足と修正指示を記録する。
- Learning Log: 独立Mock CI Service契約で何が改善したかを残す。
- AI Task Packet: rate_limit、timeout、不足artifactを次回依頼のdeltaへ戻す。
