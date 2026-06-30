# Product Brief: AIDD Control Plane MVP 006

## 目的

AIDD Control Planeを初めて見るユーザーが、App Type Templatesを選んで適用し、Verification Run Trackerで実行結果と証跡不足を確認できる状態にする。AIDD-Spec v0.1とstandards/aidd-control-plane-mvp-v0.1.mdのVerification Evidence / Review Record / Learning Logへ接続する。

## 対象ユーザー

- AIでWeb/mobileアプリを作りたい初心者
- Codexに依頼する前の設計ドキュメントを作りたい開発者
- チームでAI駆動開発の品質を揃えたいリードエンジニア

## 主要フロー

1. ユーザーが動画サービス風、学習支援、予約管理、社内申請からテンプレートを選ぶ。
2. テンプレートを適用し、主要機能、状態契約、品質ゲート、非ゴール、外部連携の初期値を反映する。
3. アプリ名、対象ユーザー、解決したい問題を入力する。
4. Product Brief、AI Task Packet、Verification Plan、Codex Promptにテンプレート名、リスク、証跡要件が含まれる。
5. Readiness Reviewでテンプレート未選択/未適用をfailure stateとして確認する。
6. Verification Run Trackerでlint、typecheck、test、build、e2e、doctor:aiddのstatus、command、summary、evidence fileを確認する。
7. 成功サンプル、失敗サンプル、証跡不足サンプルを切り替え、readyではない理由を確認する。

## 非ゴール

- 外部AI APIの呼び出し
- ログイン、課金、本番DB永続化
- 実サービスの商標・ロゴ・コピー利用
- ブラウザ保存領域への永続化

## 成功条件

- 初期状態でテンプレート未選択が見える。
- テンプレート選択後、適用前はテンプレート未適用が見える。
- テンプレート適用で主要機能、状態契約、品質ゲート、非ゴール、外部連携が反映される。
- 必須項目が揃うとreadyとして見える。
- 生成物にテンプレート名、リスク、証跡要件、状態契約、品質ゲートが含まれる。
- Verification Evidenceとしてterminal evidenceとscreenshot evidenceが必要であることが表示される。
- Review Recordにpass/fail/findings/remaining riskを残す前提が生成物に含まれる。
- Learning Logに失敗・修正・次回Spec改善点を残す前提が生成物に含まれる。
