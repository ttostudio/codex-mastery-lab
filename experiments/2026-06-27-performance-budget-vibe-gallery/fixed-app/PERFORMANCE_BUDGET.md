# Performance Budget

## Budget values

- `index.html + styles.css + app.js`: <= 32,000 bytes
- `styles.css`: <= 12,000 bytes and <= 360 lines
- `app.js`: <= 5,000 bytes
- No external network assets, third-party fonts, CDN, analytics, `@import`, or `url(...)`
- Costly paint effects are bounded and transitions include a reduced-motion fallback

## Actual measured sizes

Measured after implementation:

- `index.html`: 4,930 bytes
- `styles.css`: 6,742 bytes
- `app.js`: 796 bytes
- Total: 12,468 bytes
- CSS lines: 349

## Commands run

```bash
node --check experiments/2026-06-27-performance-budget-vibe-gallery/fixed-app/app.js
python3 experiments/2026-06-27-performance-budget-vibe-gallery/audit_static_performance.py experiments/2026-06-27-performance-budget-vibe-gallery/fixed-app
```

## Known trade-offs

- Visuals use semantic HTML and CSS gradients instead of raster screenshots to avoid network and image layout costs.
- The filter interaction hides cards with vanilla JavaScript and avoids animation beyond a small opacity transition.
