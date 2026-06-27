#!/usr/bin/env python3
"""Start a Node contact API and run tiny dependency-free smoke checks."""
from __future__ import annotations

import json
import os
import socket
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path


def free_port() -> int:
    with socket.socket() as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


def request(method: str, url: str, body: dict | None = None, headers: dict | None = None):
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method, headers=headers or {})
    try:
        with urllib.request.urlopen(req, timeout=3) as res:
            return res.status, res.read().decode(), dict(res.headers)
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode(), dict(e.headers)


def main() -> int:
    if len(sys.argv) != 2:
        print("usage: smoke_contact_api.py <api-dir>")
        return 2

    app = Path(sys.argv[1])
    server = app / "server.js"
    port = free_port()
    env = os.environ.copy()
    env["PORT"] = str(port)
    # Provide expected security env for fixed implementation if it uses them.
    env.setdefault("CSRF_TOKEN", "lab-static-token")
    env.setdefault("ALLOWED_ORIGINS", "http://127.0.0.1")
    proc = subprocess.Popen(
        ["node", str(server)],
        cwd=Path.cwd(),
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        env=env,
    )
    try:
        base = f"http://127.0.0.1:{port}"
        for _ in range(30):
            try:
                status, body, _ = request("GET", base + "/health")
                if status == 200:
                    break
            except Exception:
                time.sleep(0.1)
        else:
            print("不合格: サーバーが起動しませんでした")
            return 1

        print(f"GET /health => {status} {body}")
        headers = {
            "Content-Type": "application/json",
            "Origin": "http://127.0.0.1",
            "X-CSRF-Token": "lab-static-token",
        }
        payload = {
            "name": "山田 太郎",
            "email": "taro@example.com",
            "company": "AIDD Lab",
            "message": "AI開発プロセスについて相談したいです。",
        }
        status, body, response_headers = request("POST", base + "/api/contact", payload, headers)
        print(f"POST /api/contact valid => {status} {body}")
        print("response_headers_subset", {k: response_headers[k] for k in response_headers if k.lower() in {"content-type", "cache-control", "x-request-id"}})

        bad_status, bad_body, _ = request("POST", base + "/api/contact", {"email": "bad"}, headers)
        print(f"POST /api/contact invalid => {bad_status} {bad_body}")

        return 0 if status in (200, 201, 202) and bad_status in (400, 422) else 1
    finally:
        proc.terminate()
        try:
            out, _ = proc.communicate(timeout=2)
        except subprocess.TimeoutExpired:
            proc.kill()
            out, _ = proc.communicate(timeout=2)
        print("サーバーログ:")
        print(out.strip())


if __name__ == "__main__":
    raise SystemExit(main())
