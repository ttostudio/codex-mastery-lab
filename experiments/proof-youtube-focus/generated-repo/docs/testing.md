# テスト方針

## Unit Test

`lib/utils/format.test.ts` で日本語フォーマットを検証します。日付、数値、再生回数、通貨は国際対応時の差し替え境界になるため、ユーティリティ単位で守ります。

`mocks/media/server.test.ts` では独立 `mock-media` service を実サーバとして起動し、Range request、500応答、interrupted streamを検証します。

## Component Test

`features/video/VideoPlayer.test.tsx` で Testing Library を使い、再生ボタン、失敗時の再試行、ミュート操作名、再生速度、キーボード操作を検証します。動画再生そのものはブラウザ実装に依存するため、HTMLMediaElementをテスト内でモックします。Trial 003ではユーザー操作後とイベントdispatch後の状態更新を待ち、Reactの `act(...)` warning が出ない状態を維持します。

## E2E

`e2e/studystream.spec.ts` で以下を確認します。

- ホームから動画詳細へ移動できる。
- 検索結果の空状態を表示できる。
- 動画取得失敗時にリトライ導線を表示できる。
- 認証、課金、オフライン、タイムアウト状態を表示できる。
- 基本ページでaxe違反がない。
- 独立mock serviceのcontrol endpointで認証、課金、ネットワーク、media状態を変更し、画面に反映される。
- 「保存」リストへ追加/解除できる。
- 学習履歴へ追加され、動画単位で削除できる。
- 集中キューへ追加/削除できる。

Playwright設定では Chromium / Firefox / WebKit を対象にしています。ローカル環境でFirefox実ブラウザが未導入の場合は `pnpm run doctor:playwright` で不足ブラウザを確認し、必要に応じて `pnpm exec playwright install firefox` を実行します。ローカルでは `pnpm exec playwright test --project=chromium --project=webkit` まででも可とし、最終証跡はCIで `pnpm exec playwright install --with-deps` 後に `pnpm run test:e2e` を走らせ、Firefox込みで確認します。

E2Eは `pnpm run mock:start` で独立mock serviceを起動してからNext.jsを起動します。Docker Composeが使えない場合はNode直接起動へフォールバックします。状態を持つserviceを使うため、Playwrightは1 workerで実行します。

`pnpm run mock:doctor` はDocker Composeの利用可否、`docker-compose.yml` の検証可否、Node fallback起動、各serviceのhealthを表示します。Docker daemonがない環境でもNode fallbackの検証を残します。

## Visual Regression

`e2e/visual.spec.ts` でホームと動画詳細のスクリーンショット基準を管理します。Visual Regressionは差分ノイズを抑えるためChromium基準に限定し、機能E2Eは Chromium / Firefox / WebKit で実行します。初回または意図したUI変更時は `pnpm run test:e2e:update` を実行して基準を更新します。

## CI artifact

GitHub Actions は `playwright-report/`、`test-results/`、`coverage/` を artifact として保存します。失敗時はHTML report、trace、スクリーンショット、coverage HTMLから原因を追えます。

## コマンド

```bash
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run test:coverage
pnpm run build
pnpm run doctor:playwright
pnpm run mock:doctor
pnpm exec playwright test --project=chromium --project=webkit
```

## Coverage

Vitest coverage は V8 provider を使います。StudyStreamでは現状値を少し下回る安全な段階導入として `statements: 65`, `branches: 60`, `functions: 50`, `lines: 68` を設定します。以降は未検証のデータ操作、権限制御、mock adapterのテストを増やし、CIで安定して通る範囲を確認しながら段階的に閾値を上げます。

履歴、保存、集中キューは現時点ではlocalStorage境界です。将来は `GET /library`、`POST /library/history`、`DELETE /library/history/:videoId`、`PUT /library/playlists/:id/items/:videoId` のようなmock API contractへ移し、E2EはUI操作、Unitは保存境界の変換を担当します。

## Accessibility

Playwright E2E で `@axe-core/playwright` を使い、ホーム、検索、動画詳細、状態表示の基本ページを検査します。Trial 003では `color-contrast` rule を有効化し、基本ページで色コントラストを含むaxe検査を通す方針です。詳細は `docs/accessibility.md` を参照してください。
