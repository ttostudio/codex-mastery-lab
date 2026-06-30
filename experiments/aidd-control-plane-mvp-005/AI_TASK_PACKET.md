# AI Task Packet: AIDD Control Plane MVP 005 App Type Templates

## spec_version
AIDD-Spec v0.1

## conformance_target
L2 Lite

## product_brief
AIDD Control Plane の Project Intake Wizard に App Type Templates を追加する。ユーザーが「動画サービス風」「学習支援」「予約管理」「社内申請」などのアプリ種別を選ぶと、AIに渡す前に必要な状態契約、品質ゲート、リスク、証跡要件、初期機能候補を提案する。

## non_goals
- 外部AI API連携はしない。
- 認証、DB永続化、課金は実装しない。
- 実サービスの商標・ロゴ・コピーは使わない。

## experience_contract
- UI、フォーム、エラーメッセージ、テスト名は日本語。
- 初期状態ではテンプレート未選択の案内を表示。
- テンプレート選択時は推奨項目をカードで表示。
- 適用後は Wizard の入力、生成ドキュメント、Readiness Review に反映。
- 品質ゲートや失敗状態を初期画面から隠さない。

## required_outputs
- Next.js + TypeScript + pnpm アプリ。
- App Type Template domain logic と unit tests。
- Playwright E2E tests。
- doctor:aidd script 更新。
- 画面キャプチャ用 script。

## verification_commands
- pnpm install --frozen-lockfile
- pnpm run lint
- pnpm run typecheck
- pnpm run test
- pnpm run build
- pnpm run test:e2e
- pnpm run doctor:aidd
