# AI Task Packet v0.5: Mobile Interaction / State Design Contract

## Scope
- Target path: `experiments/2026-06-28-mobile-state-contract/fixed-app/`
- Forbidden paths: この実験ディレクトリ外。既存の `vibe-app/` は変更しない。
- Dependencies policy: 依存パッケージを追加しない。vanilla HTML/CSS/JavaScriptのみ。

## Product intent
スマホで使いやすい日本語UIの「リマインダー予約メモ」を作る。利用者が件名、日付、時間、通知方法、メモを入力し、送信後に予約内容を確認できる。

## Functional requirements
- 件名、日付、時間、通知方法、メモを入力できる。
- 件名/日付/時間は必須。
- 通知方法は「アプリ通知」「メール」「SMS」から選ぶ。
- 送信すると予約内容を安全なテキスト描画で表示する。
- 入力が不正な場合は日本語エラーメッセージを表示する。

## Non-goals
- 実通知、サーバー送信、永続保存、ログイン、外部API連携はしない。
- localStorage/sessionStorage/indexedDB/fetch/XMLHttpRequestは使わない。

## State Design
- 空状態: まだ予約がないこと、入力後に予約できることを説明する。
- エラー状態: 必須項目ごとにエラーを表示し、aria-describedbyで入力欄と結び付ける。
- 成功状態: 成功メッセージと予約内容を表示し、結果領域へfocus移動する。
- 編集復帰: 再編集できる導線を置く。

## Accessibility Contract
- すべての入力にvisible labelを置く。
- 必須項目のエラー表示は aria-describedby で結ぶ。
- エラー/成功状態を aria-live="polite" の領域で知らせる。
- 送信後は結果領域に tabindex="-1" を付けて `.focus()` する。
- キーボードフォーカスは `:focus-visible` で明確に見える。

## Mobile Interaction Contract
- 主要タップ領域は44px以上。
- 360px幅でも横スクロールしない。
- 入力欄はスマホキーボードに適した type/inputmode/autocomplete を使う。
- ボタンは画面下部に近い位置でも押しやすい余白を持つ。
- モーションを使う場合は `prefers-reduced-motion` を用意する。使わない場合も方針をCSSまたは証拠ファイルに明記する。

## Security / Privacy Contract
- 件名/メモはユーザー入力。`textContent` で描画する。
- 件名 maxlength=80、メモ maxlength=300。
- console.logで入力値を出さない。
- 外部ネットワーク資産を使わない。

## Quality Gate
次を実行し、結果を `MOBILE_STATE_EVIDENCE.md` に記録する。

```bash
node --check experiments/2026-06-28-mobile-state-contract/fixed-app/script.js
python3 experiments/2026-06-28-mobile-state-contract/audit_mobile_state.py experiments/2026-06-28-mobile-state-contract/fixed-app
```

## Verification Evidence
`fixed-app/MOBILE_STATE_EVIDENCE.md` を作成し、次を日本語で記録する。
- 空状態
- エラー状態
- 成功状態
- スマホ操作配慮
- 検証コマンド
- 既知制約
