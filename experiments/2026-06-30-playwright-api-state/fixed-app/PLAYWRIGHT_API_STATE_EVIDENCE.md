# 配送状況トラッカー API状態テスト証拠

## 失敗状態一覧

- `offline`: ネットワークに接続できない状態。通信環境を確認して再試行する案内を表示する。
- `timeout`: AbortControllerで取得を中断する状態。時間を置いて再試行する案内を表示する。
- `server-error`: 配送API側でサーバーエラーが起きた状態。復旧待ちまたは再試行の案内を表示する。
- `empty`: API応答が0件の状態。検索条件の見直しやデータ追加待ちを案内する。

## E2Eで確認すること

- success初期表示で荷物一覧が表示される。
- 検索語を入力した後にofflineへ切り替えても、検索語と直前に取得済みの一覧が保持される。
- offlineでは日本語のエラー文言と再試行ボタンが見える。
- timeoutではタイムアウトの日本語文言が表示される。
- server-errorではサーバーエラーの日本語文言が表示される。
- emptyでは空状態の日本語文言が表示される。
- successへ戻して再試行すると一覧が復帰する。

## 実行コマンド

```bash
node --check experiments/2026-06-30-playwright-api-state/fixed-app/app.js
pnpm exec playwright test experiments/2026-06-30-playwright-api-state/tests/api-state-e2e.spec.js --project=chromium
pnpm exec playwright test --config=experiments/2026-06-30-playwright-api-state/tests/playwright.config.js api-state-e2e.spec.js --project=chromium
```

## 既知制約

- 静的HTMLを`file://`で開くため、実ネットワークのAPI呼び出しは行わない。
- API境界は`requestShipments({ scenario, signal })`としてUI描画から分離し、デモ用の疑似応答を返す。
- ルートの依存状態によっては`@playwright/test`が直接解決できないため、E2Eは`@playwright/test`を優先し、同梱の`playwright/test`へフォールバックする。

## AIDD-Specへ戻す項目

- UI入力を保持したままAPI失敗状態を再現するタスク粒度。
- success、offline、timeout、server-error、emptyの状態契約。
- AbortControllerを使ったtimeout表現。
- 失敗時も直前取得済み一覧を残す復旧体験。
- aria-liveで状態変化を伝えるアクセシビリティ要件。
