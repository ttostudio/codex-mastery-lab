# Learning Log

対象はAIDD-Spec v0.1とstandards/aidd-control-plane-mvp-v0.1.mdに接続するAIDD Control Plane MVP 014: 独立Mock CI Service契約。

## 期待する学び

- UI内サンプルだけではなく、独立Mock CI Serviceの`/state`を読むことでE2Eの状態制御が再現可能になるか。
- `/__control/state`をE2Eから叩くと、empty / valid / failure / timeout / rate_limitの画面反映を決定的に検証できるか。
- rate_limitを待機時間、token scope見直し、手動証跡添付、次回AI Task Packet Deltaへ分解すると、CI API制限時の再依頼が明確になるか。

## 実装メモ

- `mocks/ci-service/server.mjs`はNode標準モジュールのみで実装する。
- `mock:start`は`.mock/ci-service.pid`を作り、`mock:stop`でPIDを止める。
- `mock:doctor`はサービスを一時起動し、`/health`、`/state`、`/__control/state`を実HTTPで検査する。
- UIは`NEXT_PUBLIC_MOCK_CI_SERVICE_URL`または`http://127.0.0.1:4314`から状態を取得する。
- 取得失敗時は手動Evidence Binder fallbackを表示し、terminal evidenceとscreenshot evidenceの添付を促す。
- PlaywrightはChromium / Firefox / WebKitの3ブラウザ対象を維持し、`timeout: 120_000`、`expect: { timeout: 90_000 }`、`workers: 1`で安定化する。
- doctor:aiddでMVP 014表記、mock service契約、mock scripts、capture:mvp014、docs、rate_limit文言を検査する。
- Verification Run Tracker、Artifact Evidence Binder、CI Artifact Importer、GitHub Actions Artifact Fetch Plan、Verification Evidence、Review Record、Learning LogはAIDD-Spec v0.1接続として扱う。

## 次回改善候補

- Docker Compose経路を追加し、Node fallbackと同じcontractを共有する。
- mock serviceのstate fixtureをファイル化し、E2Eとdocsで同じfixtureを参照する。
- artifactのファイル存在確認をmock serviceへ追加する。
- 手動Evidence Binder fallbackをユーザー入力で編集できるようにする。
- CIで`coverage`、`playwright-report`、`test-results`、`terminal-evidence`をartifact保存するworkflow検査を追加する。
