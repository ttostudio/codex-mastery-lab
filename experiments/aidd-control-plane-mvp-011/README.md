# AIDD Control Plane MVP 011: Evidence Gap Repair Planner

MVP 010では、GitHub Actionsのrun URLからCI証跡取得計画を作った。MVP 011では、その取得計画とVerification Evidenceを見比べ、欠けている証跡を「次に何を直すか」へ変換する Evidence Gap Repair Planner を追加する。

## 目的

AIの「CIを確認した」「artifactを見た」という曖昧な報告を、足りない証跡、影響するAIDD-Spec artifact、次回のAI Task Packet差分、再実行コマンドに変換する。ユーザーが検査票の穴を見つけた瞬間に、次の修理依頼まで作れる入口にする。

## 対象

- 実装先: `experiments/aidd-control-plane-mvp-011/generated-repo`
- 接続先: `standards/aidd-spec-v0.1.md`, `standards/aidd-control-plane-mvp-v0.1.md`
- UI/テスト/docs: 日本語

## MVP範囲

- Evidence Gap Repair Plannerを初期画面で見える場所へ追加
- 必須証跡: coverage / playwright-report / test-results / terminal-evidence / empty screenshot / valid screenshot / failure screenshot
- CI取得計画、Verification Run、Artifact Evidence Binderから不足を評価する決定的ロジック
- empty / valid / failure state
- failureでは不足証跡ごとに、重要度、影響、修正指示、再実行コマンド、AIDD-Spec更新候補を表示
- Next AI Task Packet DeltaとCodex prompt deltaへ反映
- Playwrightでempty、valid、failure、terminal evidenceをキャプチャ

## 非ゴール

- GitHub API実接続
- artifact zipの展開
- 画像差分解析
- 本番DB永続化
