# AIDD Control Plane MVP 016：CI workflowの「artifact保存漏れ」を先に見つける

前回のMVP 015では、Mock CI Serviceをfixture駆動にし、Docker Compose経路とNode fallback経路で同じ`/health`、`/state`、`/__control/state`を確認できるようにしました。

ただし、CI連携の話を進めると、次の落とし穴が残ります。

> CIコマンドは並んでいるのに、レビューに必要なartifactが保存されていない。

これはAI駆動開発ではかなり危険です。料理でいえば、手順は書いてあるのに、味見の記録、失敗した写真、材料の残量メモが残っていない状態です。あとから人間や別のAIが確認できません。

今回はAIDD Control Plane MVP 016として、GitHub Actions workflowを静的監査し、品質gateとartifact保存の不足をReview Finding、AI Task Packet Delta、AIDD-Spec更新候補へ戻す「CI Workflow Artifact Auditor」を追加しました。

## 読者の悩み

AIに「CIを追加して」と頼むと、よく次のような結果になります。

- `lint`や`test`は実行している
- でも`playwright-report`がartifact保存されていない
- `test-results`が残らない
- terminal evidenceがCI artifactに含まれない
- `mock:doctor`や`doctor:aidd`が抜ける
- 成功/失敗の結果が次回の依頼文に戻らない

画面上は「CIあり」に見えても、あとから検証できないならAIDD-Spec的には弱い証跡です。

## 今回の仮説

今回の仮説は次です。

> CI workflowを実行結果だけでなく、実行前の定義ファイルとして静的監査し、必須gateとartifact保存pathをUI・doctor・E2Eで確認すれば、AIDD Control Planeは「CIがある」から「再レビューできる証跡が残る」へ進む。

AIDD Control Planeの価値は、AIにコードを書かせることそのものではありません。AIに渡す前のチェックリストと、AIが作った後の証跡を、同じ流れで確認できることです。

## 実験内容

`experiments/aidd-control-plane-mvp-016/generated-repo`に、MVP 015を引き継いで次を追加しました。

- `.github/workflows/aidd-control-plane.yml`
- UIの「CI Workflow Artifact Auditor」セクション
- valid / failure / emptyのworkflow監査サンプル
- workflow監査ロジック
- Review Finding / AI Task Packet Delta / AIDD-Spec更新候補への変換
- `doctor:aidd`によるworkflow tokenとartifact path検査
- `capture:mvp016`
- 日本語Unit/E2Eテスト

workflowには次のgateを含めています。

```text
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run doctor:aidd
pnpm run mock:doctor
pnpm run test:e2e
```

artifact保存対象は次です。

```text
coverage
playwright-report
test-results
experiments/aidd-control-plane-mvp-016/artifacts/terminal
```

## 画面キャプチャ

### empty / initial：workflow未設定の不足を最初に見せる

![MVP016 empty state](../assets/aidd-control-plane-mvp016-empty.png)

emptyでは、workflowやartifact pathが未設定の状態を表示します。重要なのは、空欄をただの空欄で終わらせず、「何を足すべきか」をReview FindingとAI Task Packet Deltaへ戻すことです。

### filled / valid：gateとartifact保存が揃った状態

![MVP016 valid state](../assets/aidd-control-plane-mvp016-valid.png)

validでは、`lint`、`typecheck`、`test`、`build`、`doctor:aidd`、`mock:doctor`、3ブラウザE2Eがworkflowに含まれ、coverage、Playwright report、test-results、terminal evidenceがartifact保存される状態を確認できます。

### failure：artifact保存漏れを修理指示へ変換する

![MVP016 failure state](../assets/aidd-control-plane-mvp016-failure.png)

failureでは、`doctor:aidd`や`mock:doctor`のgate不足、`playwright-report`や`test-results`のartifact保存漏れを検出します。単に赤く表示するだけでなく、必要な上流情報、標準更新候補、次回Codex prompt deltaまで表示します。

### terminal evidence：検証ログを画像として残す

![MVP016 terminal evidence](../assets/aidd-control-plane-mvp016-terminal-evidence.png)

記事用にterminal evidence画像も作成しました。公開証跡では、Markdown本文だけでなく画像内にもローカルパスやホスト名が残らないように確認する必要があります。

## 失敗 / 修正

今回の実装では、Codexが一通り実装した後、3ブラウザE2Eで失敗しました。

原因は、画面上に同じ文言が複数出ていたことです。

```text
strict mode violation:
getByText('AIDD-Spec更新候補') resolved to 2 elements
```

これはUIの失敗というより、テストの指定が曖昧だった問題です。Playwrightのstrict modeは、曖昧なlocatorを見つけると止めてくれます。AIDD-Spec的には良い失敗です。人間が読む文言と、テストが狙う要素を分ける必要があるからです。

修正では、見出しは`getByRole("heading", { name: "AIDD-Spec更新候補" })`で確認し、リスト内に複数出る文言は`.first()`で意図を明確にしました。

もう1つの運用上のメモとして、CodexがE2E修正ループに入りそうだったため、十分な差分が出た時点で停止し、独立検証へ切り替えました。AIの自己申告ではなく、こちらで個別コマンドを実行して確認しています。

push後の初回GitHub Actionsでは、`actions/setup-node`の`cache: pnpm`がpnpm有効化前に走り、`Unable to locate executable file: pnpm`で失敗しました。これはアプリ品質ではなくCI定義の順序問題です。MVP 016の狙い通り、workflow自体も検査対象として扱い、`cache: pnpm`を外して`corepack enable`後に通常の`pnpm install --frozen-lockfile`を実行する形へ修正しました。

## 検証ログ

最終確認は次の通りです。

```text
pnpm install --frozen-lockfile: pass
pnpm run lint: pass
pnpm run typecheck: pass
pnpm run test: pass
pnpm run build: pass
pnpm run doctor:aidd: pass
pnpm run mock:doctor: pass
pnpm run test:e2e: pass
```

3ブラウザE2Eは33件通過しました。

```text
33 passed (1.1m)
```

## 読者が使えるチェックリスト

| チェック項目 | 何を確認したいのか | なぜ必要か |
| --- | --- | --- |
| workflowファイルがある | CIが口約束ではなく定義されているか | AIの完了報告だけに依存しないため |
| installが固定されている | `pnpm install --frozen-lockfile`で再現できるか | 依存関係のずれを防ぐため |
| lint/typecheck/test/buildがある | 基本品質gateがCIで走るか | ローカルだけ成功を避けるため |
| doctor:aiddがある | AIDD-Spec固有の抜けを検査するか | 通常テストで見えない証跡不足を拾うため |
| mock:doctorがある | mock service contractをCIでも確認するか | UIとmockの接続が形だけになるのを防ぐため |
| 3ブラウザE2Eがある | Chromiumだけの成功ではないか | Firefox / WebKit差分を早く見つけるため |
| coverageを保存する | テスト量の証跡が残るか | 後からレビューしやすくするため |
| playwright-reportを保存する | E2E失敗時に画面・traceを追えるか | 失敗原因を再現しやすくするため |
| test-resultsを保存する | rawなE2E結果が残るか | HTML reportだけに依存しないため |
| terminal evidenceを保存する | 実行ログがartifactとして残るか | 記事・レビュー・次回改善に使えるため |

## AIDD-Spec / AIDD Control Plane SaaSへの接続

MVP 016は、AIDD-Spec v0.1の次のartifactに接続します。

- Verification Evidence
- Test Plan
- Review Record
- Learning Log
- External Integration Contract
- AI Task Packet

AIDD Control Plane SaaSとして見ると、これは「GitHub連携」の前段です。いきなりAPI tokenを扱う前に、workflow定義が必要な証跡を残す形になっているかを先に確認する。これにより、実GitHub Actions APIと接続した後も、ただの成功バッジ表示で終わりにくくなります。

note記事としても、ここに一次情報があります。「AIでCIを作りました」という一般論ではなく、実際にE2Eがstrict modeで落ち、locatorを直し、3ブラウザで通したログと画像がある。AI量産記事よりも、こうした実験した本人しか書けない証跡の方が長く価値を持つはずです。

## 次回

次回の自然な改善対象は、CI workflow定義から一歩進んだ「GitHub Actions artifact URLの取り込み」です。

- mockではなく実CI artifact URLをEvidence Binderへ貼る
- CI run URL、artifact URL、Playwright report URLの整合性を検査する
- workflow成功でもartifact欠落ならReview Findingへ戻す
- 公開記事とpreviewでCI証跡画像をより見やすくする

AIDD Control Planeは、AIにコードを書かせるSaaSではなく、誰でもベストに近いAI駆動開発フローと設計ドキュメントを作るための入口に近づいています。MVP 016では、その入口に「CI workflowの証跡保存チェック」を追加しました。
