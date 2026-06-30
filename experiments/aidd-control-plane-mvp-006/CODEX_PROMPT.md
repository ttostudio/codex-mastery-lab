MVP 006 として、既存の AIDD Control Plane MVP 005 実装を壊さずに Verification Run Tracker を追加してください。

前提:
- このディレクトリは Next.js + TypeScript + pnpm の generated-repo です。
- UI、テスト名、サンプルデータ、エラーメッセージは日本語にしてください。
- AIDD-Spec v0.1 と standards/aidd-control-plane-mvp-v0.1.md の Verification Evidence / Review Record / Learning Log に接続してください。
- 実サービスの商標・ロゴ・コピーは使わないでください。

実装要件:
1. 画面に「Verification Run Tracker」セクションを追加する。
2. 品質ゲートとして少なくとも lint, typecheck, test, build, e2e, doctor:aidd を表示する。
3. 各ゲートに status（未実行 / 成功 / 失敗 / 証跡不足）、command、summary、evidence file を持たせる。
4. 初期状態では未実行ゲートと証跡不足を failure state として表示する。
5. 「成功サンプルを適用」ボタンで全ゲート成功、Chromium / Firefox / WebKit のE2E成功、terminal evidence と screenshot evidence が揃った状態にする。
6. 「失敗サンプルを適用」ボタンで e2e または doctor:aidd が失敗し、readyではない状態を表示する。
7. 「証跡不足サンプルを適用」ボタンでコマンドは成功しているが evidence file が足りず、readyではない状態を表示する。
8. Readiness Review / 生成される Product Brief / AI Task Packet / Verification Plan / Codex Prompt に Verification Run の状態と必要証跡を含める。
9. domain logic を app/lib または同等の場所に分離し、unit test を追加する。
10. Playwright E2E を更新し、初期、成功、失敗、証跡不足を確認する。
11. scripts/doctor-aidd.mjs を更新し、Verification Run Tracker に必要な文言・テスト・docs が存在することを確認する。
12. scripts/capture-article-assets.mjs を更新し、以下を experiments/aidd-control-plane-mvp-006/artifacts/screenshots と repo root assets に保存できるようにする。
    - aidd-control-plane-mvp006-empty.png
    - aidd-control-plane-mvp006-ready.png
    - aidd-control-plane-mvp006-failure.png
    - aidd-control-plane-mvp006-evidence-missing.png
    - aidd-control-plane-mvp006-terminal-evidence.png

検証コマンド:
- pnpm install --frozen-lockfile
- pnpm run lint
- pnpm run typecheck
- pnpm run test
- pnpm run build
- pnpm run test:e2e
- pnpm run doctor:aidd

完了時は、変更したファイルと実行した検証を簡潔に報告してください。
