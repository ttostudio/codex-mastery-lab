# PLAN: 2026-06-28 mobile-state-contract

## 今日のテーマ
スマホ向けの予約リマインダーUIを題材に、Mobile Interaction Contract / State Design / Verification Evidence を後工程から逆算する。

## なぜやるか
雑なバイブコーディングでは、見た目が整ったフォームは作れても、スマホでのタップ領域、エラー表示、空状態、送信後状態、キーボード操作、motion配慮、証拠ファイルが抜けやすい。後工程のレビューは「動くフォーム」ではなく「スマホ利用時に迷わず、安全に復帰できる状態設計」を必要とする。

## 題材アプリ
日本語UIの「リマインダー予約メモ」。利用者が件名、日付、時間、通知方法、メモを入力し、送信するとプレビュー/完了状態を見る小さな静的Webアプリ。

## 監査カテゴリ
1. Design Quality / Mobile Interaction
2. Accessibility
3. Build / Lint / Format / Console

## Reverse Chain
欠陥 → 理想状態 → 修正指示 → 必要な前工程情報 → AIDD-Spec標準成果物 → AI Task Packetへの差分。

## 制約
- 依存パッケージを追加しない。
- vanilla HTML/CSS/JSのみ。
- Codexの変更範囲は実験ディレクトリ配下に閉じる。
- ブラウザ操作GIFとconsole logを保存する。
- 監査は軽量なPython静的監査とPlaywright操作キャプチャで行う。

## 成功条件
- バイブ版と改善版の両方にGIFがある。
- バイブ版の欠陥が標準フォーマットで記録されている。
- 改善版では Mobile Interaction Contract / State Evidence が証拠ファイルとして残る。
- standards/aidd-spec-ai-task-packet-standard-v0.1.md にMobile Interaction Contractを追記する。
- 記事ドラフト、preview再生成、git commitまで完了する。
