# {{DATE}} Codex Mastery Lab / AIDD-Spec Daily Report

> 想定読了時間: 約10分  
> 記事種別: {{Concept / Template / Experiment / Failure / SaaS / Book}}  
> 将来の書籍章: {{BOOK_CHAPTER}}

## タイトル案

{{TITLE}}

## この記事で検証する問い

- 今日の問い:
- 仮説:
- なぜ今これを検証するか:
- 読者が普段の開発で困りそうな場面:
- AIDD-Spec上の対象成果物:

## 前提情報: なぜこの検証をするのか

- バイブコーディングだと何が起きがちか:
- 駆け出しエンジニアが見落としやすい点:
- 現場で後から困る点:
- 今回の検証で明らかにしたいこと:

## 先に結論

- 実験で分かったこと:
- 期待と違ったこと:
- AIDD-Specに追加/修正すべきこと:
- 次回試すこと:

## 実験環境

- Machine: Apple M4 Mac mini / 16GB RAM / 256GB SSD
- OS:
- Codex CLI:
- Hermes:
- Repo:
- 対象アプリ/実験ディレクトリ:
- 実行日時:

## 今日作る/監査するもの

### バイブコーディング対象

- アプリ種別:
- 最小機能:
- あえて曖昧にした点:
- 想定ユーザー:
- 本来満たすべき仕様:

### 成功条件

- 仕様充足:
- 品質:
- セキュリティ:
- アクセシビリティ:
- パフォーマンス:
- 運用保守:

## Step 0: 実験前の状態

### ファイル構成 / git状態

```text
{{GIT_STATUS_BEFORE}}
```

### 今日使う評価観点

1.
2.
3.

## Step 1: Codexに雑に作らせる

### 実際に渡した日本語プロンプト

```text
{{RAW_VIBE_PROMPT_JA}}
```

### 実行コマンド

```bash
{{CODEX_COMMAND_1}}
```

### 実行ログ全文または重要部分

```text
{{CODEX_LOG_1}}
```

### 何が生成されたか

```text
{{GENERATED_FILES}}
```

### この時点での観察

- 良かった点:
- 怪しい点:
- まだ確認できていない点:

## Step 2: バイブコーディング版をブラウザで操作する

### 起動コマンド

```bash
{{VIBE_SERVER_COMMAND}}
```

### 操作内容

1.
2.
3.

### 操作GIF

{{VIBE_APP_GIF}}

### ブラウザ/コンソール確認

- URL:
- Console errors:
- Console warnings:
- Network errors:

```text
{{VIBE_BROWSER_CONSOLE_OUTPUT}}
```

### ブラウザで見て分かったこと

- 

## Step 3: 品質ゲートを通す

### Lint / Format / Typecheck

```bash
{{QUALITY_COMMANDS}}
```

```text
{{QUALITY_OUTPUT}}
```

### Build warnings

```text
{{BUILD_WARNINGS}}
```

### 依存パッケージ / バージョン健全性

```bash
{{DEPENDENCY_COMMANDS}}
```

```text
{{DEPENDENCY_OUTPUT}}
```

### ここから分かったこと

- 

## Step 4: 仕様充足を確認する

### 本来の受け入れ条件

| ID | 受け入れ条件 | 結果 | 証拠 |
|---|---|---|---|
| AC-1 |  | PASS/FAIL |  |

### 実際に試した操作

1.
2.
3.

### 結果

```text
{{REQUIREMENT_CHECK_OUTPUT}}
```

### ここから分かったこと

- 

## Step 5: セキュリティ観点で見る

### 実行したチェック

```bash
{{SECURITY_COMMANDS}}
```

```text
{{SECURITY_OUTPUT}}
```

### 見つかった懸念

```yaml
{{SECURITY_FINDINGS}}
```

### ここから分かったこと

- 

## Step 6: アクセシビリティ / Lighthouse / デザインを見る

### Accessibility

```text
{{A11Y_OUTPUT}}
```

### Lighthouse / Performance

```text
{{LIGHTHOUSE_OUTPUT}}
```

### デザイン品質レビュー

- レイアウト:
- 余白:
- タイポグラフィ:
- 状態設計:
- モバイル対応:

### ここから分かったこと

- 

## Step 7: 欠陥を標準フォーマットで記録する

```yaml
findings:
  - category:
    finding:
    severity:
    observed_by:
    ideal_state:
    fix_instruction:
    needed_upstream_info:
      -
    standard_update:
      document:
      field:
    codex_prompt_delta: |
    verification:
      command:
      expected:
```

## Step 8: 理想状態へ近づけるためにCodexへ再指示する

### 再指示の日本語プロンプト

```text
{{FIX_PROMPT_JA}}
```

### 実行コマンド

```bash
{{CODEX_COMMAND_2}}
```

### 実行ログ

```text
{{CODEX_LOG_2}}
```

### 修正後diff

```diff
{{DIFF_AFTER_FIX}}
```

## Step 9: 修正版をブラウザで操作する

### 起動コマンド

```bash
{{FIXED_SERVER_COMMAND}}
```

### 操作内容

1.
2.
3.

### 操作GIF

{{FIXED_APP_GIF}}

### ブラウザ/コンソール確認

- URL:
- Console errors:
- Console warnings:
- Network errors:

```text
{{FIXED_BROWSER_CONSOLE_OUTPUT}}
```

## Step 10: 再検証する

### 再実行したコマンド

```bash
{{REVERIFY_COMMANDS}}
```

### 結果

```text
{{REVERIFY_OUTPUT}}
```

### 改善したこと / まだ残ったこと

- 改善:
- 残課題:

## Step 11: 逆算する

### 今回の欠陥を防ぐために、前段で必要だった情報

| 欠陥 | 必要だった前工程情報 | AIDD-Spec成果物 | AI Task Packetに入れるべき項目 |
|---|---|---|---|
|  |  |  |  |

### つまり、最初からCodexに渡すべきだったもの

```text
{{IMPROVED_INITIAL_PROMPT_OR_TASK_PACKET_JA}}
```

## AIDD-Specへの反映

- 更新した標準ドキュメント:
- 追加したテンプレート項目:
- 次回検証すべき仮説:

## 実務で使うならどうするか

- どこまでAIに任せてよいか:
- どこで人間レビューを挟むべきか:
- チーム導入時のガードレール:
- SaaS化した場合に自動化すべき箇所:

## 明日から使えるチェックリスト

- [ ]
- [ ]
- [ ]
- [ ]
- [ ]

## 次回検証

{{NEXT_EXPERIMENT}}

## 付録: 生ログ / 参照ファイル

- Experiment path:
- Logs:
- Assets:
- Standards updated:
