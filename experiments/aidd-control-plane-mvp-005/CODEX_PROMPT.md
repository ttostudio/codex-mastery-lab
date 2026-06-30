あなたはCodexです。<repo>/experiments/aidd-control-plane-mvp-005/generated-repo を編集して、AIDD Control Plane MVP 005: App Type Templates を実装してください。

要件:
- 既存MVP004のProject Intake Wizardを壊さず、App Type Templates機能を追加する。
- 日本語UI、日本語テスト名を維持する。
- テンプレート例: 動画サービス風、学習支援、予約管理、社内申請。
- 各テンプレートは、推奨機能、状態契約、品質ゲート、リスク、証跡要件を持つ。
- テンプレート未選択/未適用をfailure stateとして画面に表示する。
- 「テンプレートを適用」ボタンで、主要機能、状態契約、品質ゲート、非ゴール、外部連携の初期値に反映する。
- 生成されるProduct Brief / AI Task Packet / Verification Plan / Codex Promptにテンプレート名とリスク/証跡要件を含める。
- unit test と Playwright E2E を追加/更新する。
- doctor:aiddでテンプレートが4件以上あること、日本語UI文字列、required gates、e2e specを検査する。
- package名は aidd-control-plane-mvp-005 に更新する。

完了前に pnpm run lint/typecheck/test/build/test:e2e/doctor:aidd を実行できる状態にしてください。ただし実行結果の自己申告は不要です。こちらで独立検証します。
