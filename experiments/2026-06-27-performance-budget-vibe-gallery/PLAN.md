# PLAN: Performance Budget を後工程から逆算する小実験

## Date
2026-06-27

## Theme
雑なバイブコーディングで作った「画像多めのSaaSギャラリー/ランディングページ」を、Performance / Lighthouse 相当と Build / Console / Verification Evidence の観点で監査し、AIDD-Spec の Performance Budget と Asset Policy に必要な前工程情報を逆算する。

## Why
前回は Accessibility Contract を対象にした。次に必要なのは、AIが見た目を優先したときに発生しやすい性能劣化を、上流のAI Task Packetでどこまで防げるかを確認すること。M4 Mac mini / 16GB RAM / 256GB SSD の制約環境なので、Lighthouse本体や重い依存は入れず、静的監査と軽量HTTP確認で検証する。

## Experiment Steps
1. Codexへ雑なプロンプトを渡し、依存なしの静的ページを `vibe-app/` に作らせる。
2. ファイルサイズ、外部画像、画像サイズ属性、lazy loading、JS/CSSサイズ、console-riskを静的監査する。
3. findingを Performance / Asset Policy / Verification Evidence の標準フォーマットで記録する。
4. 欠陥から Performance Budget を含む AI Task Packet v0.2 を逆算する。
5. Codexへ改善版Task Packetを渡し、`fixed-app/` を作らせる。
6. 同じ監査を再実行し、欠陥が減るか比較する。
7. 図解、記事、標準仕様、書籍アウトライン、backlogを更新する。

## Audit Categories
- Performance / Lighthouse proxy
- Dependency / Asset / Version Health（外部CDN・リモート画像依存）
- Build / Console / Verification Evidence

## Constraints
- No dependency install.
- No files outside this experiment directory except logs/, assets/, articles/, standards/, book/outline.md, backlog.md updates.
- Keep the app tiny and static.

## Vibe Prompt
```text
In this git repo, create a tiny static SaaS product gallery landing page under experiments/2026-06-27-performance-budget-vibe-gallery/vibe-app.
Use only HTML, CSS, and vanilla JavaScript. Make it look premium and visual, with a hero section, 6 feature/product cards, images or illustrations for each card, a testimonial strip, and a small interactive filter.
Keep it simple. Do not install dependencies. Do not modify files outside that vibe-app directory. Then exit.
```
