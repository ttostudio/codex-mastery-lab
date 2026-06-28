import type { ArtifactKey } from "./contracts";

export const sampleArtifacts: Record<ArtifactKey, string> = {
  taskPacket: JSON.stringify(
    {
      spec_version: "AIDD-Spec v0.1",
      task_id: "aidd-control-plane-mvp-002",
      conformance_target: "L3",
      product_brief: {
        name: "AIDD Control Plane MVP 002",
        user_problem: "AIDD-Spec成果物の不足を人間が毎回目視で探す負担が大きい。",
        target_pattern: "AIDD-Spec準拠のJSON Contract Checker",
        non_goals: ["ログインは作らない", "外部API送信はしない", "DB接続はしない"]
      },
      experience_contract: {
        screens: ["Contract Checker Dashboard", "Artifact JSON Editors", "Schema Requirements", "Validation Results"],
        states: ["empty", "valid", "invalid_json", "missing_required", "warning", "offline"],
        failure_contract: ["JSON parse errorを日本語で表示する", "必須項目不足をpathつきで表示する", "外部API未接続を明示する"]
      },
      implementation_contract: {
        constraints: ["generated-repo内で完結する", "UI copy/test/docsは日本語", "ブラウザ保存は使わない"]
      },
      quality_gates: {
        required_commands: [
          "pnpm install --frozen-lockfile",
          "pnpm run lint",
          "pnpm run typecheck",
          "pnpm run test",
          "pnpm run build",
          "pnpm run test:e2e",
          "pnpm run doctor:aidd"
        ]
      },
      expected_outputs: {
        files: ["app/page.tsx", "src/lib/contracts.ts", "tests/contracts.test.ts", "e2e/contract-checker.spec.ts"]
      },
      acceptance_criteria: ["サンプル入力で全体statusが合格になる", "必須項目不足をpathつきで表示する", "invalid_json stateを表示する"]
    },
    null,
    2
  ),
  verificationEvidence: JSON.stringify(
    {
      id: "evidence-aidd-control-plane-mvp-002",
      task_id: "aidd-control-plane-mvp-002",
      overall_status: "passed",
      command_logs: ["pnpm run lint: passed", "pnpm run test: passed", "pnpm run test:e2e: passed"],
      reports: ["playwright-report/index.html"],
      screenshots: ["assets/contract-checker-dashboard.png"],
      checked_at: "2026-06-28T00:00:00+09:00"
    },
    null,
    2
  ),
  reviewRecord: JSON.stringify(
    {
      id: "review-aidd-control-plane-mvp-002",
      task_id: "aidd-control-plane-mvp-002",
      score: 86,
      passed: true,
      findings: ["4成果物の必須pathを検査できる", "invalid_jsonとmissing_requiredを別状態で表示できる"],
      remaining_risks: ["完全なJSON Schema Draft validatorではない"]
    },
    null,
    2
  ),
  learningLog: JSON.stringify(
    {
      id: "learning-aidd-control-plane-mvp-002",
      task_id: "aidd-control-plane-mvp-002",
      what_worked: ["成果物ごとに必須pathと意図を分けると説明しやすい"],
      what_failed: ["最初から完全なSchema validatorを狙うとMVP範囲が膨らむ"],
      spec_updates_needed: ["AIDD-Spec v0.2では成果物ごとのJSON Schemaを別ファイル化する"]
    },
    null,
    2
  )
};

export const emptyArtifacts: Record<ArtifactKey, string> = {
  taskPacket: "",
  verificationEvidence: "",
  reviewRecord: "",
  learningLog: ""
};

export function createMissingRequiredSample(): Record<ArtifactKey, string> {
  const taskPacket = JSON.parse(sampleArtifacts.taskPacket) as {
    product_brief?: { user_problem?: string };
  };
  delete taskPacket.product_brief?.user_problem;

  return {
    ...sampleArtifacts,
    taskPacket: JSON.stringify(taskPacket, null, 2)
  };
}

export function createInvalidJsonSample(): Record<ArtifactKey, string> {
  return {
    ...sampleArtifacts,
    taskPacket: '{ "spec_version": "AIDD-Spec v0.1", "task_id": '
  };
}
