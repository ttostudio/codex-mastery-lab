# Reverse Engineering Methodology for AIDD-Spec

> AIDD-Specは「理想の上流ドキュメント」から作らない。まず雑にバイブコーディングされたシステムを徹底監査し、理想状態へ直すために必要な後工程の要求を洗い出し、そこから前工程の指示・成果物へ逆算する。

## 1. 基本思想

AI駆動開発の標準仕様は、最初から綺麗なプロセスを描いても机上の空論になる。

現実のAI開発では、次が起きる。

- とりあえず動くが脆弱
- 仕様を満たしているようでエッジケースが抜ける
- UIはそれっぽいがアクセシビリティが低い
- Lighthouseが悪い
- コンソールに警告が出る
- 依存パッケージが古い/不適切
- アーキテクチャが後から破綻する
- テストがない、または粒度がずれる
- 非機能要件が何も決まっていない
- 運用保守の観点が存在しない

したがって、AIDD-Specは以下の順番で作る。

1. あえて雑なバイブコーディングで小さなシステムを作る
2. そのシステムをあらゆる角度から監査する
3. 理想状態との差分を明文化する
4. 差分を解消するための修正指示を作る
5. その修正指示を出すために必要だった前段成果物を逆算する
6. 逆算された成果物をAIDD-Specに追加する
7. 次の実験でその成果物を事前に渡し、失敗が減るか検証する

## 2. Reverse Chain

AIDD-Specの核となる逆算チェーンは以下。

```text
監査で見つかった欠陥
  ↓
理想状態の定義
  ↓
修正指示
  ↓
修正指示を生成するために必要な情報
  ↓
前工程で作るべき成果物
  ↓
Codexに最初から渡すべきAI Task Packet
  ↓
標準仕様AIDD-Specへの反映
```

例:

```text
LighthouseでCLSが悪い
  ↓
画像/フォント/レイアウトシフトの予算が必要
  ↓
画像サイズ固定、font-display、skeleton設計を入れる修正指示
  ↓
画面ごとのPerformance Budgetが必要
  ↓
Non-Functional ContractにPerformance Budgetを追加
  ↓
AI Task Packetに「Lighthouse目標値」を含める
```

## 3. 監査カテゴリ

### 3.1 Requirement Fit

問い:

- そもそも仕様を満たしているか
- ユーザーストーリーに対して画面/機能が揃っているか
- 受け入れ条件を満たす証拠があるか
- エッジケースが処理されているか
- エラー時の挙動が決まっているか

必要ツール:

- Acceptance Criteria Matrix
- E2Eテスト
- 手動シナリオチェック

逆算される前工程:

- AI-Ready Requirement Spec
- Acceptance Criteria Matrix
- Edge Case Catalog

### 3.2 Security / Vulnerability

問い:

- XSS/CSRF/SQL injection/path traversalの余地はないか
- 認証/認可は適切か
- secretが露出していないか
- 入力値検証はあるか
- 依存パッケージに既知脆弱性はないか

必要ツール:

- npm audit / pip-audit / osv-scanner
- Semgrep
- secret scanning
- manual threat modeling

逆算される前工程:

- Security Baseline
- Permission Matrix
- Data Classification
- External Integration Contract

### 3.3 Accessibility

問い:

- キーボード操作可能か
- aria属性は適切か
- コントラストは十分か
- フォーカス順は自然か
- スクリーンリーダーで意味が伝わるか

必要ツール:

- axe
- Lighthouse accessibility
- Playwright accessibility snapshot
- manual keyboard test

逆算される前工程:

- Accessibility Contract
- Screen State Design
- Component Responsibility

### 3.4 Performance / Lighthouse

問い:

- Lighthouse scoreは目標値以上か
- LCP/CLS/INPは許容範囲か
- バンドルサイズは妥当か
- 画像最適化されているか
- 不要なJavaScriptはないか

必要ツール:

- Lighthouse
- bundle analyzer
- browser performance profile

逆算される前工程:

- Performance Budget
- Asset Policy
- Rendering Strategy

### 3.5 Load / Scalability

問い:

- 同時アクセスで破綻しないか
- DB queryはN+1になっていないか
- rate limitはあるか
- queue/job設計が必要か

必要ツール:

- k6 / autocannon / wrk
- DB query log
- API latency measurement

逆算される前工程:

- Load Assumption
- Availability Target
- Scaling Policy
- Cost Budget

### 3.6 Design Quality

問い:

- 見た目がプロダクト品質か
- レイアウト、余白、タイポグラフィは一貫しているか
- コンポーネント設計は再利用可能か
- empty/loading/error/success stateがあるか
- モバイルで自然に使えるか

必要ツール:

- screenshot review
- visual regression
- design rubric

逆算される前工程:

- Design Contract
- Design System Tokens
- Screen Inventory
- Mobile Interaction Contract

### 3.7 Architecture / Maintainability

問い:

- フレームワーク選定は妥当か
- ディレクトリ構成は将来拡張に耐えるか
- 責務分離されているか
- 状態管理が過剰/不足していないか
- APIとUIが密結合しすぎていないか

必要ツール:

- dependency graph
- code review
- static analysis
- architecture decision record review

逆算される前工程:

- Architecture Decision Record
- System Boundary Map
- Domain Model

### 3.8 Dependency / Version Health

問い:

- 使われているパッケージは最新安定か
- メンテされているか
- 不要に重い依存はないか
- ライセンス問題はないか

必要ツール:

- npm outdated
- npm audit
- license checker
- package health review

逆算される前工程:

- Dependency Policy
- Approved Stack List
- License Policy

### 3.9 Build / Lint / Format / Console

問い:

- buildで警告がないか
- lint警告がないか
- formatterが通るか
- console error/warnがないか
- typecheckが通るか

必要ツール:

- build command
- eslint/ruff/etc.
- prettier/black
- tsc/mypy
- browser console capture

逆算される前工程:

- Quality Gate Contract
- Required Commands
- Definition of Done

### 3.10 Operations / Maintenance

問い:

- ログはあるか
- 監視すべきメトリクスは決まっているか
- バックアップ/リストアはあるか
- 障害時の手順はあるか
- コストが監視できるか

必要ツール:

- observability checklist
- runbook review
- cost estimate

逆算される前工程:

- Observability Plan
- Maintenance Runbook
- Backup/Recovery Plan
- Cost Budget

## 4. 評価結果の標準フォーマット

各監査カテゴリは、必ず同じ形で記録する。

```yaml
category: Accessibility
finding: Button has no accessible name
severity: high
observed_by: axe
ideal_state: All interactive controls have accessible names
fix_instruction: Add aria-label or visible text to the button
needed_upstream_info:
  - Accessibility Contract
  - Component Responsibility
standard_update:
  document: Design Contract
  field: interactive_controls.accessible_name_required
codex_prompt_delta: |
  Ensure every interactive element has a visible label or aria-label and verify with axe.
verification:
  command: npx playwright test accessibility.spec.ts
  expected: pass
```

## 5. 日次実験の標準手順

毎日の実験は以下の型で行う。

1. 小さな題材アプリを決める
2. あえて雑な指示でCodexに作らせる
3. 監査カテゴリから1〜3個を選んで評価する
4. 欠陥を記録する
5. 修正指示を作る
6. その修正指示に必要な前工程情報を逆算する
7. AIDD-Specテンプレートに反映する
8. 同じ題材を改善版Task Packetで再実行する
9. 欠陥が減ったか比較する
10. note記事化する

## 6. これがSaaSになると何をするか

AIDD Control Planeは、この逆算プロセスをSaaS化する。

機能:

- バイブコーディング成果物の監査
- 欠陥のカテゴリ分類
- 理想状態の提案
- 修正指示生成
- 必要な前工程成果物の逆算
- AI Task Packet生成
- Verification Evidence生成
- AIDD-Specテンプレート更新
- 書籍/記事用の学び抽出

つまり、SaaSの価値は「AIにコードを書かせる」ことではない。

価値は、**AIが作ったものを共通説明書レベルへ引き上げること**、そして次回から最初に渡すべき共通説明書を導くことである。
