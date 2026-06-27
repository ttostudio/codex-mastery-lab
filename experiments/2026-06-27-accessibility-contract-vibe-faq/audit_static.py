#!/usr/bin/env python3
import re
import sys
from html.parser import HTMLParser
from pathlib import Path


class AuditParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.tags = []
        self.inputs = {}
        self.labels_for = set()
        self.ids = set()
        self.live_regions = []
        self.faq_items = 0
        self.ul_ids = set()
        self.decorative_icons = []

    def handle_starttag(self, tag, attrs):
        attr = dict(attrs)
        self.tags.append((tag, attr))
        if "id" in attr:
            self.ids.add(attr["id"])
        if tag == "input" and "id" in attr:
            self.inputs[attr["id"]] = attr
        if tag == "label" and "for" in attr:
            self.labels_for.add(attr["for"])
        if attr.get("aria-live") == "polite":
            self.live_regions.append(attr)
        if tag == "ul" and "id" in attr:
            self.ul_ids.add(attr["id"])
        if tag == "li" and self.stack and self.stack[-1][0] == "ul" and self.stack[-1][1].get("id") == "faq-list":
            self.faq_items += 1
        if tag == "svg":
            self.decorative_icons.append(attr)
        self.stack.append((tag, attr))

    def handle_endtag(self, tag):
        for index in range(len(self.stack) - 1, -1, -1):
            if self.stack[index][0] == tag:
                del self.stack[index:]
                return


def check(name, passed, failures):
    print(f"{'合格' if passed else '不合格'}: {name}")
    if not passed:
        failures.append(name)


def main():
    if len(sys.argv) != 2:
        print("使い方: audit_static.py 対象アプリディレクトリ", file=sys.stderr)
        return 2

    root = Path(sys.argv[1])
    html = (root / "index.html").read_text(encoding="utf-8")
    css = (root / "styles.css").read_text(encoding="utf-8")
    js = (root / "app.js").read_text(encoding="utf-8")

    parser = AuditParser()
    parser.feed(html)
    search = parser.inputs.get("faq-search", {})
    describedby = set(search.get("aria-describedby", "").split())
    failures = []

    check("html要素にlang属性がある", bool(re.search(r"<html[^>]+lang=", html)), failures)
    check("検索欄に見えるラベルがある", "faq-search" in parser.labels_for, failures)
    check("検索欄がfaq-listを制御対象として宣言している", search.get("aria-controls") == "faq-list", failures)
    check("検索欄が補足説明テキストを参照している", "search-help" in describedby and "search-help" in parser.ids, failures)
    check("検索欄が結果件数表示を参照している", "result-status" in describedby and "result-status" in parser.ids, failures)
    check("検索欄が該当なし表示を参照している", "no-results" in describedby and "no-results" in parser.ids, failures)
    check("結果件数がaria-liveで通知される", bool(parser.live_regions), failures)
    check("FAQ一覧がul/liのリスト構造になっている", "faq-list" in parser.ul_ids, failures)
    check("FAQデータが8件以上ある", len(re.findall(r"question:\s*[\"']", js)) >= 8, failures)
    check("FAQ開閉にbutton要素を使っている", bool(re.search(r"createElement\([\"']button[\"']\)", js)), failures)
    check("フォーム送信時のページ再読み込みを防いでいる", "preventDefault()" in js and bool(re.search(r"[\"']submit[\"']\s*,", js)), failures)
    check("キーボードフォーカス用の:focus-visible指定がある", ":focus-visible" in css, failures)
    check("装飾SVGがaria-hiddenかつfocusable=falseになっている", all(icon.get("aria-hidden") == "true" and icon.get("focusable") == "false" for icon in parser.decorative_icons), failures)
    check("依存パッケージのimport/requireを使っていない", "import " not in js and "require(" not in js, failures)

    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
