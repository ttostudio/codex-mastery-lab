# AIDD Control Plane MVP 005: App Type Templates

MVP 004 の Project Intake Wizard は、粗いアプリ案から Product Brief / AI Task Packet / Verification Plan / Codex Prompt を生成した。MVP 005 では、ユーザーがアプリ種別を選ぶだけで、状態契約・品質ゲート・リスク・初期機能案が補助される App Type Templates を追加する。

## 目的

- 初心者が「何を検証すべきか」を白紙から考えなくてよい入口を作る。
- AIDD-Spec v0.1 の Product Brief、State Design、Quality Gates、AI Task Packet と接続する。
- `standards/aidd-control-plane-mvp-v0.1.md` の Template marketplace / Project Intake Wizard 方向へ進める。

## 受け入れ条件

- 日本語UIでアプリ種別テンプレートを選べる。
- 選択したテンプレートの推奨機能、状態契約、品質ゲート、リスク、証跡要件が表示される。
- テンプレート適用ボタンで Intake Wizard の入力に反映される。
- テンプレートが未選択または適用不足の failure state を表示する。
- Product Brief / AI Task Packet / Verification Plan / Codex Prompt にテンプレート由来の前提が出力される。
- lint/typecheck/test/build/e2e/doctor:aidd が通る。
