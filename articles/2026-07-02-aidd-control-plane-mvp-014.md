# AIDD Control Plane MVP 014：CI証跡を「画面内サンプル」から独立Mock Serviceへ切り出す

前回のMVP 013では、CI証跡をSaaS画面に取り込む方向性は見えたものの、重要な弱点が残っていました。画面内のサンプル状態を切り替えているだけでは、Codexやレビュー担当者が「本当に外部CIのような境界をまたいで検証したのか」を判断しにくい、という問題です。

今回はその弱点を、AIDD Control Plane MVP 014として修正しました。ポイントは、CI証跡の状態をUI内の固定データではなく、独立したMock CI Serviceから取得することです。

## 読者の悩み

AIにWebアプリを作らせると、最後にこういう報告が返ってくることがあります。

> lint、test、build、E2Eを追加しました。すべて確認済みです。

しかし、実際に見たいのは「きれいな完了報告」ではありません。

- どのCI runを見たのか
- どのartifactが残っているのか
- Playwright reportやtest-resultsは本当にあるのか
- API制限やtimeout時にどう扱うのか
- 失敗した状態をE2Eから再現できるのか

ここが曖昧なままだと、AIの作業結果は「読める説明」にはなっても、「再確認できる証跡」にはなりません。

AIDD Control Planeで扱いたいのは、まさにこの不安です。AIに任せる範囲が広がるほど、完了報告ではなく、あとから確認できる証跡の束が必要になります。

## 今回の仮説

今回の仮説は次の通りです。

> CI証跡の状態を独立Mock CI Serviceとして切り出し、UIとE2Eが`/state`と`/__control/state`を通じて状態を読むようにすれば、AIDD Control Planeは「CI連携の見た目」ではなく「検証可能な契約」に近づく。

ここでいう契約は、難しい概念ではありません。料理でいえば、完成写真だけでなく、材料、分量、手順、味見ポイントが揃っている状態です。AIに「いい感じに作って」と頼むのではなく、「この状態を読み、この失敗も表示し、このコマンドで確認する」と渡せる共通説明を作る、ということです。

## 実験内容

MVP 014では、`experiments/aidd-control-plane-mvp-014/generated-repo`に次の要素を追加・検証しました。

- `mocks/ci-service/server.mjs`
  - `/health`
  - `/state`
  - `/__control/state`
  - CORS
  - `empty / valid / failure / timeout / rate_limit`の5状態
- `pnpm run mock:start`
- `pnpm run mock:stop`
- `pnpm run mock:doctor`
- `pnpm run doctor:aidd`
- `pnpm run capture:mvp014`
- 3ブラウザE2E
  - Chromium
  - Firefox
  - WebKit

UI側は、`NEXT_PUBLIC_MOCK_CI_SERVICE_URL`または`http://127.0.0.1:4314`からMock CI Serviceを読みます。E2Eは`/__control/state`へPOSTして状態を切り替え、画面反映を確認します。

## 画面キャプチャ

### empty / initial：CI証跡がまだない状態

![MVP014 empty state](../assets/aidd-control-plane-mvp014-empty.png)

最初の状態では、CI run URLやartifactが未取得であることを明示します。ここで大事なのは、未入力を単なる空欄にしないことです。「何が足りないのか」を最初から見せることで、次に何を集めればよいかが分かります。

### filled / ready：証跡が揃った状態

![MVP014 valid state](../assets/aidd-control-plane-mvp014-valid.png)

`valid`では、CI run、jobs、artifacts、terminal evidence、screenshot evidenceが揃った状態として表示されます。AIDD Control Planeが目指すのは、単に「成功」と書くことではなく、成功と判断した材料を同じ画面で確認できることです。

### failure / insufficient：証跡不足の状態

![MVP014 failure state](../assets/aidd-control-plane-mvp014-failure.png)

`failure`では、playwright-report、test-results、screenshotなどの不足を、Evidence Gap Repair Plannerへ戻します。失敗を赤く表示するだけでなく、次回のAI Task Packetに何を追加すべきかまで落とし込むのが今回の狙いです。

### timeout：CI取得が止まった状態

![MVP014 timeout state](../assets/aidd-control-plane-mvp014-timeout.png)

`timeout`では、外部CIから証跡を取れない場合のfallbackを表示します。実サービス化すると、APIやネットワークは必ず不安定になります。そのため、timeout時に「手動Evidence Binderへterminal evidenceを保存する」という逃げ道をUI上に出しました。

### rate_limit：API制限中の状態

![MVP014 rate limit state](../assets/aidd-control-plane-mvp014-rate_limit.png)

`rate_limit`では、60秒待機、`actions:read / contents:read`の確認、手動証跡添付、次回AI Task Packet Deltaを表示します。これはAIDD-SpecでいうVerification EvidenceとReview Recordを、API制限時にも途切れさせないための設計です。

### terminal evidence：実行ログの画像化

![MVP014 terminal evidence](../assets/aidd-control-plane-mvp014-terminal-evidence.png)

記事用のterminal evidence画像は、ローカルパスを置換したうえで生成しました。本文だけをサニタイズしても、画像内にローカル情報が残ることがあるため、スクリーンショット生成前に置換する必要があります。

## 失敗 / 修正

今回の一次情報として重要だったのは、最初からすべてが通っていたわけではないことです。

初期ログでは、次の問題が出ていました。

- `pnpm run lint`が未使用importやNode globalsで失敗していた
- `pnpm run build`が途中終了していた
- `pnpm run doctor:aidd`が古いMVP番号や古いcapture script名を見て失敗していた
- `pnpm run mock:doctor`は既存のMock CI Serviceが`rate_limit`状態のまま残っていると、初期`empty`契約の検査に失敗した

修正後は、lint、typecheck、unit test、build、doctor、mock doctor、3ブラウザE2Eを再実行し、記事用のterminal evidenceも再生成しました。

ここから得た学びは、Mock Serviceを導入すると、UIの品質だけでなく「サービス起動状態」も証跡品質に影響するという点です。特に`mock:doctor`は、既存プロセスの状態に引っ張られないように、起動・停止の前提を明確にする必要があります。

## 検証ログ

今回の最終確認は次の通りです。

```text
pnpm run lint: pass
pnpm run typecheck: pass
pnpm run test: pass (22 tests)
pnpm run build: pass (Next.js production build)
pnpm run doctor:aidd: pass
pnpm run mock:doctor: pass
pnpm run test:e2e: pass (30 tests, Chromium / Firefox / WebKit)
```

実際のE2Eでは、30件が3ブラウザで通過しました。

```text
Running 30 tests using 1 worker
...
30 passed (1.2m)
```

また、Mock CI Serviceは次の契約を満たしました。

```text
/health
/state
/__control/state
empty
valid
failure
timeout
rate_limit
```

## 読者が使えるチェックリスト

| チェック項目 | 何を確認したいのか | なぜ必要か |
| --- | --- | --- |
| UI内サンプルだけでなくMock Serviceを持つ | 外部境界をまたぐ検証になっているか | 画面だけの成功表示を避けるため |
| `/health`を持つ | serviceが起動しているか | E2Eやdoctorの前提を確認するため |
| `/state`を持つ | UIが同じ状態を再現できるか | 人とAIが同じ前提でレビューするため |
| `/__control/state`を持つ | E2Eから失敗状態を作れるか | failure、timeout、rate_limitを決定的に検査するため |
| empty / valid / failureを分ける | 入力前、成功、不足を区別できるか | 「まだない」と「壊れている」を混同しないため |
| timeout / rate_limitを分ける | 外部APIの不安定さを扱えるか | 実サービスでは通信失敗が通常運用で起きるため |
| terminal evidence画像を作る | 実行結果を記事やReview Recordへ残せるか | 後から第三者が確認できる一次情報にするため |
| 画像内のローカル情報を消す | 公開してよい証跡になっているか | パスや環境名の漏えいを防ぐため |
| 3ブラウザE2Eを通す | Chromium依存の成功ではないか | WebKit / Firefoxで壊れるUIを早期に見つけるため |

## AIDD-Spec / AIDD Control Plane SaaSへの接続

MVP 014は、AIDD-Specの中では特に次のartifactに接続します。

- Verification Evidence
- Review Record
- Learning Log
- AI Task Packet
- Test Plan
- External Integration Contract
- Observability Planの入口

今回の成果は、AIDD Control Plane SaaSが「コードを書くエージェント」ではなく、「AIに渡す前提と、AIが残した証跡を検査する場所」になるための部品です。

MVP 013までのCI連携は、まだ画面内の説明に寄っていました。MVP 014で独立Mock CI Serviceを置いたことで、AIDD Control Planeは次の段階に進めます。

- 実CI APIに接続する前に、contractを固定する
- timeoutやrate_limitを先にUIとE2Eへ入れる
- 失敗状態をAI Task Packet Deltaへ戻す
- 証跡が足りない状態を「成功」と誤判定しない

これは、AIDD-Specを単なる文書にしないためにも重要です。標準は、読んで終わりではなく、検査できる形に落ちて初めて実務で使えます。

## 次回

次回は、今回見えた未達をさらに進めます。

- Docker Compose経路を追加し、Node fallbackと同じcontractを共有する
- mock serviceのfixtureをファイル化し、E2Eとdocsで同じデータを見る
- artifactのファイル存在確認をmock serviceへ追加する
- CIで`coverage`、`playwright-report`、`test-results`、`terminal-evidence`をartifact保存するworkflow検査を追加する

AIDD Control Planeは、少しずつ「AIに依頼する前に何を揃えるか」「完了後に何を証拠として残すか」を扱うSaaSに近づいています。MVP 014では、その中でもCI証跡を再現可能な契約へ近づける一歩を確認できました。
