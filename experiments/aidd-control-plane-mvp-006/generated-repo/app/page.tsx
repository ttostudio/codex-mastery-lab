"use client";

import { useMemo, useState } from "react";
import {
  APP_TYPES,
  APP_TYPE_TEMPLATES,
  QUALITY_GATE_OPTIONS,
  STATE_CONTRACT_OPTIONS,
  type AppTypeTemplateId,
  type QualityGate,
  type StateContract,
  type VerificationRun,
  buildIntakeDraft,
  createEvidenceMissingVerificationRun,
  createFailureVerificationRun,
  createInitialVerificationRun,
  createSuccessVerificationRun,
  evaluateReadiness,
  evaluateVerificationRun,
  generateCodexPrompt,
  generateProductBrief,
  generateTaskPacket,
  generateVerificationPlan
} from "../src/lib/intake";

const initialStateContract: StateContract[] = ["empty", "success", "error"];
const initialQualityGates: QualityGate[] = ["lint", "typecheck", "test", "build", "e2e", "doctor:aidd"];

const statusLabels = {
  empty: "empty: 入力待ち",
  draft: "draft: 下書き",
  ready: "ready: AIへ渡せます",
  insufficient: "insufficient: 必須項目が不足"
};

export default function Home() {
  const [appName, setAppName] = useState("");
  const [appType, setAppType] = useState("");
  const [targetUser, setTargetUser] = useState("");
  const [userProblem, setUserProblem] = useState("");
  const [keyFeaturesText, setKeyFeaturesText] = useState("");
  const [nonGoalsText, setNonGoalsText] = useState("");
  const [externalIntegrationsText, setExternalIntegrationsText] = useState("");
  const [stateContract, setStateContract] = useState<StateContract[]>(initialStateContract);
  const [qualityGates, setQualityGates] = useState<QualityGate[]>(initialQualityGates);
  const [selectedTemplateId, setSelectedTemplateId] = useState<AppTypeTemplateId | "">("");
  const [appliedTemplateId, setAppliedTemplateId] = useState<AppTypeTemplateId | "">("");
  const [verificationRun, setVerificationRun] = useState<VerificationRun>(() => createInitialVerificationRun());

  const draft = useMemo(
    () =>
      buildIntakeDraft({
        appName,
        appType,
        targetUser,
        userProblem,
        keyFeaturesText,
        nonGoalsText,
        externalIntegrationsText,
        stateContract,
        qualityGates,
        selectedTemplateId,
        appliedTemplateId,
        verificationRun
      }),
    [
      appName,
      appType,
      targetUser,
      userProblem,
      keyFeaturesText,
      nonGoalsText,
      externalIntegrationsText,
      stateContract,
      qualityGates,
      selectedTemplateId,
      appliedTemplateId,
      verificationRun
    ]
  );

  const review = useMemo(() => evaluateReadiness(draft), [draft]);
  const verificationReview = useMemo(() => evaluateVerificationRun(verificationRun), [verificationRun]);
  const productBrief = useMemo(() => generateProductBrief(draft), [draft]);
  const taskPacket = useMemo(() => generateTaskPacket(draft), [draft]);
  const verificationPlan = useMemo(() => generateVerificationPlan(draft), [draft]);
  const codexPrompt = useMemo(() => generateCodexPrompt(draft), [draft]);
  const selectedTemplate = APP_TYPE_TEMPLATES.find((template) => template.id === selectedTemplateId);
  const templateFailure =
    selectedTemplateId === "" ? "テンプレート未選択" : selectedTemplateId !== appliedTemplateId ? "テンプレート未適用" : "";

  function applySelectedTemplate() {
    if (!selectedTemplate) return;
    setAppType(selectedTemplate.appType);
    setKeyFeaturesText(selectedTemplate.recommendedFeatures.join("\n"));
    setNonGoalsText(selectedTemplate.nonGoals.join("\n"));
    setExternalIntegrationsText(selectedTemplate.externalIntegrations.join("\n"));
    setStateContract([...selectedTemplate.stateContract]);
    setQualityGates([...selectedTemplate.qualityGates]);
    setAppliedTemplateId(selectedTemplate.id);
  }

  return (
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <div>
          <p className="eyebrow">AIDD Control Plane MVP 006</p>
          <h1 id="hero-title">アプリ種別テンプレートから、開発ブリーフとAI依頼書と検証計画を作るSaaS</h1>
          <p>
            Project Intake Wizardは、初めてAIDD Control Planeを使う人が「何を入力すればよいか」を順番に答えられる画面です。
            App Type Templatesで初期値を作り、Product Brief、AI Task Packet、Verification Plan、Codex Prompt、Readiness Reviewをローカルで生成します。
          </p>
        </div>
        <aside className={`status-card status-${review.status}`} aria-labelledby="readiness-mini-title">
          <h2 id="readiness-mini-title">Readiness Review</h2>
          <strong>{statusLabels[review.status]}</strong>
          <span>readiness score: {review.score}</span>
        </aside>
      </section>

      <section className="workspace" aria-label="Project Intake Wizard">
        <form className="wizard" aria-labelledby="wizard-title">
          <div className="section-heading">
            <p className="eyebrow">Project Intake Wizard</p>
            <h2 id="wizard-title">AIに渡す依頼書を生成</h2>
          </div>

          <section className="template-picker" aria-labelledby="template-title">
            <div className="template-picker-header">
              <div>
                <p className="eyebrow">App Type Templates</p>
                <h3 id="template-title">テンプレートを選ぶ</h3>
              </div>
              {templateFailure ? <strong className="failure-state">{templateFailure}</strong> : <strong className="applied-state">テンプレート適用済み</strong>}
            </div>
            <div className="template-grid">
              {APP_TYPE_TEMPLATES.map((template) => (
                <label key={template.id} className={`template-option ${selectedTemplateId === template.id ? "is-selected" : ""}`}>
                  <input
                    type="radio"
                    name="app-type-template"
                    checked={selectedTemplateId === template.id}
                    onChange={() => setSelectedTemplateId(template.id)}
                  />
                  <span>
                    <strong>{template.name}</strong>
                    <small>{template.recommendedFeatures.slice(0, 3).join(" / ")}</small>
                  </span>
                </label>
              ))}
            </div>
            {selectedTemplate ? (
              <div className="template-detail" aria-live="polite">
                <p>
                  <strong>リスク:</strong> {selectedTemplate.risks.join(" / ")}
                </p>
                <p>
                  <strong>証跡要件:</strong> {selectedTemplate.evidenceRequirements.join(" / ")}
                </p>
              </div>
            ) : (
              <p className="template-detail">テンプレート未選択のため、リスクと証跡要件はまだ生成物に入りません。</p>
            )}
            <button type="button" className="primary-button" onClick={applySelectedTemplate} disabled={!selectedTemplate}>
              テンプレートを適用
            </button>
          </section>

          <label>
            <span>何を作りたいですか？</span>
            <input value={appName} onChange={(event) => setAppName(event.target.value)} placeholder="例: StudyFlow" />
          </label>

          <label>
            <span>アプリ種別</span>
            <select value={appType} onChange={(event) => setAppType(event.target.value)}>
              <option value="">選択してください</option>
              {APP_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>誰のどんな問題を解決しますか？ 対象ユーザー</span>
            <textarea value={targetUser} onChange={(event) => setTargetUser(event.target.value)} rows={3} placeholder="例: 毎日短時間で学習を進めたい社会人" />
          </label>

          <label>
            <span>解決したい問題</span>
            <textarea value={userProblem} onChange={(event) => setUserProblem(event.target.value)} rows={3} placeholder="例: 教材が散らばり、今日やることを決められない" />
          </label>

          <label>
            <span>必要な機能は何ですか？ 1行に1つ</span>
            <textarea value={keyFeaturesText} onChange={(event) => setKeyFeaturesText(event.target.value)} rows={5} placeholder={"今日の学習キュー\n進捗チェック\n復習リマインド"} />
          </label>

          <label>
            <span>作らないものを決める 1行に1つ</span>
            <textarea value={nonGoalsText} onChange={(event) => setNonGoalsText(event.target.value)} rows={4} placeholder={"外部AI API呼び出し\n課金機能\nSNS投稿"} />
          </label>

          <label>
            <span>外部連携はありますか？ 1行に1つ</span>
            <textarea value={externalIntegrationsText} onChange={(event) => setExternalIntegrationsText(event.target.value)} rows={3} placeholder="なし" />
          </label>

          <fieldset>
            <legend>必要な検証を選ぶ: どんな状態を検証しますか？</legend>
            <div className="checkbox-grid">
              {STATE_CONTRACT_OPTIONS.map((state) => (
                <label key={state} className="check-row">
                  <input
                    type="checkbox"
                    checked={stateContract.includes(state)}
                    onChange={() => setStateContract((current) => toggleItem(current, state))}
                  />
                  <span>{state}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>どの品質ゲートを通しますか？</legend>
            <div className="checkbox-grid">
              {QUALITY_GATE_OPTIONS.map((gate) => (
                <label key={gate} className="check-row">
                  <input
                    type="checkbox"
                    checked={qualityGates.includes(gate)}
                    onChange={() => setQualityGates((current) => toggleItem(current, gate))}
                  />
                  <span>{gate}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </form>

        <aside className="review-panel" aria-labelledby="review-title">
          <div className="section-heading">
            <p className="eyebrow">Readiness Review</p>
            <h2 id="review-title">{statusLabels[review.status]}</h2>
          </div>
          <meter min={0} max={100} value={review.score} aria-label="readiness score" />
          <p className="score">readiness score: {review.score}</p>

          <h3>missing fields</h3>
          {review.missingFields.length > 0 ? (
            <ul>
              {review.missingFields.map((field) => (
                <li key={field}>{field}</li>
              ))}
            </ul>
          ) : (
            <p>必須項目は揃っています。</p>
          )}

          <h3>recommended next questions</h3>
          <ul>
            {review.recommendedNextQuestions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="verification-tracker" aria-labelledby="verification-run-title">
        <div className="section-heading">
          <p className="eyebrow">Verification Run Tracker</p>
          <h2 id="verification-run-title">Verification Run Tracker</h2>
          <p>
            AIDD-Spec v0.1とstandards/aidd-control-plane-mvp-v0.1.mdのVerification Evidence / Review Record / Learning Logに接続する実行状況です。
          </p>
        </div>

        <div className={`verification-summary ${verificationReview.ready ? "is-ready" : "is-not-ready"}`} aria-live="polite">
          <strong>{verificationReview.ready ? "ready: 必要証跡が揃っています" : "not ready: failure stateがあります"}</strong>
          <span>{verificationRun.title}</span>
        </div>

        <div className="sample-actions" aria-label="Verification Runサンプル操作">
          <button type="button" className="primary-button" onClick={() => setVerificationRun(createSuccessVerificationRun())}>
            成功サンプルを適用
          </button>
          <button type="button" className="secondary-button" onClick={() => setVerificationRun(createFailureVerificationRun())}>
            失敗サンプルを適用
          </button>
          <button type="button" className="secondary-button" onClick={() => setVerificationRun(createEvidenceMissingVerificationRun())}>
            証跡不足サンプルを適用
          </button>
        </div>

        <div className="gate-grid">
          {verificationRun.gates.map((gate) => (
            <article key={gate.id} className={`gate-card gate-${gate.status}`} aria-label={`${gate.label} ${gate.status}`}>
              <div className="gate-card-header">
                <h3>{gate.label}</h3>
                <strong>{gate.status}</strong>
              </div>
              <dl>
                <div>
                  <dt>command</dt>
                  <dd>{gate.command}</dd>
                </div>
                <div>
                  <dt>summary</dt>
                  <dd>{gate.summary}</dd>
                </div>
                <div>
                  <dt>evidence file</dt>
                  <dd>{gate.evidenceFile || "未登録"}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>

        <div className="evidence-grid">
          <section aria-labelledby="browser-e2e-title">
            <h3 id="browser-e2e-title">3ブラウザE2E</h3>
            <ul>
              <li>Chromium: {verificationRun.browserE2E.chromium}</li>
              <li>Firefox: {verificationRun.browserE2E.firefox}</li>
              <li>WebKit: {verificationRun.browserE2E.webkit}</li>
            </ul>
          </section>
          <section aria-labelledby="terminal-evidence-title">
            <h3 id="terminal-evidence-title">terminal evidence</h3>
            {verificationRun.terminalEvidence.length > 0 ? (
              <ul>
                {verificationRun.terminalEvidence.map((file) => (
                  <li key={file}>{file}</li>
                ))}
              </ul>
            ) : (
              <p className="failure-state">terminal evidence不足</p>
            )}
          </section>
          <section aria-labelledby="screenshot-evidence-title">
            <h3 id="screenshot-evidence-title">screenshot evidence</h3>
            {verificationRun.screenshotEvidence.length > 0 ? (
              <ul>
                {verificationRun.screenshotEvidence.map((file) => (
                  <li key={file}>{file}</li>
                ))}
              </ul>
            ) : (
              <p className="failure-state">screenshot evidence不足</p>
            )}
          </section>
        </div>
      </section>

      <section className="outputs" aria-label="生成結果">
        <Preview title="Generated Product Brief" content={productBrief} />
        <Preview title="Generated AI Task Packet" content={taskPacket} />
        <Preview title="Verification Plan" content={verificationPlan} />
        <Preview title="Codex Prompt" content={codexPrompt} copyable />
      </section>
    </main>
  );
}

function Preview({ title, content, copyable = false }: { title: string; content: string; copyable?: boolean }) {
  return (
    <article className="preview-card" aria-labelledby={`${title.replaceAll(" ", "-")}-title`}>
      <h2 id={`${title.replaceAll(" ", "-")}-title`}>{title}</h2>
      {copyable ? (
        <textarea aria-label="コピーできるCodex Prompt" readOnly value={content} rows={15} />
      ) : (
        <pre>{content}</pre>
      )}
    </article>
  );
}

function toggleItem<T>(items: T[], item: T): T[] {
  return items.includes(item) ? items.filter((current) => current !== item) : [...items, item];
}
