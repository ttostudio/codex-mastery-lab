#!/usr/bin/env python3
"""Tiny static performance/asset audit for the performance budget experiment.
No third-party dependencies. Intentionally conservative: this is a Lighthouse proxy,
not a Lighthouse replacement.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

CSS_BUDGET_BYTES = 12_000
JS_BUDGET_BYTES = 5_000
HTML_BUDGET_BYTES = 16_000
TOTAL_BUDGET_BYTES = 32_000
MAX_CSS_LINES = 360


def result(ok: bool, label: str, detail: str = "") -> tuple[bool, str]:
    status = "PASS" if ok else "FAIL"
    suffix = f" — {detail}" if detail else ""
    return ok, f"{status}: {label}{suffix}"


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: audit_static_performance.py <app_dir>")
        return 2

    app_dir = Path(sys.argv[1])
    html_path = app_dir / "index.html"
    css_path = app_dir / "styles.css"
    js_path = app_dir / "app.js"

    html = html_path.read_text(encoding="utf-8") if html_path.exists() else ""
    css = css_path.read_text(encoding="utf-8") if css_path.exists() else ""
    js = js_path.read_text(encoding="utf-8") if js_path.exists() else ""
    perf_doc_path = app_dir / "PERFORMANCE_BUDGET.md"
    perf_doc = perf_doc_path.read_text(encoding="utf-8") if perf_doc_path.exists() else ""

    sizes = {
        "html": len(html.encode("utf-8")),
        "css": len(css.encode("utf-8")),
        "js": len(js.encode("utf-8")),
    }
    total = sum(sizes.values())
    css_lines = len(css.splitlines())

    checks: list[tuple[bool, str]] = []
    checks.append(result(html_path.exists(), "index.html exists"))
    checks.append(result(css_path.exists(), "styles.css exists"))
    checks.append(result(js_path.exists(), "app.js exists"))
    checks.append(result(sizes["html"] <= HTML_BUDGET_BYTES, "HTML bytes within budget", f"{sizes['html']} <= {HTML_BUDGET_BYTES}"))
    checks.append(result(sizes["css"] <= CSS_BUDGET_BYTES, "CSS bytes within budget", f"{sizes['css']} <= {CSS_BUDGET_BYTES}"))
    checks.append(result(sizes["js"] <= JS_BUDGET_BYTES, "JS bytes within budget", f"{sizes['js']} <= {JS_BUDGET_BYTES}"))
    checks.append(result(total <= TOTAL_BUDGET_BYTES, "Total static bytes within budget", f"{total} <= {TOTAL_BUDGET_BYTES}"))
    checks.append(result(css_lines <= MAX_CSS_LINES, "CSS line count stays reviewable", f"{css_lines} <= {MAX_CSS_LINES}"))

    external_refs = re.findall(r"https?://|@import|url\(", html + "\n" + css + "\n" + js)
    checks.append(result(not external_refs, "No external network asset references", f"found {len(external_refs)}"))

    img_tags = re.findall(r"<img\b[^>]*>", html, flags=re.I)
    imgs_have_dimensions = all(re.search(r"\bwidth=", tag, re.I) and re.search(r"\bheight=", tag, re.I) for tag in img_tags)
    imgs_have_lazy = all(re.search(r"\bloading=[\"']lazy[\"']", tag, re.I) for tag in img_tags[1:])
    checks.append(result(imgs_have_dimensions, "Images have width/height to reduce CLS", f"img tags: {len(img_tags)}"))
    checks.append(result(imgs_have_lazy, "Below-fold images are lazy loaded", f"img tags: {len(img_tags)}"))

    has_perf_doc = re.search(r"performance budget|asset policy|lighthouse|lcp|cls|inp", perf_doc, re.I)
    checks.append(result(bool(has_perf_doc), "Performance budget is documented in deliverable"))

    costly_css = re.findall(r"backdrop-filter|filter:|box-shadow|transition:|transform:", css)
    checks.append(result(len(costly_css) <= 18, "Potentially costly visual CSS is bounded", f"found {len(costly_css)} tokens"))

    has_reduced_motion = "prefers-reduced-motion" in css
    checks.append(result(has_reduced_motion, "Motion/transition has prefers-reduced-motion fallback"))

    no_console = not re.search(r"\bconsole\.(log|warn|error|debug)\b", js)
    checks.append(result(no_console, "No console logging left in JS"))

    print(f"APP: {app_dir}")
    print(f"SIZES: html={sizes['html']} css={sizes['css']} js={sizes['js']} total={total} css_lines={css_lines}")
    for _, line in checks:
        print(line)

    return 1 if any(not ok for ok, _ in checks) else 0


if __name__ == "__main__":
    raise SystemExit(main())
