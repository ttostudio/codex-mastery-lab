# AIDD Control Plane MVP 002：AI Task PacketをJSON Contract Checkerで検査する

> 2026-06-28 / Codex Mastery Lab  
> 対象: AIDD Control Plane MVP / JSON Contract Checker / AIDD-Spec v0.1  
> 結果: **AI Task Packet、Verification Evidence、Review Record、Learning Logを画面上で検査し、不足pathと改善提案を出せるようになった**

## 先に結論

MVP 001では、AIDD-Specの流れをSaaS画面にした。

```text
Product Brief
  -> AI Task Packet
  -> Agent Runbook
  -> Review Record
  -> Learning Log
```

しかし、まだ弱い点があった。

画面で入力できても、その入力が標準に沿っているかは人間が見る必要があった。

そこでMVP 002では、AIDD-Specの成果物を **JSON Contract Checker** で検査する画面に進めた。

今回検査対象にした成果物は4つ。

- AI Task Packet
- Verification Evidence
- Review Record
- Learning Log

検証結果:

```text
pnpm install --frozen-lockfile  exit=0
pnpm run lint                   exit=0
pnpm run typecheck              exit=0
pnpm run test                   4 tests passed / exit=0
pnpm run build                  exit=0
pnpm run test:e2e               3 passed / exit=0
pnpm run doctor:aidd            exit=0
```

自己評価は **94 / 100**。

完成SaaSではないが、AIDD Control Planeが「入力を作る画面」から「入力を検査する画面」へ進んだ。

## 画面キャプチャ

初期画面では、Contract Checker Dashboard、Artifact JSON Editors、Schema Requirements、Validation Resultsが並ぶ。MVP 001よりも「標準成果物を検査する道具」らしくなった。

![AIDD Control Plane MVP 002 初期画面](assets/aidd-control-plane-mvp002-empty.png)

サンプルを入れると、AI Task Packet / Verification Evidence / Review Record / Learning Logがすべて合格になる。ここでユーザーは、標準成果物の最小形をそのまま見られる。

![AIDD Control Plane MVP 002 合格状態](assets/aidd-control-plane-mvp002-valid.png)

必須項目を1つ削ると、`missing_required` になり、不足pathが表示される。これは人間のレビューをかなり助ける。曖昧に「足りません」ではなく、どの成果物のどのpathが足りないかを出せるからだ。

![AIDD Control Plane MVP 002 missing_required状態](assets/aidd-control-plane-mvp002-missing.png)

JSONを壊すと `invalid_json` になる。AIエージェントが壊れたJSONや途中の出力を返したときに、まず形式エラーとして切り分けられる。

![AIDD Control Plane MVP 002 invalid_json状態](assets/aidd-control-plane-mvp002-invalid-json.png)

検証ログも画像化した。記事では、これ以降もできるだけ画面と実行結果のキャプチャを入れる。

![AIDD Control Plane MVP 002 terminal evidence](assets/aidd-control-plane-mvp002-terminal-evidence.png)

## 何がSaaSらしくなったのか

MVP 001は、AIDD-Specの流れを見えるようにした。

MVP 002は、そこに **合否判定** を入れた。

違いは大きい。

MVP 001:

```text
入力を作る
```

MVP 002:

```text
入力を作る
入力を検査する
不足をpathで示す
改善提案を出す
```

AIDD Control PlaneをSaaSにするなら、ユーザーに文章を入力させるだけでは弱い。

必要なのは、入力がAIエージェントに渡してよい品質かをチェックすることだ。

## 実装した検査

今回の検査は、完全なJSON Schema Draft validatorではない。

まずはAIDD-Spec v0.1で必要な最小pathを定義し、存在と空配列/空文字を検査した。

例: AI Task Packetの必須path。

```text
spec_version
task_id
conformance_target
product_brief.name
product_brief.user_problem
product_brief.target_pattern
product_brief.non_goals
experience_contract.screens
experience_contract.states
experience_contract.failure_contract
implementation_contract.constraints
quality_gates.required_commands
expected_outputs.files
acceptance_criteria
```

Verification Evidenceでは、次を必須にした。

```text
id
task_id
overall_status
command_logs
reports
screenshots
checked_at
```

Review Recordでは、次を必須にした。

```text
id
task_id
score
passed
findings
remaining_risks
```

Learning Logでは、次を必須にした。

```text
id
task_id
what_worked
what_failed
spec_updates_needed
```

## なぜpath表示が効くのか

初心者向けに言うと、これは健康診断の結果に近い。

「体調が悪いです」だけでは次に何をすればよいか分からない。

でも、

```text
AI Task Packet.product_brief.user_problem が足りません
```

と表示されれば、直す場所が分かる。

AIDD-Specは、AIに良い指示を渡すための説明書である。

その説明書に必要な欄が空なら、AIは勝手に推測してしまう。

だからAIDD Control Planeは、AIへ渡す前に不足欄を見つける必要がある。

## 実装ファイル

生成された主なファイル:

```text
experiments/aidd-control-plane-mvp-002/generated-repo/app/page.tsx
experiments/aidd-control-plane-mvp-002/generated-repo/src/lib/contracts.ts
experiments/aidd-control-plane-mvp-002/generated-repo/src/lib/samples.ts
experiments/aidd-control-plane-mvp-002/generated-repo/tests/contracts.test.ts
experiments/aidd-control-plane-mvp-002/generated-repo/e2e/contract-checker.spec.ts
experiments/aidd-control-plane-mvp-002/generated-repo/scripts/doctor-aidd.mjs
```

検証ロジックの中心は `src/lib/contracts.ts` にある。

```text
validateArtifact
validateContract
parseArtifactJson
statusLabel
```

UI、unit test、E2E、doctorが同じ契約を参照するようにした。

## E2Eで確認したこと

Playwrightでは3つのシナリオを確認した。

```text
サンプル入力で全体statusが合格になる
必須項目を削るとmissing_requiredとpathが表示される
壊れたJSONでinvalid_json stateが表示される
```

結果:

```text
3 passed
```

## doctor:aidd

`doctor:aidd` は、AIDD Control Planeとして最低限の静的契約を検査する。

今回確認したもの:

- 必須ファイル
- npm scripts
- 必須UI token
- empty / valid / invalid_json / missing_required / warning / offline
- fetch/XMLHttpRequest/WebSocket/localStorage/sessionStorage禁止
- 外部URL禁止

結果:

```text
doctor:aidd passed
checked files: 12
checked scripts: lint, typecheck, test, build, test:e2e, doctor:aidd
checked states: empty, valid, invalid_json, missing_required, warning, offline
exit=0
```

## 今回分かったこと

### 1. AIDD-Specは検査可能な形にできる

前回までは、AIDD-Specは仕様書・テンプレート・画面だった。

今回は、最小限だが検査ロジックになった。

これは重要だ。

標準は、読まれるだけでは弱い。

SaaSにするなら、入力と出力をチェックできる必要がある。

### 2. path単位の不足表示は初心者にも効く

「AI Task Packetが不十分です」では直せない。

でも、

```text
AI Task Packet.product_brief.user_problem
```

のようにpathで表示すれば、どこを直せばよいか分かる。

これは、AIDD Control Planeの中核UIになりそうだ。

### 3. 完全なJSON Schemaの前に、最小Contract Checkerで十分価値がある

今回はJSON Schema Draftを完全実装していない。

でも、必須path、空値、壊れたJSONだけでも価値が出た。

つまりMVPとしては、最初から巨大なSchema validatorを作る必要はない。

まずはAIDD-Specの最小契約をチェックし、その後にJSON Schemaへ寄せればよい。

## まだ足りないもの

まだ完成SaaSではない。

未到達:

- 永続化
- 複数プロジェクト
- 実行ログアップロード
- GitHub Actions artifact取り込み
- 完全なJSON Schema Draft対応
- CI上のL4検証
- ユーザー管理
- チーム共有

## 次に作るもの

次は **MVP 003: Evidence Collector UI** が自然だ。

今は成果物JSONを検査できる。

次は、実行ログ、スクリーンショット、Playwright report、CI URLをアップロード/登録し、Verification Evidenceとしてまとめる画面が必要になる。

```text
MVP 001: ワークフロー画面
MVP 002: Contract Checker
MVP 003: Evidence Collector
MVP 004: GitHub Actions連携
MVP 005: 複数Project/Packet管理
```

## まとめ

MVP 002で、AIDD Control Planeは一段SaaSに近づいた。

```text
AIDD-Spec成果物
  -> JSON editor
  -> Contract Checker
  -> missing path
  -> improvement suggestions
  -> Verification Evidence
```

これはまだ完成ではない。

しかし、AIエージェントに渡す前の入力を「標準に照らして検査する」という、AIDD Control Planeの中核機能が動き始めた。
