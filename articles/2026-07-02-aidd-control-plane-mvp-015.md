# AIDD Control Plane MVP 015：Mock CI ServiceをfixtureとDocker Compose経路へ進める

前回のMVP 014では、CI証跡を画面内サンプルから独立Mock CI Serviceへ切り出しました。これで、UIとE2Eが`/state`と`/__control/state`を通じて同じ失敗状態を確認できるようになりました。

ただし、まだ弱点がありました。状態データが`server.mjs`の中に直書きされていたため、UI、E2E、docs、記事が「同じ材料」を見ていると説明しにくかったのです。料理でいえば、レシピが紙に分かれておらず、鍋の中に直接書いてあるような状態です。

今回はAIDD Control Plane MVP 015として、Mock CI Serviceをfixture駆動にし、Docker Compose経路とNode fallback経路で同じcontractを確認できるようにしました。

## 読者の悩み

AIに「CI連携っぽい画面」を作らせると、見た目はそれらしくなります。

しかし、レビューで本当に知りたいのは次です。

- 失敗状態はどこから来ているのか
- そのデータはE2Eから再現できるのか
- Dockerで起動してもNodeで起動しても同じcontractなのか
- UIとテストとdocsが同じfixtureを参照しているのか
- timeoutやrate limitを、あとから同じ手順で再現できるのか

ここが曖昧だと、AIの「完了しました」は、確認可能な証跡ではなく、ただの報告文になってしまいます。

## 今回の仮説

今回の仮説は次です。

> Mock CI Serviceの状態をfixtureファイルへ分離し、Docker Compose経路とNode fallback経路の両方で同じ`/health`、`/state`、`/__control/state`を検査すれば、AIDD Control Planeは「CI連携の見た目」から「再現できる証跡契約」へ近づく。

AIDD-Specで重要なのは、AIに渡す前の共通説明です。完成イメージを曖昧に伝えるのではなく、「この状態ファイルを読み、この失敗を出し、このコマンドで確認する」と渡せる形にすることです。

## 実験内容

MVP 015では、`experiments/aidd-control-plane-mvp-015/generated-repo`に次を追加しました。

- `mocks/ci-service/fixtures/empty.json`
- `mocks/ci-service/fixtures/valid.json`
- `mocks/ci-service/fixtures/failure.json`
- `mocks/ci-service/fixtures/timeout.json`
- `mocks/ci-service/fixtures/rate_limit.json`
- fixtureを読む`mocks/ci-service/server.mjs`
- `docker-compose.yml`
- Node fallbackの`pnpm run mock:start` / `mock:stop` / `mock:doctor`
- Docker Compose経路とNode fallback経路を同じcontractとして説明するUI
- `capture:mvp015`
- fixture、Compose、docs、capture、AIDD-Spec接続を確認する`doctor:aidd`

画面には「fixture駆動」「Docker Compose経路」「Node fallback経路」「同一contract」を常時表示し、重要な検証経路が隠れないようにしました。

## 画面キャプチャ

### empty / initial：fixtureから入力待ち状態を読む

![MVP015 empty state](../assets/aidd-control-plane-mvp015-empty.png)

emptyでは、CI run URLが未入力で、artifactも未取得です。単に空欄にするのではなく、「どの証跡がまだないのか」を表示します。

### filled / valid：必須証跡が揃った状態

![MVP015 valid state](../assets/aidd-control-plane-mvp015-valid.png)

validでは、lint、typecheck、test、E2E、mock doctor、doctor:aiddが成功し、coverage、playwright-report、test-results、terminal evidence、各スクリーンショットが揃った状態として表示されます。

### failure：証跡不足を修理計画へ戻す

![MVP015 failure state](../assets/aidd-control-plane-mvp015-failure.png)

failureでは、短すぎるcommit SHA、失敗job、不足artifactをReview Findingへ分類します。赤い表示だけで終わらせず、次回のAI Task Packet Deltaへ戻すところがAIDD Control Planeの価値です。

### timeout：取得不能時の逃げ道を表示する

![MVP015 timeout state](../assets/aidd-control-plane-mvp015-timeout.png)

実サービスでは、CI APIやネットワークが止まることがあります。timeout状態では、再試行だけでなく、手動Artifact Evidence Binderへterminal evidenceを残すfallbackを表示しました。

### rate limit：API制限時の判断材料を出す

![MVP015 rate limit state](../assets/aidd-control-plane-mvp015-rate_limit.png)

rate limitでは、60秒待機、`actions:read` / `contents:read`、手動証跡添付、次回AI Task Packet Deltaを表示します。

### terminal evidence：検証ログを画像として残す

![MVP015 terminal evidence](../assets/aidd-control-plane-mvp015-terminal-evidence.png)

記事用のterminal evidence画像も生成しました。公開する証跡では、本文だけでなく画像内のローカル情報にも注意が必要です。

## 失敗 / 修正

今回の一次情報として重要だったのは、E2Eが最初から通らなかったことです。

初回の3ブラウザE2Eでは、timeout状態の文言期待値が古いままでした。

```text
期待: 手動Evidence Binderへterminal evidence
実際: 手動Artifact Evidence Binderへterminal evidence
```

これは小さな差に見えますが、AIDD-Spec的には大事です。UI文言、テスト、docsが同じ意味を共有していないと、AIに渡す依頼文もずれていきます。

修正後、残っていたmock service / Next devプロセスを停止し、`mock:doctor`と3ブラウザE2Eを再実行しました。

## 検証ログ

最終確認は次の通りです。

```text
pnpm install --frozen-lockfile: pass
pnpm run lint: pass
pnpm run typecheck: pass
pnpm run test: pass (22 tests)
pnpm run build: pass (Next.js production build)
pnpm run doctor:aidd: pass
pnpm run mock:doctor: pass
pnpm run test:e2e: pass (30 tests / Chromium, Firefox, WebKit)
```

E2Eは3ブラウザで30件通過しました。

```text
30 passed (1.1m)
```

なお、`next build`ではNext.js ESLint plugin未検出のwarningが出ています。ビルドは成功していますが、次回以降の品質改善候補として残します。

## 読者が使えるチェックリスト

| チェック項目 | 何を確認したいのか | なぜ必要か |
| --- | --- | --- |
| fixtureを分離する | UI、E2E、docsが同じ状態データを見るか | サンプルの二重管理を避けるため |
| `/health`を持つ | mock serviceが起動しているか | テスト前提を短時間で確認するため |
| `/state`を持つ | 現在のscenarioを外から読めるか | 人とAIが同じ状態を見てレビューするため |
| `/__control/state`を持つ | E2Eから失敗状態を作れるか | timeoutやrate_limitを決定的に再現するため |
| Docker Compose経路を用意する | container起動でも同じcontractか | CIや他メンバー環境に近づけるため |
| Node fallbackを残す | Dockerが使えない時も検証できるか | cronや軽量環境で実験を止めないため |
| doctorで静的検査する | fixture、Compose、docs、captureの抜けを検出できるか | 「あるつもり」を防ぐため |
| 3ブラウザE2Eを通す | Chromiumだけの成功ではないか | Firefox / WebKit差分を早めに見つけるため |

## AIDD-Spec / AIDD Control Plane SaaSへの接続

MVP 015は、AIDD-Spec v0.1の次のartifactに接続します。

- Verification Evidence
- External Integration Contract
- Test Plan
- Review Record
- Learning Log
- AI Task Packet

今回の変更で、AIDD Control Planeは「CI証跡を表示する画面」から一歩進みました。fixture、Mock Service、Docker Compose、Node fallback、doctor、E2Eが同じcontractを扱うことで、AIに渡す前提と、AIが残した証跡を同じ流れで確認できます。

SaaSとして見ると、これは将来の実CI連携の前段です。いきなりGitHub Actions APIへ接続するのではなく、先に失敗状態と証跡不足の扱いを固定しておく。これにより、実API接続後も「成功表示だけ」のSaaSになりにくくなります。

## 次回

次回の自然な改善対象は、CI workflowとartifact保存の検査です。

- GitHub Actions workflowをgenerated repoに追加する
- CIで`coverage`、`playwright-report`、`test-results`、terminal evidenceをartifact保存する
- doctor:aiddでworkflowのartifact設定を静的検査する
- CI失敗時のReview FindingをAI Task Packet Deltaへ戻す

AIDD Control Planeは、AIにコードを書かせるSaaSではなく、誰でもベストに近いAI駆動開発フローと設計ドキュメントを作るための入口に近づいています。MVP 015では、そのための「再現できるmock CI契約」を一段固めました。
