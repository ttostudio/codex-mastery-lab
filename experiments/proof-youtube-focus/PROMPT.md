# Proof 001: YouTube風ではなく「学習動画キュー」サンプルを0から作る

あなたは `<repo>` の `AGENTS.md` と `skills/software-development/aidd-app-clone-lab/SKILL.md` を必ず読み、それに従って新規サンプルを作ります。

## 作業ディレクトリ

`<repo>/experiments/proof-youtube-focus/generated-repo/`

存在しない場合は作成してください。完全に0から作ってください。

## ゴール

YouTube風の「動画一覧・動画詳細・検索・関連動画・保存」は認識できるが、目的を娯楽ではなく **学習動画キューと集中視聴** に変えたサンプルを作る。

名称は `StudyStream`。実在サービスのロゴ、商標、コピー、配色の完全コピーは使わない。

## 必須体験

- ホーム: 学習動画カード、検索、集中キュー、今日の学習目標
- 動画詳細: 再生プレースホルダー、章立て、メモ、保存/解除、キュー追加/解除
- 学習状態: auth anonymous/premium、billing failed、media failure、offline/timeoutをUIに出す
- 学習キュー: localStorageで追加/解除できる
- 学習履歴: 視聴履歴を表示/削除できる

## 必須技術

- Next.js + TypeScript + pnpm
- mock-api/mock-media/mock-auth/mock-billing
- 各mock serviceに `/health`, `/state`, `/__control/state`
- Docker Compose優先 + Node fallback
- `mock:start`, `mock:stop`, `mock:doctor`
- `doctor:playwright`
- `lint`, `typecheck`, `test`, `test:coverage`, `build`, `test:e2e`
- Playwright functional E2EはChromium/Firefox/WebKit対象
- Firefoxが遅い前提で `timeout: 60_000`, `expect.timeout: 15_000`

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
pnpm exec playwright test e2e/studystream.spec.ts --project=chromium --project=firefox --project=webkit
```

最後に `docs/score-self-review.md` に100点基準の自己採点を書いてください。

## 注意

- ローカルパスはdocsに書かない。
- node_modules, .next, coverage, playwright-report, test-results はコミット対象にしない前提。
- 実行ログはCodexが必要なら `../artifacts/proof-youtube-focus/terminal/` に保存してよい。
