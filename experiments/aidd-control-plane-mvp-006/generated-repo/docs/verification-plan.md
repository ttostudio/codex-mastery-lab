# Verification Plan

対象はAIDD-Spec v0.1とstandards/aidd-control-plane-mvp-v0.1.mdに接続するAIDD Control Plane MVP 006: Verification Run Tracker。

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
- Verification Runの成功サンプルがreadyになる。
- Verification Runの失敗サンプルがreadyにならない。
- Verification Runの証跡不足サンプルが、コマンド成功後もVerification Evidence不足としてreadyにならない。

## E2E観点

- 初期empty stateが表示される。
- テンプレート未選択が表示される。
- テンプレート選択後にテンプレート未適用が表示される。
- テンプレート適用後に主要機能、非ゴール、外部連携、生成結果が更新される。
- サンプルアプリ入力でready stateになり、生成結果が表示される。
- 主要機能を削除するとinsufficient stateになり、missing fieldsが表示される。
- Chromium / Firefox / WebKitで同じE2Eを実行する。
- 初期状態でVerification Run Trackerに未実行ゲート、terminal evidence不足、screenshot evidence不足が表示される。
- 成功サンプルでlint、typecheck、test、build、e2e、doctor:aiddが成功し、Chromium / Firefox / WebKitと証跡が表示される。
- 失敗サンプルでe2eまたはdoctor:aiddが失敗し、readyではない状態が表示される。
- 証跡不足サンプルでevidence file不足が表示され、readyではない状態が表示される。

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
- Verification Run Tracker、成功/失敗/証跡不足サンプル、Verification Evidence、Review Record、Learning Logの文言が存在する。
- testsとE2E specにVerification Run Trackerの主要状態の検査が存在する。
