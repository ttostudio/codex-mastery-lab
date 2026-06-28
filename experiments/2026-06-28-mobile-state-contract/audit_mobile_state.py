#!/usr/bin/env python3
from __future__ import annotations

import re
import sys
from pathlib import Path


def check(name: str, ok: bool, results: list[tuple[str, bool]]) -> None:
    results.append((name, ok))
    print(("合格" if ok else "不合格") + f": {name}")


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: audit_mobile_state.py <app-dir>", file=sys.stderr)
        return 2
    app = Path(sys.argv[1])
    html = (app / "index.html").read_text(encoding="utf-8") if (app / "index.html").exists() else ""
    css = (app / "style.css").read_text(encoding="utf-8") if (app / "style.css").exists() else ""
    js = (app / "script.js").read_text(encoding="utf-8") if (app / "script.js").exists() else ""
    evidence = (app / "MOBILE_STATE_EVIDENCE.md").read_text(encoding="utf-8") if (app / "MOBILE_STATE_EVIDENCE.md").exists() else ""

    results: list[tuple[str, bool]] = []
    check("index.html / style.css / script.js が存在する", bool(html and css and js), results)
    check("日本語UIで lang=ja と viewport がある", 'lang="ja"' in html and 'name="viewport"' in html, results)
    check("主要入力に visible label がある", html.count("<label") >= 5, results)
    check("必須入力のエラー表示先が aria-describedby で結び付いている", "aria-describedby" in html and re.search(r'id="[^"]*error', html) is not None, results)
    check("エラー/成功/空状態の live region が分離されている", html.count("aria-live") >= 2 and re.search(r'id="[^"]*(status|success)', html) is not None, results)
    check("送信後に結果領域へ focus 移動する", re.search(r'\.focus\s*\(', js) is not None and "tabindex" in html, results)
    check("件名/メモに maxlength がある", re.search(r'name="subject"[^>]*maxlength=', html) is not None and re.search(r'name="memo"[^>]*maxlength=', html) is not None, results)
    check("スマホのタップ領域が44px以上で明示されている", re.search(r'min-height\s*:\s*(4[4-9]|[5-9][0-9])px', css) is not None, results)
    check("キーボードフォーカスが :focus-visible で見える", ":focus-visible" in css, results)
    check("モーションに prefers-reduced-motion がある", "prefers-reduced-motion" in css, results)
    check("外部ネットワーク資産を使っていない", "http://" not in html + css + js and "https://" not in html + css + js, results)
    check("console.log で入力値を出していない", "console.log" not in js, results)
    check("MOBILE_STATE_EVIDENCE.md がある", bool(evidence), results)
    check("証拠ファイルに状態設計/検証コマンド/既知制約がある", all(s in evidence for s in ["空状態", "エラー状態", "成功状態", "検証コマンド", "既知制約"]), results)

    passed = sum(ok for _, ok in results)
    failed = len(results) - passed
    print(f"SUMMARY: {passed} passed / {failed} failed")
    return 0 if failed == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
