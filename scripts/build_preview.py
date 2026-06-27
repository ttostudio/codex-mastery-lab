#!/usr/bin/env python3
from __future__ import annotations

import html
import re
import shutil
from pathlib import Path

ROOT = Path('/Users/tto/codex-mastery-lab')
ARTICLES = ROOT / 'articles'
ASSETS = ROOT / 'assets'
OUT = ROOT / 'preview'
OUT_ASSETS = OUT / 'assets'

CSS = """
:root { color-scheme: light; --fg:#172033; --muted:#667085; --bg:#f5f7fb; --card:#fff; --line:#d9e2f1; --accent:#1d4ed8; --code:#0f172a; }
* { box-sizing: border-box; }
body { margin:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background:var(--bg); color:var(--fg); line-height:1.78; }
.layout { display:grid; grid-template-columns: 280px minmax(0, 1fr); min-height:100vh; }
aside { position:sticky; top:0; height:100vh; overflow:auto; padding:24px; background:#0b1220; color:#e5eefc; }
aside h1 { font-size:18px; line-height:1.35; margin:0 0 20px; }
aside a { color:#c7d7ff; text-decoration:none; display:block; padding:8px 0; border-bottom:1px solid rgba(255,255,255,.08); font-size:14px; }
aside a:hover { color:#fff; }
main { max-width: 940px; padding: 48px 42px 80px; }
article { background:var(--card); padding:42px 48px; border:1px solid var(--line); border-radius:22px; box-shadow:0 18px 50px rgba(15,23,42,.08); }
h1 { font-size: 34px; line-height:1.25; margin: 0 0 22px; letter-spacing:-.02em; }
h2 { font-size: 25px; margin: 44px 0 14px; padding-top:8px; border-top:1px solid #edf1f7; }
h3 { font-size: 19px; margin: 28px 0 10px; }
p { margin: 14px 0; }
blockquote { margin: 18px 0; padding: 14px 18px; border-left: 4px solid var(--accent); background:#eff6ff; color:#1e3a8a; border-radius: 10px; }
pre { background:var(--code); color:#e2e8f0; padding:18px; border-radius:14px; overflow:auto; line-height:1.55; font-size:13px; }
code { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
p code, li code { background:#eef2ff; color:#1e3a8a; padding:2px 5px; border-radius:5px; }
img { max-width:100%; border:1px solid var(--line); border-radius:14px; background:white; margin:18px 0; }
table { border-collapse: collapse; width:100%; margin:18px 0; font-size:14px; }
th, td { border:1px solid var(--line); padding:8px 10px; vertical-align:top; }
th { background:#f1f5f9; }
.meta { color:var(--muted); font-size:14px; margin-bottom:24px; }
.home article { max-width:860px; }
@media (max-width: 850px) { .layout { grid-template-columns:1fr; } aside { position:relative; height:auto; } main { padding:20px; } article { padding:26px 20px; } }
"""

def slug(path: Path) -> str:
    return path.stem + '.html'

def inline_md(text: str) -> str:
    text = html.escape(text)
    text = re.sub(r'`([^`]+)`', r'<code>\1</code>', text)
    text = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', text)
    text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', lambda m: f'<a href="{html.escape(m.group(2))}">{m.group(1)}</a>', text)
    return text

def md_to_html(md: str) -> str:
    lines = md.splitlines()
    out = []
    in_code = False
    code_buf = []
    in_ul = False
    in_ol = False
    in_table = False
    table_rows = []

    def close_lists():
        nonlocal in_ul, in_ol
        if in_ul:
            out.append('</ul>'); in_ul = False
        if in_ol:
            out.append('</ol>'); in_ol = False

    def flush_table():
        nonlocal in_table, table_rows
        if not in_table: return
        out.append('<table>')
        for i,row in enumerate(table_rows):
            cells = [c.strip() for c in row.strip('|').split('|')]
            if all(set(c) <= set('-: ') and c for c in cells):
                continue
            tag = 'th' if i == 0 else 'td'
            out.append('<tr>' + ''.join(f'<{tag}>{inline_md(c)}</{tag}>' for c in cells) + '</tr>')
        out.append('</table>')
        in_table = False; table_rows = []

    for line in lines:
        if line.startswith('```'):
            flush_table(); close_lists()
            if not in_code:
                in_code = True; code_buf=[]
            else:
                out.append('<pre><code>' + html.escape('\n'.join(code_buf)) + '</code></pre>')
                in_code = False
            continue
        if in_code:
            code_buf.append(line); continue
        if '|' in line and line.strip().startswith('|'):
            close_lists(); in_table = True; table_rows.append(line); continue
        else:
            flush_table()
        if not line.strip():
            close_lists(); continue
        m = re.match(r'^(#{1,6})\s+(.*)$', line)
        if m:
            close_lists(); level=len(m.group(1)); out.append(f'<h{level}>{inline_md(m.group(2))}</h{level}>'); continue
        if line.startswith('> '):
            close_lists(); out.append('<blockquote>' + inline_md(line[2:]) + '</blockquote>'); continue
        m = re.match(r'^!\[([^\]]*)\]\(([^)]+)\)', line.strip())
        if m:
            close_lists()
            src = m.group(2).replace('../assets/', 'assets/')
            out.append(f'<p><img src="{html.escape(src)}" alt="{html.escape(m.group(1))}"></p>')
            continue
        m = re.match(r'^- \[([ x])\]\s+(.*)$', line)
        if m:
            if not in_ul: out.append('<ul>'); in_ul=True
            checked=' checked' if m.group(1)=='x' else ''
            out.append(f'<li><input type="checkbox" disabled{checked}> {inline_md(m.group(2))}</li>')
            continue
        if line.startswith('- '):
            if not in_ul: out.append('<ul>'); in_ul=True
            out.append(f'<li>{inline_md(line[2:])}</li>'); continue
        m = re.match(r'^\d+\.\s+(.*)$', line)
        if m:
            if not in_ol: out.append('<ol>'); in_ol=True
            out.append(f'<li>{inline_md(m.group(1))}</li>'); continue
        close_lists()
        out.append('<p>' + inline_md(line) + '</p>')
    if in_code:
        out.append('<pre><code>' + html.escape('\n'.join(code_buf)) + '</code></pre>')
    flush_table(); close_lists()
    return '\n'.join(out)

def page(title: str, body: str, links: list[tuple[str,str]], cls='') -> str:
    nav = '\n'.join(f'<a href="{href}">{html.escape(text)}</a>' for text,href in links)
    return f'''<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{html.escape(title)}</title><style>{CSS}</style></head><body><div class="layout {cls}"><aside><h1>Codex Mastery Lab<br>AIDD-Spec Preview</h1>{nav}</aside><main>{body}</main></div></body></html>'''

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    OUT_ASSETS.mkdir(parents=True, exist_ok=True)
    for asset in list(ASSETS.glob('2026-06-27*.svg')) + list(ASSETS.glob('2026-06-27*.gif')) + list(ASSETS.glob('2026-06-27*.console.txt')):
        shutil.copy2(asset, OUT_ASSETS / asset.name)
    articles = sorted(ARTICLES.glob('2026-06-27*.md'), key=lambda p: p.name)
    links = []
    rendered = []
    for p in articles:
        title = p.read_text(encoding='utf-8').splitlines()[0].lstrip('# ').strip()
        href = slug(p)
        links.append((title, href))
        rendered.append((p, title, href))
    home_list = ''.join(f'<li><a href="{href}">{html.escape(title)}</a></li>' for _,title,href in rendered)
    home = '<article><h1>Codex Mastery Lab Preview</h1><p class="meta">Generated local preview for note drafts. Use the sidebar or list below.</p><ul>'+home_list+'</ul></article>'
    (OUT/'index.html').write_text(page('Codex Mastery Lab Preview', home, links, 'home'), encoding='utf-8')
    for p,title,href in rendered:
        md = p.read_text(encoding='utf-8')
        body = f'<article>{md_to_html(md)}</article>'
        (OUT/href).write_text(page(title, body, links), encoding='utf-8')
    print(f'Wrote {len(rendered)} articles to {OUT}')

if __name__ == '__main__':
    main()
