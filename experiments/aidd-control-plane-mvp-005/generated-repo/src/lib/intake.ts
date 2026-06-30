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
};

export type ReadinessReview = {
  status: ReadinessStatus;
  score: number;
  missingFields: string[];
  recommendedNextQuestions: string[];
};

const REQUIRED_GATES: QualityGate[] = ["lint", "typecheck", "test", "build"];

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
    templateEvidenceRequirements: appliedTemplate ? [...appliedTemplate.evidenceRequirements] : []
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

  const completedChecks = [
    Boolean(draft.appName),
    Boolean(draft.appType),
    Boolean(draft.targetUser),
    Boolean(draft.userProblem),
    Boolean(draft.selectedTemplateId),
    Boolean(draft.appliedTemplateId && draft.selectedTemplateId === draft.appliedTemplateId && draft.templateName),
    draft.keyFeatures.length >= 2,
    draft.stateContract.length >= 2,
    ...REQUIRED_GATES.map((gate) => draft.qualityGates.includes(gate))
  ].filter(Boolean).length;
  const score = Math.round((completedChecks / 12) * 100);

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
    formatList(draft.stateContract, "状態契約は未選択です。")
  ].join("\n");
}

export function generateTaskPacket(draft: IntakeDraft): string {
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
    "## 完了条件",
    "- Product Brief、AI Task Packet、Verification Plan、Readiness Reviewを更新する",
    "- 重要な品質ゲートを実行し、結果をレビュー記録に残す",
    "- 外部通信やブラウザ保存領域に依存しない"
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

function withFallback(items: readonly string[], fallback: string[]): string[] {
  return items.length > 0 ? [...items] : fallback;
}

function escapeYaml(value: string): string {
  return value.replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}

function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || "untitled-app";
}
