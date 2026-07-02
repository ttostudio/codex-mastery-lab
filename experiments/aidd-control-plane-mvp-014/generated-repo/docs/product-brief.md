# Product Brief: AIDD Control Plane MVP 014

## 目的

AIDD Control PlaneのMock CI Evidence Connectorを、UI内のサンプル切替ではなく独立Mock CI Service契約へ切り出す。Node fallbackの`mocks/ci-service/server.mjs`が`/health`、`/state`、`/__control/state`を提供し、E2Eからempty / valid / failure / timeout / rate_limitを制御してUI反映を検証できる状態にする。

## 対象ユーザー

- Codexへ再依頼する前にCI証跡の状態を再現したい開発者
- AIDD-Spec v0.1のVerification Evidence / Review Record / Learning Logへmock service契約の証跡を残したいリードエンジニア
- CI APIのtimeoutやrate_limitを、手動証跡添付と次回AI Task Packet Deltaへ戻したいAI駆動開発チーム

## 主要フロー

1. `pnpm run mock:start`で独立Mock CI Serviceを起動し、PIDファイルを保存する。
2. UIが`NEXT_PUBLIC_MOCK_CI_SERVICE_URL`または`http://127.0.0.1:4314`の`/state`から状態を取得する。
3. 取得失敗時は手動Evidence Binder fallbackを表示し、terminal evidenceとscreenshot evidenceの添付方針を示す。
4. E2Eが`/__control/state`へPOST JSONを送り、empty / valid / failure / timeout / rate_limitを切り替える。
5. UIが各scenarioを日本語で表示し、jobs API結果、artifacts API結果、修正指示、Codex prompt deltaを表示する。
6. rate_limitでは待機時間、token scope見直し、手動証跡添付、次回AI Task Packet Deltaを明示する。
7. `pnpm run mock:doctor`が一時起動したserviceに実HTTPで`/health`、`/state`、`/__control/state`を検査する。
8. `pnpm run doctor:aidd`がMVP 014契約、mock scripts、capture:mvp014、docs、rate_limit文言を検査する。

## 非ゴール

- GitHub APIの実通信
- GitHub token保存
- artifact zipの実ダウンロード
- Docker Compose経路の追加
- ブラウザ保存領域への永続化

## 成功条件

- `package.json`のnameと画面表記がaidd-control-plane-mvp-014 / MVP 014になっている。
- `mocks/ci-service/server.mjs`が外部重依存なしで`/health`、`/state`、`/__control/state`、CORSを提供する。
- `mock:start`、`mock:stop`、`mock:doctor`がPID管理と実HTTP検査を満たす。
- Playwright 3ブラウザ設定を維持し、E2Eから`/__control/state`を叩いてUI反映を確認する。
- `capture:mvp014`がempty / valid / failure / timeout / rate_limit / terminal evidenceのスクリーンショットを`experiments/aidd-control-plane-mvp-014/artifacts/screenshots`へ保存できる。
- Verification Evidence、Review Record、Learning Log、Next AI Task Packet DeltaがAIDD-Spec v0.1接続として説明される。
