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

SERIES_ORDER = [
    '001-series-roadmap.md',
    '2026-06-27-watchflow-trial-001.md',
    '2026-06-27-watchflow-trial-002.md',
    '2026-06-27-watchflow-trial-003.md',
    '2026-06-27-watchflow-trial-004.md',
    '2026-06-27-watchflow-trial-005.md',
]

CONTROL_PLANE_ORDER = [
    '2026-06-28-aidd-control-plane-mvp-001.md',
    '2026-06-28-aidd-control-plane-mvp-002.md',
    '2026-06-28-aidd-control-plane-mvp-003.md',
]

PAST_ARTICLES_ORDER = [
    '2026-06-27-accessibility-contract-vibe-faq.md',
    '2026-06-27-performance-budget-vibe-gallery.md',
    '2026-06-27-security-baseline-contact-form.md',
    '2026-06-27-contact-api-threat-model.md',
]

CSS = """
:root {
  color-scheme: light;
  --fg:#172033; --muted:#667085; --bg:#f5f7fb; --card:#fff; --line:#d9e2f1;
  --accent:#1d4ed8; --accent2:#7c3aed; --code:#0f172a; --soft:#eef4ff;
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Hiragino Sans', 'Noto Sans JP', sans-serif; background:var(--bg); color:var(--fg); line-height:1.82; }
a { color: var(--accent); }
.layout { display:grid; grid-template-columns: 300px minmax(0, 1fr); min-height:100vh; }
aside { position:sticky; top:0; height:100vh; overflow:auto; padding:22px; background:#0b1220; color:#e5eefc; }
.brand { font-weight:800; line-height:1.35; margin:0 0 16px; font-size:18px; letter-spacing:-.01em; }
.series-note { color:#9fb4d8; font-size:12px; margin:0 0 18px; }
.chapter-link { color:#c7d7ff; text-decoration:none; display:block; padding:10px 10px; border:1px solid rgba(255,255,255,.08); border-radius:12px; margin:8px 0; font-size:14px; background:rgba(255,255,255,.03); }
.chapter-link:hover, .chapter-link.current { color:#fff; background:rgba(59,130,246,.22); border-color:rgba(147,197,253,.45); }
.chapter-num { color:#93c5fd; font-weight:700; font-size:12px; display:block; margin-bottom:2px; }
.nav-section-title { color:#93c5fd; font-size:12px; font-weight:800; letter-spacing:.08em; text-transform:uppercase; margin:18px 0 8px; }
.chapter-link.past { color:#d7e1f7; background:rgba(255,255,255,.02); }
.chapter-link.past .chapter-num { color:#a8b6d8; }
main { max-width: 980px; padding: 42px 34px 80px; }
article { background:var(--card); padding:42px 48px; border:1px solid var(--line); border-radius:24px; box-shadow:0 18px 50px rgba(15,23,42,.08); }
h1 { font-size: clamp(28px, 5vw, 42px); line-height:1.24; margin: 0 0 22px; letter-spacing:-.03em; }
h2 { font-size: clamp(22px, 3vw, 28px); margin: 46px 0 14px; padding-top:10px; border-top:1px solid #edf1f7; }
h3 { font-size: 20px; margin: 30px 0 10px; }
p { margin: 14px 0; }
blockquote { margin: 18px 0; padding: 14px 18px; border-left: 4px solid var(--accent); background:#eff6ff; color:#1e3a8a; border-radius: 10px; }
pre { background:var(--code); color:#e2e8f0; padding:18px; border-radius:14px; overflow:auto; line-height:1.55; font-size:13px; white-space:pre-wrap; overflow-wrap:anywhere; word-break:break-word; }
pre code { white-space:pre-wrap; overflow-wrap:anywhere; word-break:break-word; }
code { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; overflow-wrap:anywhere; word-break:break-word; }
p code, li code { background:#eef2ff; color:#1e3a8a; padding:2px 5px; border-radius:5px; white-space:normal; }
ul, ol { padding-left:1.45em; }
li { overflow-wrap:anywhere; }
img { max-width:100%; border:1px solid var(--line); border-radius:14px; background:white; margin:18px 0; height:auto; }
table { border-collapse: collapse; width:100%; margin:18px 0; font-size:14px; display:block; overflow-x:auto; }
th, td { border:1px solid var(--line); padding:8px 10px; vertical-align:top; min-width:120px; }
th { background:#f1f5f9; }
.meta { color:var(--muted); font-size:14px; margin-bottom:24px; }
.hero { background:linear-gradient(135deg,#eff6ff,#faf5ff); border:1px solid #dbeafe; border-radius:24px; padding:28px; margin-bottom:22px; }
.chapter-nav { display:flex; gap:12px; justify-content:space-between; margin:24px 0; }
.chapter-nav a { flex:1; text-decoration:none; background:var(--soft); border:1px solid var(--line); border-radius:14px; padding:14px; color:#17315f; }
.chapter-nav .next { text-align:right; }
.chapter-nav span { display:block; color:var(--muted); font-size:12px; }
.home-grid { display:grid; gap:14px; padding:0; list-style:none; }
.home-grid li a { display:block; padding:18px; background:#fff; border:1px solid var(--line); border-radius:16px; text-decoration:none; box-shadow:0 8px 24px rgba(15,23,42,.05); }
.mobile-index { display:none; background:#0b1220; padding:12px 16px; position:sticky; top:0; z-index:10; }
.mobile-index details { color:#e5eefc; }
.mobile-index summary { cursor:pointer; font-weight:700; }
.mobile-index a { color:#c7d7ff; display:block; padding:8px 0; }
@media (max-width: 900px) {
  .layout { display:block; }
  aside { display:none; }
  .mobile-index { display:block; }
  main { padding:16px; max-width:none; }
  article { padding:24px 18px; border-radius:18px; }
  .chapter-nav { flex-direction:column; }
  .chapter-nav .next { text-align:left; }
  pre { font-size:12px; padding:14px; }
}
@media (max-width: 480px) {
  body { line-height:1.75; }
  main { padding:10px; }
  article { padding:20px 14px; border-radius:14px; }
  h1 { font-size:28px; }
  h2 { font-size:22px; }
}
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
            out.append(f'<p><img src="{html.escape(src)}" alt="{html.escape(m.group(1))}" loading="lazy"></p>')
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

def chapter_label(i: int, title: str) -> str:
    return f'第{i:02d}回｜{title}'

def nav_html(series_items, control_items, past_items, current_href=None):
    series = '\n'.join(
        f'<a class="chapter-link {"current" if href == current_href else ""}" href="{href}"><span class="chapter-num">第{i:02d}回</span>{html.escape(title)}</a>'
        for i, (_, title, href) in enumerate(series_items, start=1)
    )
    control = '\n'.join(
        f'<a class="chapter-link {"current" if href == current_href else ""}" href="{href}"><span class="chapter-num">MVP {i:02d}</span>{html.escape(title)}</a>'
        for i, (_, title, href) in enumerate(control_items, start=1)
    )
    past = '\n'.join(
        f'<a class="chapter-link past {"current" if href == current_href else ""}" href="{href}"><span class="chapter-num">過去記事 {i:02d}</span>{html.escape(title)}</a>'
        for i, (_, title, href) in enumerate(past_items, start=1)
    )
    return f'<div class="nav-section-title">WatchFlow 100点チャレンジ</div>{series}<div class="nav-section-title">AIDD Control Plane SaaS化</div>{control}<div class="nav-section-title">過去記事</div>{past}'

def mobile_nav(series_items, control_items, past_items):
    series = '\n'.join(f'<a href="{href}">第{i:02d}回｜{html.escape(title)}</a>' for i, (_, title, href) in enumerate(series_items, start=1))
    control = '\n'.join(f'<a href="{href}">MVP{i:02d}｜{html.escape(title)}</a>' for i, (_, title, href) in enumerate(control_items, start=1))
    past = '\n'.join(f'<a href="{href}">過去記事{i:02d}｜{html.escape(title)}</a>' for i, (_, title, href) in enumerate(past_items, start=1))
    return f'<div class="mobile-index"><details><summary>目次を開く</summary><div class="nav-section-title">WatchFlow 100点チャレンジ</div>{series}<div class="nav-section-title">AIDD Control Plane SaaS化</div>{control}<div class="nav-section-title">過去記事</div>{past}</details></div>'

def prev_next(items, index):
    parts = ['<nav class="chapter-nav" aria-label="前後の記事">']
    if index > 0:
        _, title, href = items[index-1]
        parts.append(f'<a class="prev" href="{href}"><span>前の記事</span>{html.escape(title)}</a>')
    else:
        parts.append('<span></span>')
    if index < len(items)-1:
        _, title, href = items[index+1]
        parts.append(f'<a class="next" href="{href}"><span>次の記事</span>{html.escape(title)}</a>')
    else:
        parts.append('<span></span>')
    parts.append('</nav>')
    return ''.join(parts)

def page(title: str, body: str, series_items, control_items, past_items, current_href=None, cls='') -> str:
    nav = nav_html(series_items, control_items, past_items, current_href)
    mob = mobile_nav(series_items, control_items, past_items)
    return f'''<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{html.escape(title)}</title><style>{CSS}</style></head><body>{mob}<div class="layout {cls}"><aside><p class="brand">Codex Mastery Lab<br>AIDD-Spec Preview</p><p class="series-note">WatchFlow本編、AIDD Control Plane SaaS化、過去記事を分けて読めるプレビュー</p>{nav}</aside><main>{body}</main></div></body></html>'''

def article_title(path: Path) -> str:
    for line in path.read_text(encoding='utf-8').splitlines():
        if line.startswith('# '):
            return line[2:].strip()
    return path.stem

def ordered_group(names):
    result = []
    for name in names:
        p = ARTICLES / name
        if p.exists():
            result.append(p)
    return result

def ordered_articles():
    series = ordered_group(SERIES_ORDER)
    control = ordered_group(CONTROL_PLANE_ORDER)
    past = ordered_group(PAST_ARTICLES_ORDER)
    seen = {p.name for p in series + control + past}
    for p in sorted(ARTICLES.glob('*.md')):
        if p.name not in seen and not p.name.startswith('2026-06-27-codex-mastery-lab-start'):
            past.append(p)
    return series, control, past

def main():
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir(parents=True, exist_ok=True)
    OUT_ASSETS.mkdir(parents=True, exist_ok=True)
    asset_patterns = [
        '2026-06-27*.svg', '2026-06-27*.gif', '2026-06-27*.png', '2026-06-27*.console.txt',
        '2026-06-28*.svg', '2026-06-28*.gif', '2026-06-28*.png', '2026-06-28*.console.txt',
        '2026-06-29*.svg', '2026-06-29*.gif', '2026-06-29*.png', '2026-06-29*.console.txt',
        'aidd-control-plane-*.png',
    ]
    for asset in [p for pattern in asset_patterns for p in ASSETS.glob(pattern)]:
        shutil.copy2(asset, OUT_ASSETS / asset.name)
    series_articles, control_articles, past_articles = ordered_articles()
    series_items = [(p, article_title(p), slug(p)) for p in series_articles]
    control_items = [(p, article_title(p), slug(p)) for p in control_articles]
    past_items = [(p, article_title(p), slug(p)) for p in past_articles]
    all_items = series_items + control_items + past_items
    series_list = ''.join(f'<li><a href="{href}"><strong>第{i:02d}回</strong><br>{html.escape(title)}</a></li>' for i, (_,title,href) in enumerate(series_items, start=1))
    control_list = ''.join(f'<li><a href="{href}"><strong>MVP {i:02d}</strong><br>{html.escape(title)}</a></li>' for i, (_,title,href) in enumerate(control_items, start=1))
    past_list = ''.join(f'<li><a href="{href}"><strong>過去記事 {i:02d}</strong><br>{html.escape(title)}</a></li>' for i, (_,title,href) in enumerate(past_items, start=1))
    home = '<article class="hero"><h1>Codex Mastery Lab Preview</h1><p class="meta">WatchFlow本編、AIDD Control Plane SaaS化シリーズ、過去記事を分けて参照できます。</p><h2>WatchFlow 100点チャレンジ</h2><ul class="home-grid">'+series_list+'</ul><h2>AIDD Control Plane SaaS化</h2><ul class="home-grid">'+control_list+'</ul><h2>過去記事</h2><ul class="home-grid">'+past_list+'</ul></article>'
    (OUT/'index.html').write_text(page('Codex Mastery Lab Preview', home, series_items, control_items, past_items, None, 'home'), encoding='utf-8')
    for idx, (p,title,href) in enumerate(series_items):
        md = p.read_text(encoding='utf-8')
        body = f'{prev_next(series_items, idx)}<article>{md_to_html(md)}</article>{prev_next(series_items, idx)}'
        (OUT/href).write_text(page(title, body, series_items, control_items, past_items, href), encoding='utf-8')
    for idx, (p,title,href) in enumerate(control_items):
        md = p.read_text(encoding='utf-8')
        body = f'{prev_next(control_items, idx)}<article>{md_to_html(md)}</article>{prev_next(control_items, idx)}'
        (OUT/href).write_text(page(title, body, series_items, control_items, past_items, href), encoding='utf-8')
    for idx, (p,title,href) in enumerate(past_items):
        md = p.read_text(encoding='utf-8')
        body = f'{prev_next(past_items, idx)}<article>{md_to_html(md)}</article>{prev_next(past_items, idx)}'
        (OUT/href).write_text(page(title, body, series_items, control_items, past_items, href), encoding='utf-8')
    print(f'Wrote {len(all_items)} articles to {OUT}')

if __name__ == '__main__':
    main()
