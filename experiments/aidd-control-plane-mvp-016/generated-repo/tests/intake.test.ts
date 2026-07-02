import { describe, expect, it } from "vitest";
import {
  APP_TYPE_TEMPLATES,
  buildIntakeDraft,
  createEmptyCiWorkflowArtifactAuditor,
  createEvidenceMissingVerificationRun,
  createFailureVerificationRun,
  createFailureCiWorkflowArtifactAuditor,
  createSuccessVerificationRun,
  createValidCiWorkflowArtifactAuditor,
  evaluateCiArtifactImport,
  evaluateCiWorkflowArtifactAuditor,
  evaluateEvidenceGapRepairPlan,
  evaluateGitHubActionsFetchPlan,
  evaluateArtifactEvidenceBinder,
  parseGitHubActionsRunUrl,
  evaluateReadiness,
  evaluateVerificationRun,
  generateCodexPrompt,
  generateLearningLog,
  generateProductBrief,
  generateReviewRecord,
  generateTaskPacket,
  generateVerificationPlan,
  type IntakeInput
} from "../src/lib/intake";

const baseInput: IntakeInput = {
  appName: "",
  appType: "",
  targetUser: "",
  userProblem: "",
  keyFeaturesText: "",
  nonGoalsText: "",
  externalIntegrationsText: "",
  stateContract: [],
  qualityGates: [],
  selectedTemplateId: "",
  appliedTemplateId: ""
};

describe("Project Intake Wizardのドメインロジック", () => {
  it("empty stateを判定できる", () => {
    const review = evaluateReadiness(buildIntakeDraft(baseInput));

    expect(review.status).toBe("empty");
    expect(review.score).toBe(0);
    expect(review.missingFields).toContain("アプリ名");
    expect(review.missingFields).toContain("テンプレート未選択");
  });

  it("テンプレート選択後に未適用failure stateを判定できる", () => {
    const review = evaluateReadiness(
      buildIntakeDraft({
        ...baseInput,
        selectedTemplateId: "learning-support"
      })
    );

    expect(review.status).toBe("insufficient");
    expect(review.missingFields).toContain("テンプレート未適用");
    expect(review.recommendedNextQuestions).toContain("選択したテンプレートを適用して初期値を反映しますか？");
  });

  it("必須項目が不足しているinsufficient stateを判定できる", () => {
    const draft = buildIntakeDraft({
      ...baseInput,
      appName: "StudyFlow",
      appType: "Webアプリ",
      targetUser: "学習を継続したい社会人",
      userProblem: "今日やる教材を決められない",
      keyFeaturesText: "今日の学習キュー",
      stateContract: ["empty"],
      qualityGates: ["lint", "typecheck", "test"]
    });

    const review = evaluateReadiness(draft);

    expect(review.status).toBe("insufficient");
    expect(review.missingFields).toEqual(expect.arrayContaining(["主要機能を2件以上", "状態契約を2件以上", "品質ゲート: build"]));
  });

  it("ready stateを判定できる", () => {
    const review = evaluateReadiness(readyDraft());

    expect(review.status).toBe("ready");
    expect(review.score).toBe(100);
    expect(review.missingFields).toHaveLength(0);
  });

  it("Verification Runの成功サンプルは全ゲートと3ブラウザE2Eと証跡が揃う", () => {
    const verification = evaluateVerificationRun(createSuccessVerificationRun());

    expect(verification.ready).toBe(true);
    expect(verification.issues).toHaveLength(0);
  });

  it("Artifact Evidence Binderのemptyサンプルは不足証跡として判定できる", () => {
    const binder = evaluateArtifactEvidenceBinder(createEvidenceMissingVerificationRun().artifactBinder);

    expect(binder.status).toBe("empty");
    expect(binder.issues).toEqual(expect.arrayContaining(["Artifact Evidence Binder: terminal evidence不足", "Artifact Evidence Binder: CI run URLが壊れています"]));
  });

  it("Artifact Evidence BinderのvalidサンプルはCI URLとPlaywright report URLを束ねる", () => {
    const binder = createSuccessVerificationRun().artifactBinder;
    const review = evaluateArtifactEvidenceBinder(binder);

    expect(review.status).toBe("valid");
    expect(review.issues).toHaveLength(0);
    expect(binder.ciRunUrl).toContain("actions/runs/9010");
    expect(binder.ciArtifactUrl).toContain("artifacts/terminal-evidence");
    expect(binder.playwrightReportUrl).toContain("playwright/index.html");
  });

  it("Evidence Gap Repair Plannerのvalidサンプルは不足0件になる", () => {
    const plan = evaluateEvidenceGapRepairPlan(createSuccessVerificationRun());

    expect(plan.status).toBe("valid");
    expect(plan.missingCount).toBe(0);
    expect(plan.repairs).toHaveLength(0);
  });

  it("Evidence Gap Repair Plannerのfailureサンプルは複数不足と修理指示を決定的に返す", () => {
    const plan = evaluateEvidenceGapRepairPlan(createFailureVerificationRun());

    expect(plan.status).toBe("failure");
    expect(plan.missingCount).toBeGreaterThanOrEqual(4);
    expect(plan.repairs.map((repair) => repair.id)).toEqual(
      expect.arrayContaining(["playwright-report", "test-results", "terminal-evidence", "empty-screenshot", "valid-screenshot", "failure-screenshot"])
    );
    expect(plan.repairs.find((repair) => repair.id === "playwright-report")?.affectedArtifact).toContain("Browser E2E Report");
    expect(plan.repairs.find((repair) => repair.id === "playwright-report")?.rerunCommand).toBe("pnpm run test:e2e");
    expect(plan.repairs.find((repair) => repair.id === "failure-screenshot")?.codexPromptDelta).toContain("failure screenshot");
  });

  it("Artifact Evidence Binderのfailureサンプルは壊れたURL、不足証跡、古いログを返す", () => {
    const reviewRecord = generateReviewRecord(createFailureVerificationRun());
    const learningLog = generateLearningLog(reviewRecord);

    expect(reviewRecord.findings.map((finding) => finding.finding)).toEqual(
      expect.arrayContaining(["CI run URLが壊れています", "CI artifact URLが不足または壊れています", "screenshot evidence不足", "terminal evidenceが古いログです"])
    );
    expect(learningLog.nextTaskPacketDelta.join("\n")).toContain("CI run URLが壊れています");
    expect(learningLog.nextTaskPacketDelta.join("\n")).toContain("Playwright report URLが壊れています");
  });


  it("CI Artifact Importerのvalidサンプルはcommit SHA、job、artifactを検証できる", () => {
    const result = evaluateCiArtifactImport(createSuccessVerificationRun().artifactBinder.ciSummary);

    expect(result.status).toBe("valid");
    expect(result.issues).toHaveLength(0);
  });

  it("CI Artifact Importerのfailureサンプルは短いcommit SHA、失敗job、不足artifactを返す", () => {
    const result = evaluateCiArtifactImport(createFailureVerificationRun().artifactBinder.ciSummary);

    expect(result.status).toBe("failure");
    expect(result.issues).toEqual(expect.arrayContaining(["CI Artifact Importer: commit SHAが短すぎます", "CI Artifact Importer: test jobが失敗", "CI Artifact Importer: playwright-report artifactが不足しています"]));
  });

  it("GitHub Actions Artifact Fetch Planはrun URLからowner、repo、run idとAPI endpointを生成できる", () => {
    const plan = parseGitHubActionsRunUrl("https://github.local/aidd-lab/aidd-control-plane/actions/runs/9010");
    const result = evaluateGitHubActionsFetchPlan(plan);

    expect(result.status).toBe("valid");
    expect(plan.owner).toBe("aidd-lab");
    expect(plan.repo).toBe("aidd-control-plane");
    expect(plan.runId).toBe("9010");
    expect(plan.jobsApiEndpoint).toContain("/actions/runs/9010/jobs");
    expect(plan.artifactsApiEndpoint).toContain("/actions/runs/9010/artifacts");
    expect(plan.tokenScopes).toEqual(expect.arrayContaining(["actions:read", "contents:read"]));
    expect(plan.requiredArtifacts).toEqual(expect.arrayContaining(["coverage", "playwright-report", "test-results", "terminal-evidence"]));
  });

  it("GitHub Actions Artifact Fetch Planのfailureサンプルはrun id、token scope、artifact不足を返す", () => {
    const result = evaluateGitHubActionsFetchPlan(createFailureVerificationRun().artifactBinder.ciSummary.fetchPlan);

    expect(result.status).toBe("failure");
    expect(result.issues).toEqual(expect.arrayContaining(["GitHub Actions Fetch Plan: run idが未抽出です", "GitHub Actions Fetch Plan: actions:read token scopeが不足しています", "GitHub Actions Fetch Plan: playwright-report取得計画が不足しています"]));
  });

  it("CI Workflow Artifact Auditorのemptyサンプルはworkflowとgateとartifact不足を返す", () => {
    const audit = evaluateCiWorkflowArtifactAuditor(createEmptyCiWorkflowArtifactAuditor());

    expect(audit.status).toBe("empty");
    expect(audit.missingWorkflow).toBe(true);
    expect(audit.missingGates).toEqual(expect.arrayContaining(["pnpm run doctor:aidd", "pnpm run mock:doctor", "pnpm run test:e2e"]));
    expect(audit.missingArtifactPaths).toEqual(expect.arrayContaining(["coverage", "playwright-report", "test-results", "experiments/aidd-control-plane-mvp-016/artifacts/terminal"]));
    expect(audit.reviewFindings.map((finding) => finding.category)).toContain("CI Workflow Artifact Auditor");
  });

  it("CI Workflow Artifact Auditorのvalidサンプルは必須gateとartifact保存を確認できる", () => {
    const audit = evaluateCiWorkflowArtifactAuditor(createValidCiWorkflowArtifactAuditor());

    expect(audit.status).toBe("valid");
    expect(audit.reviewFindings).toHaveLength(0);
    expect(audit.aiTaskPacketDelta.join("\n")).toContain("GitHub Actions成功後");
    expect(audit.specUpdateCandidates).toEqual(expect.arrayContaining(["Verification Evidence", "Review Record", "Learning Log"]));
  });

  it("CI Workflow Artifact Auditorのfailureサンプルは不足artifactをReview FindingとAI Task Packet DeltaとAIDD-Spec更新候補に変換する", () => {
    const audit = evaluateCiWorkflowArtifactAuditor(createFailureCiWorkflowArtifactAuditor());

    expect(audit.status).toBe("failure");
    expect(audit.missingGates).toEqual(expect.arrayContaining(["pnpm run doctor:aidd", "pnpm run mock:doctor", "pnpm run test:e2e"]));
    expect(audit.missingArtifactPaths).toEqual(expect.arrayContaining(["playwright-report", "test-results"]));
    expect(audit.reviewFindings.map((finding) => finding.finding)).toEqual(expect.arrayContaining(["playwright-report artifact保存が不足", "test-results artifact保存が不足"]));
    expect(audit.aiTaskPacketDelta.join("\n")).toContain("actions/upload-artifact");
    expect(audit.specUpdateCandidates).toEqual(expect.arrayContaining(["Verification Evidence", "Review Record", "Learning Log", "Screen Inventory"]));
  });

  it("Verification Runの失敗サンプルはreadyではない", () => {
    const verification = evaluateVerificationRun(createFailureVerificationRun());

    expect(verification.ready).toBe(false);
    expect(verification.issues).toEqual(expect.arrayContaining(["Verification Run: e2eが失敗", "Verification Run: doctor:aiddが失敗", "3ブラウザE2E: webkitが失敗"]));
  });

  it("Verification Runの証跡不足サンプルはコマンド成功後もreadyではない", () => {
    const verification = evaluateVerificationRun(createEvidenceMissingVerificationRun());

    expect(verification.ready).toBe(false);
    expect(verification.issues).toEqual(
      expect.arrayContaining(["Verification Run: e2eが証跡不足", "Verification Evidence: e2eのevidence file不足", "Verification Evidence: terminal evidence不足"])
    );
  });

  it("App Type Templatesを4件以上持ち、各テンプレートにリスクと証跡要件がある", () => {
    expect(APP_TYPE_TEMPLATES.length).toBeGreaterThanOrEqual(4);
    expect(APP_TYPE_TEMPLATES.map((template) => template.name)).toEqual(expect.arrayContaining(["動画サービス風", "学習支援", "予約管理", "社内申請"]));
    for (const template of APP_TYPE_TEMPLATES) {
      expect(template.recommendedFeatures.length).toBeGreaterThanOrEqual(2);
      expect(template.stateContract.length).toBeGreaterThanOrEqual(2);
      expect(template.qualityGates).toEqual(expect.arrayContaining(["lint", "typecheck", "test", "build"]));
      expect(template.risks.length).toBeGreaterThanOrEqual(1);
      expect(template.evidenceRequirements.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("Generated Product Briefにアプリ名、対象ユーザー、非ゴールが含まれる", () => {
    const brief = generateProductBrief(readyDraft());

    expect(brief).toContain("StudyFlow");
    expect(brief).toContain("学習を継続したい社会人");
    expect(brief).toContain("課金機能");
    expect(brief).toContain("学習支援");
    expect(brief).toContain("offline時の進捗保存方針");
    expect(brief).toContain("offline / timeout状態の画面証跡");
    expect(brief).toContain("Verification Evidence / Review Record / Learning Log");
    expect(brief).toContain("terminal evidence");
  });

  it("AI Task PacketとVerification Planにテンプレート名、リスク、証跡要件、Verification Runが含まれる", () => {
    const taskPacket = generateTaskPacket(readyDraft());
    const verificationPlan = generateVerificationPlan(readyDraft());

    expect(taskPacket).toContain('app_type_template: "学習支援"');
    expect(taskPacket).toContain("template_risks");
    expect(taskPacket).toContain("evidence_requirements");
    expect(taskPacket).toContain("verification_run");
    expect(taskPacket).toContain("artifact_evidence_binder");
    expect(taskPacket).toContain("evidence_gap_repair_planner");
    expect(taskPacket).toContain("browser_e2e");
    expect(taskPacket).toContain("ci_run_url");
    expect(verificationPlan).toContain("学習支援");
    expect(verificationPlan).toContain("offline / timeout状態の画面証跡");
    expect(verificationPlan).toContain("Verification Run Tracker");
    expect(verificationPlan).toContain("Review Record");
    expect(verificationPlan).toContain("Learning Log");
    expect(verificationPlan).toContain("Evidence Gap Repair Planner");
    expect(taskPacket).toContain("ci_artifact_importer");
  });

  it("Review RecordとLearning Logが失敗を次回AI Task Packet Deltaへ戻す", () => {
    const reviewRecord = generateReviewRecord(createFailureVerificationRun(), ["offline時の進捗保存方針が曖昧になる"]);
    const learningLog = generateLearningLog(reviewRecord);

    expect(reviewRecord.passed).toBe(false);
    expect(reviewRecord.findings.map((finding) => finding.finding)).toEqual(expect.arrayContaining(["e2eが失敗", "doctor:aiddが失敗", "webkit E2Eが失敗"]));
    expect(learningLog.specUpdatesNeeded).toEqual(expect.arrayContaining(["Verification Evidence", "Test Plan"]));
    expect(learningLog.codexPromptDelta).toContain("次回のCodex Prompt Delta");
    expect(learningLog.nextTaskPacketDelta.join("\n")).toContain("pnpm run test:e2e");
    expect(learningLog.nextTaskPacketDelta.join("\n")).toContain("playwright-report");
  });

  it("成功サンプルでも残リスクと次回改善案を出せる", () => {
    const reviewRecord = generateReviewRecord(createSuccessVerificationRun());
    const learningLog = generateLearningLog(reviewRecord);

    expect(reviewRecord.passed).toBe(true);
    expect(reviewRecord.score).toBe(100);
    expect(reviewRecord.remainingRisks.join("\n")).toContain("CI連携前");
    expect(learningLog.nextTaskPacketDelta.join("\n")).toContain("CIでも実行");
  });

  it("Generated Codex Promptに品質ゲートと状態契約が含まれる", () => {
    const prompt = generateCodexPrompt(readyDraft());

    expect(prompt).toContain("lint");
    expect(prompt).toContain("typecheck");
    expect(prompt).toContain("empty");
    expect(prompt).toContain("offline");
    expect(prompt).toContain("学習支援");
    expect(prompt).toContain("リスク");
    expect(prompt).toContain("証跡要件");
    expect(prompt).toContain("Verification Run");
    expect(prompt).toContain("screenshot evidence");
    expect(prompt).toContain("Artifact Evidence Binder");
    expect(prompt).toContain("CI Artifact Importer");
    expect(prompt).toContain("Evidence Gap Repair Planner");
  });
});

function readyDraft() {
  return buildIntakeDraft({
    ...baseInput,
    appName: "StudyFlow",
    appType: "Webアプリ",
    targetUser: "学習を継続したい社会人",
    userProblem: "教材が散らばり、今日やることを決められない",
    keyFeaturesText: "今日の学習キュー\n進捗チェック",
    nonGoalsText: "課金機能\n外部AI API呼び出し",
    externalIntegrationsText: "なし",
    stateContract: ["empty", "success", "error", "offline"],
    qualityGates: ["lint", "typecheck", "test", "build", "e2e", "doctor:aidd"],
    selectedTemplateId: "learning-support",
    appliedTemplateId: "learning-support",
    verificationRun: createSuccessVerificationRun()
  });
}
