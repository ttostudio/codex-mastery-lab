# AI Task Packet v0.2: Performance-Budgeted Static SaaS Gallery

## Scope
Implement the same tiny static SaaS product gallery landing page as the vibe app, but under:

```text
experiments/2026-06-27-performance-budget-vibe-gallery/fixed-app/
```

Use only HTML, CSS, and vanilla JavaScript. Do not install dependencies. Do not modify files outside `fixed-app/` except you may read `audit_static_performance.py`.

## Functional Requirements
- Hero section with clear product story.
- 6 feature/product cards.
- A testimonial/proof section.
- Small category filter interaction using vanilla JS.
- Works as static files served by `python3 -m http.server`.

## Performance Budget Contract
- Total static bytes for `index.html + styles.css + app.js` must be <= 32KB.
- `styles.css` must be <= 12KB and <= 360 lines.
- `app.js` must be <= 5KB.
- Avoid external network assets: no `http://`, `https://`, CSS `@import`, or `url(...)` references.
- Use CSS/simple inline SVG/semantic HTML instead of remote raster images.
- If images are used, every `<img>` must have explicit `width` and `height`; below-fold images must use `loading="lazy"`.
- Bound expensive paint effects: avoid excessive `box-shadow`, `backdrop-filter`, `filter`, `transition`, and `transform` declarations.
- If transitions are used, include a `@media (prefers-reduced-motion: reduce)` fallback.

## Asset Policy
- No third-party fonts.
- No CDN.
- No tracking pixels or analytics.
- Decorative visuals must be local and lightweight.

## Verification Evidence
Create a short `PERFORMANCE_BUDGET.md` inside `fixed-app/` containing:
- Budget values.
- Actual measured sizes.
- Commands run.
- Any known trade-offs.

Run if possible:

```bash
node --check experiments/2026-06-27-performance-budget-vibe-gallery/fixed-app/app.js
python3 experiments/2026-06-27-performance-budget-vibe-gallery/audit_static_performance.py experiments/2026-06-27-performance-budget-vibe-gallery/fixed-app
```

The static audit should pass.
