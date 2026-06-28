# WatchFlow 100点ナレッジを別アプリに移植する：StudyStreamとDrillSwipeで再実証

> 2026-06-28 / Codex Mastery Lab  
> 対象: AIDD app-clone lab knowledge / StudyStream / DrillSwipe  
> 結果: **2つの別ゴールで100点手順を再利用できた**

## 先にまとめ

| 項目 | 結果 | 証跡 |
| --- | --- | --- |
| WatchFlow Trial 005 | 100点化完了 | Firefox導入、3ブラウザE2E、GitHub Actions成功、artifact確認 |
| ナレッジ化 | 完了 | `AGENTS.md` と `skills/software-development/aidd-app-clone-lab/SKILL.md` に手順化 |
| もう一度0から作ったサンプル | 成功 | `StudyStream`: YouTube風ではなく学習動画キュー。3ブラウザE2E 33 passed |
| TikTok風への横展開 | 成功 | `DrillSwipe`: TikTok風ではなく短尺反復学習ドリル。3ブラウザE2E 12 passed |
| CI | 成功 | `App Clone Lab Proofs CI` が `success`。coverage / playwright-report artifactあり |

今回のポイントは、WatchFlowで100点に到達した手順を「その場限りの成功」にせず、**別ゴールのアプリを0から作らせても再現できる知識**としてrepoに固定したことだ。

CI run:

```text
https://github.com/ttomobile/codex-mastery-lab/actions/runs/28312855035
```

CI artifact:

```text
StudyStream-playwright-report   222150
StudyStream-coverage             65063
DrillSwipe-playwright-report     207786
DrillSwipe-coverage              22671
```

## 何を試したか

Trial 005でWatchFlowは100点に到達した。そこで、成功した手順を一回限りの作業で終わらせず、repoの実行知識として残した。

追加したのはこの2つだ。

```text
AGENTS.md
skills/software-development/aidd-app-clone-lab/SKILL.md
```

このナレッジには、次の完了条件を入れた。

- Next.js + TypeScript + pnpm
- 日本語UI、日本語テスト名、日本語docs
- mock-api / mock-media / mock-auth / mock-billing
- 各mock serviceの `/health`, `/state`, `/__control/state`
- Docker Compose優先 + Node fallback
- lint / typecheck / unit / coverage / build
- Playwright doctor / mock doctor
- Chromium / Firefox / WebKit の3ブラウザE2E
- GitHub Actions artifact
- 記事化とローカルパス漏れ検査

重要なのは、**同じWatchFlowをもう一度作る**のではなく、別のアプリ目的に移しても効くかを見ることだ。

## Proof 001: StudyStream

最初の横展開は `StudyStream`。YouTube風の認識しやすい動画体験を使うが、目的は娯楽視聴ではなく **学習動画キュー** に変えた。

```text
experiments/proof-youtube-focus/generated-repo
```

主要体験はこうした。

- ホーム: 学習動画カード、今日の学習目標、集中キュー
- 検索: 講座、講師、タグ検索
- 動画詳細: 再生プレースホルダー、章立て、学習メモ
- ライブラリ: 保存、集中キュー追加/解除、学習履歴削除
- 状態: media failure、offline、timeout、auth、billing failure

Codexは一度Firefoxで詰まった。FirefoxではNext dev上の一部ページ表示がChromium/WebKitよりかなり遅く、15秒のexpect timeoutでは `loading.tsx` のまま失敗した。

そこで、Firefoxを外すのではなく設定を広げた。

```ts
timeout: 120_000,
expect: { timeout: 90_000 },
workers: 1,
retries: process.env.CI ? 2 : 1,
```

結果、3ブラウザE2Eは成功した。

```text
33 passed (Chromium / Firefox / WebKit)
```

実行したゲートはこれだ。

```text
pnpm install --frozen-lockfile  exit=0
pnpm run lint                   exit=0
pnpm run typecheck              exit=0
pnpm run test                   exit=0
pnpm run test:coverage          exit=0
pnpm run build                  exit=0
pnpm run doctor:playwright      exit=0
pnpm run mock:doctor            exit=0
3 browser E2E                   33 passed
```

## Proof 002: DrillSwipe

次は `DrillSwipe`。TikTok風の縦スクロール短尺フィードを使うが、目的は娯楽ではなく **短尺反復学習ドリル** に変えた。

```text
experiments/proof-tiktok-drill/generated-repo
```

主要体験はこうした。

- 縦型短尺ドリルフィード
- 現在のドリル、進捗、復習キュー
- 正解/不正解の選択
- 保存、復習キュー追加、履歴削除
- auth premium、billing failed、media failed
- offline / timeout

DrillSwipeでは別の失敗が出た。Next devのTurbopackでReact Client Manifest関連のエラーが出た。

```text
Could not find the module ... global-error.js#default in the React Client Manifest
```

これはアプリの要件不備というより、Next dev / Turbopack / Playwright webServerの組み合わせで起きる不安定さだった。Playwright側のwebServerをwebpack dev serverへ切り替えた。

```ts
webServer: {
  command: "pnpm run mock:start && pnpm exec next dev --webpack --hostname 127.0.0.1 --port 3000",
  url: "http://127.0.0.1:3000"
}
```

その後、削除なしの再実行で3ブラウザE2Eが成功した。

```text
12 passed (Chromium / Firefox / WebKit)
```

実行したゲートはこれだ。

```text
pnpm install --frozen-lockfile  exit=0
pnpm run lint                   exit=0
pnpm run typecheck              exit=0
pnpm run test                   exit=0
pnpm run test:coverage          exit=0
pnpm run build                  exit=0
pnpm run doctor:playwright      exit=0
pnpm run mock:doctor            exit=0
3 browser E2E                   12 passed
```

## 何が分かったか

今回の再実証で、100点化の本質は特定アプリの作り込みではなく、**完了条件を実行可能な契約として先に置くこと**だと確認できた。

特に効いたのはこの4つ。

1. UIと独立したmock serviceを用意する
2. E2Eからmock serviceの状態を変える
3. Firefoxを対象外にせず、遅さを前提に安定化する
4. docs、score、terminal logを同じ実験単位に置く

逆に、まだ改善できる点もある。

- DrillSwipeのunit coverageはゲートとしては通ったが、対象範囲はまだ薄い
- Proof appsのCIはroot workflowでまとめて回す形にし、今回成功まで確認した
- 生成アプリが増えるとruntime artifactの除外ルールをさらに厳密にする必要がある

## CI化

横展開用にroot workflowを追加し、実際にGitHub Actionsで成功まで確認した。

```text
.github/workflows/app-clone-lab-proofs-ci.yml
```

matrixで `StudyStream` と `DrillSwipe` を回す。

```text
StudyStream: e2e/studystream.spec.ts
DrillSwipe: e2e/drillswipe.spec.ts
```

CIでは次を実行する。

```text
pnpm install --frozen-lockfile
pnpm exec playwright install --with-deps
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run test:coverage
pnpm run build
pnpm run doctor:playwright
pnpm run mock:doctor
pnpm exec playwright test ... --project=chromium --project=firefox --project=webkit
```

## 結論

Trial 005の100点化は、WatchFlow専用の偶然ではなかった。

`AGENTS.md` と `aidd-app-clone-lab` skillに落としたことで、動画学習キューと短尺ドリルという別ゴールでも、mock backend、失敗状態、3ブラウザE2Eまで到達できた。

次にやるべきことは、この手順をAIDD-Specの「アプリパターン実験プロトコル」として整理し、各app cloneで同じ採点表とCI証跡を比較できるようにすることだ。
