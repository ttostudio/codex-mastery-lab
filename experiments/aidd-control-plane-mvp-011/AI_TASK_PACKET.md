# AI Task Packet: AIDD Control Plane MVP 011

## AIDD-Spec接続

- spec_version: AIDD-Spec v0.1
- control_plane_standard: standards/aidd-control-plane-mvp-v0.1.md
- conformance_target: L2 Lite
- primary_artifacts:
  - Product Brief
  - AI Task Packet
  - Verification Evidence
  - Review Record
  - Learning Log

## Product Brief

AIDD Control Planeに、取得済み/予定中のCI・terminal・screenshot証跡から不足を検出し、次の修正依頼へ変換する「Evidence Gap Repair Planner」を追加する。目的は、検証証跡の穴を見つけるだけでなく、AIに渡せる修理依頼、再実行コマンド、AIDD-Spec更新候補まで同時に作ること。

## ユーザー

- AI駆動開発でCodexや別エージェントを使う開発者
- CI artifactやスクリーンショットの不足をレビューしたい個人開発者、チームリード
- AIDD-SpecのVerification EvidenceとLearning Logを次回タスクへ戻したい人

## 機能要件

1. 画面タイトルをMVP 011として表示する。
2. Evidence Gap Repair Plannerを初期画面で見えるようにする。
3. 必須証跡として coverage / playwright-report / test-results / terminal-evidence / empty screenshot / valid screenshot / failure screenshot を評価する。
4. valid stateでは不足0件、証跡完全、再実行不要を表示する。
5. failure stateでは不足証跡、重要度、影響するAIDD-Spec artifact、修正指示、再実行コマンドを表示する。
6. Next AI Task Packet DeltaとCodex Prompt Deltaに不足証跡の修理指示を反映する。
7. Review FindingのcategoryにEvidence Gap Repair Plannerを追加する。
8. 日本語UI、日本語テスト名、日本語ドキュメントにする。

## 非ゴール

- 実GitHub API呼び出し
- token保存
- artifact zip展開
- DB永続化

## 品質ゲート

個別に実行し、`experiments/aidd-control-plane-mvp-011/artifacts/terminal/*.txt` に保存する。

- `pnpm install --frozen-lockfile`
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`

## 画像証跡

次を `assets/` と `experiments/aidd-control-plane-mvp-011/artifacts/screenshots/` に保存する。

- `aidd-control-plane-mvp011-empty.png`
- `aidd-control-plane-mvp011-valid.png`
- `aidd-control-plane-mvp011-failure.png`
- `aidd-control-plane-mvp011-terminal-evidence.png`

## 受け入れ条件

- 初期画面でEvidence Gap Repair Plannerが見える。
- valid stateで「不足0件」「証跡完全」が見える。
- failure stateでcoverage / playwright-report / failure screenshot等の不足と修正指示が見える。
- e2eで3ブラウザのempty/valid/failure確認が通る。
- doctor:aiddがMVP 011の必須ラベル、スクリーンショット、AIDD-Spec接続を確認する。
