import { describe, expect, it } from "vitest";
import {
  APP_TYPE_TEMPLATES,
  buildIntakeDraft,
  evaluateReadiness,
  generateCodexPrompt,
  generateProductBrief,
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
  });

  it("AI Task PacketとVerification Planにテンプレート名、リスク、証跡要件が含まれる", () => {
    const taskPacket = generateTaskPacket(readyDraft());
    const verificationPlan = generateVerificationPlan(readyDraft());

    expect(taskPacket).toContain('app_type_template: "学習支援"');
    expect(taskPacket).toContain("template_risks");
    expect(taskPacket).toContain("evidence_requirements");
    expect(verificationPlan).toContain("学習支援");
    expect(verificationPlan).toContain("offline / timeout状態の画面証跡");
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
    appliedTemplateId: "learning-support"
  });
}
