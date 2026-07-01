# Verification Plan

対象はAIDD-Spec v0.1とstandards/aidd-control-plane-mvp-v0.1.mdに接続するAIDD Control Plane MVP 011: Evidence Gap Repair Planner。

## 静的ゲート

- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run doctor:aidd`

## E2Eゲート

- `pnpm run test:e2e`
- PlaywrightはChromium / Firefox / WebKitを対象にする。

## 単体テスト観点

- empty stateを判定できる。
- valid sampleのEvidence Gap Repair Plannerが不足0件になる。
- failure sampleのEvidence Gap Repair Plannerが複数不足を返す。
- 不足ごとに重要度、影響するAIDD-Spec artifact、修正指示、再実行コマンド、Codex prompt deltaを返す。
- Review Record / Learning Log / Next AI Task Packet Deltaへ不足証跡の修理指示が反映される。
- GitHub Actions Artifact Fetch Planのvalid/failure判定はMVP 010の挙動を維持する。

## E2E観点

- 初期empty stateが表示される。
- Evidence Gap Repair Planner: emptyと不足証跡7件が表示される。
- validサンプルで不足証跡0件が表示される。
- failureサンプルでplaywright-report、test-results、terminal-evidence、empty screenshot、valid screenshot、failure screenshotなど複数不足が表示される。
- 修正指示、再実行コマンド、Codex prompt deltaがReview FindingsとNext AI Task Packet Deltaへ戻る。
- Artifact Evidence Binder、CI Artifact Importer、GitHub Actions Artifact Fetch Planが引き続き表示される。

## AIDD doctor観点

- 必須ファイルとpackage scriptsが存在する。
- `scripts/capture-mvp011.mjs`が存在する。
- UIコピー文字列、状態契約、App Type Templatesが存在する。
- Verification Run Tracker、Artifact Evidence Binder、CI Artifact Importer、GitHub Actions Artifact Fetch Plan、Evidence Gap Repair Plannerの文言が存在する。
- testsとE2E specにempty / valid / failureと不足0件/複数不足の検査が存在する。
- app/srcにブラウザ保存領域や外部通信プリミティブがない。

## 必須証跡

以下をVerification Evidenceとして扱う。

- coverage
- playwright-report
- test-results
- terminal-evidence
- empty screenshot
- valid screenshot
- failure screenshot

## Capture

`scripts/capture-mvp011.mjs`で次の画像を保存する。

- `aidd-control-plane-mvp011-empty.png`
- `aidd-control-plane-mvp011-valid.png`
- `aidd-control-plane-mvp011-failure.png`
- `aidd-control-plane-mvp011-terminal-evidence.png`
