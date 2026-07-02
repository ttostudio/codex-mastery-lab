# AIDD Control Plane MVP 016: CI Workflow Artifact Auditor

MVP 016は、MVP 015でfixture駆動にしたMock CI Serviceの次段として、generated repo内のGitHub Actions workflowがAIDD-Spec v0.1のVerification Evidence要件を満たすかを静的に検査する。

## 目的

AIが「CIを追加しました」と報告しても、実際にはcoverage、playwright-report、test-results、terminal evidenceがartifact保存されていないことがある。MVP 016では、その抜けをUI、doctor、E2Eで見える化し、Review Findingと次回AI Task Packet Deltaへ戻す。

## 接続する標準

- `standards/aidd-spec-v0.1.md`
- `standards/aidd-control-plane-mvp-v0.1.md`
- Verification Evidence
- Test Plan
- Review Record
- Learning Log
- External Integration Contract

## 完了条件

- `generated-repo/.github/workflows/aidd-control-plane.yml`を追加する
- CI workflowにlint/typecheck/test/build/e2e/doctor:aidd/mock:doctorを含める
- coverage、playwright-report、test-results、terminal evidenceをartifact保存する
- UIにCI Workflow Artifact Auditorを追加し、valid/failure/empty状態を日本語で表示する
- `doctor:aidd`がworkflowとartifact保存の不足を検査する
- 日本語テスト名でUnit/E2Eを更新する
- empty/valid/failure/terminal evidenceの画像証跡を保存する
