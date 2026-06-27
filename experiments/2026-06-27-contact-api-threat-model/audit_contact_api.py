#!/usr/bin/env python3
"""Lightweight static audit for dependency-free contact API experiments."""
from __future__ import annotations

import re
import sys
from pathlib import Path


def check(results, condition, message):
    results.append((bool(condition), message))


def main() -> int:
    if len(sys.argv) != 2:
        print("usage: audit_contact_api.py <api-dir>")
        return 2

    app = Path(sys.argv[1])
    server = app / "server.js"
    evidence = app / "SECURITY_OPERATIONS.md"
    code = server.read_text(encoding="utf-8") if server.exists() else ""
    evidence_text = evidence.read_text(encoding="utf-8") if evidence.exists() else ""
    combined = (code + "\n" + evidence_text).lower()
    results = []

    check(results, server.exists(), "server.js が存在する")
    check(results, 'require("http")' in code or "require('http')" in code, "Node.js標準のhttpモジュールを使っている")
    check(results, "express" not in code and "require(\"express\")" not in code, "Express等の外部Webフレームワークに依存していない")
    check(results, "GET" in code and "/health" in code, "GET /health が実装されている")
    check(results, "POST" in code and "/api/contact" in code, "POST /api/contact が実装されている")
    check(results, "application/json" in code.lower(), "application/json を要求または返却している")
    check(results, "MAX_BODY_BYTES" in code and re.search(r"1024\s*\*\s*(16|32|64)", code), "リクエストbodyサイズ上限が小さく明示されている")
    check(results, re.search(r"name\.length\s*>\s*\d+", code) and re.search(r"message\.length\s*>\s*\d+", code), "フィールド長の検証がある")
    check(results, "email" in code and re.search(r"/\^.*@.*\$/", code, re.S), "メールアドレス検証がある")

    # API security/abuse controls expected from the improved packet.
    check(results, "x-csrf-token" in combined or "csrf" in combined, "CSRFまたはブラウザOrigin保護が文書化/実装されている")
    check(results, "origin" in combined and ("allowlist" in combined or "allowed_origins" in combined or "allowed origin" in combined), "Origin許可リスト方針がある")
    check(results, "rate" in combined and "limit" in combined and ("429" in code or "too many" in combined), "rate limitと429挙動がある")
    check(results, "requestid" in code.lower() or "request-id" in combined or "crypto.randomuuid" in code.lower(), "request idを生成または伝播している")
    check(results, "audit" in combined and "log" in combined, "監査ログ方針がある")
    check(results, "console.log" not in code or re.search(r"console\.log\([^)]*(requestId|method|url|status|audit)", code, re.I | re.S), "consoleログでPII payloadを直接出していない")
    check(results, "retention" in combined and ("no persistence" in combined or "not persist" in combined or "memory" in combined), "保持/no-persistence方針がある")
    check(results, "data classification" in combined and "pii" in combined, "データ分類がPIIを含んでいる")
    check(results, "error contract" in combined or "error response" in combined, "エラーレスポンス契約が文書化されている")
    check(results, evidence.exists(), "SECURITY_OPERATIONS.md 証跡ファイルが存在する")
    check(results, "verification" in evidence_text.lower() and "node --check" in evidence_text.lower(), "証跡ファイルが検証コマンド/結果を含む")

    passed = sum(1 for ok, _ in results if ok)
    failed = len(results) - passed
    print(f"対象API: {app}")
    if server.exists():
        print(f"サイズ: server_js_bytes={server.stat().st_size}")
    for ok, message in results:
        print(("合格" if ok else "不合格") + f": {message}")
    print(f"まとめ: {passed}件合格 / {failed}件不合格")
    return 0 if failed == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
