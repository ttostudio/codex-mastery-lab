# 2026-06-30 Playwright API State Contract 実験計画

## 今日の問い
昨日のAPI失敗状態契約は静的監査中心だった。では、後工程のE2E担当が本当に欲しい「ブラウザ上でoffline/timeout/server-error/retryが確認できる証拠」を、AI Task Packetに入れるとCodexの成果物は改善するか。

## 題材
日本語UIの「配送状況トラッカー」。荷物一覧をAPIから取得する想定の静的Webアプリ。

## 比較
1. 雑プロンプト: APIから取得する雰囲気、検索、一覧だけを依頼する。
2. 改善プロンプト: Playwright E2E Contractを含むAI Task Packetを渡し、状態切替UI、E2E、証拠ファイルを要求する。

## 監査カテゴリ
- Requirement Fit / Failure State
- Test Plan / Playwright E2E
- Verification Evidence

## 完了条件
- vibe-app と fixed-app を作る。
- 両方をブラウザ操作してGIFを assets/ に保存する。
- fixed-app は Playwright E2Eで offline / timeout / server-error / retry / success復帰を確認する。
- AIDD-Spec標準またはテンプレートに Playwright E2E Contract を追記する。
- 日本語記事ドラフトとプレビューを生成する。
