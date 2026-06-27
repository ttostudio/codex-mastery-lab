# Audit Results: Performance Budget Vibe Gallery

## Summary

雑プロンプト版は見た目・基本機能・外部依存なしという点では優秀だった。しかし、後工程の性能監査で見ると、Performance Budgetが成果物として存在せず、CSSが605行まで膨らみ、レビュー可能性と将来のLighthouse改善指示へ接続しづらい状態だった。

改善版AI Task Packet v0.2では、Performance Budget Contract / Asset Policy / Verification Evidence を事前に渡した。結果、fixed-appは同じ監査を全PASSし、CSS行数は605行から349行、総静的バイトは18,018 bytesから12,468 bytesへ減った。

## Vibe audit excerpt

```text
APP: experiments/2026-06-27-performance-budget-vibe-gallery/vibe-app
SIZES: html=6958 css=10154 js=906 total=18018 css_lines=605
PASS: HTML bytes within budget — 6958 <= 16000
PASS: CSS bytes within budget — 10154 <= 12000
PASS: Total static bytes within budget — 18018 <= 32000
FAIL: CSS line count stays reviewable — 605 <= 360
FAIL: Performance budget is documented in deliverable
FAIL: Potentially costly visual CSS is bounded — found 20 tokens
FAIL: Motion/transition has prefers-reduced-motion fallback
```

## Fixed audit excerpt

```text
APP: experiments/2026-06-27-performance-budget-vibe-gallery/fixed-app
SIZES: html=4930 css=6742 js=796 total=12468 css_lines=349
PASS: HTML bytes within budget — 4930 <= 16000
PASS: CSS bytes within budget — 6742 <= 12000
PASS: JS bytes within budget — 796 <= 5000
PASS: Total static bytes within budget — 12468 <= 32000
PASS: CSS line count stays reviewable — 349 <= 360
PASS: No external network asset references — found 0
PASS: Performance budget is documented in deliverable
PASS: Potentially costly visual CSS is bounded — found 5 tokens
PASS: Motion/transition has prefers-reduced-motion fallback
PASS: No console logging left in JS
```

## Standard Findings

```yaml
category: Performance / Lighthouse Proxy
finding: Visual static page had no explicit performance budget evidence and CSS grew to 605 lines despite being a tiny app.
severity: medium
observed_by: audit_static_performance.py
ideal_state: Every AI-generated UI packet carries measurable budgets for total bytes, CSS/JS size, asset source policy, motion fallback, and evidence file.
fix_instruction: Add Performance Budget Contract and Asset Policy to the AI Task Packet; require PERFORMANCE_BUDGET.md and static audit output.
needed_upstream_info:
  - Performance Budget
  - Asset Policy
  - Rendering Strategy
  - Verification Evidence
standard_update:
  document: aidd-spec-ai-task-packet-standard-v0.1.md
  field: performance_budget_contract + asset_policy
codex_prompt_delta: |
  Keep total static bytes <= 32KB, CSS <= 12KB and <= 360 lines, JS <= 5KB. Avoid external assets/CDNs/url(). Include reduced-motion fallback and PERFORMANCE_BUDGET.md with measured sizes.
verification:
  command: python3 experiments/2026-06-27-performance-budget-vibe-gallery/audit_static_performance.py experiments/2026-06-27-performance-budget-vibe-gallery/fixed-app
  expected: pass
```

```yaml
category: Build / Console / Verification Evidence
finding: The vibe app had no deliverable documenting what was measured, even though Codex verbally reported checks.
severity: medium
observed_by: file review and logs
ideal_state: Verification evidence is stored in the repo, not only in chat output.
fix_instruction: Require a local evidence artifact such as PERFORMANCE_BUDGET.md and saved command logs under experiments/.../logs.
needed_upstream_info:
  - Definition of Done
  - Required Commands
  - Evidence File List
standard_update:
  document: AI Task Packet
  field: verification_evidence.files_to_attach
codex_prompt_delta: |
  Create PERFORMANCE_BUDGET.md with budget values, measured sizes, commands run, and trade-offs.
verification:
  command: test -f experiments/2026-06-27-performance-budget-vibe-gallery/fixed-app/PERFORMANCE_BUDGET.md
  expected: pass
```
