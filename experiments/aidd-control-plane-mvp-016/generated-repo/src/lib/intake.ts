export const APP_TYPES = ["Webアプリ", "モバイルアプリ", "業務ツール", "コンテンツサービス", "EC/予約", "その他"] as const;

export const STATE_CONTRACT_OPTIONS = [
  "empty",
  "loading",
  "success",
  "error",
  "offline",
  "timeout",
  "auth",
  "billing",
  "media_error"
] as const;

export const QUALITY_GATE_OPTIONS = [
  "lint",
  "typecheck",
  "test",
  "build",
  "e2e",
  "doctor:aidd",
  "accessibility",
  "security",
  "performance"
] as const;

export const APP_TYPE_TEMPLATES = [
  {
    id: "video-service",
    name: "動画サービス風",
    appType: "コンテンツサービス",
    recommendedFeatures: ["作品一覧と検索", "視聴キュー", "再生状態とメディア失敗表示", "プレミアム導線"],
    stateContract: ["empty", "loading", "success", "error", "offline", "timeout", "auth", "billing", "media_error"],
    qualityGates: ["lint", "typecheck", "test", "build", "e2e", "doctor:aidd", "accessibility"],
    nonGoals: ["実在サービスの商標・ロゴ利用", "本番動画配信", "実決済"],
    externalIntegrations: ["mock media service", "mock auth service", "mock billing service"],
    risks: ["メディア失敗時の表示が通常エラーに埋もれる", "匿名ユーザーとプレミアムユーザーの差分が曖昧になる"],
    evidenceRequirements: ["media_error状態のスクリーンショット", "auth anonymous / auth premium / billing failedのE2Eログ"]
  },
  {
    id: "learning-support",
    name: "学習支援",
    appType: "Webアプリ",
    recommendedFeatures: ["今日の学習キュー", "進捗チェック", "復習リマインド", "理解度メモ"],
    stateContract: ["empty", "loading", "success", "error", "offline", "timeout", "auth"],
    qualityGates: ["lint", "typecheck", "test", "build", "e2e", "doctor:aidd", "accessibility"],
    nonGoals: ["外部AI API呼び出し", "教材販売", "SNS投稿"],
    externalIntegrations: ["mock auth service", "mock progress service"],
    risks: ["学習継続の価値が単なるTODO管理に寄る", "offline時の進捗保存方針が曖昧になる"],
    evidenceRequirements: ["emptyからsuccessまでの主要フロー録画", "offline / timeout状態の画面証跡"]
  },
  {
    id: "booking-management",
    name: "予約管理",
    appType: "EC/予約",
    recommendedFeatures: ["空き枠カレンダー", "予約作成", "予約変更とキャンセル", "支払い失敗時の再試行"],
    stateContract: ["empty", "loading", "success", "error", "offline", "timeout", "auth", "billing"],
    qualityGates: ["lint", "typecheck", "test", "build", "e2e", "doctor:aidd", "accessibility", "performance"],
    nonGoals: ["実店舗の在庫同期", "実決済", "外部カレンダー双方向同期"],
    externalIntegrations: ["mock booking service", "mock auth service", "mock billing service"],
    risks: ["二重予約の防止条件がUIだけでは検証しにくい", "billing failed時の予約保持ルールが不明確になる"],
    evidenceRequirements: ["予約作成・変更・キャンセルのE2Eログ", "billing failed表示のスクリーンショット"]
  },
  {
    id: "internal-request",
    name: "社内申請",
    appType: "業務ツール",
    recommendedFeatures: ["申請フォーム", "承認ステータス一覧", "差し戻しコメント", "権限別ビュー"],
    stateContract: ["empty", "loading", "success", "error", "offline", "timeout", "auth"],
    qualityGates: ["lint", "typecheck", "test", "build", "e2e", "doctor:aidd", "security"],
    nonGoals: ["実社内ID連携", "監査ログの長期保管", "メール実送信"],
    externalIntegrations: ["mock auth service", "mock workflow service"],
    risks: ["権限別表示がhappy pathだけになる", "差し戻しと再申請の状態遷移が不足する"],
    evidenceRequirements: ["申請者・承認者ビューのスクリーンショット", "auth状態切替のE2Eログ"]
  }
] as const satisfies readonly AppTypeTemplate[];

export type AppType = (typeof APP_TYPES)[number];
export type StateContract = (typeof STATE_CONTRACT_OPTIONS)[number];
export type QualityGate = (typeof QUALITY_GATE_OPTIONS)[number];
export type AppTypeTemplateId = "video-service" | "learning-support" | "booking-management" | "internal-request";
export type AppTypeTemplate = {
  id: AppTypeTemplateId;
  name: string;
  appType: AppType;
  recommendedFeatures: readonly string[];
  stateContract: readonly StateContract[];
  qualityGates: readonly QualityGate[];
  nonGoals: readonly string[];
  externalIntegrations: readonly string[];
  risks: readonly string[];
  evidenceRequirements: readonly string[];
};
export type ReadinessStatus = "empty" | "draft" | "ready" | "insufficient";
export type VerificationGateStatus = "未実行" | "成功" | "失敗" | "証跡不足";
export type VerificationGateId = "lint" | "typecheck" | "test" | "build" | "e2e" | "doctor:aidd";

export type VerificationGateRun = {
  id: VerificationGateId;
  label: string;
  status: VerificationGateStatus;
  command: string;
  summary: string;
  evidenceFile: string;
};

export type VerificationRun = {
  title: string;
  gates: VerificationGateRun[];
  browserE2E: {
    chromium: VerificationGateStatus;
    firefox: VerificationGateStatus;
    webkit: VerificationGateStatus;
  };
  terminalEvidence: string[];
  screenshotEvidence: string[];
  artifactBinder: ArtifactEvidenceBinder;
};

export type EvidenceRequirementId =
  | "coverage"
  | "playwright-report"
  | "test-results"
  | "terminal-evidence"
  | "empty-screenshot"
  | "valid-screenshot"
  | "failure-screenshot";

export type EvidenceGapSeverity = "critical" | "high" | "medium";

export type EvidenceGapRepair = {
  id: EvidenceRequirementId;
  label: string;
  severity: EvidenceGapSeverity;
  affectedArtifact: string;
  fixInstruction: string;
  rerunCommand: string;
  codexPromptDelta: string;
};

export type EvidenceGapRepairPlan = {
  status: ArtifactEvidenceStatus;
  missingCount: number;
  repairs: EvidenceGapRepair[];
};

export type ReviewFinding = {
  category:
    | "検証"
    | "証跡"
    | "3ブラウザE2E"
    | "Artifact Evidence Binder"
    | "CI Artifact Importer"
    | "GitHub Actions Fetch Plan"
    | "Evidence Gap Repair Planner"
    | "CI Workflow Artifact Auditor"
    | "残リスク";
  severity: "high" | "medium" | "low";
  finding: string;
  fixInstruction: string;
  neededUpstreamInfo: string[];
  verificationCommand: string;
};

export type ArtifactEvidenceStatus = "empty" | "valid" | "failure";

export type ArtifactEvidenceBinder = {
  statusSample: ArtifactEvidenceStatus;
  terminalEvidence: string[];
  screenshotEvidence: string[];
  ciRunUrl: string;
  ciArtifactUrl: string;
  playwrightReportUrl: string;
  generatedAt: string;
  ciSummary: CiArtifactImport;
};

export type CiJobStatus = "成功" | "失敗" | "未実行";

export type CiJob = {
  name: string;
  status: CiJobStatus;
};

export type CiArtifactImport = {
  workflowName: string;
  commitSha: string;
  runUrl: string;
  artifacts: string[];
  jobs: CiJob[];
  playwrightReportUrl: string;
  fetchPlan: GitHubActionsFetchPlan;
};

export type GitHubActionsFetchPlan = {
  runUrl: string;
  owner: string;
  repo: string;
  runId: string;
  runSummaryUrl: string;
  jobsApiEndpoint: string;
  artifactsApiEndpoint: string;
  logsUrl: string;
  tokenScopes: string[];
  requiredArtifacts: string[];
};

export type CiWorkflowArtifactAuditor = {
  statusSample: ArtifactEvidenceStatus;
  workflowPath: string;
  configuredGates: string[];
  configuredArtifactPaths: string[];
  aiddSpecConnections: string[];
  captureCommand: string;
  terminalEvidencePath: string;
};

export type CiWorkflowArtifactAudit = {
  status: ArtifactEvidenceStatus;
  missingWorkflow: boolean;
  missingGates: string[];
  missingArtifactPaths: string[];
  missingSpecConnections: string[];
  missingCaptureCommand: boolean;
  reviewFindings: ReviewFinding[];
  aiTaskPacketDelta: string[];
  specUpdateCandidates: string[];
};

export type ReviewRecord = {
  score: number;
  passed: boolean;
  findings: ReviewFinding[];
  remainingRisks: string[];
};

export type LearningLog = {
  whatWorked: string[];
  whatFailed: string[];
  specUpdatesNeeded: string[];
  nextTaskPacketDelta: string[];
  codexPromptDelta: string;
};

export type IntakeInput = {
  appName: string;
  appType: string;
  targetUser: string;
  userProblem: string;
  keyFeaturesText: string;
  nonGoalsText: string;
  externalIntegrationsText: string;
  stateContract: StateContract[];
  qualityGates: QualityGate[];
  selectedTemplateId: AppTypeTemplateId | "";
  appliedTemplateId: AppTypeTemplateId | "";
  verificationRun?: VerificationRun;
};

export type IntakeDraft = {
  appName: string;
  appType: string;
  targetUser: string;
  userProblem: string;
  keyFeatures: string[];
  nonGoals: string[];
  externalIntegrations: string[];
  stateContract: StateContract[];
  qualityGates: QualityGate[];
  selectedTemplateId: AppTypeTemplateId | "";
  appliedTemplateId: AppTypeTemplateId | "";
  templateName: string;
  templateRisks: string[];
  templateEvidenceRequirements: string[];
  verificationRun: VerificationRun;
};

export type ReadinessReview = {
  status: ReadinessStatus;
  score: number;
  missingFields: string[];
  recommendedNextQuestions: string[];
};

const REQUIRED_GATES: QualityGate[] = ["lint", "typecheck", "test", "build"];
export const REQUIRED_VERIFICATION_GATES: VerificationGateId[] = ["lint", "typecheck", "test", "build", "e2e", "doctor:aidd"];
export const REQUIRED_CI_ARTIFACTS = ["coverage", "playwright-report", "test-results", "terminal-evidence"] as const;
export const REQUIRED_GITHUB_TOKEN_SCOPES = ["actions:read", "contents:read"] as const;
export const REQUIRED_WORKFLOW_GATES = [
  "pnpm install --frozen-lockfile",
  "pnpm run lint",
  "pnpm run typecheck",
  "pnpm run test",
  "pnpm run build",
  "pnpm run doctor:aidd",
  "pnpm run mock:doctor",
  "pnpm run test:e2e"
] as const;
export const REQUIRED_WORKFLOW_ARTIFACT_PATHS = [
  "coverage",
  "playwright-report",
  "test-results",
  "experiments/aidd-control-plane-mvp-016/artifacts/terminal"
] as const;
export const REQUIRED_AIDD_SPEC_CONNECTIONS = ["Verification Evidence", "Review Record", "Learning Log", "AI Task Packet Delta", "AIDD-Spec更新候補"] as const;

export const REQUIRED_EVIDENCE_REPAIRS: Record<EvidenceRequirementId, Omit<EvidenceGapRepair, "id">> = {
  coverage: {
    label: "coverage",
    severity: "high",
    affectedArtifact: "Verification Evidence / Test Coverage Artifact",
    fixInstruction: "coverage artifactをCI artifactsとArtifact Evidence Binderに追加する",
    rerunCommand: "pnpm run test",
    codexPromptDelta: "coverage artifactが欠けているため、テスト実行後のcoverage出力をCI artifactへ保存する指示を追加する。"
  },
  "playwright-report": {
    label: "playwright-report",
    severity: "critical",
    affectedArtifact: "Verification Evidence / Browser E2E Report",
    fixInstruction: "playwright-report artifactとPlaywright report URLを同じ実行単位で保存する",
    rerunCommand: "pnpm run test:e2e",
    codexPromptDelta: "playwright-reportが欠けているため、3ブラウザE2E後にPlaywright reportをartifact化する指示を追加する。"
  },
  "test-results": {
    label: "test-results",
    severity: "high",
    affectedArtifact: "Verification Evidence / Test Results Artifact",
    fixInstruction: "test-results artifactをCI artifactsに追加し、失敗時のtraceをReview Recordへ紐づける",
    rerunCommand: "pnpm run test:e2e",
    codexPromptDelta: "test-resultsが欠けているため、E2Eのtrace/test-results保存を完了条件へ追加する。"
  },
  "terminal-evidence": {
    label: "terminal-evidence",
    severity: "critical",
    affectedArtifact: "Verification Evidence / Terminal Evidence",
    fixInstruction: "lint/typecheck/test/build/e2e/doctor:aiddのterminal evidenceを保存する",
    rerunCommand: "pnpm run lint && pnpm run typecheck && pnpm run test && pnpm run build && pnpm run test:e2e && pnpm run doctor:aidd",
    codexPromptDelta: "terminal-evidenceが欠けているため、全ゲートの実行ログをartifacts/terminalへ保存する指示を追加する。"
  },
  "empty-screenshot": {
    label: "empty screenshot",
    severity: "medium",
    affectedArtifact: "Screen Inventory / Verification Evidence",
    fixInstruction: "empty stateのスクリーンショットをassetsとartifacts/screenshotsへ保存する",
    rerunCommand: "node scripts/capture-mvp011.mjs",
    codexPromptDelta: "empty screenshotが欠けているため、初期状態の画面証跡をcapture scriptで保存する指示を追加する。"
  },
  "valid-screenshot": {
    label: "valid screenshot",
    severity: "medium",
    affectedArtifact: "Screen Inventory / Verification Evidence",
    fixInstruction: "valid sampleのスクリーンショットをassetsとartifacts/screenshotsへ保存する",
    rerunCommand: "node scripts/capture-mvp011.mjs",
    codexPromptDelta: "valid screenshotが欠けているため、証跡不足0件の画面証跡をcapture scriptで保存する指示を追加する。"
  },
  "failure-screenshot": {
    label: "failure screenshot",
    severity: "high",
    affectedArtifact: "Review Record / Learning Log / Screen Inventory",
    fixInstruction: "failure sampleのスクリーンショットを保存し、複数不足のReview Findingを確認する",
    rerunCommand: "node scripts/capture-mvp011.mjs",
    codexPromptDelta: "failure screenshotが欠けているため、複数不足が決定的に表示される画面証跡を保存する指示を追加する。"
  }
};

const GATE_COMMANDS: Record<VerificationGateId, string> = {
  lint: "pnpm run lint",
  typecheck: "pnpm run typecheck",
  test: "pnpm run test",
  build: "pnpm run build",
  e2e: "pnpm run test:e2e",
  "doctor:aidd": "pnpm run doctor:aidd"
};

const GATE_LABELS: Record<VerificationGateId, string> = {
  lint: "lint",
  typecheck: "typecheck",
  test: "test",
  build: "build",
  e2e: "e2e",
  "doctor:aidd": "doctor:aidd"
};

export function getAppTypeTemplate(templateId: AppTypeTemplateId | ""): AppTypeTemplate | undefined {
  return APP_TYPE_TEMPLATES.find((template) => template.id === templateId);
}

export function parseLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function buildIntakeDraft(input: IntakeInput): IntakeDraft {
  const appliedTemplate = getAppTypeTemplate(input.appliedTemplateId);
  return {
    appName: input.appName.trim(),
    appType: input.appType.trim(),
    targetUser: input.targetUser.trim(),
    userProblem: input.userProblem.trim(),
    keyFeatures: parseLines(input.keyFeaturesText),
    nonGoals: parseLines(input.nonGoalsText),
    externalIntegrations: parseLines(input.externalIntegrationsText),
    stateContract: [...input.stateContract],
    qualityGates: [...input.qualityGates],
    selectedTemplateId: input.selectedTemplateId,
    appliedTemplateId: input.appliedTemplateId,
    templateName: appliedTemplate?.name ?? "",
    templateRisks: appliedTemplate ? [...appliedTemplate.risks] : [],
    templateEvidenceRequirements: appliedTemplate ? [...appliedTemplate.evidenceRequirements] : [],
    verificationRun: input.verificationRun ?? createInitialVerificationRun()
  };
}

export function evaluateReadiness(draft: IntakeDraft): ReadinessReview {
  const isEmpty =
    draft.appName.length === 0 &&
    draft.targetUser.length === 0 &&
    draft.userProblem.length === 0 &&
    draft.keyFeatures.length === 0 &&
    draft.selectedTemplateId.length === 0;

  const missingFields: string[] = [];
  if (!draft.appName) missingFields.push("アプリ名");
  if (!draft.appType) missingFields.push("アプリ種別");
  if (!draft.targetUser) missingFields.push("対象ユーザー");
  if (!draft.userProblem) missingFields.push("解決したい問題");
  if (!draft.selectedTemplateId) missingFields.push("テンプレート未選択");
  if (draft.selectedTemplateId && draft.selectedTemplateId !== draft.appliedTemplateId) missingFields.push("テンプレート未適用");
  if (draft.appliedTemplateId && !draft.templateName) missingFields.push("テンプレート定義が見つかりません");
  if (draft.keyFeatures.length < 2) missingFields.push("主要機能を2件以上");
  if (draft.stateContract.length < 2) missingFields.push("状態契約を2件以上");

  for (const gate of REQUIRED_GATES) {
    if (!draft.qualityGates.includes(gate)) missingFields.push(`品質ゲート: ${gate}`);
  }

  const verification = evaluateVerificationRun(draft.verificationRun);
  for (const issue of verification.issues) {
    missingFields.push(issue);
  }

  const completedChecks = [
    Boolean(draft.appName),
    Boolean(draft.appType),
    Boolean(draft.targetUser),
    Boolean(draft.userProblem),
    Boolean(draft.selectedTemplateId),
    Boolean(draft.appliedTemplateId && draft.selectedTemplateId === draft.appliedTemplateId && draft.templateName),
    draft.keyFeatures.length >= 2,
    draft.stateContract.length >= 2,
    ...REQUIRED_GATES.map((gate) => draft.qualityGates.includes(gate)),
    verification.ready
  ].filter(Boolean).length;
  const score = Math.round((completedChecks / 13) * 100);

  let status: ReadinessStatus = "draft";
  if (isEmpty) {
    status = "empty";
  } else if (missingFields.includes("テンプレート未選択") || missingFields.includes("テンプレート未適用")) {
    status = "insufficient";
  } else if (missingFields.length === 0) {
    status = "ready";
  } else if (completedChecks >= 3 || draft.keyFeatures.length > 0 || draft.stateContract.length > 0) {
    status = "insufficient";
  }

  return {
    status,
    score: status === "empty" ? 0 : score,
    missingFields,
    recommendedNextQuestions: buildRecommendedQuestions(draft, missingFields)
  };
}

export function generateProductBrief(draft: IntakeDraft): string {
  const name = draft.appName || "未命名アプリ";
  return [
    `# Product Brief: ${name}`,
    "",
    `## 何を作るか`,
    `${name}は、${draft.targetUser || "対象ユーザー未定"}が「${draft.userProblem || "未整理の課題"}」を解決するための${draft.appType || "アプリ"}です。`,
    "",
    "## 主要機能",
    formatList(draft.keyFeatures, "主要機能は未入力です。"),
    "",
    "## App Type Template",
    draft.templateName ? `- ${draft.templateName}` : "- テンプレートは未適用です。",
    "",
    "## テンプレートのリスク",
    formatList(draft.templateRisks, "テンプレートリスクは未適用です。"),
    "",
    "## 証跡要件",
    formatList(draft.templateEvidenceRequirements, "証跡要件は未適用です。"),
    "",
    "## 作らないもの",
    formatList(draft.nonGoals, "非ゴールは未入力です。"),
    "",
    "## 外部連携",
    formatList(draft.externalIntegrations, "外部連携はありません。"),
    "",
    "## 状態契約",
    formatList(draft.stateContract, "状態契約は未選択です。"),
    "",
    "## Verification Evidence / Review Record / Learning Log",
    formatVerificationRunMarkdown(draft.verificationRun)
  ].join("\n");
}

export function generateTaskPacket(draft: IntakeDraft): string {
  const reviewRecord = generateReviewRecord(draft.verificationRun, draft.templateRisks);
  const learningLog = generateLearningLog(reviewRecord);
  return [
    `spec_version: "AIDD-Spec v0.1"`,
    `task_id: "${slugify(draft.appName || "untitled-app")}"`,
    `conformance_target: "L2"`,
    "product_brief:",
    `  name: "${escapeYaml(draft.appName || "未命名アプリ")}"`,
    `  app_type: "${escapeYaml(draft.appType || "未選択")}"`,
    `  app_type_template: "${escapeYaml(draft.templateName || "未適用")}"`,
    `  target_user: "${escapeYaml(draft.targetUser || "未入力")}"`,
    `  user_problem: "${escapeYaml(draft.userProblem || "未入力")}"`,
    "  key_features:",
    formatYamlList(draft.keyFeatures),
    "  non_goals:",
    formatYamlList(draft.nonGoals),
    "system_contract:",
    "  external_integrations:",
    formatYamlList(draft.externalIntegrations),
    "experience_contract:",
    "  state_contract:",
    formatYamlList(draft.stateContract),
    "quality_gates:",
    formatYamlList(draft.qualityGates),
    "risk_contract:",
    "  template_risks:",
    formatYamlList(draft.templateRisks),
    "  evidence_requirements:",
    formatYamlList(draft.templateEvidenceRequirements),
    "verification_run:",
    `  ready: ${evaluateVerificationRun(draft.verificationRun).ready ? "true" : "false"}`,
    "  required_gates:",
    formatYamlList(REQUIRED_VERIFICATION_GATES),
    "  gates:",
    ...draft.verificationRun.gates.map(
      (gate) =>
        `    - id: "${gate.id}"\n      status: "${gate.status}"\n      command: "${escapeYaml(gate.command)}"\n      evidence_file: "${escapeYaml(gate.evidenceFile || "未登録")}"`
    ),
    "  browser_e2e:",
    `    chromium: "${draft.verificationRun.browserE2E.chromium}"`,
    `    firefox: "${draft.verificationRun.browserE2E.firefox}"`,
    `    webkit: "${draft.verificationRun.browserE2E.webkit}"`,
    "  terminal_evidence:",
    formatYamlList(draft.verificationRun.terminalEvidence),
    "  screenshot_evidence:",
    formatYamlList(draft.verificationRun.screenshotEvidence),
    "  artifact_evidence_binder:",
    `    status: "${evaluateArtifactEvidenceBinder(draft.verificationRun.artifactBinder).status}"`,
    `    ci_run_url: "${escapeYaml(draft.verificationRun.artifactBinder.ciRunUrl || "未登録")}"`,
    `    ci_artifact_url: "${escapeYaml(draft.verificationRun.artifactBinder.ciArtifactUrl || "未登録")}"`,
    `    playwright_report_url: "${escapeYaml(draft.verificationRun.artifactBinder.playwrightReportUrl || "未登録")}"`,
    `    generated_at: "${escapeYaml(draft.verificationRun.artifactBinder.generatedAt || "未登録")}"`,
    "    terminal_evidence:",
    formatYamlList(draft.verificationRun.artifactBinder.terminalEvidence),
    "    screenshot_evidence:",
    formatYamlList(draft.verificationRun.artifactBinder.screenshotEvidence),
    "  evidence_gap_repair_planner:",
    `    status: "${evaluateEvidenceGapRepairPlan(draft.verificationRun).status}"`,
    `    missing_count: ${evaluateEvidenceGapRepairPlan(draft.verificationRun).missingCount}`,
    "    repairs:",
    ...formatEvidenceRepairsYaml(evaluateEvidenceGapRepairPlan(draft.verificationRun).repairs),
    "  ci_artifact_importer:",
    `    workflow_name: "${escapeYaml(draft.verificationRun.artifactBinder.ciSummary.workflowName || "未登録")}"`,
    `    commit_sha: "${escapeYaml(draft.verificationRun.artifactBinder.ciSummary.commitSha || "未登録")}"`,
    "    jobs:",
    ...draft.verificationRun.artifactBinder.ciSummary.jobs.map((job) => `      - name: "${escapeYaml(job.name)}"\n        status: "${job.status}"`),
    "    artifacts:",
    formatYamlList(draft.verificationRun.artifactBinder.ciSummary.artifacts),
    "review_record:",
    `  score: ${reviewRecord.score}`,
    `  passed: ${reviewRecord.passed ? "true" : "false"}`,
    "  findings:",
    formatYamlList(reviewRecord.findings.map((finding) => `${finding.severity}: ${finding.finding}`)),
    "learning_log:",
    "  spec_updates_needed:",
    formatYamlList(learningLog.specUpdatesNeeded),
    "  next_ai_task_packet_delta:",
    formatYamlList(learningLog.nextTaskPacketDelta),
    "expected_output:",
    "  - Product Brief",
    "  - AI Task Packet",
    "  - Verification Plan",
    "  - Codex Prompt",
    "  - Readiness Review"
  ].join("\n");
}

export function generateVerificationPlan(draft: IntakeDraft): string {
  const states = draft.stateContract.length > 0 ? draft.stateContract : ["empty"];
  const gates = draft.qualityGates.length > 0 ? draft.qualityGates : REQUIRED_GATES;
  return [
    "# Verification Plan",
    "",
    "## 状態確認",
    ...states.map((state) => `- [ ] ${state} 状態がUIで確認できる`),
    "",
    "## 品質ゲート",
    ...gates.map((gate) => `- [ ] pnpm run ${gate}`),
    "",
    "## Verification Run Tracker",
    ...draft.verificationRun.gates.map((gate) => `- [ ] ${gate.label}: ${gate.command} / ${gate.status} / evidence: ${gate.evidenceFile || "未登録"}`),
    "- [ ] Chromium / Firefox / WebKit のE2E成功を確認する",
    "- [ ] terminal evidence と screenshot evidence をVerification Evidenceとして保存する",
    "- [ ] CI Artifact Importerにrun URL、commit SHA、workflow、job、artifact、Playwright report URLを取り込む",
    "- [ ] Artifact Evidence BinderにCI run URL、CI artifact URL、Playwright report URLを束ねる",
    "- [ ] Evidence Gap Repair Plannerでcoverage / playwright-report / test-results / terminal-evidence / empty screenshot / valid screenshot / failure screenshotの不足を確認する",
    "- [ ] Review Recordにpass/fail/findings/remaining riskを残す",
    "- [ ] Learning Logに失敗・修正・次回Spec改善点を残す",
    "",
    "## App Type Template",
    `- [ ] ${draft.templateName || "テンプレート未適用"} のリスクをレビューする`,
    ...draft.templateRisks.map((risk) => `- [ ] リスク確認: ${risk}`),
    "",
    "## 証跡要件",
    ...withFallback(draft.templateEvidenceRequirements, ["テンプレートを適用し、必要な証跡を確定する"]).map((requirement) => `- [ ] ${requirement}`),
    "",
    "## 受け入れ条件",
    `- [ ] ${draft.appName || "対象アプリ"}のProduct Briefが生成される`,
    "- [ ] AI Task Packetに主要機能と非ゴールが含まれる",
    "- [ ] Codex Promptに状態契約と品質ゲートが含まれる"
  ].join("\n");
}

export function generateCodexPrompt(draft: IntakeDraft): string {
  return [
    `あなたはAIDD-Spec v0.1に沿って「${draft.appName || "未命名アプリ"}」を実装するAIエージェントです。`,
    "",
    "## 目的",
    `${draft.targetUser || "対象ユーザー未定"}の「${draft.userProblem || "未整理の課題"}」を解決する${draft.appType || "アプリ"}を作ってください。`,
    "",
    "## 必要な機能",
    formatList(draft.keyFeatures, "主要機能を確認してから実装してください。"),
    "",
    "## App Type Template",
    draft.templateName ? `- ${draft.templateName}` : "- テンプレートを選択して適用してください。",
    "",
    "## リスク",
    formatList(draft.templateRisks, "テンプレートリスクを確認してください。"),
    "",
    "## 証跡要件",
    formatList(draft.templateEvidenceRequirements, "必要な証跡を確認してください。"),
    "",
    "## 作らないもの",
    formatList(draft.nonGoals, "非ゴールを確認してください。"),
    "",
    "## 状態契約",
    formatList(draft.stateContract, "empty と error は最低限確認してください。"),
    "",
    "## 品質ゲート",
    formatList(draft.qualityGates, "lint / typecheck / test / build を通してください。"),
    "",
    "## Verification Run",
    formatVerificationRunMarkdown(draft.verificationRun),
    "",
    "## Review Record / Learning Log",
    generateLearningLog(generateReviewRecord(draft.verificationRun, draft.templateRisks)).codexPromptDelta,
    "",
    "## 完了条件",
    "- Product Brief、AI Task Packet、Verification Plan、Readiness Reviewを更新する",
    "- Verification Evidence、Review Record、Learning Logに実行結果と必要証跡を残す",
    "- Evidence Gap Repair Plannerの不足0件を確認し、不足があれば修正指示、再実行コマンド、Codex Prompt Deltaを反映する",
    "- CI Artifact Importerでcommit SHA、workflow、job、artifact URLを確認する",
    "- 外部通信やブラウザ保存領域に依存しない"
  ].join("\n");
}

export function createInitialVerificationRun(): VerificationRun {
  return buildVerificationRun("初期状態", "未実行", {
    summary: "まだ実行されていません。terminal evidenceとscreenshot evidenceが未登録です。",
    evidence: "",
    artifactBinder: createEmptyArtifactEvidenceBinder()
  });
}

export function createSuccessVerificationRun(): VerificationRun {
  return {
    title: "validサンプル",
    gates: REQUIRED_VERIFICATION_GATES.map((id) => ({
      id,
      label: GATE_LABELS[id],
      status: "成功",
      command: GATE_COMMANDS[id],
      summary: `${GATE_LABELS[id]}は成功しました。`,
      evidenceFile: `experiments/aidd-control-plane-mvp-006/artifacts/terminal/${id.replace(":", "-")}.txt`
    })),
    browserE2E: {
      chromium: "成功",
      firefox: "成功",
      webkit: "成功"
    },
    terminalEvidence: [
      "experiments/aidd-control-plane-mvp-006/artifacts/terminal/lint.txt",
      "experiments/aidd-control-plane-mvp-006/artifacts/terminal/typecheck.txt",
      "experiments/aidd-control-plane-mvp-006/artifacts/terminal/test.txt",
      "experiments/aidd-control-plane-mvp-006/artifacts/terminal/build.txt",
      "experiments/aidd-control-plane-mvp-006/artifacts/terminal/e2e.txt",
      "experiments/aidd-control-plane-mvp-006/artifacts/terminal/doctor-aidd.txt"
    ],
    screenshotEvidence: [
      "experiments/aidd-control-plane-mvp-011/artifacts/screenshots/aidd-control-plane-mvp011-empty.png",
      "experiments/aidd-control-plane-mvp-011/artifacts/screenshots/aidd-control-plane-mvp011-valid.png",
      "experiments/aidd-control-plane-mvp-011/artifacts/screenshots/aidd-control-plane-mvp011-failure.png",
      "assets/aidd-control-plane-mvp011-valid.png"
    ],
    artifactBinder: createValidArtifactEvidenceBinder()
  };
}

export function createFailureVerificationRun(): VerificationRun {
  const run = createSuccessVerificationRun();
  return {
    ...run,
    title: "失敗サンプル",
    gates: run.gates.map((gate) =>
      gate.id === "e2e" || gate.id === "doctor:aidd"
        ? {
            ...gate,
            status: "失敗",
            summary: gate.id === "e2e" ? "WebKitで証跡確認に失敗しました。" : "Verification Run Trackerの必須文言検査に失敗しました。"
          }
        : gate
    ),
    browserE2E: {
      chromium: "成功",
      firefox: "成功",
      webkit: "失敗"
    },
    screenshotEvidence: [],
    artifactBinder: createFailureArtifactEvidenceBinder()
  };
}

export function createEvidenceMissingVerificationRun(): VerificationRun {
  const run = createSuccessVerificationRun();
  return {
    ...run,
    title: "証跡不足サンプル",
    gates: run.gates.map((gate) =>
      gate.id === "e2e" || gate.id === "doctor:aidd"
        ? {
            ...gate,
            status: "証跡不足",
            summary: `${gate.label}のコマンドは成功しましたが、evidence fileが足りません。`,
            evidenceFile: ""
          }
        : gate
    ),
    terminalEvidence: [],
    screenshotEvidence: ["experiments/aidd-control-plane-mvp-006/artifacts/screenshots/aidd-control-plane-mvp006-evidence-missing.png"],
    artifactBinder: createEmptyArtifactEvidenceBinder()
  };
}

export function createEmptyArtifactEvidenceBinder(): ArtifactEvidenceBinder {
  return {
    statusSample: "empty",
    terminalEvidence: [],
    screenshotEvidence: [],
    ciRunUrl: "",
    ciArtifactUrl: "",
    playwrightReportUrl: "",
    generatedAt: "",
    ciSummary: createEmptyCiArtifactImport()
  };
}

export function createValidArtifactEvidenceBinder(): ArtifactEvidenceBinder {
  return {
    statusSample: "valid",
    terminalEvidence: [
      "experiments/aidd-control-plane-mvp-008/artifacts/terminal/lint.txt",
      "experiments/aidd-control-plane-mvp-008/artifacts/terminal/typecheck.txt",
      "experiments/aidd-control-plane-mvp-008/artifacts/terminal/test.txt",
      "experiments/aidd-control-plane-mvp-008/artifacts/terminal/build.txt",
      "experiments/aidd-control-plane-mvp-008/artifacts/terminal/e2e.txt",
      "experiments/aidd-control-plane-mvp-008/artifacts/terminal/doctor-aidd.txt"
    ],
    screenshotEvidence: [
      "experiments/aidd-control-plane-mvp-011/artifacts/screenshots/aidd-control-plane-mvp011-empty.png",
      "experiments/aidd-control-plane-mvp-011/artifacts/screenshots/aidd-control-plane-mvp011-valid.png",
      "experiments/aidd-control-plane-mvp-011/artifacts/screenshots/aidd-control-plane-mvp011-failure.png",
      "experiments/aidd-control-plane-mvp-011/artifacts/screenshots/aidd-control-plane-mvp011-terminal-evidence.png"
    ],
    ciRunUrl: exampleUrl("github.local/aidd-lab/aidd-control-plane/actions/runs/9010"),
    ciArtifactUrl: exampleUrl("github.local/aidd-lab/aidd-control-plane/actions/runs/9010/artifacts/terminal-evidence"),
    playwrightReportUrl: exampleUrl("reports.local/aidd-control-plane-mvp-010/playwright/index.html"),
    generatedAt: "2026-06-30T09:00:00.000Z",
    ciSummary: createValidCiArtifactImport()
  };
}

export function createFailureArtifactEvidenceBinder(): ArtifactEvidenceBinder {
  return {
    statusSample: "failure",
    terminalEvidence: [
      "experiments/aidd-control-plane-mvp-008/artifacts/terminal/lint.txt",
      "experiments/aidd-control-plane-mvp-008/artifacts/terminal/e2e-stale.txt"
    ],
    screenshotEvidence: [],
    ciRunUrl: "not-a-ci-url",
    ciArtifactUrl: "",
    playwrightReportUrl: "broken-report-url",
    generatedAt: "2026-05-01T00:00:00.000Z",
    ciSummary: createFailureCiArtifactImport()
  };
}

export function createEmptyCiArtifactImport(): CiArtifactImport {
  return { workflowName: "", commitSha: "", runUrl: "", artifacts: [], jobs: [], playwrightReportUrl: "", fetchPlan: createEmptyGitHubActionsFetchPlan() };
}

export function createValidCiArtifactImport(): CiArtifactImport {
  const runUrl = exampleUrl("github.local/aidd-lab/aidd-control-plane/actions/runs/9010");
  return {
    workflowName: "AIDD Control Plane MVP 010 CI",
    commitSha: "9f4c2d1a8b7e6c5d4a3b2c1d0e9f8a7b6c5d4e3f",
    runUrl,
    artifacts: [...REQUIRED_CI_ARTIFACTS],
    jobs: REQUIRED_VERIFICATION_GATES.map((gate) => ({ name: gate, status: "成功" as const })),
    playwrightReportUrl: exampleUrl("reports.local/aidd-control-plane-mvp-010/playwright/index.html"),
    fetchPlan: parseGitHubActionsRunUrl(runUrl)
  };
}

export function createFailureCiArtifactImport(): CiArtifactImport {
  return {
    workflowName: "",
    commitSha: "abc123",
    runUrl: "broken-ci-run",
    artifacts: ["coverage"],
    jobs: [
      { name: "lint", status: "成功" },
      { name: "typecheck", status: "成功" },
      { name: "test", status: "失敗" },
      { name: "build", status: "未実行" }
    ],
    playwrightReportUrl: "broken-report",
    fetchPlan: {
      ...parseGitHubActionsRunUrl(exampleUrl("github.local/aidd-control-plane/actions/runs/")),
      tokenScopes: ["contents:read"],
      requiredArtifacts: ["coverage", "test-results"]
    }
  };
}

export function createEmptyCiWorkflowArtifactAuditor(): CiWorkflowArtifactAuditor {
  return {
    statusSample: "empty",
    workflowPath: "",
    configuredGates: [],
    configuredArtifactPaths: [],
    aiddSpecConnections: [],
    captureCommand: "",
    terminalEvidencePath: ""
  };
}

export function createValidCiWorkflowArtifactAuditor(): CiWorkflowArtifactAuditor {
  return {
    statusSample: "valid",
    workflowPath: ".github/workflows/aidd-control-plane.yml",
    configuredGates: [...REQUIRED_WORKFLOW_GATES],
    configuredArtifactPaths: [...REQUIRED_WORKFLOW_ARTIFACT_PATHS],
    aiddSpecConnections: [...REQUIRED_AIDD_SPEC_CONNECTIONS],
    captureCommand: "pnpm run capture:mvp016",
    terminalEvidencePath: "experiments/aidd-control-plane-mvp-016/artifacts/terminal"
  };
}

export function createFailureCiWorkflowArtifactAuditor(): CiWorkflowArtifactAuditor {
  return {
    statusSample: "failure",
    workflowPath: ".github/workflows/aidd-control-plane.yml",
    configuredGates: ["pnpm install --frozen-lockfile", "pnpm run lint", "pnpm run typecheck", "pnpm run test", "pnpm run build"],
    configuredArtifactPaths: ["coverage", "experiments/aidd-control-plane-mvp-016/artifacts/terminal"],
    aiddSpecConnections: ["Verification Evidence", "Review Record"],
    captureCommand: "",
    terminalEvidencePath: "experiments/aidd-control-plane-mvp-016/artifacts/terminal"
  };
}

export function evaluateCiWorkflowArtifactAuditor(auditor: CiWorkflowArtifactAuditor): CiWorkflowArtifactAudit {
  const missingWorkflow = auditor.workflowPath !== ".github/workflows/aidd-control-plane.yml";
  const missingGates = REQUIRED_WORKFLOW_GATES.filter((gate) => !auditor.configuredGates.includes(gate));
  const missingArtifactPaths = REQUIRED_WORKFLOW_ARTIFACT_PATHS.filter((artifactPath) => !auditor.configuredArtifactPaths.includes(artifactPath));
  const missingSpecConnections = REQUIRED_AIDD_SPEC_CONNECTIONS.filter((connection) => !auditor.aiddSpecConnections.includes(connection));
  const missingCaptureCommand = auditor.captureCommand !== "pnpm run capture:mvp016";

  const reviewFindings: ReviewFinding[] = [];
  if (missingWorkflow) {
    reviewFindings.push(
      buildFinding(
        "CI Workflow Artifact Auditor",
        "high",
        ".github/workflows/aidd-control-plane.ymlが未接続",
        "repo rootの.github/workflows/aidd-control-plane.ymlを追加し、generated-repoをworking-directoryにする",
        ["CI gate", "Verification Evidence"],
        "pnpm run doctor:aidd"
      )
    );
  }
  for (const gate of missingGates) {
    reviewFindings.push(
      buildFinding(
        "CI Workflow Artifact Auditor",
        gate.includes("test:e2e") || gate.includes("doctor:aidd") ? "high" : "medium",
        `${gate} gateがworkflowから不足`,
        `${gate}をGitHub Actions workflowへ追加し、terminal evidenceへ保存する`,
        ["Test Plan", "Verification Evidence"],
        "pnpm run doctor:aidd"
      )
    );
  }
  for (const artifactPath of missingArtifactPaths) {
    reviewFindings.push(
      buildFinding(
        "CI Workflow Artifact Auditor",
        artifactPath.includes("playwright") || artifactPath.includes("test-results") ? "high" : "medium",
        `${artifactPath} artifact保存が不足`,
        `${artifactPath}をactions/upload-artifactのpathへ追加する`,
        ["Verification Evidence", "Review Record", "Learning Log"],
        "pnpm run doctor:aidd"
      )
    );
  }
  for (const connection of missingSpecConnections) {
    reviewFindings.push(
      buildFinding(
        "CI Workflow Artifact Auditor",
        "medium",
        `${connection}への接続説明が不足`,
        `workflow artifact保存を${connection}へ戻す説明をUIとdocsへ追加する`,
        [connection],
        "pnpm run doctor:aidd"
      )
    );
  }
  if (missingCaptureCommand) {
    reviewFindings.push(
      buildFinding(
        "CI Workflow Artifact Auditor",
        "high",
        "capture:mvp016がworkflow監査に接続されていません",
        "capture:mvp016でempty/valid/failure/terminal evidenceを../artifacts/screenshotsへ保存する",
        ["Screen Inventory", "Verification Evidence"],
        "pnpm run capture:mvp016"
      )
    );
  }

  const status: ArtifactEvidenceStatus =
    reviewFindings.length === 0
      ? "valid"
      : auditor.statusSample === "empty" && auditor.configuredGates.length === 0 && auditor.configuredArtifactPaths.length === 0
        ? "empty"
        : "failure";
  return {
    status,
    missingWorkflow,
    missingGates,
    missingArtifactPaths,
    missingSpecConnections,
    missingCaptureCommand,
    reviewFindings,
    aiTaskPacketDelta:
      reviewFindings.length > 0
        ? reviewFindings.map((finding) => `${finding.finding}: ${finding.fixInstruction}`)
        : ["CI workflowは必須gateとartifact保存を宣言済み。GitHub Actions成功後にartifact URLをVerification Evidenceへ貼る。"],
    specUpdateCandidates:
      reviewFindings.length > 0
        ? Array.from(new Set(reviewFindings.flatMap((finding) => finding.neededUpstreamInfo)))
        : ["CI gate", "Verification Evidence", "Review Record", "Learning Log"]
  };
}

export function createEmptyGitHubActionsFetchPlan(): GitHubActionsFetchPlan {
  return { runUrl: "", owner: "", repo: "", runId: "", runSummaryUrl: "", jobsApiEndpoint: "", artifactsApiEndpoint: "", logsUrl: "", tokenScopes: [], requiredArtifacts: [] };
}

export function parseGitHubActionsRunUrl(runUrl: string): GitHubActionsFetchPlan {
  const empty = createEmptyGitHubActionsFetchPlan();
  try {
    const parsed = new URL(runUrl);
    const match = parsed.pathname.match(/^\/([^/]+)\/([^/]+)\/actions\/runs\/(\d+)\/?$/);
    if (!match) return { ...empty, runUrl };
    const [, owner, repo, runId] = match;
    const apiBase = exampleUrl(`api.github.local/repos/${owner}/${repo}/actions/runs/${runId}`);
    const webBase = `${parsed.protocol}//${parsed.host}/${owner}/${repo}/actions/runs/${runId}`;
    return {
      runUrl,
      owner,
      repo,
      runId,
      runSummaryUrl: webBase,
      jobsApiEndpoint: `${apiBase}/jobs`,
      artifactsApiEndpoint: `${apiBase}/artifacts`,
      logsUrl: `${apiBase}/logs`,
      tokenScopes: [...REQUIRED_GITHUB_TOKEN_SCOPES],
      requiredArtifacts: [...REQUIRED_CI_ARTIFACTS]
    };
  } catch {
    return { ...empty, runUrl };
  }
}

export function evaluateGitHubActionsFetchPlan(plan: GitHubActionsFetchPlan): { status: ArtifactEvidenceStatus; issues: string[] } {
  const issues: string[] = [];
  if (!isValidUrl(plan.runUrl)) issues.push("GitHub Actions Fetch Plan: run URLが壊れています");
  if (!plan.owner) issues.push("GitHub Actions Fetch Plan: ownerが未抽出です");
  if (!plan.repo) issues.push("GitHub Actions Fetch Plan: repoが未抽出です");
  if (!/^\d+$/.test(plan.runId)) issues.push("GitHub Actions Fetch Plan: run idが未抽出です");
  if (!isValidUrl(plan.jobsApiEndpoint)) issues.push("GitHub Actions Fetch Plan: jobs API endpointが未生成です");
  if (!isValidUrl(plan.artifactsApiEndpoint)) issues.push("GitHub Actions Fetch Plan: artifacts API endpointが未生成です");
  if (!isValidUrl(plan.logsUrl)) issues.push("GitHub Actions Fetch Plan: logs URLが未生成です");
  for (const scope of REQUIRED_GITHUB_TOKEN_SCOPES) {
    if (!plan.tokenScopes.includes(scope)) issues.push(`GitHub Actions Fetch Plan: ${scope} token scopeが不足しています`);
  }
  for (const artifact of REQUIRED_CI_ARTIFACTS) {
    if (!plan.requiredArtifacts.includes(artifact)) issues.push(`GitHub Actions Fetch Plan: ${artifact}取得計画が不足しています`);
  }
  if (issues.length === 0) return { status: "valid", issues };
  const isEmpty = !plan.runUrl && !plan.owner && !plan.repo && !plan.runId && plan.tokenScopes.length === 0 && plan.requiredArtifacts.length === 0;
  return { status: isEmpty ? "empty" : "failure", issues };
}

export function evaluateCiArtifactImport(summary: CiArtifactImport): { status: ArtifactEvidenceStatus; issues: string[] } {
  const issues: string[] = [];
  if (!summary.workflowName.trim()) issues.push("CI Artifact Importer: workflow名が未登録です");
  if (!/^[0-9a-f]{40}$/i.test(summary.commitSha)) issues.push("CI Artifact Importer: commit SHAが短すぎます");
  if (!isValidUrl(summary.runUrl)) issues.push("CI Artifact Importer: CI run URLが壊れています");
  if (!isValidUrl(summary.playwrightReportUrl)) issues.push("CI Artifact Importer: Playwright report URLが壊れています");
  issues.push(...evaluateGitHubActionsFetchPlan(summary.fetchPlan).issues);
  for (const gate of REQUIRED_VERIFICATION_GATES) {
    const job = summary.jobs.find((item) => item.name === gate);
    if (!job) issues.push(`CI Artifact Importer: ${gate} jobが未登録です`);
    else if (job.status !== "成功") issues.push(`CI Artifact Importer: ${gate} jobが${job.status}`);
  }
  for (const artifact of REQUIRED_CI_ARTIFACTS) {
    if (!summary.artifacts.includes(artifact)) issues.push(`CI Artifact Importer: ${artifact} artifactが不足しています`);
  }
  if (issues.length === 0) return { status: "valid", issues };
  const isEmpty = !summary.workflowName && !summary.commitSha && !summary.runUrl && summary.artifacts.length === 0 && summary.jobs.length === 0 && !summary.playwrightReportUrl && evaluateGitHubActionsFetchPlan(summary.fetchPlan).status === "empty";
  return { status: isEmpty ? "empty" : "failure", issues };
}

export function evaluateArtifactEvidenceBinder(binder: ArtifactEvidenceBinder, now = new Date("2026-06-30T00:00:00.000Z")): { status: ArtifactEvidenceStatus; issues: string[] } {
  const issues: string[] = [];
  if (binder.terminalEvidence.length === 0) issues.push("Artifact Evidence Binder: terminal evidence不足");
  if (binder.screenshotEvidence.length === 0) issues.push("Artifact Evidence Binder: screenshot evidence不足");
  if (!isValidUrl(binder.ciRunUrl)) issues.push("Artifact Evidence Binder: CI run URLが壊れています");
  if (!isValidUrl(binder.ciArtifactUrl)) issues.push("Artifact Evidence Binder: CI artifact URLが不足または壊れています");
  if (!isValidUrl(binder.playwrightReportUrl)) issues.push("Artifact Evidence Binder: Playwright report URLが壊れています");
  issues.push(...evaluateCiArtifactImport(binder.ciSummary).issues);
  if (!binder.generatedAt || Number.isNaN(Date.parse(binder.generatedAt))) {
    issues.push("Artifact Evidence Binder: generatedAtが未登録です");
  } else {
    const ageMs = now.getTime() - Date.parse(binder.generatedAt);
    const maxAgeMs = 7 * 24 * 60 * 60 * 1000;
    if (ageMs > maxAgeMs) issues.push("Artifact Evidence Binder: terminal evidenceが古いログです");
  }

  if (issues.length === 0) return { status: "valid", issues };
  const status = binder.statusSample === "empty" && isBinderEmpty(binder) ? "empty" : "failure";
  return { status, issues };
}

export function evaluateEvidenceGapRepairPlan(run: VerificationRun): EvidenceGapRepairPlan {
  const repairs: EvidenceGapRepair[] = [];
  const artifacts = new Set(run.artifactBinder.ciSummary.artifacts);
  const terminalEvidence = [...run.terminalEvidence, ...run.artifactBinder.terminalEvidence];
  const screenshotEvidence = [...run.screenshotEvidence, ...run.artifactBinder.screenshotEvidence];

  for (const artifact of REQUIRED_CI_ARTIFACTS) {
    if (!artifacts.has(artifact)) repairs.push(buildEvidenceRepair(artifact));
  }
  if (terminalEvidence.length === 0) pushUniqueRepair(repairs, "terminal-evidence");
  if (!screenshotEvidence.some((file) => /empty/i.test(file))) repairs.push(buildEvidenceRepair("empty-screenshot"));
  if (!screenshotEvidence.some((file) => /valid|ready/i.test(file))) repairs.push(buildEvidenceRepair("valid-screenshot"));
  if (!screenshotEvidence.some((file) => /failure|fail/i.test(file))) repairs.push(buildEvidenceRepair("failure-screenshot"));

  const status: ArtifactEvidenceStatus = repairs.length === 0 ? "valid" : run.artifactBinder.statusSample === "empty" ? "empty" : "failure";
  return { status, missingCount: repairs.length, repairs };
}

export function evaluateVerificationRun(run: VerificationRun): { ready: boolean; issues: string[] } {
  const issues: string[] = [];
  const gateMap = new Map(run.gates.map((gate) => [gate.id, gate]));
  for (const id of REQUIRED_VERIFICATION_GATES) {
    const gate = gateMap.get(id);
    if (!gate) {
      issues.push(`Verification Run: ${id}が未登録`);
      continue;
    }
    if (gate.status !== "成功") issues.push(`Verification Run: ${gate.label}が${gate.status}`);
    if (!gate.evidenceFile.trim()) issues.push(`Verification Evidence: ${gate.label}のevidence file不足`);
  }
  for (const [browser, status] of Object.entries(run.browserE2E)) {
    if (status !== "成功") issues.push(`3ブラウザE2E: ${browser}が${status}`);
  }
  if (run.terminalEvidence.length === 0) issues.push("Verification Evidence: terminal evidence不足");
  if (run.screenshotEvidence.length === 0) issues.push("Verification Evidence: screenshot evidence不足");
  issues.push(...evaluateArtifactEvidenceBinder(run.artifactBinder).issues);
  for (const repair of evaluateEvidenceGapRepairPlan(run).repairs) {
    issues.push(`Evidence Gap Repair Planner: ${repair.label}不足`);
  }
  return { ready: issues.length === 0, issues };
}

export function generateReviewRecord(run: VerificationRun, templateRisks: readonly string[] = []): ReviewRecord {
  const findings: ReviewFinding[] = [];
  const gateMap = new Map(run.gates.map((gate) => [gate.id, gate]));
  for (const id of REQUIRED_VERIFICATION_GATES) {
    const gate = gateMap.get(id);
    if (!gate) {
      findings.push(buildFinding("検証", "high", `${id}が未登録`, `${id}をVerification Run Trackerに追加し、実行ログを保存する`, ["Verification Evidence", "Test Plan"], GATE_COMMANDS[id]));
      continue;
    }
    if (gate.status === "未実行") findings.push(buildFinding("検証", "high", `${gate.label}が未実行`, `${gate.command}を実行し、terminal evidenceへ保存する`, ["Test Plan", "Verification Evidence"], gate.command));
    if (gate.status === "失敗") findings.push(buildFinding("検証", "high", `${gate.label}が失敗`, `${gate.summary} 修正後に${gate.command}を再実行する`, ["Acceptance Criteria Matrix", "Test Plan"], gate.command));
    if (gate.status === "証跡不足" || !gate.evidenceFile.trim()) findings.push(buildFinding("証跡", "medium", `${gate.label}の証跡不足`, `${gate.command}のログをartifacts/terminalへ保存し、Review Recordに紐づける`, ["Verification Evidence", "Review Record"], gate.command));
  }
  for (const [browser, status] of Object.entries(run.browserE2E)) {
    if (status !== "成功") findings.push(buildFinding("3ブラウザE2E", "high", `${browser} E2Eが${status}`, `Chromium / Firefox / WebKitを同じ条件で再実行し、${browser}の失敗ログを残す`, ["Browser Support Matrix", "Verification Evidence"], "pnpm run test:e2e"));
  }
  if (run.terminalEvidence.length === 0) findings.push(buildFinding("証跡", "medium", "terminal evidence不足", "各品質ゲートの実行ログをartifacts/terminal/*.txtに保存する", ["Verification Evidence"], "pnpm run lint && pnpm run typecheck && pnpm run test && pnpm run build"));
  if (run.screenshotEvidence.length === 0) findings.push(buildFinding("証跡", "medium", "screenshot evidence不足", "empty/filled/failure/terminal evidenceの画面キャプチャを保存する", ["Verification Evidence", "Screen Inventory"], "pnpm run test:e2e"));
  for (const issue of evaluateArtifactEvidenceBinder(run.artifactBinder).issues) {
    findings.push(
      buildFinding(
        issue.startsWith("GitHub Actions Fetch Plan") ? "GitHub Actions Fetch Plan" : issue.startsWith("CI Artifact Importer") ? "CI Artifact Importer" : "Artifact Evidence Binder",
        issue.includes("URL") || issue.includes("古いログ") || issue.includes("job") || issue.includes("commit") || issue.includes("run id") || issue.includes("token scope") ? "high" : "medium",
        issue.replace("Artifact Evidence Binder: ", "").replace("CI Artifact Importer: ", ""),
        `${issue.replace("Artifact Evidence Binder: ", "").replace("CI Artifact Importer: ", "")}を修正し、CI run URL、commit SHA、workflow、job、artifact、Playwright report URLを同じ実行単位で束ねる`,
        ["Verification Evidence", "Review Record", "Learning Log"],
        "pnpm run test:e2e && pnpm run doctor:aidd"
      )
    );
  }
  for (const repair of evaluateEvidenceGapRepairPlan(run).repairs) {
    findings.push(
      buildFinding(
        "Evidence Gap Repair Planner",
        repair.severity === "critical" ? "high" : repair.severity,
        `${repair.label}不足`,
        repair.fixInstruction,
        [repair.affectedArtifact, "AIDD-Spec Artifact"],
        repair.rerunCommand
      )
    );
  }

  const remainingRisks = findings.length === 0 ? [...templateRisks, "CI連携前のため、ローカル成功とGitHub Actions成功の差分は別途確認が必要"] : ["失敗ログを次回AI Task Packetへ戻すまで完了扱いにしない", ...templateRisks];
  const penalty = findings.reduce((sum, finding) => sum + (finding.severity === "high" ? 12 : finding.severity === "medium" ? 7 : 3), 0);
  return {
    score: Math.max(0, 100 - penalty),
    passed: findings.length === 0,
    findings: findings.length > 0 ? findings : [buildFinding("残リスク", "low", "主要ゲートは成功", "成功条件をテンプレートとLearning Logへ戻す", ["Learning Log"], "pnpm run doctor:aidd")],
    remainingRisks
  };
}

export function generateLearningLog(reviewRecord: ReviewRecord): LearningLog {
  const failedFindings = reviewRecord.findings.filter((finding) => finding.severity !== "low");
  const whatWorked = reviewRecord.passed ? ["lint/typecheck/test/build/e2e/doctor:aiddと証跡が揃った", "Review Recordから次回改善案を確認できる"] : ["Verification Run Trackerにより、未実行・失敗・証跡不足を分類できた"];
  const whatFailed = failedFindings.length > 0 ? failedFindings.map((finding) => finding.finding) : ["大きな失敗は検出されていないが、CI連携とチームレビューは未接続"];
  const specUpdatesNeeded = failedFindings.length > 0 ? Array.from(new Set(failedFindings.flatMap((finding) => finding.neededUpstreamInfo))) : ["Verification Evidence", "Review Record", "Learning Log"];
  const nextTaskPacketDelta = failedFindings.length > 0 ? failedFindings.map((finding) => `${finding.fixInstruction}。検証コマンド: ${finding.verificationCommand}`) : ["同じ品質ゲートをCIでも実行し、artifact URLをVerification Evidenceへ追加する"];
  return {
    whatWorked,
    whatFailed,
    specUpdatesNeeded,
    nextTaskPacketDelta,
    codexPromptDelta: ["次回のCodex Prompt Delta:", ...nextTaskPacketDelta.map((delta) => `- ${delta}`), "- 修正後はReview RecordとLearning Logを更新し、失敗が次回依頼へ戻ったことを確認する。"].join("\n")
  };
}

function buildFinding(category: ReviewFinding["category"], severity: ReviewFinding["severity"], finding: string, fixInstruction: string, neededUpstreamInfo: string[], verificationCommand: string): ReviewFinding {
  return { category, severity, finding, fixInstruction, neededUpstreamInfo, verificationCommand };
}

function buildVerificationRun(title: string, status: VerificationGateStatus, options: { summary: string; evidence: string; artifactBinder: ArtifactEvidenceBinder }): VerificationRun {
  return {
    title,
    gates: REQUIRED_VERIFICATION_GATES.map((id) => ({
      id,
      label: GATE_LABELS[id],
      status,
      command: GATE_COMMANDS[id],
      summary: options.summary,
      evidenceFile: options.evidence
    })),
    browserE2E: {
      chromium: status,
      firefox: status,
      webkit: status
    },
    terminalEvidence: [],
    screenshotEvidence: [],
    artifactBinder: options.artifactBinder
  };
}

function formatVerificationRunMarkdown(run: VerificationRun): string {
  const verification = evaluateVerificationRun(run);
  const repairPlan = evaluateEvidenceGapRepairPlan(run);
  return [
    `- Verification Run: ${run.title}`,
    `- Ready: ${verification.ready ? "ready" : "not ready"}`,
    `- 必要ゲート: ${REQUIRED_VERIFICATION_GATES.join(" / ")}`,
    ...run.gates.map((gate) => `- ${gate.label}: ${gate.status} / ${gate.command} / evidence file: ${gate.evidenceFile || "未登録"} / ${gate.summary}`),
    `- 3ブラウザE2E: Chromium=${run.browserE2E.chromium} / Firefox=${run.browserE2E.firefox} / WebKit=${run.browserE2E.webkit}`,
    `- terminal evidence: ${run.terminalEvidence.length > 0 ? run.terminalEvidence.join(" / ") : "未登録"}`,
    `- screenshot evidence: ${run.screenshotEvidence.length > 0 ? run.screenshotEvidence.join(" / ") : "未登録"}`,
    `- Artifact Evidence Binder: ${evaluateArtifactEvidenceBinder(run.artifactBinder).status}`,
    `- CI run URL: ${run.artifactBinder.ciRunUrl || "未登録"}`,
    `- CI artifact URL: ${run.artifactBinder.ciArtifactUrl || "未登録"}`,
    `- Playwright report URL: ${run.artifactBinder.playwrightReportUrl || "未登録"}`,
    `- CI Artifact Importer: workflow=${run.artifactBinder.ciSummary.workflowName || "未登録"} / commit=${run.artifactBinder.ciSummary.commitSha || "未登録"}`,
    `- CI jobs: ${run.artifactBinder.ciSummary.jobs.length > 0 ? run.artifactBinder.ciSummary.jobs.map((job) => `${job.name}=${job.status}`).join(" / ") : "未登録"}`,
    `- CI artifacts: ${run.artifactBinder.ciSummary.artifacts.length > 0 ? run.artifactBinder.ciSummary.artifacts.join(" / ") : "未登録"}`,
    `- Evidence Gap Repair Planner: ${repairPlan.status} / missing count: ${repairPlan.missingCount}`,
    ...repairPlan.repairs.map((repair) => `- Repair: ${repair.label} / ${repair.severity} / ${repair.affectedArtifact} / ${repair.fixInstruction} / ${repair.rerunCommand}`),
    `- Review Record: ${verification.ready ? "passとして記録可能" : "fail/findings/remaining riskを記録する"}`,
    `- Learning Log: ${verification.ready ? "成功条件を次回テンプレートへ戻す" : "失敗・証跡不足・修正方針を残す"}`
  ].join("\n");
}

function buildRecommendedQuestions(draft: IntakeDraft, missingFields: string[]): string[] {
  const questions: string[] = [];
  if (!draft.targetUser) questions.push("このアプリを最初に使う人は誰ですか？");
  if (!draft.userProblem) questions.push("その人は今どの作業で困っていますか？");
  if (!draft.selectedTemplateId) questions.push("どのApp Type Templateを土台にしますか？");
  if (draft.selectedTemplateId && draft.selectedTemplateId !== draft.appliedTemplateId) questions.push("選択したテンプレートを適用して初期値を反映しますか？");
  if (draft.keyFeatures.length < 2) questions.push("最初のリリースに必要な機能を2つ以上に絞ると何ですか？");
  if (draft.nonGoals.length === 0) questions.push("今回あえて作らない機能は何ですか？");
  if (draft.stateContract.length < 2) questions.push("empty/error/offlineなど、最低限どの状態を検証しますか？");
  if (missingFields.some((field) => field.startsWith("品質ゲート"))) questions.push("lint/typecheck/test/buildをどの順番で確認しますか？");
  if (missingFields.some((field) => field.startsWith("Verification Run") || field.startsWith("Verification Evidence") || field.startsWith("3ブラウザE2E"))) {
    questions.push("Verification Evidence、Review Record、Learning Logに残す証跡は揃っていますか？");
  }
  return questions.length > 0 ? questions : ["この内容でCodexに渡してよいか、残リスクを確認してください。"];
}

function formatList(items: readonly string[], fallback: string): string {
  if (items.length === 0) return `- ${fallback}`;
  return items.map((item) => `- ${item}`).join("\n");
}

function formatYamlList(items: readonly string[]): string {
  if (items.length === 0) return "    []";
  return items.map((item) => `    - "${escapeYaml(item)}"`).join("\n");
}

function formatEvidenceRepairsYaml(repairs: readonly EvidenceGapRepair[]): string[] {
  if (repairs.length === 0) return ["      []"];
  return repairs.map(
    (repair) =>
      `      - id: "${repair.id}"\n        severity: "${repair.severity}"\n        affected_artifact: "${escapeYaml(repair.affectedArtifact)}"\n        fix_instruction: "${escapeYaml(repair.fixInstruction)}"\n        rerun_command: "${escapeYaml(repair.rerunCommand)}"\n        codex_prompt_delta: "${escapeYaml(repair.codexPromptDelta)}"`
  );
}

function withFallback(items: readonly string[], fallback: string[]): string[] {
  return items.length > 0 ? [...items] : fallback;
}

function escapeYaml(value: string): string {
  return value.replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}

function exampleUrl(path: string): string {
  return `https${"://"}${path}`;
}

function isValidUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" && Boolean(parsed.hostname);
  } catch {
    return false;
  }
}

function isBinderEmpty(binder: ArtifactEvidenceBinder): boolean {
  return (
    binder.terminalEvidence.length === 0 &&
    binder.screenshotEvidence.length === 0 &&
    binder.ciRunUrl.length === 0 &&
    binder.ciArtifactUrl.length === 0 &&
    binder.playwrightReportUrl.length === 0 &&
    binder.generatedAt.length === 0 &&
    evaluateCiArtifactImport(binder.ciSummary).status === "empty"
  );
}

function buildEvidenceRepair(id: EvidenceRequirementId): EvidenceGapRepair {
  return { id, ...REQUIRED_EVIDENCE_REPAIRS[id] };
}

function pushUniqueRepair(repairs: EvidenceGapRepair[], id: EvidenceRequirementId): void {
  if (!repairs.some((repair) => repair.id === id)) repairs.push(buildEvidenceRepair(id));
}

function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || "untitled-app";
}
