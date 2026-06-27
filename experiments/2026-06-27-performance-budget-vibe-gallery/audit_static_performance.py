#!/usr/bin/env python3
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
    status = "合格" if ok else "不合格"
    suffix = f" — {detail}" if detail else ""
    return ok, f"{status}: {label}{suffix}"


def main() -> int:
    if len(sys.argv) != 2:
        print("使い方: audit_static_performance.py <app_dir>")
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

    sizes = {"html": len(html.encode("utf-8")), "css": len(css.encode("utf-8")), "js": len(js.encode("utf-8"))}
    total = sum(sizes.values())
    css_lines = len(css.splitlines())

    checks: list[tuple[bool, str]] = []
    checks.append(result(html_path.exists(), "index.html が存在する"))
    checks.append(result(css_path.exists(), "styles.css が存在する"))
    checks.append(result(js_path.exists(), "app.js が存在する"))
    checks.append(result(sizes["html"] <= HTML_BUDGET_BYTES, "HTMLサイズが予算内", f"{sizes['html']} <= {HTML_BUDGET_BYTES}"))
    checks.append(result(sizes["css"] <= CSS_BUDGET_BYTES, "CSSサイズが予算内", f"{sizes['css']} <= {CSS_BUDGET_BYTES}"))
    checks.append(result(sizes["js"] <= JS_BUDGET_BYTES, "JSサイズが予算内", f"{sizes['js']} <= {JS_BUDGET_BYTES}"))
    checks.append(result(total <= TOTAL_BUDGET_BYTES, "静的ファイル合計サイズが予算内", f"{total} <= {TOTAL_BUDGET_BYTES}"))
    checks.append(result(css_lines <= MAX_CSS_LINES, "CSS行数がレビューしやすい範囲内", f"{css_lines} <= {MAX_CSS_LINES}"))

    external_refs = re.findall(r"https?://|@import|url\(", html + "\n" + css + "\n" + js)
    checks.append(result(not external_refs, "外部ネットワーク資産を参照していない", f"found {len(external_refs)}"))

    img_tags = re.findall(r"<img\b[^>]*>", html, flags=re.I)
    imgs_have_dimensions = all(re.search(r"\bwidth=", tag, re.I) and re.search(r"\bheight=", tag, re.I) for tag in img_tags)
    imgs_have_lazy = all(re.search(r"\bloading=[\"']lazy[\"']", tag, re.I) for tag in img_tags[1:])
    checks.append(result(imgs_have_dimensions, "CLS対策として画像にwidth/heightがある", f"img tags: {len(img_tags)}"))
    checks.append(result(imgs_have_lazy, "折り返し以降の画像がlazy loadingになっている", f"img tags: {len(img_tags)}"))

    has_perf_doc = re.search(r"performance budget|asset policy|lighthouse|lcp|cls|inp|性能予算|資産方針", perf_doc, re.I)
    checks.append(result(bool(has_perf_doc), "Performance Budgetが成果物に文書化されている"))

    costly_css = re.findall(r"backdrop-filter|filter:|box-shadow|transition:|transform:", css)
    checks.append(result(len(costly_css) <= 18, "重くなりやすい視覚表現CSSが上限内", f"found {len(costly_css)} tokens"))

    has_reduced_motion = "prefers-reduced-motion" in css
    checks.append(result(has_reduced_motion, "動き/transitionにprefers-reduced-motionの代替がある"))

    no_console = not re.search(r"\bconsole\.(log|warn|error|debug)\b", js)
    checks.append(result(no_console, "consoleログがJSに残っていない"))

    print(f"対象アプリ: {app_dir}")
    print(f"サイズ: html={sizes['html']} css={sizes['css']} js={sizes['js']} total={total} css_lines={css_lines}")
    for _, line in checks:
        print(line)
    return 1 if any(not ok for ok, _ in checks) else 0

if __name__ == "__main__":
    raise SystemExit(main())
