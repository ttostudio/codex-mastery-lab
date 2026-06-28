# Proof 002: TikTok風ではなく「短尺反復学習フィード」サンプルを0から作る

あなたは `<repo>` の `AGENTS.md` と `skills/software-development/aidd-app-clone-lab/SKILL.md` を必ず読み、それに従って新規サンプルを作ります。

## 作業ディレクトリ

`<repo>/experiments/proof-tiktok-drill/generated-repo/`

存在しない場合は作成してください。完全に0から作ってください。

## ゴール

TikTok風の「縦スクロール短尺フィード・いいね・保存・プロフィール・音声/字幕」は認識できるが、目的を娯楽ではなく **短尺反復学習ドリル** に変えたサンプルを作る。

名称は `DrillSwipe`。実在サービスのロゴ、商標、コピー、配色の完全コピーは使わない。

## 必須体験

- ホーム: 縦型カード風フィード、現在のドリル、進捗、復習キュー
- ドリル詳細: 短尺動画プレースホルダー、字幕、正解/不正解、保存、復習キュー追加/解除
- 状態: auth anonymous/premium、billing failed、media failure、offline/timeoutをUIに出す
- 反復学習: localStorageで正解数、保存、復習キュー、視聴履歴を操作できる
- E2Eでフィード遷移、保存、復習キュー、正解/不正解、履歴削除を確認する

## 必須技術

- Next.js + TypeScript + pnpm
- mock-api/mock-media/mock-auth/mock-billing
- 各mock serviceに `/health`, `/state`, `/__control/state`
- Docker Compose優先 + Node fallback
- `mock:start`, `mock:stop`, `mock:doctor`
- `doctor:playwright`
- `lint`, `typecheck`, `test`, `test:coverage`, `build`, `test:e2e`
- Playwright functional E2EはChromium/Firefox/WebKit対象
- Firefoxが遅い前提で `timeout: 120_000`, `expect.timeout: 90_000`, local retries 1

## 必須docs/evidence

- `docs/product-brief.md`
- `docs/testing-contract.md`
- `docs/score-self-review.md`

## 完了条件

以下を実際に実行して通してください。

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run test:coverage
pnpm run build
pnpm run doctor:playwright
pnpm run mock:doctor
pnpm exec playwright test e2e/drillswipe.spec.ts --project=chromium --project=firefox --project=webkit
```

最後に `docs/score-self-review.md` に100点基準の自己採点を書いてください。
