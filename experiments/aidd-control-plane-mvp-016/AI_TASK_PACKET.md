# AI Task Packet: AIDD Control Plane MVP 016

## Spec Version
AIDD-Spec v0.1

## Conformance Target
L2 Lite

## Product Brief
AIDD Control Planeに、GitHub Actions workflowとartifact保存の静的監査機能を追加する。目的は、AIが作ったCI設定が「コマンドを並べただけ」ではなく、Verification Evidenceとして再利用できるログ・レポート・スクリーンショットを残すことを確認する入口を作ること。

## Non-goals
- 実GitHub API接続はしない
- 実CIをこのcron内で起動しない
- secretsやtokenを扱わない
- 英語UIにしない

## Required Features
1. `.github/workflows/aidd-control-plane.yml`を追加する
2. workflowに以下のgateを含める: install, lint, typecheck, test, build, test:e2e, doctor:aidd, mock:doctor
3. artifact保存を含める: coverage, playwright-report, test-results, terminal evidence
4. UIに「CI Workflow Artifact Auditor」セクションを追加する
5. valid状態では必要gate/artifactが揃っていることを表示する
6. failure状態では不足gate/artifactをReview Findingへ変換して表示する
7. empty状態ではworkflow未設定時に何を足すべきかを表示する
8. `doctor:aidd`でworkflow存在、gate名、artifact保存path、AIDD-Spec接続文言、capture scriptを検査する
9. `capture:mvp016`でempty/valid/failure/terminal evidence画像を生成する

## Quality Gates
- pnpm install --frozen-lockfile
- pnpm run lint
- pnpm run typecheck
- pnpm run test
- pnpm run build
- pnpm run test:e2e
- pnpm run doctor:aidd

## UI/Copy Requirements
- 画面表示、テスト名、docsは日本語
- 重要gateは初期表示から見える
- failureは赤表示だけでなく、needed upstream information、standard update、codex prompt deltaへ接続する

## Verification Evidence
`experiments/aidd-control-plane-mvp-016/artifacts/terminal/*.txt`と`screenshots/*.png`に保存する。
