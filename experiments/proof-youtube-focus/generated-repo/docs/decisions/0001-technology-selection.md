# 技術選定理由

## 採用

- Node.js 22.23.1: Next.js 16 系と Playwright の現行実行環境を揃えやすく、LTS 系の範囲で CI とローカルを固定できるため。
- Next.js 16.2.9 App Router: Trial 001 の構成を継続し、画面単位のServer Componentと再生プレイヤーのClient Componentを分離しやすいため。Next.js 16 は新しめのためエコシステムの追従遅れがリスクですが、今回は Trial 001 との差分検証を優先します。
- React 19.2.7: Next.js 16 と組み合わせた App Router 前提の検証を継続するため。Testing Library や一部型定義の追従差分がリスクです。
- TypeScript 6.0.3 strict: APIモック、UI状態、動画プレイヤーの状態遷移を型で管理するため。TypeScript 6 は新しめのため eslint/tsconfig 周辺の互換性がリスクですが、strict で破綻を早く検出できる利点を取ります。
- pnpm + pnpm-lock.yaml: チーム標準に合わせ、依存解決を lockfile と `packageManager` で固定するため。
- Vitest: Unit Test と Testing Library ベースの Component Test を高速に実行できるため。
- Playwright: Chromium / Firefox / WebKit のE2EとVisual Regressionを同じ設定で扱えるため。
- ローカルRoute Handlerモック: 実APIや実データを使わず、失敗、遅延、404、課金、認証状態を再現できるため。

## 分割方針

- `app/`: App Router、ページ、Route Handler。
- `features/`: 動画、コメント、チャンネル、レイアウトなど利用者の体験単位。
- `components/ui/`: 汎用UI。
- `lib/mocks/`: サンプルデータ、状態型、モックアダプタ。
- `lib/i18n/`: 日本語文言。将来の多言語化で差し替えやすいよう集約する。
- `lib/utils/format.ts`: 日付、数値、再生回数、通貨、タイムゾーンのフォーマット境界。
- `mocks/`: docker-compose で独立 mock service 化するための契約と placeholder。

## 非採用

- 外部動画API: 実サービス依存と利用規約リスクを避けるため。
- 1ファイル巨大実装: プレイヤー、API、表示状態、テストの責務が混ざるため。Trial 002 では `VideoPlayerShell`、`PlayerControls`、`usePlayerStateMachine`、`mediaAdapter`、`playerErrors` に分けます。
- YouTube由来のロゴや実データ: 独自名 StudyStream と独自デザインで検証するため。
