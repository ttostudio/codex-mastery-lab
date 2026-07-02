# AIDD Control Plane MVP Design v0.1

> AIDD-Specに沿ったAIエージェント開発ワークフローを、誰でも辿れるSaaSにするためのMVP設計。

## 1. Product Vision

AIDD Control Planeは、AIにコードを書かせるだけのSaaSではない。

主価値は、AI駆動開発で必要な入力・出力・検証証跡・レビュー・学習ログを一つの流れとして扱うことにある。

```text
Product Brief
  -> AI Task Packet
  -> Agent Run
  -> Verification Evidence
  -> Review Record
  -> Learning Log
  -> Spec Improvement
```

## 2. MVPで解く問題

AIエージェント活用時の初期問題は次である。

- 依頼文が曖昧
- 非ゴールがない
- 状態設計がない
- テスト条件がない
- 完了証拠が残らない
- 失敗が次回の指示に戻らない

MVPではこの流れをフォームとチェックリストで標準化する。

## 3. MVP機能

| 機能 | 目的 | v0.1範囲 |
| --- | --- | --- |
| Product Brief Builder | 何を作るかを短く固定する | name/user_problem/non_goals |
| AI Task Packet Builder | AIへ渡す入力を作る | YAML/Markdown出力 |
| Contract Checker | 必須項目の不足を検出する | static validation |
| Agent Runbook Generator | Codex等へ渡すコマンドを生成する | prompt + command |
| Evidence Collector | 実行ログとartifactを紐づける | 手動アップロード/パス入力 |
| Review Record | 結果を採点する | pass/fail/findings |
| Learning Log | 次回改善点を残す | spec_updates_needed |
| App Type Templates | アプリ種別ごとの推奨機能・状態契約・品質ゲート・リスク・証跡要件を補助する | video-service / learning-support / booking-management / internal-request |
| Verification Run Tracker | AI Task Packetと実行ログを結びつけ、品質ゲートの未実行・成功・失敗・証跡不足を見える化する | lint / typecheck / test / build / e2e / doctor:aidd、3ブラウザE2E、terminal evidence、screenshot evidence |
| Review & Learning Log Generator | Verification Runの失敗・証跡不足をReview Findingへ分類し、次回AI Task Packet Deltaへ戻す | review score、findings、needed upstream information、spec updates needed、Codex prompt delta |
| Artifact Evidence Binder | terminal evidence、screenshot evidence、CI run URL、CI artifact URL、Playwright report URLを同じ検証単位で束ねる | empty / valid / failure、古いログ、壊れたURL、不足証跡 |
| CI Artifact Importer | CI run summaryをVerification Evidenceへ取り込み、commit SHA、workflow、job、artifact、Playwright report URLを確認する | 手入力/サンプル入力、短いcommit SHA、失敗job、不足artifactの検出 |
| GitHub Actions Artifact Fetch Plan | run URLからCI証跡取得経路を生成し、API endpoint、token scope、必要artifactをレビューする | owner / repo / run id解析、jobs API、artifacts API、logs URL、actions:read、contents:read、不足artifact取得計画の検出 |
| Fixture-driven Mock CI Service | CI証跡の外部境界をfixtureとmock service contractで再現する | empty / valid / failure / timeout / rate_limit fixture、Docker Compose経路、Node fallback経路、`/health` / `/state` / `/__control/state`、同一contract検査 |

## 4. 初期データモデル

```ts
type Project = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
};

type AITaskPacket = {
  id: string;
  projectId: string;
  specVersion: "AIDD-Spec v0.1";
  conformanceTarget: "L0" | "L1" | "L2" | "L3" | "L4";
  productBrief: ProductBrief;
  experienceContract: ExperienceContract;
  qualityGates: QualityGate[];
  expectedOutput: ExpectedOutput;
};

type VerificationEvidence = {
  id: string;
  taskPacketId: string;
  commandLogs: CommandLog[];
  reports: EvidenceFile[];
  screenshots: EvidenceFile[];
  ciRuns: CiRun[];
};

type ReviewRecord = {
  id: string;
  taskPacketId: string;
  score: number;
  passed: boolean;
  findings: Finding[];
  remainingRisks: string[];
};

type LearningLog = {
  id: string;
  taskPacketId: string;
  whatWorked: string[];
  whatFailed: string[];
  specUpdatesNeeded: string[];
};
```

## 5. 初期画面

1. Dashboard
2. New Project
3. AI Task Packet Builder
4. Packet Preview
5. Agent Runbook
6. Evidence Upload
7. Review Dashboard
8. Learning Log

## 6. MVP Tech Stack

- Next.js + TypeScript
- pnpm
- Local JSON persistence for first demo
- Later: Postgres/Supabase or SQLite/Turso
- Playwright for workflow E2E
- GitHub Actions for CI

## 7. ライブ配信で実演する順序

1. AIDD-Spec v0.1を見せる
2. AI Task Packetをフォームで作る構想を説明する
3. まず手動YAMLでIssueBrief LiteをCodexへ渡す
4. Codex出力を検証する
5. その流れをSaaSの画面に落とす
6. MVPの最初の画面をAIエージェントに作らせる
7. Verification Evidenceを保存する
8. Review Recordを書く
9. Learning Logから次回タスクを作る

## 8. 受け入れ条件

MVP v0.1は次を満たせば成功とする。

- Product Briefを入力できる
- AI Task Packet Markdown/YAMLを生成できる
- 必須項目不足を表示できる
- Codexへ渡すRunbookを生成できる
- Evidence/Review/Learning Logの雛形を作れる
- 1つのサンプルタスクでEnd-to-Endの流れを説明できる

## 9. 今後のSaaS化

v0.2以降で追加する。

- JSON Schema validation
- GitHub Actions連携
- Artifact upload API
- 複数AIエージェント比較
- Spec diff / improvement proposal
- Team review workflow
- Template marketplace
