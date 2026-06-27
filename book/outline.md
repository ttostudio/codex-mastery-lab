# 書籍企画: AI駆動開発時代の共通説明書

## 仮タイトル候補

1. AI駆動開発時代の共通説明書
2. AIDD-Spec: AIに渡せる仕様書の作り方
3. Codex時代のシステム開発標準
4. AIエージェントと作るWeb/スマホアプリ開発の新標準
5. ソフトウェア開発に「説明書」を取り戻す

## 本のコアメッセージ

専門業務に説明書があるように、AI駆動開発にも標準化された設計成果物が必要である。

AIに「いい感じに作って」と頼む時代は終わる。これから必要なのは、AIが迷わず実装し、人間が検査でき、運用担当が保守できる、共通言語としてのシステム開発説明書である。

## 想定読者

- AI駆動開発を導入したいCTO/テックリード
- 受託開発の品質を標準化したい開発会社
- Cursor/Codex/Claude Code/Devinを使っているが成果が安定しない開発者
- 仕様書や設計書のあり方に疑問を持つPM/PdM
- AI開発をSaaS/事業化したい起業家

## 章立て案

### 第1部: なぜAI駆動開発には標準仕様が必要なのか

#### 1章: AIがコードを書く時代に、なぜ開発はむしろ不安定になるのか

- AIは速いが、前提が曖昧だと速く間違える
- 人間同士の暗黙知はAIに伝わらない
- AI導入で露呈する既存開発プロセスの弱さ

#### 2章: 専門業務説明書に学ぶ、システム開発成果物の共通言語

- 専門業務ではなぜ説明書が標準化されているのか
- システム開発における「説明書不在」問題
- API仕様書、DB設計書、画面設計書、非機能要件のバラつき

#### 3章: AIに渡せる仕様とは何か

- 人間向け仕様とAI向け仕様の違い
- AIが迷う曖昧さ
- 仕様は後工程から逆算して作る

### 第2部: AIDD-Specの標準成果物

#### 4章: Product Brief — 何を作るかではなく、なぜ作るか

#### 5章: AI-Ready Requirement Spec — AIが実装できる要件定義

#### 6章: Design Contract — 画面設計、状態設計、アクセシビリティ

#### 7章: System Contract — API、DB、権限、外部連携

#### 8章: Non-Functional Contract — 性能、可用性、セキュリティ、コスト

#### 9章: AI Task Packet — Codexに渡す最小実装単位

#### 10章: Verification Evidence — 「できた」の証拠を標準化する

#### 11章: Learning Log — 失敗を標準仕様に還元する

### 第3部: Codexで検証するAI駆動開発プロセス

#### 12章: 雑プロンプト vs AI Task Packet

#### 13章: テスト先行はAI開発に効くのか

#### 14章: AIが壊しやすいWebアプリの領域

#### 15章: スマホアプリ開発でAIが見落とす状態と権限

#### 16章: AI実装レビューを3層に分ける

#### 17章: 16GB Mac miniで回す現実的なAI開発環境

### 第4部: AIDD Control PlaneというSaaS構想

#### 18章: AI開発に必要なのは、もう1つのエージェントではなくControl Planeである

#### 19章: AIDD Control PlaneのMVP

#### 20章: 開発プロセス、証拠、学習ログをSaaSで束ねる

#### 21章: 受託開発会社・CTO・個人開発者への導入シナリオ

#### 22章: AIDD-Specを業界標準にするロードマップ

## 付録

- AIDD-Spec Liteテンプレート
- AI Task Packetテンプレート
- Verification Evidenceテンプレート
- Non-Functional Checklist
- Mobile UX State Checklist
- Security Baseline Checklist
- Codexプロンプト集
- SaaS MVP仕様書

## 日次noteとの関係

日次noteは、書籍の素材を毎日蓄積する場にする。

### 蓄積済み素材

- 2026-06-27: 「雑なFAQ検索アプリのアクセシビリティ監査からAI Task Packetを逆算する」 — 第6章 Design Contract、第9章 AI Task Packet、第10章 Verification Evidence、第12章 雑プロンプト vs AI Task Packet に接続。
- 2026-06-27: 「プレミアムにしてで膨らむCSSを、Performance Budgetから逆算してAI Task Packetに入れる」 — 第8章 Non-Functional Contract、第9章 AI Task Packet、第10章 Verification Evidence、第12章 雑プロンプト vs AI Task Packet、第17章 16GB Mac miniで回す現実的なAI開発環境に接続。
- 2026-06-27: 「問い合わせフォームのPIIを、Security BaselineからAI Task Packetへ逆算する」 — 第7章 System Contract、第8章 Non-Functional Contract、第9章 AI Task Packet、第10章 Verification Evidence、第12章 雑プロンプト vs AI Task Packet に接続。
- 2026-06-27: 「問い合わせAPIのCSRF・Rate Limit・監査ログを、AI Task Packetへ逆算する」 — 第7章 System Contract、第8章 Non-Functional Contract、第9章 AI Task Packet、第10章 Verification Evidence、第12章 雑プロンプト vs AI Task Packet、第16章 AI実装レビューを3層に分ける に接続。

各記事は以下のどれかに分類する。

- Concept: 標準仕様の考え方
- Template: 成果物テンプレート
- Experiment: Codex検証ログ
- Failure: 失敗パターン
- SaaS: プロダクト構想
- Book: 書籍用に再構成した章

## 書籍化の品質基準

- すべての主張に実験ログまたは現場観察がある
- すべてのテンプレートに使用例がある
- すべてのプロセスに「Codexに渡すとどうなるか」の検証がある
- 抽象論だけで終わらない
- 読者が自社で導入できるチェックリストを持ち帰れる
