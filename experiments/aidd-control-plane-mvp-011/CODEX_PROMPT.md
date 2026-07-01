# Codex Prompt: AIDD Control Plane MVP 011

あなたは `<repo>` の実験担当です。`experiments/aidd-control-plane-mvp-011/generated-repo` に、AIDD Control Plane MVP 011を実装してください。

前提:
- MVP 010のgenerated-repoを土台にしてよい。
- Next.js + TypeScript + pnpm。
- UI、テスト名、docsは日本語。
- AIDD-Spec v0.1 と `standards/aidd-control-plane-mvp-v0.1.md` に接続する。

実装内容:
1. MVP 010のGitHub Actions Artifact Fetch Planを壊さず、Evidence Gap Repair Plannerを追加する。
2. 必須証跡 coverage / playwright-report / test-results / terminal-evidence / empty screenshot / valid screenshot / failure screenshot を評価するロジックを `src/lib/intake.ts` に追加する。
3. valid sampleでは不足0件、failure sampleでは複数不足を決定的に表示する。
4. 不足ごとに、重要度、影響するAIDD-Spec artifact、修正指示、再実行コマンド、Codex prompt deltaを出す。
5. Review Finding / Learning Log / Next AI Task Packet Deltaへ不足証跡の修理指示を反映する。
6. `scripts/doctor-aidd.mjs` をMVP 011用に更新する。
7. Playwright e2eとVitestを更新し、empty / valid / failureを確認する。
8. `scripts/capture-mvp011.mjs` で次の画像を保存する。
   - `aidd-control-plane-mvp011-empty.png`
   - `aidd-control-plane-mvp011-valid.png`
   - `aidd-control-plane-mvp011-failure.png`
   - `aidd-control-plane-mvp011-terminal-evidence.png`
9. docs/product-brief.md, docs/verification-plan.md, docs/review-record.md, docs/learning-log.md をMVP 011へ更新する。

完了条件:
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`
が通る状態にしてください。

注意:
- runtime生成物をコミット対象にしない。
- 実GitHub API接続、token保存、artifact zip展開は非ゴール。
