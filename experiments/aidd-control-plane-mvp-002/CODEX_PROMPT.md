# Codex Prompt: AIDD Control Plane MVP 002

You are building AIDD Control Plane MVP 002.

Read these files first:

- `AGENTS.md`
- `standards/aidd-spec-v0.1.md`
- `standards/aidd-control-plane-mvp-v0.1.md`
- `experiments/aidd-control-plane-mvp-002/AI_TASK_PACKET.md`
- `experiments/aidd-control-plane-mvp-001/generated-repo/src/lib/aidd.ts`
- `experiments/aidd-control-plane-mvp-001/generated-repo/app/page.tsx`

Create a new Next.js app under:

`experiments/aidd-control-plane-mvp-002/generated-repo/`

Do not edit outside that generated-repo except docs/evidence under `experiments/aidd-control-plane-mvp-002/` if needed.

Build a Japanese UI for a JSON Contract Checker:

- Contract Checker Dashboard
- Artifact JSON Editors for:
  - AI Task Packet
  - Verification Evidence
  - Review Record
  - Learning Log
- Schema Requirements section with beginner-friendly intent explanations
- Validation Results section with:
  - overall status
  - artifact-by-artifact status
  - missing required paths
  - invalid JSON errors
  - improvement suggestions
- buttons for:
  - サンプルを入れる
  - 必須項目を1つ削って失敗を見る
  - JSONを壊してinvalid_jsonを見る
  - リセット

Constraints:

- No external API calls.
- No fetch/XMLHttpRequest/WebSocket/localStorage/sessionStorage.
- Japanese visible UI copy.
- TypeScript strict enough to pass typecheck.
- Use Vitest unit tests for contract validation logic.
- Use Playwright Chromium E2E for happy path, missing required, and invalid JSON.
- Add `doctor:aidd` static checker.
- Save docs: product-brief, review-record, learning-log, verification-evidence.

After implementation, run and fix until these pass:

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
```

Return a concise summary with changed files and real command results.
