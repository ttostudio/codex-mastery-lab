# AIDD World Standard Manifesto

> AI駆動開発時代における、Web/スマホアプリ開発の「共通の説明書」を作るための宣言。

## 1. 誰が読んでも迷わないシステム開発成果物を作る

良い料理レシピには、材料、分量、手順、火加減、調理時間、失敗しやすいポイント、完成の目安が書かれている。

同じレシピを見れば、別の人が作ってもある程度同じ料理に近づける。もちろん腕の差は出るが、「何をどう作るのか」という共通理解がある。

一方、システム開発の成果物はあまりにも自由だ。

- 要件定義書の粒度が会社ごとに違う
- API仕様書がある場合もない場合もある
- DB設計書の品質が揺れる
- 画面設計書が存在しないことも多い
- 詳細設計書は重すぎるか、逆に存在しない
- 非機能要件が会話にすら上がらない
- テスト設計の粒度がチームごとに違う
- インフラ構成の正解が曖昧
- 運用保守で何を継続すべきか定義されない
- コスト最適化とセキュリティが後回しになる

AI駆動開発では、この曖昧さがさらに危険になる。

人間同士なら雰囲気で補える曖昧さを、AIは勝手な前提で埋める。だから、AIに渡す前提情報は、人間向けドキュメントよりも構造化されていなければならない。

## 2. 目指す標準: AIDD-Spec

AIDD-Spec は、AI-Driven Development Standard Specification の略称である。

目的は、Web/スマホアプリ開発において、以下を定義すること。

1. 何を決めるべきか
2. どの順番で決めるべきか
3. どの成果物に落とすべきか
4. どの粒度ならAIが実装できるか
5. どの証拠があれば「完了」と言えるか
6. どの観点でレビューすべきか
7. 運用保守で何を継続監視すべきか

AIDD-Spec は「ドキュメントの様式集」ではない。

これは、AI・人間・テスト・レビュー・運用が同じ説明書を読んで作業するための **開発プロトコル** である。

## 3. 後工程から逆算する

標準仕様は、上流工程の理想論から作らない。

後工程から逆算する。

最終的に必要なのは、以下である。

- Codexが迷わず実装できる
- テストが自動生成/実行できる
- レビュー担当が差分を評価できる
- セキュリティ担当がリスクを確認できる
- 運用担当が監視・バックアップ・障害対応できる
- 顧客が期待する価値が満たされていると確認できる
- 将来のAI/人間が変更理由を追跡できる

したがって、標準成果物はすべて次の問いに答えなければならない。

> この成果物は、後工程の誰または何を迷わせないために存在するのか？

## 4. Codexを「標準仕様の検査機」として使う

Codexは単なる実装者ではない。

AIDD-Specを検証するための検査機である。

標準仕様として正しいなら、Codexに渡したときに次の現象が起きるはずである。

- 実装範囲が暴れない
- 不要なファイルを触らない
- 受け入れ条件からテストが作れる
- エラー状態を実装に含める
- 非機能要件を無視しない
- セキュリティ境界を越えない
- 運用に必要なログ/設定/READMEを残す
- Verification Evidenceを自力で揃えられる

逆に、Codexが迷う、暴れる、勝手に決める、テストを省く、運用を無視するなら、それはCodexの失敗であると同時に、仕様の失敗である。

## 5. AIDDの標準成果物マップ

Web/スマホアプリ開発の共通説明書として、以下の成果物を置く。

### 5.1 Business / Product Layer

- Product Brief
- Stakeholder Map
- User Persona / JTBD
- Success Metrics
- Business Constraints

### 5.2 Requirement Layer

- AI-Ready Requirement Spec
- Use Case Catalog
- Acceptance Criteria Matrix
- Edge Case Catalog
- Non-Goal List

### 5.3 Experience Layer

- Screen Inventory
- User Flow Diagram
- State Design: empty/loading/error/success
- Copy Contract
- Accessibility Contract
- Mobile Interaction Contract

### 5.4 System Layer

- Domain Model
- API Contract
- DB Schema Contract
- Event/Job Contract
- Permission Matrix
- External Integration Contract

### 5.5 Non-Functional Layer

- Performance Budget
- Availability Target
- Security Baseline
- Privacy/Data Classification
- Cost Budget
- Observability Plan
- Backup/Recovery Plan

### 5.6 Implementation Layer

- System Boundary Map
- AI Task Packet
- Test Plan
- Migration Plan
- Rollback Plan
- Release Checklist

### 5.7 Evidence / Operations Layer

- Verification Evidence
- Review Record
- Incident Readiness Checklist
- Maintenance Runbook
- Learning Log
- Prompt/Spec Improvement Record

## 6. 「これがアンサー」と言い切るための検証基準

AIDD-Specが標準を名乗るには、思想だけでは足りない。

最低限、以下を満たす必要がある。

1. 複数種類のWebアプリで使える
2. モバイルUI/スマホアプリにも拡張できる
3. Codex以外のAIエージェントでも使える
4. 人間だけのチームでも読める
5. 小規模開発でも重すぎないLite版がある
6. 大規模開発でも監査可能なFull版がある
7. テスト・レビュー・運用まで接続している
8. 成果物がSaaS上で生成/検証/蓄積できる
9. 失敗ログから標準自体を改善できる
10. 実験ログと記事で外部に説明できる

## 7. 書籍化の前提

この取り組みは書籍化を前提にする。

書籍の主題は「AIコーディング入門」ではない。

主題は、**AI駆動開発時代の共通説明書** である。

想定読者:

- CTO
- 開発会社経営者
- PM/PdM
- テックリード
- ソフトウェアアーキテクト
- AI駆動開発で受託/自社開発を再設計したい人
- AI開発に興味がある駆け出し〜中堅エンジニア

読後に得るもの:

- AIに渡せる仕様の作り方
- AIが生成した成果物の検査方法
- Web/スマホアプリ開発の標準成果物体系
- AI駆動開発SaaSの設計思想
- 自社開発プロセスを再設計するためのチェックリスト

## 8. 当面の研究方針

毎日のCodex Mastery Labでは、必ず以下のどれかを進める。

1. AIDD-Specの成果物を1つ定義する
2. その成果物を使ってCodexに実装させる
3. 成果物なしの場合と比較する
4. 失敗パターンを抽出する
5. 標準仕様を改訂する
6. SaaS機能に変換する
7. 書籍の章として再構成する

最終的に、AIDD-Specを「これがAI駆動開発時代の共通説明書である」と言い切れるところまで突き詰める。
