# AIDD Control Plane MVP 006：AI依頼書と検証ログをつなぐ Verification Run Tracker

> 2026-06-30 / Codex Mastery Lab  
> 対象: AIDD Control Plane SaaS化 / Verification Evidence / Review Record / Learning Log / AIDD-Spec v0.1  
> 結果: **AI Task Packetに対して、品質ゲートが未実行・成功・失敗・証跡不足のどれなのかを画面で追えるようにした**

## 読者の悩み：AIが「できました」と言っても、何が本当に通ったのか分からない

MVP 004では、ユーザーが「何を作りたいか」から Product Brief、AI Task Packet、Verification Plan、Codex Promptを生成できるようにした。

MVP 005では、アプリ種別テンプレートを追加し、学習支援、予約管理、動画サービス風、社内申請などで必要な状態契約・品質ゲート・リスク・証跡要件を最初から入れられるようにした。

でも、まだ大事な穴が残っていた。

```text
AIに依頼書を渡した。
Codexが「テストしました」と言った。
でも、どのコマンドが本当に通った？
E2Eは3ブラウザで通った？
スクリーンショットやterminal evidenceは残っている？
失敗ログはReview RecordやLearning Logへ戻った？
```

AI駆動開発で怖いのは、完成報告が上手に見えるのに、証拠が薄いことだ。家計簿で「今月は大丈夫」と言われても、レシートと残高がなければ確認できない。それと同じで、AI開発にも「実行結果のレシート」が必要になる。

## 今回の仮説

AIDD Control Planeの画面に Verification Run Tracker を置けば、AI Task Packet と検証ログのズレを早く見つけられるはずだ。

今回の仮説はこうだ。

```text
AI Task Packet
  -> 必要な品質ゲート
  -> 実行ログ
  -> terminal evidence
  -> screenshot evidence
  -> Review Record
  -> Learning Log
```

この流れが画面で見えれば、「AIが言ったから完了」ではなく、「証跡が揃ったから完了」に近づける。

## 実験内容

Codexに、MVP 005のProject Intake WizardとApp Type Templatesを壊さず、MVP 006として Verification Run Tracker を追加させた。

今回のTrackerは、次の品質ゲートを扱う。

| 品質ゲート | 何を確認したいのか | なぜ必要か |
| --- | --- | --- |
| lint | 基本的なコード品質違反がないか | 小さなルール違反を後工程へ持ち越さないため |
| typecheck | TypeScript上の型エラーがないか | 画面で触る前に壊れたデータの扱いを見つけるため |
| test | ドメインロジックが期待通りか | UIの見た目だけでは分からない判定を守るため |
| build | 本番ビルドが通るか | dev serverだけ動く状態を完了扱いしないため |
| e2e | ブラウザで主要フローが動くか | ユーザー操作として成立するか確認するため |
| doctor:aidd | AIDD-Spec上の必須文言・証跡・構造があるか | プロジェクト固有の品質契約を自動で点検するため |

各ゲートには、status、command、summary、evidence fileを持たせた。statusは `未実行`、`成功`、`失敗`、`証跡不足` の4種類にした。

## 初期状態：未実行と証跡不足を隠さない

初期画面では、Project Intake Wizardの右側にReadiness Reviewがあり、下部にVerification Run Trackerが表示される。

![AIDD Control Plane MVP 006 初期画面](assets/aidd-control-plane-mvp006-empty.png)

ここで重要なのは、まだ何も実行していない状態を曖昧にしないことだ。

```text
not ready: failure stateがあります
lint: 未実行
terminal evidence不足
screenshot evidence不足
```

初心者向けSaaSとしては、重要なゲートを「あとで任意に見る」場所へ隠すべきではない。AIDD Control Planeは、AIに渡す前・AIから戻った後の両方で、足りない証拠を見える場所に置く必要がある。

## 成功状態：3ブラウザE2Eと証跡が揃う

成功サンプルを適用すると、lint、typecheck、test、build、e2e、doctor:aiddが成功になり、Chromium / Firefox / WebKit のE2E成功も表示される。

![AIDD Control Plane MVP 006 ready状態](assets/aidd-control-plane-mvp006-ready.png)

この状態では、terminal evidenceとscreenshot evidenceも表示される。

```text
terminal evidence:
- experiments/aidd-control-plane-mvp-006/artifacts/terminal/lint.txt
- experiments/aidd-control-plane-mvp-006/artifacts/terminal/e2e.txt
- experiments/aidd-control-plane-mvp-006/artifacts/terminal/doctor-aidd.txt

screenshot evidence:
- experiments/aidd-control-plane-mvp-006/artifacts/screenshots/aidd-control-plane-mvp006-ready.png
- assets/aidd-control-plane-mvp006-ready.png
```

AIDD-Specでいう Verification Evidence は、単なる「ログ置き場」ではない。AI Task Packetで約束した検証が、本当に実行されたことを確認するための証拠セットだ。

## failure state：E2Eやdoctorが落ちたらreadyにしない

失敗サンプルでは、e2eとdoctor:aiddを失敗にした。WebKitも失敗として表示される。

![AIDD Control Plane MVP 006 failure状態](assets/aidd-control-plane-mvp006-failure.png)

ここでの狙いは、失敗を記事の都合で隠さないことだ。

AI駆動開発では、失敗ログは価値がある。どのゲートが落ちたか、どのブラウザで壊れたか、どの証跡が足りないかをReview Recordに残すことで、次のAI Task Packetを改善できる。

## 証跡不足：コマンド成功でも完了ではない

もう一つの重要な状態として、コマンドは成功しているがevidence fileが足りないケースを作った。

![AIDD Control Plane MVP 006 証跡不足状態](assets/aidd-control-plane-mvp006-evidence-missing.png)

これは現場で起きやすい。

```text
テストは通った。
でもログを保存していない。
スクリーンショットもない。
あとから第三者が確認できない。
```

AIDD-Specでは、この状態を成功扱いにしない。なぜなら、AIと人間のレビューで共通の説明に戻れないからだ。

## 実装で追加したもの

Codexには `CODEX_PROMPT.md` で次を依頼した。

```text
- Verification Run Tracker セクションを追加する
- lint / typecheck / test / build / e2e / doctor:aidd を表示する
- status、command、summary、evidence file を持たせる
- 初期、成功、失敗、証跡不足の状態を作る
- Readiness Review と生成物へ Verification Run を反映する
- unit test / 3ブラウザE2E / doctor:aidd / capture script を更新する
```

実装後、Codexの自己申告は信用せず、こちらで個別に検証した。

![AIDD Control Plane MVP 006 terminal evidence](assets/aidd-control-plane-mvp006-terminal-evidence.png)

## 検証ログ

今回の独立検証結果は次の通り。

| command | result |
| --- | --- |
| `pnpm install --frozen-lockfile` | pass |
| `pnpm run lint` | pass |
| `pnpm run typecheck` | pass |
| `pnpm run test` | 11 tests passed |
| `pnpm run build` | pass |
| `pnpm run test:e2e` | Chromium / Firefox / WebKitで24 tests passed |
| `pnpm run doctor:aidd` | pass |

E2Eでは、次を確認した。

```text
初期empty stateが表示される
テンプレート未選択/未適用が表示される
テンプレート適用後に生成結果へリスクと証跡要件が入る
成功サンプルで全ゲート成功と3ブラウザE2E成功が表示される
失敗サンプルでe2e / doctor:aidd失敗が表示される
証跡不足サンプルでevidence file不足が表示される
Chromium / Firefox / WebKitで同じ確認が通る
```

なお、Next.js buildではESLint plugin検出に関する警告が出ている。ビルド自体は成功しているが、AIDD-Spec的には今後の改善対象として残す。

## 読者がすぐ使えるチェックリスト

| チェック項目 | 何を確認したいのか | なぜ必要か |
| --- | --- | --- |
| AI Task Packetに品質ゲートがあるか | lint/typecheck/test/build/e2e/doctorなどが明記されているか | AIが「適当に確認しました」で終わるのを防ぐため |
| 各ゲートに実行ログがあるか | コマンドごとのterminal evidenceが残っているか | 後から第三者が再確認できるようにするため |
| 3ブラウザE2Eを分けて見たか | Chromium / Firefox / WebKitの結果が分かるか | 1ブラウザだけの成功を過大評価しないため |
| スクリーンショット証跡があるか | empty、ready、failure、証跡不足などの画面が残っているか | UI状態の説明を文章だけに頼らないため |
| 証跡不足を失敗として扱ったか | コマンド成功でもログや画像がなければnot readyにしたか | 完了判断を感想ではなく証拠にするため |
| Review Recordに戻したか | pass/fail/findings/remaining riskを残したか | 次の修正指示を具体化するため |
| Learning Logに戻したか | 失敗・修正・次回Spec改善点を残したか | 同じ失敗を次のAI依頼で減らすため |

## AIDD-Specへの接続

今回のMVP 006は、AIDD-Spec v0.1の次の項目に接続する。

- AI Task Packet
- Test Plan
- Verification Evidence
- Review Record
- Learning Log
- Conformance Target L2 Lite

重要なのは、Verification Evidenceを「おまけの添付ファイル」にしないことだ。

AIに渡す依頼書、実行したコマンド、保存したログ、画面キャプチャ、レビュー記録、次回改善が一列につながって、はじめてAI駆動開発の再現性が上がる。

## SaaSとしての意味

AIDD Control Planeは、別のコーディングエージェントを作るSaaSではない。

今回のVerification Run Trackerは、次の価値に近い。

```text
粗いアプリ案
  -> Project Intake Wizard
  -> App Type Templates
  -> AI Task Packet
  -> Verification Run Tracker
  -> Verification Evidence
  -> Review Record
  -> Learning Log
  -> 次のAI Task Packet改善
```

ユーザーにとっての価値は、「どのAIを使うか」よりも、「何を頼み、何を確認し、どんな証拠を残すか」が揃うことだ。

将来的には、ここにGitHub Actionsのrun URL、artifact一覧、Playwright report、coverage、レビューコメントを接続できる。MVP 006は、その前段階として、画面上の状態モデルを作った。

## noteで読む価値について

今回の記事で大事なのは、「AIで記事を量産した」ことではない。

実際にCodexへ依頼し、実装を受け取り、別プロセスでlint/typecheck/unit/build/3ブラウザE2E/doctorを走らせ、スクリーンショットとterminal evidenceを残した。これは実験した本人しか書けない一次情報だ。

noteで読まれる可能性があるのは、こういう再利用できる失敗・修正・証跡のセットだと思う。

## 次回

次の自然な改善は、**CI/artifact連携** だ。

MVP 007では、Verification Run TrackerにGitHub Actions風のrun URL、artifact名、coverage、Playwright reportを紐づけ、SaaS上で「ローカル検証」と「CI検証」の差分を見えるようにしたい。
