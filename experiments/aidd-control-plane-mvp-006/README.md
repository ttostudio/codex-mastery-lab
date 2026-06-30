# AIDD Control Plane MVP 006: Verification Run Tracker

MVP 005 は Project Intake Wizard に App Type Templates を追加し、アプリ種別ごとの状態契約・品質ゲート・リスク・証跡要件を生成物へ反映した。MVP 006 では、生成した AI Task Packet と検証ログを結びつけ、どの品質ゲートが本当に通ったのかを画面で追える Verification Run Tracker を追加する。

## 目的

- AIに渡した依頼書と、実際に実行した検証コマンドの対応を見える化する。
- `lint/typecheck/test/build/e2e/doctor:aidd` などの品質ゲートを、未実行・成功・失敗・証跡不足として扱う。
- AIDD-Spec v0.1 の Verification Evidence / Review Record / Learning Log と接続する。
- `standards/aidd-control-plane-mvp-v0.1.md` の Evidence Collector と Review Dashboard を、ユーザーが理解しやすいSaaS画面に近づける。

## 受け入れ条件

- 日本語UIで Verification Run Tracker セクションを表示する。
- 初期状態では未実行ゲートと証跡不足を failure state として表示する。
- サンプル実行ログを適用すると、各品質ゲートの pass/fail、ブラウザ別E2E結果、証跡ファイル有無が表示される。
- 失敗ログまたは証跡不足がある場合、AI Task Packet を ready 扱いにしない。
- Product Brief / AI Task Packet / Verification Plan / Codex Prompt に Verification Run の前提と必要証跡が出力される。
- unit test / Playwright E2E / doctor:aidd を更新し、lint/typecheck/test/build/e2e/doctor:aidd が通る。
