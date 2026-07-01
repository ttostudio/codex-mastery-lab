# Learning Log

対象はAIDD-Spec v0.1とstandards/aidd-control-plane-mvp-v0.1.mdに接続するAIDD Control Plane MVP 011: Evidence Gap Repair Planner。

## 期待する学び

- Verification Evidenceの不足を単なるエラー一覧ではなく、修理可能なNext AI Task Packet Deltaへ変換できるか。
- coverage / playwright-report / test-results / terminal-evidence / empty screenshot / valid screenshot / failure screenshotを必須証跡として扱うと、完了判定が明確になるか。
- GitHub Actions Artifact Fetch Planを維持したまま、Evidence Gap Repair Plannerを追加してもReview RecordとLearning Logの流れが崩れないか。

## 実装メモ

- 永続化は使わず、Reactのローカルstateだけで決定的に動かす。
- 生成処理は`src/lib/intake.ts`の純粋関数に集約する。
- `evaluateEvidenceGapRepairPlan`が不足0件/複数不足を返す。
- Review Findingは不足ごとに重要度、影響するAIDD-Spec artifact、修正指示、再実行コマンドを持つ。
- Learning Logは修理指示をNext AI Task Packet DeltaとCodex prompt deltaへ戻す。
- doctor:aiddでEvidence Gap Repair Planner、必須証跡7種、capture script、docs/tests/E2Eの検査を行う。
- Verification Run Tracker、Artifact Evidence Binder、CI Artifact Importer、GitHub Actions Artifact Fetch Plan、Verification Evidence、Review Record、Learning LogはAIDD-Spec v0.1接続として扱う。

## 次回改善候補

- 実GitHub Actions URLの到達確認をmock backend化する。
- artifactのファイル存在確認を追加する。
- BinderとRepair Plannerをユーザー入力で編集できるようにする。
- Review Recordのfindings入力とLearning Logのspec_updates_needed入力を編集可能にする。
- CIで`coverage`、`playwright-report`、`test-results`、`terminal-evidence`をartifact保存するworkflow検査を追加する。
