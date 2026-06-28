export type ArtifactKey = "taskPacket" | "verificationEvidence" | "reviewRecord" | "learningLog";

export type ArtifactStatus = "valid" | "invalid_json" | "missing_required" | "warning" | "empty";

export type ArtifactDefinition = {
  key: ArtifactKey;
  label: string;
  requiredPaths: string[];
  intent: string;
};

export type ArtifactValidation = {
  key: ArtifactKey;
  label: string;
  status: ArtifactStatus;
  missingPaths: string[];
  invalidJsonError?: string;
  suggestions: string[];
};

export type ValidationSummary = {
  overallStatus: ArtifactStatus;
  artifactResults: ArtifactValidation[];
  missingRequiredPaths: string[];
  invalidJsonErrors: string[];
  improvementSuggestions: string[];
};

export const artifactDefinitions: ArtifactDefinition[] = [
  {
    key: "taskPacket",
    label: "AI Task Packet",
    intent: "AIに渡す作業範囲、非ゴール、品質条件を固定し、実装のぶれを減らします。",
    requiredPaths: [
      "spec_version",
      "task_id",
      "conformance_target",
      "product_brief.name",
      "product_brief.user_problem",
      "product_brief.target_pattern",
      "product_brief.non_goals",
      "experience_contract.screens",
      "experience_contract.states",
      "experience_contract.failure_contract",
      "implementation_contract.constraints",
      "quality_gates.required_commands",
      "expected_outputs.files",
      "acceptance_criteria"
    ]
  },
  {
    key: "verificationEvidence",
    label: "Verification Evidence",
    intent: "完了したという主張ではなく、実行ログと証跡で確認できる状態にします。",
    requiredPaths: ["id", "task_id", "overall_status", "command_logs", "reports", "screenshots", "checked_at"]
  },
  {
    key: "reviewRecord",
    label: "Review Record",
    intent: "合否、点数、指摘、残リスクを残し、後から判断理由を追えるようにします。",
    requiredPaths: ["id", "task_id", "score", "passed", "findings", "remaining_risks"]
  },
  {
    key: "learningLog",
    label: "Learning Log",
    intent: "失敗と改善点を次のAI Task Packetへ戻し、同じ抜け漏れを減らします。",
    requiredPaths: ["id", "task_id", "what_worked", "what_failed", "spec_updates_needed"]
  }
];

export const requiredUiTokens = [
  "Contract Checker Dashboard",
  "Artifact JSON Editors",
  "Schema Requirements",
  "Validation Results",
  "AI Task Packet",
  "Verification Evidence",
  "Review Record",
  "Learning Log",
  "サンプルを入れる",
  "必須項目を1つ削って失敗を見る",
  "JSONを壊してinvalid_jsonを見る",
  "リセット",
  "overall status",
  "artifact-by-artifact status",
  "missing required paths",
  "invalid JSON errors",
  "improvement suggestions",
  "外部API未接続",
  "ログイン不要"
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getPathValue(source: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((current, segment) => {
    if (!isRecord(current)) return undefined;
    return current[segment];
  }, source);
}

function isMissingRequiredValue(value: unknown): boolean {
  if (value === undefined || value === null) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

export function parseArtifactJson(raw: string): { ok: true; value: unknown } | { ok: false; error: string } {
  if (raw.trim().length === 0) {
    return { ok: false, error: "JSONが空です。" };
  }

  try {
    return { ok: true, value: JSON.parse(raw) as unknown };
  } catch (error) {
    const message = error instanceof Error ? error.message : "JSON parse error";
    return { ok: false, error: `JSONの形式が正しくありません: ${message}` };
  }
}

export function validateArtifact(definition: ArtifactDefinition, raw: string): ArtifactValidation {
  if (raw.trim().length === 0) {
    return {
      key: definition.key,
      label: definition.label,
      status: "empty",
      missingPaths: definition.requiredPaths,
      invalidJsonError: "JSONが空です。",
      suggestions: [`${definition.label}のサンプルを入れて、必須項目の形を確認してください。`]
    };
  }

  const parsed = parseArtifactJson(raw);
  if (!parsed.ok) {
    return {
      key: definition.key,
      label: definition.label,
      status: "invalid_json",
      missingPaths: [],
      invalidJsonError: parsed.error,
      suggestions: [`${definition.label}のカンマ、引用符、閉じ括弧を確認してください。`]
    };
  }

  const missingPaths = definition.requiredPaths.filter((path) => isMissingRequiredValue(getPathValue(parsed.value, path)));
  const suggestions = missingPaths.map((path) => `${definition.label}: ${path} を追加してください。`);

  return {
    key: definition.key,
    label: definition.label,
    status: missingPaths.length > 0 ? "missing_required" : "valid",
    missingPaths,
    suggestions
  };
}

export function validateContract(rawArtifacts: Record<ArtifactKey, string>): ValidationSummary {
  const artifactResults = artifactDefinitions.map((definition) => validateArtifact(definition, rawArtifacts[definition.key]));
  const invalidJsonErrors = artifactResults
    .filter((result) => result.status === "invalid_json" || result.status === "empty")
    .map((result) => `${result.label}: ${result.invalidJsonError ?? "JSONエラー"}`);
  const missingRequiredPaths = artifactResults.flatMap((result) =>
    result.missingPaths.map((path) => `${result.label}.${path}`)
  );
  const improvementSuggestions = artifactResults.flatMap((result) => result.suggestions);
  const overallStatus = artifactResults.some((result) => result.status === "invalid_json" || result.status === "empty")
    ? "invalid_json"
    : artifactResults.some((result) => result.status === "missing_required")
      ? "missing_required"
      : "valid";

  return {
    overallStatus,
    artifactResults,
    missingRequiredPaths,
    invalidJsonErrors,
    improvementSuggestions:
      improvementSuggestions.length > 0
        ? improvementSuggestions
        : ["4つの成果物が最小契約を満たしています。次は実行ログとレビュー内容を実データに差し替えてください。"]
  };
}

export function statusLabel(status: ArtifactStatus): string {
  const labels: Record<ArtifactStatus, string> = {
    valid: "合格",
    invalid_json: "invalid_json",
    missing_required: "missing_required",
    warning: "warning",
    empty: "empty"
  };
  return labels[status];
}
