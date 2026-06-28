# AGENTS.mdとaidd-app-clone-lab skillは何に効いたのか：100点化手順を読み解く

> 2026-06-28 / Codex Mastery Lab  
> 対象: `AGENTS.md` / `skills/software-development/aidd-app-clone-lab/SKILL.md`  
> 結論: **一発で100点を出す魔法ではなく、80〜90点の生成物を100点へ収束させる検証契約だった**

## 先にまとめ

今回作った `AGENTS.md` と `aidd-app-clone-lab` skillは、Codexに「良い感じのアプリ」を作らせるための文章ではない。

目的はもっと具体的で、次の3つだ。

1. 最初の生成で抜けがちな要件を、最初から作業範囲に入れる
2. 途中で失敗したときに、何を直せば100点に近づくか分かるようにする
3. 最後に「できた」と言ってよい条件を、CI・artifact・記事まで含めて固定する

つまり、これは **完璧な一発プロンプト** ではなく、**100点へ収束させるための作業契約** だ。

実際の横展開では、StudyStreamもDrillSwipeも一発で100点ではなかった。

| 実験 | 初回生成の到達点 | 詰まったところ | どの記述が効いたか | 最終結果 |
| --- | --- | --- | --- | --- |
| StudyStream | mock、UI、docs、E2Eの土台は出た | Firefoxが遅く、`loading.tsx` のままtimeout | Firefoxを外さずtimeout/retryで安定化するルール | 3ブラウザE2E 33 passed |
| DrillSwipe | lint/typecheck/unit/build/mock doctorまでは通った | Next dev Turbopack manifest error、CIのPlaywright doctorがmacOS前提 | `next dev --webpack`、portable doctor、root CI workflowのルール | 3ブラウザE2E 12 passed / CI success |

## AGENTS.mdの役割

`AGENTS.md` は、そのrepoで作業するAIに毎回効かせたい基本契約だ。

今回の `AGENTS.md` は短い。短いが、Codex Mastery Labではかなり強い意味を持つ。

```text
このrepoは、AI駆動開発で「見た目だけのvibe code」から、CI・mock backend・3ブラウザE2E・記事化まで到達できるかを検証する実験場です。
```

ここでまず、作業のゴールを「UIを作る」から「検証済みの実験を閉じる」に変えている。

AIにアプリを作らせると、自然には見た目やコンポーネントへ寄りやすい。だから最初に、repoの目的をこう固定した。

- CIまで見る
- mock backendまで見る
- 3ブラウザE2Eまで見る
- 記事化まで見る

この一文が、以降の作業全体の評価軸になる。

## Default stackは何に効くか

`AGENTS.md` の冒頭には、default stackを書いた。

```text
- Next.js + TypeScript を基本スタックにする。
- package managerは pnpm。
- UIは日本語で書く。
- テストケース名・docs・記事も原則日本語で書く。
- AIDD-Spec説明では建築/建物メタファーを使わない。
```

これは地味だが重要だ。

| 記述 | 効く問題 | 理由 |
| --- | --- | --- |
| Next.js + TypeScript | 実験間の比較不能を防ぐ | 毎回stackが変わると、失敗理由がAIの問題なのかstack差なのか分からない |
| pnpm | lockfileとCIを安定させる | npm/yarn/pnpmが混ざるとCI再現性が落ちる |
| UI/テスト/docsは日本語 | 日本向け記事にそのまま使える | 後で翻訳すると、テスト名と記事の対応が崩れる |
| 建築メタファー禁止 | AIDD-Specの説明癖を抑える | ユーザーの長期方針に合わない表現を最初から避ける |

StudyStreamとDrillSwipeでは、どちらも日本語UI・日本語テスト名・日本語docsが生成された。これは単なる好みではなく、後で記事にそのまま接続するための形式だ。

## Product briefは何に効くか

`AGENTS.md` では、新しい「〇〇風」サンプルを作るときに、まず `docs/product-brief.md` を要求している。

```text
docs/product-brief.md に、対象サービス風の体験、差別化したゴール、非ゴール、主要ユーザーフローを書く。
```

これは「YouTubeっぽい」「TikTokっぽい」を、単なる見た目コピーにしないために効く。

今回の横展開ではこうなった。

| 元の体験パターン | そのまま作ると危ないもの | Product briefで変えたゴール |
| --- | --- | --- |
| YouTube風 | 動画カードと再生画面だけの模倣 | 学習動画キュー / 集中視聴 / 学習履歴 |
| TikTok風 | 縦スクロール動画フィードだけの模倣 | 短尺反復学習ドリル / 正解不正解 / 復習キュー |

これにより、記事で書ける実験テーマが生まれた。

単に「似たUIを作れた」ではなく、**認識できる体験パターンを、別目的のプロダクトへ移植できるか** という検証になる。

## Mock backend contractは何に効くか

`AGENTS.md` ではmock serviceを必須にした。

```text
mocks/api, mocks/media, mocks/auth, mocks/billing など、UIから独立したmock serviceを用意する。
各serviceは /health, /state, /__control/state を持つ。
```

これは、AI生成アプリがよくやる「コンポーネント内に状態を直書きする」を防ぐためだ。

mock serviceがないと、E2Eでこういう検証ができない。

- APIが落ちたら何が出るか
- mediaが失敗したら何が出るか
- anonymous/premiumでUIが変わるか
- billing failedが画面に出るか
- timeout/offlineの状態を再現できるか

`/__control/state` があると、Playwrightから状態を直接変えられる。

```ts
await request.post("http://127.0.0.1:4010/__control/state", {
  data: { state: "offline" }
});
```

これがStudyStreamでは、media failure、auth、billing、offline、timeoutの表示検証に効いた。DrillSwipeでも、短尺フィードの状態だけでなく、課金・認証・media失敗をUIに出すための根拠になった。

## 「状態と失敗」を最初から入れる意味

`AGENTS.md` にはこう書いた。

```text
online / offline / timeout / media failure / auth anonymous / auth premium / billing failed などをUIに反映する。
```

これは100点化にかなり効く。

AIに普通に「YouTube風アプリを作って」と頼むと、ほぼ必ずhappy path中心になる。

- 動画一覧が出る
- 動画詳細が出る
- 再生ボタンがある

しかし、実験として見るべきなのは、むしろ失敗時だ。

| 失敗状態 | なぜ必要か | 100点化への効き方 |
| --- | --- | --- |
| offline | ネットワーク断を扱えるか | 単なる静的UIではないことを示せる |
| timeout | 遅延時のUIを持てるか | loadingのまま固まる実装を避ける |
| media failure | 動画アプリらしい失敗を扱えるか | YouTube風/短尺動画風の本質に近い |
| auth anonymous/premium | 権限差を扱えるか | アプリ状態が複数あることを示せる |
| billing failed | 課金状態を扱えるか | SaaS的な現実の失敗を検証できる |

今回の横展開では、この指定が「見た目だけのUI」から「状態を持つ実験」へ引き上げた。

## Testing gateは何に効くか

`AGENTS.md` では、最低限のコマンドを列挙している。

```text
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run test:coverage
pnpm run build
pnpm run doctor:playwright
pnpm run mock:doctor
pnpm run test:e2e
```

これは、AIが「実装しました」で止まらないようにするためだ。

| gate | 見ているもの | 効く問題 |
| --- | --- | --- |
| lint | 基本的な品質 | 雑なunused/import崩れを止める |
| typecheck | 型整合性 | 見た目だけ動くが型が壊れている状態を止める |
| unit test | 細かいロジック | 永続化や状態変換の退行を検知する |
| coverage | テストの厚み | テストが1本だけある状態を見抜く |
| build | production build | devだけ動くNext.jsアプリを止める |
| doctor:playwright | browser準備 | E2E前の環境差分を早く検知する |
| mock:doctor | mock service準備 | UIとmockの接続不備を早く検知する |
| test:e2e | 実ユーザー操作 | 画面が本当に動くか確認する |

StudyStreamでは、これらの静的gateは通ったがFirefox E2Eで詰まった。だから問題は「実装が全部ダメ」ではなく「Firefoxでの表示待ちが不足」と切り分けられた。

DrillSwipeでも、lint/typecheck/unit/build/mock doctorが通っていたため、Turbopack manifest errorはアプリ要件の欠落ではなく、Next dev / Playwright webServer周辺の不安定性として扱えた。

## Firefoxを外さない指定は何に効いたか

`AGENTS.md` にはこう書いた。

```text
PlaywrightはChromium / Firefox / WebKitを対象にする。
Firefoxが遅い場合はアプリを諦めず、3ブラウザ連続実行では timeout: 120_000、expect: { timeout: 90_000 }、workers: 1、ローカル retries: 1 などで安定化する。
```

これはStudyStreamで直接効いた。

初回のStudyStreamはChromium/WebKitでは通り、Firefoxでだけ落ちた。失敗の見え方は、`loading.tsx` のままexpect timeoutになるというものだった。

ここでFirefoxを外すと、見かけ上は簡単に成功する。しかし、それでは100点ではない。

今回のルールではFirefoxを外さず、こう調整した。

```ts
timeout: 120_000,
expect: { timeout: 90_000 },
workers: 1,
retries: process.env.CI ? 2 : 1,
```

結果、StudyStreamは3ブラウザE2Eで `33 passed` まで到達した。

この指定がなければ、AIや人間は「Firefoxだけ不安定だから今回は除外」と判断しやすい。だからAGENTS.mdに先に書いておく意味がある。

## CI gateは何に効いたか

`AGENTS.md` には、CIについてこう書いた。

```text
repo rootの .github/workflows/ にworkflowを置く。generated repo内だけに置いて終わらせない。
CIでは pnpm exec playwright install --with-deps を実行する。
coverage, playwright-report, test-results をartifact保存する。
GitHub Actionsが success になるまで完了扱いにしない。
```

これはDrillSwipeで強く効いた。

生成されたrepo内にworkflowがあっても、親repoのGitHub Actionsでは動かない。だからroot workflowを作る必要がある。

さらに、ローカルで通っていてもCIでは落ちることがある。実際にDrillSwipeでは `doctor:playwright` が落ちた。

原因は、doctorがmacOSのPlaywright cache directoryを見ていたことだった。

```text
~/Library/Caches/ms-playwright
```

これはmacOSではよいが、Linux CIでは違う。そこで、skill側に次のpitfallを追加した。

```text
Avoid checking browser install by listing a cache directory.
Use chromium.launch(), firefox.launch(), and webkit.launch().
```

修正後、CIは成功した。

```text
App Clone Lab Proofs CI: success
```

ここで重要なのは、CI gateがなければこの問題に気づけなかったことだ。ローカル成功だけで記事にしていたら、読者が再実行したときに壊れる可能性が残る。

## Evidence and articleは何に効くか

`AGENTS.md` では記事と証跡も完了条件に入れた。

```text
experiments/<name>/artifacts/<name>/terminal/ に実行ログを保存する。
articles/ に日本語記事を書く。
preview/ を再生成する。
ローカル環境名が残っていないことを確認する。
```

これは、実験を「やった気がする」で終わらせないためだ。

今回も、最終的には次が残った。

```text
articles/2026-06-28-aidd-app-clone-lab-proof.md
preview/2026-06-28-aidd-app-clone-lab-proof.html
experiments/proof-youtube-focus/artifacts/...
experiments/proof-tiktok-drill/artifacts/...
```

また、`/Users/...` やホスト名、private tunnel文字列が記事・preview・artifactに残らないよう検査した。

公開記事にするなら、この処理はかなり大事だ。AI生成ログはローカルパスを大量に含みやすい。

## skillの役割

`AGENTS.md` がrepo全体の憲法だとすると、`aidd-app-clone-lab` skillは作業手順書だ。

ただし、ここでいう手順書は「こうしましょう」という一般論ではない。WatchFlow、StudyStream、DrillSwipeで実際に詰まった点を反映した、再利用用の具体手順だ。

skillには、AGENTS.mdより詳しい内容を入れている。

- 実験ディレクトリの形
- mock serviceの最小構成
- E2Eから `/__control/state` を叩く例
- Firefox安定化のPlaywright設定例
- visual snapshotをCIから分離する判断
- root GitHub Actions workflowの注意
- artifact確認の方法
- よくあるpitfall

つまりAGENTS.mdが「完了条件」を固定し、skillが「そこへ到達する方法」を補う。

## これがこれに効く対応表

一番大事な対応関係をまとめる。

| AGENTS.md / skillの記述 | 効いた問題 | 実際の効果 |
| --- | --- | --- |
| Product briefを書く | ただのUI模倣になる | YouTube風を学習動画キュー、TikTok風を短尺ドリルに変換できた |
| 実サービスの商標・ロゴ・コピーを使わない | cloneがコピー寄りになる | 体験パターンだけを抽象化できた |
| mock-api/mock-media/mock-auth/mock-billing | コンポーネント内の直書き状態になる | failure stateをE2Eから制御できた |
| `/health`, `/state`, `/__control/state` | mockが本当に動いているか分からない | doctorとE2Eから状態確認・変更できた |
| offline/timeout/media/auth/billing failure | happy pathだけになる | 100点採点に必要な失敗状態を持てた |
| lint/typecheck/unit/coverage/build | 見た目だけ動く | 静的品質とproduction buildを確認できた |
| 3ブラウザE2E | Chromiumだけ成功して終わる | Firefox/WebKit差分を検出できた |
| Firefoxを外さない | 不安定browserを除外してしまう | timeout/retry調整でStudyStreamを通せた |
| `next dev --webpack` pitfall | Turbopack manifest errorで止まる | DrillSwipeのE2Eを再実行できた |
| portable Playwright doctor | macOSでは通るがLinux CIで落ちる | DrillSwipe CI失敗を修正できた |
| root workflow必須 | generated repo内workflowだけで終わる | App Clone Lab Proofs CIを実際に動かせた |
| artifact保存 | CI greenだけで証跡が薄い | coverage/playwright-reportを残せた |
| ローカルパス検査 | 公開記事にprivate情報が混ざる | 記事/preview/artifactを公開しやすくした |

## 何がまだ足りないか

今回のAGENTS.mdとskillは、100点へ収束させるには効いた。ただし、まだ改善余地はある。

### 1. 一発100点を保証するものではない

StudyStreamもDrillSwipeも、一発では100点ではなかった。

- StudyStream: Firefox timeout調整が必要
- DrillSwipe: Turbopack回避、CI doctor修正が必要

つまり、現時点の知識は「一発成功プロンプト」ではなく「失敗を潰すための検証契約」だ。

### 2. 初回生成でcoverageの厚みまでは安定しない

DrillSwipeはgateとしては通ったが、unit coverageの対象はまだ薄かった。今後は、coverage thresholdや対象モジュールをもう少し明示した方がよい。

### 3. スクリーンショット/GIFの自動取得はまだ弱い

AGENTS.mdにはscreenshots/GIFを書くようにしているが、今回の記事ではCI artifactとterminal evidenceが中心だった。ユーザー向け記事としては、画面比較GIFをさらに自動で残す仕組みが必要だ。

## この記事の結論

`AGENTS.md` と `aidd-app-clone-lab` skillは、Codexを突然万能にするものではない。

効いたのは、次の3点だ。

1. 最初から抜けやすい品質項目を作業範囲に入れる
2. 失敗したときに、どの層の問題か切り分けられる
3. 最終的にCI・artifact・記事まで揃ったら完了、と言える

今回の横展開で見えたのは、AIDD-Specに必要なのは「すごい一発プロンプト」ではなく、**生成物を100点へ収束させる検証契約** だということだ。

この意味で、AGENTS.mdはrepoの完了条件を固定するもの、skillはその完了条件に到達するための実行手順を保存するもの、と考えると分かりやすい。
