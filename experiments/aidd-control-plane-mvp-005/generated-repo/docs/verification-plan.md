# Verification Plan

## 静的ゲート

- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run doctor:aidd`

## E2Eゲート

- `pnpm run test:e2e`

## 単体テスト観点

- empty stateを判定できる。
- テンプレート選択後の未適用failure stateを判定できる。
- 必須項目不足をinsufficientとして判定できる。
- 必須項目が揃うとreadyとして判定できる。
- App Type Templatesを4件以上持ち、各テンプレートにリスクと証跡要件がある。
- Product Briefにアプリ名、対象ユーザー、非ゴールが含まれる。
- AI Task Packet、Verification Plan、Codex Promptにテンプレート名、品質ゲート、状態契約、リスク、証跡要件が含まれる。

## E2E観点

- 初期empty stateが表示される。
- テンプレート未選択が表示される。
- テンプレート選択後にテンプレート未適用が表示される。
- テンプレート適用後に主要機能、非ゴール、外部連携、生成結果が更新される。
- サンプルアプリ入力でready stateになり、生成結果が表示される。
- 主要機能を削除するとinsufficient stateになり、missing fieldsが表示される。
- Chromium / Firefox / WebKitで同じE2Eを実行する。

## AIDD doctor観点

- 必須ファイルが存在する。
- 必須package scriptsが存在する。
- UIコピー文字列が存在する。
- 状態契約文字列が存在する。
- App Type Templatesが4件以上存在する。
- required gatesが各テンプレートに含まれる。
- E2E specにテンプレート未選択/未適用/適用後証跡の検査が存在する。
- Playwright設定にChromium / Firefox / WebKitが存在する。
- app/srcにブラウザ保存領域や外部通信プリミティブがない。
- app/srcに外部URLがない。
