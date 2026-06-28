# AI Task Packet: AIDD Control Plane MVP 002

```yaml
spec_version: "AIDD-Spec v0.1"
task_id: "aidd-control-plane-mvp-002"
conformance_target: "L3"
product_brief:
  name: "AIDD Control Plane MVP 002"
  user_problem: "AI Task PacketやVerification Evidenceが標準に沿っているか、人間が毎回目視で確認するのはつらい。"
  target_pattern: "AIDD-Spec準拠のJSON Contract Checker"
  intended_difference: "MVP 001のワークフロー画面に、標準成果物の合否検査と不足項目の説明を追加する。"
  non_goals:
    - "ログインは作らない"
    - "外部API送信はしない"
    - "DB接続はしない"
    - "localStorage/sessionStorageは使わない"
    - "完全なJSON Schema Draft validatorは作らない"
experience_contract:
  screens:
    - name: "Contract Checker Dashboard"
      purpose: "AI Task Packet / Verification Evidence / Review Record / Learning Logの合否を見る"
    - name: "Artifact JSON Editors"
      purpose: "各成果物のJSONを編集する"
    - name: "Schema Requirements"
      purpose: "必須項目と理由を表示する"
    - name: "Validation Results"
      purpose: "合格/警告/失敗、不足path、改善提案を表示する"
  states:
    - "empty"
    - "valid"
    - "invalid_json"
    - "missing_required"
    - "warning"
    - "offline"
  failure_contract:
    - "JSON parse errorを日本語で表示する"
    - "必須項目不足をpathつきで表示する"
    - "外部API未接続を明示する"
    - "ログイン不要を明示する"
implementation_contract:
  stack:
    - "Next.js App Router"
    - "TypeScript"
    - "pnpm"
    - "Vitest"
    - "Playwright Chromium"
  constraints:
    - "generated-repo/の中だけで完結する"
    - "UI copy/test/docsは日本語"
    - "fetch/XMLHttpRequest/WebSocket/localStorage/sessionStorageは禁止"
    - "標準サンプルJSONは初期表示またはボタンで入れられる"
quality_gates:
  required_commands:
    - "pnpm install --frozen-lockfile"
    - "pnpm run lint"
    - "pnpm run typecheck"
    - "pnpm run test"
    - "pnpm run build"
    - "pnpm run test:e2e"
    - "pnpm run doctor:aidd"
expected_outputs:
  files:
    - "generated-repo/package.json"
    - "generated-repo/app/page.tsx"
    - "generated-repo/src/lib/contracts.ts"
    - "generated-repo/src/lib/samples.ts"
    - "generated-repo/tests/contracts.test.ts"
    - "generated-repo/e2e/contract-checker.spec.ts"
    - "generated-repo/scripts/doctor-aidd.mjs"
    - "generated-repo/docs/product-brief.md"
    - "generated-repo/docs/review-record.md"
    - "generated-repo/docs/learning-log.md"
    - "generated-repo/docs/verification-evidence.md"
acceptance_criteria:
  - "初期表示でAI Task Packetなど4種のJSON editorが見える"
  - "サンプル入力で全体statusが合格になる"
  - "必須項目を消すと不足pathが表示される"
  - "壊れたJSONを入れるとinvalid_json stateになる"
  - "Schema Requirementsに各チェックの意図が表示される"
  - "doctor:aiddが必須UI token、状態、禁止APIを検査する"
  - "記事用スクリーンショットを撮りやすい見た目にする"
```
