# WatchFlow Trial 005 Codex Prompt

あなたは `/path/to/project-root/experiments/watchflow-trial-005/generated-repo/` にある WatchFlow Trial 004 のNext.jsアプリを改善します。

実際の作業ディレクトリは `/path/to/project-root/experiments/watchflow-trial-005/generated-repo/` です。ただし、README/docs/logに個人ユーザー名を含む絶対パスを書かないでください。

## 絶対条件

- 変更は `/path/to/project-root/experiments/watchflow-trial-005/generated-repo/` 配下に閉じる。
- Trial 001〜004やarticlesは変更しない。
- UI、テスト名、エラー文、README/docsは日本語ベース。
- YouTubeのロゴ、商標、実データ、実APIは使わない。
- pnpm前提を維持する。
- 可能な範囲で以下を実行し、結果を報告する。
  - `pnpm install --frozen-lockfile`
  - `pnpm run lint`
  - `pnpm run typecheck`
  - `pnpm run test`
  - `pnpm run test:coverage`
  - `pnpm run build`
  - `pnpm exec playwright test --project=chromium --project=webkit`

## Trial 004結果

Trial 004は **91/100**。

成功:

- LCP poster warning解消
- `mock:start` / `mock:stop` 追加
- Docker Compose優先、Docker daemonなしならNode直接起動へfallback
- E2Eから独立mock serviceの `/__control/state` を操作
- auth / billing / media / network状態をE2Eで変更して画面反映
- mock-media failureを動画画面で確認
- 「後で見る」追加/解除をE2E化
- CIに `pnpm exec playwright install --with-deps` とartifact upload追加
- LICENSEと公開README追加
- Chromium/WebKit E2E 23件合格

残課題:

- GitHub Actionsの実run証跡をまだ確認していない。
- ローカルFirefox実行環境は未導入。ただしCIでFirefoxを走らせる設計は入っている。
- Docker daemonなしのためdocker-compose pathは未確認。Node fallbackは確認済み。
- coverage Functionsが54.87%で低い。
- 履歴削除、プレイリスト永続化、premium権限制御がまだ浅い。
- READMEにCI badgeや記事リンクがない。

## Trial 005の改善目標

### 1. coverage thresholdを段階導入

いきなり高すぎるthresholdは避ける。現状値を少し下回る安全な閾値から開始する。

最低限:

- `vitest.config.ts` に coverage thresholds を設定。
- 目安:
  - statements: 65
  - branches: 60
  - lines: 68
  - functions: 50
- `docs/testing.md` に「段階的に上げる」方針を書く。
- `pnpm run test:coverage` が通ること。

### 2. データ操作を増やす

Trial 004の「後で見る」はlocalStorage中心だった。Trial 005では、最低2つの操作をE2E/Unitで確認する。

候補:

- 視聴履歴に追加される
- 視聴履歴を削除できる
- 後で見るリストを一覧表示できる
- プレイリストに追加/削除できる
- premium限定動画のロック/解除状態をauth/billing stateに接続する
- 通知を既読にできる

最低限:

- UIとして操作できる。
- E2EまたはUnitで検証する。
- localStorageでよいが、mock API contractまたはdocsに将来の永続化境界を書く。

### 3. CI実行証跡を取りやすくする

GitHub Actionsの実run確認はHermes側で後からやるが、repo側も改善する。

最低限:

- READMEにCI badgeを追加する。URLは `https://github.com/ttostudio/codex-mastery-lab/actions/workflows/ci.yml/badge.svg` 形式。
- READMEに記事リンクを追加する。
- `docs/public-repo.md` に「CI run確認手順」「artifact確認手順」を書く。
- CI workflowに summary step を追加して、coverage/E2E結果がActions summaryに出るようにする。

### 4. Firefox/CIの扱いを明確化

- ローカルFirefox未導入はdoctorで検出。
- CIでは `pnpm exec playwright install --with-deps` 後に `pnpm run test:e2e` でFirefox含む全projectを走らせる。
- README/docs/testing.mdに、ローカルはChromium/WebKitだけでも可、最終証跡はCIでFirefox込みにする方針を書く。

### 5. Docker compose pathの検証性を上げる

Docker daemonがない環境でも、compose設定の静的検証やfallback検証ができるようにする。

候補:

- `pnpm run mock:doctor` を追加し、docker availability / node fallback / service healthを表示。
- E2Eログにfallback modeを明示。
- docs/mock-services.mdにDocker pathとNode fallback pathを明記。

### 6. Trial 005自己採点

`docs/score-self-review.md` をTrial 005に更新し、自己採点案を出す。

目標は **95点以上**。ただし、実CI run証跡やDocker daemonがない場合は満点にしない。

## 期待する最終報告

- 変更概要
- 実行したコマンドと結果
- 残った制約
- Trial 005自己採点案
