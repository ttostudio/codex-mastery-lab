"use client";

import { useMemo, useState } from "react";
import { ArtifactKey, artifactDefinitions, statusLabel, validateContract } from "../src/lib/contracts";
import { createInvalidJsonSample, createMissingRequiredSample, emptyArtifacts, sampleArtifacts } from "../src/lib/samples";

const editorOrder: ArtifactKey[] = ["taskPacket", "verificationEvidence", "reviewRecord", "learningLog"];

export default function Home() {
  const [artifacts, setArtifacts] = useState<Record<ArtifactKey, string>>(emptyArtifacts);
  const validation = useMemo(() => validateContract(artifacts), [artifacts]);

  function updateArtifact(key: ArtifactKey, value: string) {
    setArtifacts((current) => ({ ...current, [key]: value }));
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">AIDD-Spec v0.1 / L3 Contract Checker</p>
          <h1>Contract Checker Dashboard</h1>
          <p className="lead">
            AI Task Packet、Verification Evidence、Review Record、Learning Log のJSONを外部API未接続・ログイン不要で検査します。
          </p>
        </div>
        <section className={`statusCard ${validation.overallStatus}`} aria-live="polite">
          <span>overall status</span>
          <strong data-testid="overall-status">{statusLabel(validation.overallStatus)}</strong>
          <small>ブラウザ保存なし、画面内だけで判定</small>
        </section>
      </header>

      <section className="actionBar" aria-label="検査シナリオ">
        <button type="button" onClick={() => setArtifacts(sampleArtifacts)}>
          サンプルを入れる
        </button>
        <button type="button" onClick={() => setArtifacts(createMissingRequiredSample())}>
          必須項目を1つ削って失敗を見る
        </button>
        <button type="button" onClick={() => setArtifacts(createInvalidJsonSample())}>
          JSONを壊してinvalid_jsonを見る
        </button>
        <button type="button" onClick={() => setArtifacts(emptyArtifacts)}>
          リセット
        </button>
      </section>

      <section className="requirements" aria-labelledby="requirements-title">
        <div className="sectionHeading">
          <p>Schema Requirements</p>
          <h2 id="requirements-title">必須項目と意図</h2>
        </div>
        <div className="requirementGrid">
          {artifactDefinitions.map((definition) => (
            <article className="requirement" key={definition.key}>
              <h3>{definition.label}</h3>
              <p>{definition.intent}</p>
              <ul>
                {definition.requiredPaths.map((path) => (
                  <li key={path}>{path}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="results" aria-labelledby="results-title">
        <div className="sectionHeading">
          <p>Validation Results</p>
          <h2 id="results-title">検査結果</h2>
        </div>
        <div className="resultGrid">
          <article>
            <h3>artifact-by-artifact status</h3>
            <ul className="statusList">
              {validation.artifactResults.map((result) => (
                <li key={result.key}>
                  <span>{result.label}</span>
                  <strong className={result.status}>{statusLabel(result.status)}</strong>
                </li>
              ))}
            </ul>
          </article>
          <article>
            <h3>missing required paths</h3>
            {validation.missingRequiredPaths.length === 0 ? (
              <p>不足pathはありません。</p>
            ) : (
              <ul data-testid="missing-paths">
                {validation.missingRequiredPaths.map((path) => (
                  <li key={path}>{path}</li>
                ))}
              </ul>
            )}
          </article>
          <article>
            <h3>invalid JSON errors</h3>
            {validation.invalidJsonErrors.length === 0 ? (
              <p>JSON形式エラーはありません。</p>
            ) : (
              <ul data-testid="json-errors">
                {validation.invalidJsonErrors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            )}
          </article>
          <article>
            <h3>improvement suggestions</h3>
            <ul>
              {validation.improvementSuggestions.map((suggestion) => (
                <li key={suggestion}>{suggestion}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="editors" aria-labelledby="editors-title">
        <div className="sectionHeading">
          <p>Artifact JSON Editors</p>
          <h2 id="editors-title">成果物JSONエディタ</h2>
        </div>
        <div className="editorGrid">
          {editorOrder.map((key) => {
            const definition = artifactDefinitions.find((item) => item.key === key);
            if (!definition) return null;
            return (
              <label className="editor" key={key}>
                <span>{definition.label}</span>
                <textarea
                  aria-label={`${definition.label} JSON`}
                  value={artifacts[key]}
                  onChange={(event) => updateArtifact(key, event.target.value)}
                  placeholder={`${definition.label} のJSONを入力`}
                  spellCheck={false}
                />
              </label>
            );
          })}
        </div>
      </section>
    </main>
  );
}
