あなたはCodex Mastery Labの実装担当です。作業範囲は experiments/aidd-control-plane-mvp-014/generated-repo のみです。MVP 013で未達だった「独立Mock CI Service契約」をMVP 014として修正してください。

必須要件:
1. package.jsonのnameや画面内MVP表記を aidd-control-plane-mvp-014 / MVP 014 に更新する。
2. Node fallbackの独立mock serviceを mocks/ci-service/server.mjs として実装する。外部重依存は追加しない。
3. mock serviceは /health, /state, /__control/state を持つ。/__control/state は POST JSONで scenario を empty / valid / failure / timeout / rate_limit に変更できる。CORSを許可する。
4. pnpm run mock:start, pnpm run mock:stop, pnpm run mock:doctor を追加する。mock:start はPIDファイルを作り、mock:stopで止める。mock:doctorはサービスを一時起動して /health /state /__control/state を実HTTPで検証する。
5. UIはNEXT_PUBLIC_MOCK_CI_SERVICE_URL または http://127.0.0.1:4314 から状態を取得し、empty / valid / failure / timeout / rate_limit を日本語で表示する。取得失敗時は手動Evidence Binder fallbackを表示する。
6. rate_limit状態には、待機時間、token scope見直し、手動証跡添付、次回AI Task Packet Deltaを表示する。
7. Playwright E2Eに「E2Eから /__control/state を叩いてUI反映を確認する」テストを追加する。3ブラウザ対象の既存設定を壊さず、タイムアウトを安定化する。
8. doctor:aiddをMVP 014契約に合わせて更新し、mocks/ci-service/server.mjs、mock scripts、capture:mvp014、docsのMVP番号、rate_limit文言を検査する。
9. capture scriptを capture:mvp014 として追加し、empty / valid / failure / timeout / rate_limit / terminal evidence のスクリーンショットを experiments/aidd-control-plane-mvp-014/artifacts/screenshots に保存できるようにする。
10. docs/product-brief.md と learning-log.md をMVP 014の内容へ更新する。

実行してほしい検証:
- pnpm install --prefer-offline が必要なら実行
- pnpm run lint
- pnpm run typecheck
- pnpm run test
- pnpm run build
- pnpm run doctor:aidd
- pnpm run mock:doctor
- 可能なら pnpm run test:e2e

制約:
- node_modules, .next, coverage, playwright-report, test-resultsはコミット対象にしない。
- 日本語UI/日本語テスト名を維持する。
- 建築/図面/施工の比喩は使わない。
- 変更結果と未達があれば短くまとめて終了してください。
