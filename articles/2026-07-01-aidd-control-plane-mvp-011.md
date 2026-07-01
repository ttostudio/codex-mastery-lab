# AIDD Control Plane MVP 011：足りない証跡を次の修正依頼へ変える Evidence Gap Repair Planner

> 2026-07-01 / Codex Mastery Lab  
> 対象: AIDD Control Plane SaaS化 / Verification Evidence / Review Record / Learning Log / AIDD-Spec v0.1  
> 結果: **coverage、Playwright report、test-results、terminal evidence、3種類の画面キャプチャ不足を検出し、次回AI Task Packet差分へ戻す画面を追加した**

## 読者の悩み：CIが通っても、記事やレビューに必要な証跡が欠ける

AI駆動開発でよく困るのは、「テストは通りました」という報告と、公開・レビューに使える証跡の間に距離があることだ。

たとえば、次のような状態が起きる。

- CIは成功しているが、coverage artifactが残っていない
- Playwright HTML reportが保存されていない
- test-resultsがなく、失敗時の添付情報を追えない
- terminal evidenceのログはあるが、どの実行単位のものか分からない
- empty / valid / failure の画面キャプチャが足りず、note記事に載せられない
- AIが「確認した」と言っているが、読者やレビュアーが後から同じ証拠を見られない

MVP 010では、GitHub Actions run URLからowner、repo、run id、jobs API、artifacts API、logs URL、token scopeを取り出す「GitHub Actions Artifact Fetch Plan」を作った。MVP 011では、その先に進み、取得計画やVerification Evidenceを見て「何が足りないか」「次に何を直すか」まで出す **Evidence Gap Repair Planner** を追加した。

## 今回の仮説

今回の仮説はこうだ。

```text
Verification Evidence
  -> 必須証跡の不足検出
  -> Review Finding
  -> Learning Log
  -> Next AI Task Packet Delta
  -> Codex prompt delta
  -> 再実行コマンド
```

AIDD Control Planeが「証跡がない」と言うだけでは弱い。冷蔵庫の中身を見て買い物メモを作るように、足りない証跡から次の依頼文と再実行手順まで作れれば、AIへの再依頼がかなり具体的になる。

## 実験内容

`experiments/aidd-control-plane-mvp-011/generated-repo` に、Next.js + TypeScript + pnpmのMVPを作った。MVP 010までのProject Intake Wizard、Verification Run Tracker、Artifact Evidence Binder、CI Artifact Importer、GitHub Actions Artifact Fetch Planを残し、その上にEvidence Gap Repair Plannerを追加した。

今回の必須証跡は7種類にした。

| 必須証跡 | 何を確認したいのか | なぜ必要か |
| --- | --- | --- |
| coverage | テスト範囲の数値とレポートが残るか | 「テストした」の深さを後から確認するため |
| playwright-report | E2EのHTMLレポートを開けるか | 失敗時の画面・trace・操作流れを追うため |
| test-results | E2Eの添付ファイルや失敗結果が保存されるか | CI成功/失敗の理由を再確認するため |
| terminal-evidence | lint/typecheck/test/build/e2e/doctorのログが残るか | AIの要約ではなく一次ログを見るため |
| empty screenshot | 初期状態が説明できるか | SaaSの入口で何が足りないかを読者に見せるため |
| valid screenshot | 正常状態が説明できるか | 「揃ったらどう見えるか」を比較できるようにするため |
| failure screenshot | 失敗状態が説明できるか | 修正対象を画面で共有できるようにするため |

MVP範囲では外部GitHub APIには接続しない。サンプルデータを使い、決定的なローカル状態としてempty / valid / failureを切り替えた。

## 画面キャプチャ

### empty / initial：不足証跡7件を初期画面で見せる

初期状態では、Evidence Gap Repair Plannerが空の証跡セットを評価し、coverage、playwright-report、test-results、terminal-evidence、empty screenshot、valid screenshot、failure screenshotが足りないことを表示する。

![AIDD Control Plane MVP 011 empty状態](assets/aidd-control-plane-mvp011-empty.png)

ここで大事なのは、重要な品質ゲートをオプションボタンの奥に隠さないことだ。AIDD Control Planeは「何を検証すべきか」を見せるSaaSなので、初期画面から不足が見える必要がある。

### filled / ready：必須証跡が揃うと不足0件になる

validサンプルでは、7種類の証跡が揃い、Evidence Gap Repair Plannerは不足0件として扱う。Verification Run Tracker、Artifact Evidence Binder、CI Artifact Importer、GitHub Actions Artifact Fetch PlanもMVP 010の流れを維持する。

![AIDD Control Plane MVP 011 valid状態](assets/aidd-control-plane-mvp011-valid.png)

この状態で初めて、「CIが通った」だけではなく、「note記事・レビュー・再現確認に必要な材料が揃った」と言える。

### failure / insufficient：足りない証跡を修正指示へ変える

failureサンプルでは、あえて複数の証跡を欠けさせた。画面は不足項目ごとに、重要度、影響するAIDD-Spec artifact、修正指示、再実行コマンド、Codex prompt deltaを表示する。

![AIDD Control Plane MVP 011 failure状態](assets/aidd-control-plane-mvp011-failure.png)

ここがMVP 011の中心だ。単に赤くするのではなく、次のような修理依頼へ変換する。

```text
coverage / playwright-report / test-results / terminal-evidence / 画面キャプチャを
Verification Evidenceとして保存し、Review RecordとLearning Logに不足理由を残す。
不足した証跡ごとに再実行コマンドとCodex prompt deltaを出す。
```

## 失敗/修正

今回の実装で見えた失敗と修正は次の通り。

| 観点 | 失敗またはリスク | 修正 |
| --- | --- | --- |
| 証跡分類 | Artifact Evidence Binderの不足とRepair Plannerの不足が似て見える | Planner側は「次の修理依頼」まで出す役割として分けた |
| 完了判定 | コマンド成功だけでreadyに見えてしまう | coverage / report / results / screenshotsまで必須証跡として評価した |
| 記事化 | screenshotが不足するとnote向け一次情報にならない | empty / valid / failure / terminal evidenceを必須画像にした |
| 再依頼 | 「CIを直して」では曖昧すぎる | Next AI Task Packet DeltaとCodex prompt deltaへ不足項目を戻した |
| 将来拡張 | GitHub API実接続は未実装 | MVP 011では非ゴールにし、次回以降のmock backend/CI連携へ送った |

また、E2Eの再実行ログとして `06-e2e-rerun.txt` には失敗ログも残った。最終的な根拠としては、3ブラウザで24件が通った `06-e2e.txt` を採用している。失敗ログを消さずに残すことで、再現性の説明と次回改善の材料になる。

## 検証ログ

独立検証として、次のコマンドを個別に実行し、`experiments/aidd-control-plane-mvp-011/artifacts/terminal/` に保存した。

| コマンド | 結果 |
| --- | --- |
| `pnpm install --frozen-lockfile` | pass |
| `pnpm run lint` | pass |
| `pnpm run typecheck` | pass |
| `pnpm run test` | 22 tests passed |
| `pnpm run build` | pass。ただしNext.js ESLint plugin警告あり |
| `pnpm run test:e2e` | 24 passed / Chromium・Firefox・WebKit |
| `pnpm run doctor:aidd` | pass。12 files、7 scripts、状態契約、テンプレートを確認 |

terminal evidenceの画像も保存した。

![AIDD Control Plane MVP 011 terminal evidence](assets/aidd-control-plane-mvp011-terminal-evidence.png)

E2Eでは次の観点を確認した。

- 初期empty stateが表示される
- Evidence Gap Repair Plannerがemptyで不足証跡7件を出す
- validサンプルで不足0件になる
- failureサンプルでplaywright-report、test-results、terminal-evidence、各種screenshot不足が表示される
- 修正指示、再実行コマンド、Codex prompt deltaがReview FindingsとNext AI Task Packet Deltaへ戻る
- Chromium / Firefox / WebKitで同じ流れが通る

## 読者が使えるチェックリスト

自分のAI駆動開発でも、次のチェックリストを使える。

| チェック項目 | 何を確認したいのか | なぜ必要か |
| --- | --- | --- |
| CI成功だけで完了にしていないか | artifactとログが残っているか | 後からレビューできない成功報告を避けるため |
| coverageが保存されているか | テスト範囲の数値を確認できるか | 「テストした」の質を見える化するため |
| Playwright reportが保存されているか | E2Eの画面・traceを開けるか | 失敗時の原因調査を速くするため |
| test-resultsが保存されているか | 添付ファイルや失敗結果を追えるか | CI上の再現情報を失わないため |
| terminal evidenceが保存されているか | lint/typecheck/test/build/e2eの一次ログがあるか | AIの要約に依存しないため |
| empty / valid / failure画像があるか | 画面状態を比較できるか | 記事、レビュー、受け入れ確認で説明しやすくするため |
| 不足をAI Task Packetへ戻しているか | 次回AI依頼が具体化されているか | 同じ曖昧な依頼を繰り返さないため |

## AIDD-Spec / AIDD Control Plane SaaSへの接続

MVP 011は、AIDD-Spec v0.1の中でも特に次のartifactへ接続する。

- Verification Evidence
- Review Record
- Learning Log
- AI Task Packet
- Test Plan
- Release Checklist

AIDD-Specの狙いは、AIに「いい感じに作って」と頼むことではない。料理のレシピや健康チェック表のように、何を作り、何を確認し、どの証拠を残すかを共通化することだ。

今回のEvidence Gap Repair Plannerは、AIDD Control Plane SaaSにとって重要な部品になる。SaaSの価値は、単にコードを書くことではなく、次の流れを支えることにある。

```text
曖昧な完了報告
  -> 証跡不足の検出
  -> Review Finding化
  -> Learning Log化
  -> AI Task Packet差分化
  -> 次の実装依頼へ戻す
```

これにより、AIDD Control Planeは「AI開発の検査票と修理メモを作る場所」に近づく。

## 次回

次回以降は、MVP 011で残した改善候補を進めたい。

- 実GitHub Actions URLの到達確認をmock backend化する
- artifactのファイル存在確認を追加する
- BinderとRepair Plannerをユーザー入力で編集できるようにする
- Review Recordのfindings入力とLearning Logのspec_updates_needed入力を編集可能にする
- CIでcoverage、playwright-report、test-results、terminal-evidenceをartifact保存するworkflow検査を追加する

MVP 011で、AIDD Control Planeは「証跡を束ねる」から「証跡不足を修理依頼へ変える」段階に進んだ。次は、実CIやmock backendと接続し、手入力サンプルではなく実行結果から同じ判断ができるかを検証する。
