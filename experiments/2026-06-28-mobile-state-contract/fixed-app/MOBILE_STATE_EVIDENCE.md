# MOBILE_STATE_EVIDENCE

## 空状態
- 初期表示では「まだ予約はありません」と表示し、入力後に予約内容を確認できることを説明する。
- 空状態領域は `aria-live="polite"` を持つ。

## エラー状態
- 件名、日付、時間を必須項目として検証する。
- 各入力欄は個別のエラー表示先と `aria-describedby` で結び付いている。
- 不正時は日本語メッセージを表示し、最初のエラー項目へフォーカスする。

## 成功状態
- 送信成功時は成功メッセージを `aria-live="polite"` の領域へ表示する。
- 予約内容は `textContent` で描画し、ユーザー入力をHTMLとして扱わない。
- 結果領域には `tabindex="-1"` を付け、送信後に `.focus()` する。
- 「再編集する」ボタンで入力欄へ戻れる。

## スマホ操作配慮
- 主要な入力欄とボタンは `min-height: 48px` とし、44px以上のタップ領域を確保した。
- viewportを指定し、360px幅でも横スクロールしないように単一カラムを基本にした。
- 日付は `type="date"`、時間は `type="time"`、テキスト入力は `inputmode="text"` を指定した。
- 画面下部でも押しやすいように送信ボタン周辺へ余白と safe-area 対応を入れた。
- 明示的なアニメーションは使わない。CSSには `prefers-reduced-motion` を用意し、スクロール挙動を抑制する方針を明記した。

## 検証コマンド
- 実行済み: `node --check experiments/2026-06-28-mobile-state-contract/fixed-app/script.js`
  - 結果: exit code 0
- 実行済み: `python3 experiments/2026-06-28-mobile-state-contract/audit_mobile_state.py experiments/2026-06-28-mobile-state-contract/fixed-app`
  - 結果: `SUMMARY: 14 passed / 0 failed`

## 既知制約
- 実通知、サーバー送信、永続保存、ログイン、外部API連携は行わない。
- localStorage、sessionStorage、indexedDB、fetch、XMLHttpRequestは使わない。
