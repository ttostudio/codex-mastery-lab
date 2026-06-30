# AI Task Packet: AIDD Control Plane MVP 006 Verification Run Tracker

## spec_version
AIDD-Spec v0.1

## conformance_target
L2 Lite

## product_brief
AIDD Control Plane の Project Intake Wizard / App Type Templates に、Verification Run Tracker を追加する。ユーザーが生成した AI Task Packet に対して、実行すべき品質ゲート、実行結果、証跡ファイル、未実行・失敗・証跡不足を一画面で確認できるようにする。

## non_goals
- GitHub API連携、外部CI連携、DB永続化はしない。
- 実ログの自動アップロードやファイルシステム監視はしない。
- 認証、課金、チーム管理は実装しない。

## experience_contract
- UI、フォーム、エラーメッセージ、テスト名は日本語。
- 重要な品質ゲートを初期画面から隠さない。
- 初期状態では「未実行」「証跡不足」を明示する。
- サンプル成功ログ適用後は、ゲート結果、3ブラウザE2E、証跡が揃っていることを表示する。
- サンプル失敗ログまたは証跡不足ログ適用後は、readyではなく修正が必要な状態を表示する。

## required_outputs
- Next.js + TypeScript + pnpm アプリ。
- Verification Run domain logic と unit tests。
- Playwright E2E tests（Chromium / Firefox / WebKit）。
- doctor:aidd script 更新。
- 画面キャプチャ用 script（empty/initial、filled/valid、failure、terminal evidence）。
- docs/verification-plan.md と docs/review-record.md の更新。

## verification_commands
- pnpm install --frozen-lockfile
- pnpm run lint
- pnpm run typecheck
- pnpm run test
- pnpm run build
- pnpm run test:e2e
- pnpm run doctor:aidd

## standard_connections
- standards/aidd-spec-v0.1.md: Verification Evidence, Review Record, Learning Log
- standards/aidd-control-plane-mvp-v0.1.md: Evidence Collector, Review Dashboard, Learning Log
