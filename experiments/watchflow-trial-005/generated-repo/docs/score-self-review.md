# 自己レビュー

| 観点 | 評価 | メモ |
| --- | ---: | --- |
| 日本語UI | 4/5 | 画面、サンプルデータ、エラー、テスト名、README/docsを日本語中心にした。 |
| App Router / strict | 5/5 | App Router、Route Handler、TypeScript strict前提。 |
| モックの網羅 | 5/5 | Route Handlerに加え、api/media/auth/billingの独立mock serviceを追加。Trial 004ではcontrol endpointとE2E実依存化を追加した。 |
| 動画プレイヤー | 4/5 | poster、再生、一時停止、シーク、音量、ミュート、字幕、バッファリング、失敗、リトライ、キーボード操作を実装。 |
| テスト | 5/5 | Unit、Component、E2E、Visual Regression、mock-media service testを用意。Trial 005ではcoverage thresholdを段階導入し、履歴削除、後で見る、プレイリスト操作も検証する。 |
| CI / 自動化 | 5/5 | GitHub Actions、Playwright browser install、HTML report/test-results/coverage artifact保存、Actions summary、Dependabotを設定。 |
| デザイン品質 | 4/5 | サイドナビ、カテゴリレール、登録チャンネル、履歴、プレイリスト、通知を追加し、動画サービスらしい情報設計を少し強めた。 |
| GDPR準備 | 4/5 | 主要論点を文書化。実装としての同意管理やエクスポートAPIは未実装。 |

## 次に改善する点

- Cookie同意、通知既読、データエクスポートの実画面を追加する。
- プレミアム状態と支払い失敗状態を動画一覧や権限制御へさらに接続する。
- Firefox実ブラウザをCI/ローカルで安定導入する手順をさらに固める。

## Trial 005 自己採点案

95/100

- coverage thresholdを `statements: 65`, `branches: 60`, `functions: 50`, `lines: 68` で段階導入した。
- 動画詳細で視聴履歴追加/削除、後で見る追加/解除、品質レビュープレイリスト追加/削除を操作できるようにした。
- UnitとE2Eでデータ操作を検証し、localStorageから将来mock APIへ移す永続化境界をdocsに明記した。
- READMEへCI badgeと記事リンクを追加し、`docs/public-repo.md` にCI runとartifact確認手順を書いた。
- CI workflowにmock doctorとActions summaryを追加し、coverage/E2E結果の確認導線を増やした。
- `mock:doctor` でDocker Composeの検証性とNode fallback health確認を強化した。
- ローカルFirefox未導入は `doctor:playwright` で検出し、ローカルはChromium/WebKit、最終証跡はCIでFirefox込みにする方針を明記した。

満点にしない理由:

- GitHub Actionsの実run証跡はHermes側で後から確認する前提で、この作業内では未確認。
- Docker daemonがない環境ではDocker Compose起動経路そのものは未確認になりうる。
- premium限定動画の権限制御や通知既読はまだ浅い。
