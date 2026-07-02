あなたはAIDD Control Plane MVP 016を実装する。作業場所はこのexperimentの`generated-repo/`である。

MVP 015の実装を引き継ぎ、GitHub Actions workflowとartifact保存の静的監査を追加せよ。

必須要件:
- 日本語UI、日本語テスト名、日本語docsを維持する
- `.github/workflows/aidd-control-plane.yml`を追加する
- workflowはpnpm install --frozen-lockfile, lint, typecheck, test, build, doctor:aidd, mock:doctor, test:e2eを実行する
- workflowはcoverage, playwright-report, test-results, experiments terminal evidence相当のartifact保存設定を含む
- UIに「CI Workflow Artifact Auditor」を追加し、valid/failure/emptyを切り替えて説明できるようにする
- failureでは不足artifactをReview Finding、AI Task Packet Delta、AIDD-Spec更新候補に変換して表示する
- `doctor:aidd`を更新し、workflow存在、required gates、artifact paths、AIDD-Spec接続、capture:mvp016を検査する
- `capture:mvp016`を追加し、empty/valid/failure/terminal evidenceを`../artifacts/screenshots/`へ保存する
- Unit/E2Eを更新し、Chromium/Firefox/WebKitで確認できるようにする
- runtime生成物をコミット対象にしない

完了前に自分でpnpm run lint/typecheck/test/build/test:e2e/doctor:aiddを実行してよいが、最終判断は外部検証で行う。
