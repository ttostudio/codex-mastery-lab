---
name: aidd-app-clone-lab
description: Use when creating or evaluating recognizable app-clone experiments for AIDD-Spec/Codex Mastery Lab. Drives an app from brief to mock backend, failure-state E2E, 3-browser Playwright, CI artifacts, screenshots, and publishable Japanese article evidence.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [aidd, codex, nextjs, playwright, ci, app-clone, mock-backend]
    related_skills: [codex, github-repo-management, test-driven-development]
---

# AIDD App Clone Lab

## Overview

This skill turns a recognizable app-inspired sample into a verified AIDD-Spec experiment. The goal is not to copy a brand; it is to reproduce a familiar interaction pattern with enough engineering evidence that another person can rerun the work.

A run is not complete when the UI looks plausible. It is complete only when mock backend contracts, failure states, unit/coverage/build gates, 3-browser Playwright E2E, GitHub Actions artifacts, and a Japanese article all exist and have real command output behind them.

## When to Use

Use this skill when:

- Building a YouTube-like, TikTok-like, Netflix-like, Slack-like, or other recognizable app-pattern sample.
- Running Codex or another coding agent against a fresh experiment directory.
- Turning a vibe-coded UI into a scored, publishable AIDD-Spec article.
- Debugging why a sample is stuck below 100 points.

Do not use this for tiny one-file demos with no CI, no mock backend, and no article deliverable.

## Required Output Shape

Each experiment should live under:

```text
experiments/<experiment-name>/
  PROMPT.md
  generated-repo/
  artifacts/<experiment-name>/
    terminal/
    score.md
articles/<date>-<experiment-name>.md
assets/<date>-<experiment-name>-*.png|gif
```

The generated repo should contain:

```text
docs/product-brief.md
docs/testing-contract.md
mocks/api
mocks/media
mocks/auth
mocks/billing
docker-compose.yml
playwright.config.ts
e2e/*.spec.ts
.github/workflows/ci.yml  # optional internal copy
```

The top-level repository should contain the actual GitHub Actions workflow under `.github/workflows/` when CI evidence is required.

## Workflow

### 1. Write a Product Brief

Create `docs/product-brief.md` before or during implementation. It must include:

- Target pattern, e.g. “YouTube風” or “TikTok風”.
- What is intentionally different from the real product.
- Primary flows.
- Failure states.
- Non-goals.

Completion criterion: a reviewer can tell what should be tested without reading the source code.

### 2. Build a Mock Backend Contract

Create independent mock services rather than hardcoding all state in components.

Minimum services:

| Service | Purpose | Required endpoints |
|---|---|---|
| `mock-api` | catalog/search/feed state | `/health`, `/state`, `/__control/state` |
| `mock-media` | video/playback/media failure | `/health`, `/state`, `/__control/state` |
| `mock-auth` | anonymous/premium/session states | `/health`, `/state`, `/__control/state` |
| `mock-billing` | free/paid/payment failure | `/health`, `/state`, `/__control/state` |

Provide scripts:

```json
{
  "mock:start": "node scripts/start-mock-services.mjs",
  "mock:stop": "node scripts/stop-mock-services.mjs",
  "mock:doctor": "node scripts/doctor-mock-services.mjs"
}
```

Completion criterion: `pnpm run mock:doctor` verifies Docker Compose config, starts services, checks all health endpoints, and stops services.

### 3. Prefer Docker Compose, Keep Node Fallback

`mock:start` should prefer:

```bash
docker compose up -d mock-api mock-media mock-auth mock-billing
```

If Docker is unavailable or cannot start, fall back to Node child processes. Log which mode was used.

Completion criterion: both a Docker path and a fallback path are documented; at least one is verified locally, and Docker is verified before claiming 100.

### 4. Encode State in E2E

Playwright tests should actively control backend state:

```ts
await request.post("http://127.0.0.1:4010/__control/state", { data: { state: "offline" } });
await page.goto("/states");
await expect(page.getByRole("heading", { name: "ネットワークに接続できません" })).toBeVisible();
```

Cover at least:

- happy navigation flow
- empty search/feed state
- media failure
- offline/timeout
- anonymous/premium/auth failure
- billing/payment failure
- one persistent user action such as save/remove/history/playlist/follow/like
- axe accessibility on key pages

Completion criterion: E2E can prove UI changes when mock service state changes.

### 5. Stabilize 3-Browser Playwright

Use Chromium, Firefox, and WebKit for functional E2E. Firefox is often slower on macOS and CI; do not remove it just because it times out.

Recommended config:

```ts
export default defineConfig({
  timeout: 60_000,
  expect: { timeout: 15_000 },
  workers: 1,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure"
  },
  webServer: {
    command: "pnpm run mock:start && WATCHFLOW_USE_EXTERNAL_MOCKS=1 pnpm exec next dev --hostname 127.0.0.1 --port 3000",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  }
});
```

Completion criterion: `pnpm run doctor:playwright` reports all three browsers available, and functional E2E passes for all three.

### 6. Treat Visual Snapshots Separately

Visual snapshots are useful but OS-specific. Linux CI may fail with missing `*-linux.png` snapshots even when the app works.

Recommended split:

- Functional CI: `pnpm exec playwright test e2e/<functional>.spec.ts`
- Local visual evidence: `pnpm exec playwright test e2e/visual.spec.ts --project=chromium`
- Commit Linux snapshots only if you intentionally maintain CI visual regression.

Completion criterion: CI success is not blocked by unplanned OS snapshot generation.

### 7. Root GitHub Actions Workflow

Generated repos may contain `.github/workflows/ci.yml`, but GitHub only reads workflows at the root of the actual repository.

Create or update:

```text
.github/workflows/<experiment>-ci.yml
```

Minimum steps:

```yaml
- run: pnpm install --frozen-lockfile
- run: pnpm exec playwright install --with-deps
- run: pnpm run doctor:playwright
- run: pnpm run mock:doctor
- run: pnpm run lint
- run: pnpm run typecheck
- run: pnpm run test:coverage
- run: pnpm run build
- run: pnpm exec playwright test e2e/watchflow.spec.ts
```

Always upload:

```yaml
- uses: actions/upload-artifact@v4
  if: always()
  with:
    name: playwright-report
    path: experiments/<name>/generated-repo/playwright-report
```

Also upload `test-results` and `coverage`.

Completion criterion: `gh run view <run-id>` reports `conclusion: success`, and the artifact API lists coverage plus Playwright report.

### 8. Capture Evidence

Save terminal logs under:

```text
experiments/<name>/artifacts/<name>/terminal/
```

Save images/GIFs under:

```text
assets/<date>-<name>-*.png
```

Sanitize before commit:

```bash
python3 - <<'PY'
from pathlib import Path
for base in [Path('articles'), Path('preview'), Path('experiments')]:
    for p in base.rglob('*'):
        if not p.is_file() or any(part in {'node_modules','.next','coverage','playwright-report','test-results'} for part in p.parts):
            continue
        try: s = p.read_text(errors='strict')
        except Exception: continue
        if any(x in s for x in ['<home>', '<host>', 'tail']):
            print('leak', p)
PY
```

Completion criterion: no local home path, machine hostname, or private tunnel URL remains in committed evidence.

### 9. Score Only from Evidence

A 100-point score requires:

- All local static gates pass.
- Docker Compose mock services start and health check passes.
- 3-browser functional E2E passes.
- GitHub Actions succeeds.
- Artifacts exist.
- Article and preview are updated.

Do not award 100 for self-review text alone.

## Prompt Template

Use this in `PROMPT.md` for Codex-style agents:

```markdown
あなたはこのrepoの AGENTS.md と skills/software-development/aidd-app-clone-lab/SKILL.md に従い、<service-pattern>風のNext.jsサンプルを0から作ります。

ゴール:
- 実サービスのロゴ/商標/コピーは使わず、体験パターンだけを再現する。
- UI、テスト名、docsは日本語。
- mock-api/mock-media/mock-auth/mock-billingを独立serviceとして用意する。
- Docker Compose優先、Node fallbackあり。
- Chromium/Firefox/WebKitの機能E2Eを通す。
- CI artifactまで確認できる構成にする。

完了条件:
- pnpm install --frozen-lockfile
- pnpm run lint
- pnpm run typecheck
- pnpm run test
- pnpm run test:coverage
- pnpm run build
- pnpm run doctor:playwright
- pnpm run mock:doctor
- pnpm exec playwright test e2e/<functional>.spec.ts --project=chromium --project=firefox --project=webkit
- docs/score-self-review.md に100点基準で自己採点を書く。
```

## Common Pitfalls

1. **Workflow in the wrong directory.** `.github/workflows` inside generated repo does not trigger Actions for the parent repo.
2. **Hardcoded state.** If E2E cannot change backend state via `/__control/state`, the sample is not a contract test.
3. **Giving up on Firefox.** Install it with `pnpm exec playwright install firefox` locally, and `--with-deps` in CI. Increase timeout before removing Firefox.
4. **Visual snapshots blocking CI.** Keep functional E2E as the CI gate unless Linux snapshots are intentionally maintained.
5. **Forgetting artifacts.** A green run without artifacts is weaker evidence.
6. **Publishing local paths.** Sanitize logs and generated HTML before commit.

## Verification Checklist

- [ ] Product brief exists and has goals/non-goals/flows/failure states.
- [ ] Mock services expose health/state/control endpoints.
- [ ] `mock:doctor` passes.
- [ ] `doctor:playwright` reports Chromium, Firefox, and WebKit available.
- [ ] lint/typecheck/unit/coverage/build pass.
- [ ] Functional E2E passes in Chromium/Firefox/WebKit.
- [ ] Docker Compose mock services start and health check.
- [ ] Root GitHub Actions workflow succeeds.
- [ ] `coverage` and `playwright-report` artifacts exist.
- [ ] Screenshots/GIF and Japanese article exist.
- [ ] Preview regenerates.
- [ ] Local paths and private hostnames are absent from committed text.
