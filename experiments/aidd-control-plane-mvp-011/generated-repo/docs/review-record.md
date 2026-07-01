# Review Record

## レビュー対象

- AIDD Control Plane MVP 011: Evidence Gap Repair Planner
- AIDD-Spec v0.1 / standards/aidd-control-plane-mvp-v0.1.md

## 判定基準

- Product Brief、AI Task Packet、Verification Plan、Codex Prompt、Readiness ReviewがUIで確認できる。
- Verification Run Tracker、Artifact Evidence Binder、CI Artifact Importer、GitHub Actions Artifact Fetch PlanがUIで確認できる。
- Evidence Gap Repair Plannerがcoverage / playwright-report / test-results / terminal-evidence / empty screenshot / valid screenshot / failure screenshotを評価できる。
- valid sampleでは不足0件になる。
- failure sampleでは複数不足を決定的に表示する。
- 不足ごとに重要度、影響するAIDD-Spec artifact、修正指示、再実行コマンド、Codex prompt deltaが表示される。
- Review Finding、Learning Log、Next AI Task Packet Deltaへ不足証跡の修理指示が戻る。
- Verification Evidence、Review Record、Learning LogがAIDD-Spec v0.1接続として生成物に含まれる。
- 実装が外部通信とブラウザ保存領域に依存しない。

## 現時点のレビュー

- Status: 実装後にローカルゲートで確認する。
- Remaining risk: CI URLはサンプル文字列であり、実CIの到達確認は次MVP以降で扱う。
- Human review question: 初見ユーザーがArtifact Evidence Binderの不足とEvidence Gap Repair Plannerの修理指示の違いを理解できるか。

## MVP 011追加

- Evidence Gap Repair Plannerを`src/lib/intake.ts`に追加する。
- 必須証跡7種を評価し、valid sampleは不足0件、failure sampleは複数不足を返す。
- 不足ごとに重要度、影響するAIDD-Spec artifact、修正指示、再実行コマンド、Codex prompt deltaを返す。
- Review Finding / Learning Log / Next AI Task Packet Deltaへ修理指示を反映する。
- `scripts/capture-mvp011.mjs`でempty / valid / failure / terminal evidence画像を保存する。
