#!/usr/bin/env python3
from __future__ import annotations

import re
import sys
from pathlib import Path

CHECKS = [
    ("index.html / app.js / styles.css が存在する", lambda p: (p / "index.html").exists() and (p / "app.js").exists() and (p / "styles.css").exists()),
    ("日本語UIとして lang=ja と viewport がある", lambda p: 'lang="ja"' in (p / "index.html").read_text(encoding="utf-8") and "viewport" in (p / "index.html").read_text(encoding="utf-8")),
    ("API境界関数 requestShipments がある", lambda p: "function requestShipments" in (p / "app.js").read_text(encoding="utf-8")),
    ("success / offline / timeout / server-error / empty を扱う", lambda p: all(s in ((p / "index.html").read_text(encoding="utf-8") + (p / "app.js").read_text(encoding="utf-8")) for s in ["success", "offline", "timeout", "server-error", "empty"])),
    ("AbortController または明示timeoutがある", lambda p: "AbortController" in (p / "app.js").read_text(encoding="utf-8") or re.search(r"timeout", (p / "app.js").read_text(encoding="utf-8"), re.I)),
    ("再試行ボタンがある", lambda p: "再試行" in (p / "index.html").read_text(encoding="utf-8") + (p / "app.js").read_text(encoding="utf-8")),
    ("失敗時の入力保持・前回一覧保持方針がある", lambda p: any(w in (p / "app.js").read_text(encoding="utf-8") + (p / "PLAYWRIGHT_API_STATE_EVIDENCE.md").read_text(encoding="utf-8") if (p / "PLAYWRIGHT_API_STATE_EVIDENCE.md").exists() else "" for w in ["保持", "前回取得済み"])),
    ("aria-live で状態変化を伝える", lambda p: "aria-live" in (p / "index.html").read_text(encoding="utf-8")),
    ("Playwright E2Eテストがある", lambda p: (p.parent / "tests" / "api-state-e2e.spec.js").exists()),
    ("E2Eテスト名が日本語で、失敗状態を検証する", lambda p: all(s in (p.parent / "tests" / "api-state-e2e.spec.js").read_text(encoding="utf-8") for s in ["offline", "timeout", "server-error", "empty", "再試行"])),
    ("PLAYWRIGHT_API_STATE_EVIDENCE.md がある", lambda p: (p / "PLAYWRIGHT_API_STATE_EVIDENCE.md").exists()),
]

def main() -> int:
    if len(sys.argv) != 2:
        print("usage: audit_playwright_api_state.py <app-dir>")
        return 2
    app = Path(sys.argv[1])
    passed = 0
    failed = 0
    for label, fn in CHECKS:
        try:
            ok = bool(fn(app))
        except Exception:
            ok = False
        print(("合格" if ok else "不合格") + f": {label}")
        passed += ok
        failed += not ok
    print(f"SUMMARY: {passed} passed / {failed} failed")
    return 0 if failed == 0 else 1

if __name__ == "__main__":
    raise SystemExit(main())
