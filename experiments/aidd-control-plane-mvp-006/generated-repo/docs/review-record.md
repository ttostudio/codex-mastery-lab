# Review Record

## レビュー対象

- AIDD Control Plane MVP 006: Verification Run Tracker
- AIDD-Spec v0.1 / standards/aidd-control-plane-mvp-v0.1.md

## 判定基準

- Product Brief、AI Task Packet、Verification Plan、Codex Prompt、Readiness ReviewがUIで確認できる。
- Verification Run TrackerがUIで確認できる。
- readiness statusがempty/draft/ready/insufficientを表現できる。
- テンプレート未選択/未適用と必須項目不足がmissing fieldsに表示される。
- テンプレート適用で主要機能、状態契約、品質ゲート、非ゴール、外部連携が初期化される。
- 生成物にテンプレート名、リスク、証跡要件が含まれる。
- lint、typecheck、test、build、e2e、doctor:aiddにstatus、command、summary、evidence fileがある。
- 初期状態では未実行ゲートとVerification Evidence不足がfailure stateとして表示される。
- 成功サンプルでは全ゲート成功、Chromium / Firefox / WebKit成功、terminal evidence、screenshot evidenceが揃う。
- 失敗サンプルと証跡不足サンプルはreadyにならない。
- Review Recordにpass/fail/findings/remaining riskを残すための状態が生成物に含まれる。
- Learning Logに失敗・修正・次回Spec改善点を残すための状態が生成物に含まれる。
- 実装が外部通信とブラウザ保存領域に依存しない。

## 現時点のレビュー

- Status: 実装後にローカルゲートで確認する。
- Remaining risk: E2E実行環境のブラウザ依存。
- Human review question: 初見ユーザーがVerification Evidence不足とコマンド失敗の違いを迷わず理解できるか。
