#!/usr/bin/env python3
from __future__ import annotations

import re
import sys
from pathlib import Path


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8") if path.exists() else ""


def check(results: list[tuple[bool, str]], condition: bool, message: str) -> None:
    results.append((condition, message))


def main() -> int:
    if len(sys.argv) != 2:
        print("使い方: audit_static_security.py <app_dir>")
        return 2

    app = Path(sys.argv[1])
    html = read(app / "index.html")
    js = read(app / "app.js")
    css = read(app / "styles.css")
    evidence = read(app / "SECURITY_PRIVACY.md")
    results: list[tuple[bool, str]] = []

    check(results, bool(html and js and css), "必要ファイル index.html / styles.css / app.js が存在する")
    check(results, '<form' in html and 'id="lead-form"' in html, "問い合わせフォームに安定したidがある")
    check(results, 'type="email"' in html, "メール欄が type=email になっている")
    check(results, 'required' in html, "必須項目がrequiredで宣言されている")
    check(results, 'maxlength=' in html, "テキスト入力/textareaにmaxlength制約がある")
    check(results, 'name="companySize"' in html and '<select' in html, "会社規模がselectで制約されている")
    check(results, 'name="budget"' in html and '<select' in html, "予算がselectで制約されている")
    check(results, 'name="privacyConsent"' in html and 'type="checkbox"' in html and 'required' in html, "プライバシー同意チェックが必須になっている")
    check(results, 'data-classification' in html, "PII/業務情報フィールドにdata-classificationがある")
    check(results, 'aria-describedby' in html and ('privacy' in html.lower() or 'retention' in html.lower() or 'プライバシー' in html), "フォーム項目がプライバシー/保持期間の説明を参照している")
    check(results, 'method=' in html or 'data-static-demo' in html, "静的デモ/no-network方針がフォームに明示されている")
    check(results, 'innerHTML' not in js and 'insertAdjacentHTML' not in js and 'outerHTML' not in js, "ユーザー入力値をHTML注入APIで描画していない")
    check(results, 'textContent' in js, "ユーザー入力プレビューをtextContent等の安全なAPIで描画している")
    check(results, not re.search(r'\b(fetch|XMLHttpRequest|sendBeacon)\b', js), "静的デモ内でネットワーク送信APIを使っていない")
    check(results, not re.search(r'\b(localStorage|sessionStorage|indexedDB)\b', js), "PIIをブラウザストレージに保存していない")
    check(results, 'console.' not in js, "フォーム/PIIデータをconsoleに出していない")
    check(results, bool(evidence), "SECURITY_PRIVACY.md 証跡ファイルが存在する")
    evidence_l = evidence.lower()
    check(results, all(term in evidence_l for term in ['data classification', 'pii', 'retention', 'no network', 'verification']) or all(term in evidence for term in ['データ分類','PII','保持','ネットワーク','検証']), "証跡ファイルが分類、PII、保持、no-network、検証を含む")

    total_bytes = sum((app / name).stat().st_size for name in ["index.html", "styles.css", "app.js"] if (app / name).exists())
    print(f"対象アプリ: {app}")
    print(f"サイズ: total_static_bytes={total_bytes} html={len(html.encode())} css={len(css.encode())} js={len(js.encode())}")
    failed = 0
    for ok, message in results:
        print(("合格" if ok else "不合格") + f": {message}")
        failed += 0 if ok else 1
    print(f"まとめ: {len(results) - failed}件合格 / {failed}件不合格")
    return 1 if failed else 0

if __name__ == "__main__":
    raise SystemExit(main())
