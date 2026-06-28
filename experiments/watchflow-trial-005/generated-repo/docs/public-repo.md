# 公開リポジトリ運用メモ

WatchFlowは学習用の動画視聴Webアプリ実験です。公開リポジトリとして扱う場合も、実サービスのロゴ、商標、実データ、実API、個人情報は含めません。

## 公開時の方針

- README/docs/logには個人ユーザー名を含む絶対パスを書かない。
- セットアップ手順は `pnpm install --frozen-lockfile` を基準にする。
- 動画、poster、字幕、認証、課金、検索はローカルmockだけで完結させる。
- control endpointはE2E用のmock専用APIとして説明し、本番APIの例として扱わない。
- Playwright report、test-results、coverageはCI artifactから確認できるようにする。
- READMEにはCI badgeと記事リンクを置き、実run証跡はGitHub Actions側で確認する。

## CI run確認手順

1. GitHubのリポジトリでActionsタブを開く。
2. `CI` workflowを選び、対象ブランチまたはPRの最新runを開く。
3. `lint typecheck test build e2e` jobが成功していることを確認する。
4. Actions summaryでcoverage指標とE2Eの実行方針を確認する。
5. 必要に応じてjob logで `pnpm exec playwright install --with-deps`、`pnpm run test:e2e`、`mock services mode: ...` の行を確認する。

## artifact確認手順

1. 対象runの下部にあるArtifactsを開く。
2. `playwright-report` をダウンロードし、E2EのHTML report、trace、スクリーンショットを確認する。
3. `test-results` をダウンロードし、失敗時のPlaywright出力を確認する。
4. `coverage` をダウンロードし、`index.html` と `coverage-summary.json` で閾値と不足箇所を確認する。
5. 失敗runの場合も `if: always()` でartifact保存を試みるため、まずartifactの有無を確認する。

## ライセンス

`LICENSE` はMITです。サンプル実装、モックデータ、生成posterはこのリポジトリ内の検証用途として扱います。
