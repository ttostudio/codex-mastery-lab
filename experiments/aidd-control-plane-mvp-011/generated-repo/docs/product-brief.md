# Product Brief: AIDD Control Plane MVP 011

## 目的

AIDD Control PlaneのVerification Evidenceを、GitHub Actions Artifact Fetch Planに加えてEvidence Gap Repair Plannerまで拡張する。coverage / playwright-report / test-results / terminal-evidence / empty screenshot / valid screenshot / failure screenshotを必須証跡として評価し、不足ごとに重要度、影響するAIDD-Spec artifact、修正指示、再実行コマンド、Codex prompt deltaを返す。

## 対象ユーザー

- Codexへ再依頼する前に不足証跡を明確にしたい開発者
- AIDD-Spec v0.1とstandards/aidd-control-plane-mvp-v0.1.mdに沿ってReview RecordとLearning Logを残したいリードエンジニア
- CI artifactと画面証跡の欠落をNext AI Task Packet Deltaへ戻したいAI駆動開発チーム

## 主要フロー

1. ユーザーがApp Type Templatesを選び、テンプレートを適用する。
2. Project Intake Wizardでアプリ名、対象ユーザー、解決したい問題を入力する。
3. Verification Run Trackerでlint、typecheck、test、build、e2e、doctor:aiddと3ブラウザE2Eを確認する。
4. Artifact Evidence Binderでterminal evidence、screenshot evidence、CI run URL、CI artifact URL、Playwright report URLを同じ実行単位に束ねる。
5. CI Artifact ImporterとGitHub Actions Artifact Fetch Planでcommit SHA、workflow、job、artifact、owner、repo、run id、API endpoint、token scopeを確認する。
6. Evidence Gap Repair Plannerで7種類の必須証跡を評価する。
7. valid sampleでは不足0件を表示する。
8. failure sampleでは複数不足を決定的に表示し、Review Finding / Learning Log / Next AI Task Packet Deltaへ修理指示を反映する。

## 非ゴール

- GitHub APIの実通信
- GitHub token保存
- artifact zipの実ダウンロード
- ブラウザ保存領域への永続化

## 成功条件

- 初期状態でEvidence Gap Repair Planner: emptyと不足証跡7件が見える。
- validサンプルでcoverage / playwright-report / test-results / terminal-evidence / empty screenshot / valid screenshot / failure screenshotが揃い、不足0件になる。
- failureサンプルで複数不足が出て、重要度、影響するAIDD-Spec artifact、修正指示、再実行コマンド、Codex prompt deltaが表示される。
- GitHub Actions Artifact Fetch Planのowner / repo / run id / jobs API / artifacts API / logs URL / actions:read / contents:readはMVP 010の挙動を維持する。
- Verification Evidence、Review Record、Learning Log、Next AI Task Packet DeltaがAIDD-Spec v0.1接続として説明される。
