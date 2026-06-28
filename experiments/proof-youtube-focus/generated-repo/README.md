# StudyStream

[![CI](https://github.com/ttostudio/codex-mastery-lab/actions/workflows/ci.yml/badge.svg)](https://github.com/ttostudio/codex-mastery-lab/actions/workflows/ci.yml)

StudyStream は、Next.js App Router と TypeScript strict で作る日本語UIの動画視聴Webアプリ実験です。特定サービスのロゴ、商標、実データ、実APIは使わず、ローカルモックだけでホーム、検索、再生、チャンネル、コメント、関連動画、エラー状態を確認できます。

関連記事は [articles](https://github.com/ttostudio/codex-mastery-lab/tree/main/articles) に集約します。

## 前提

- Node.js: `22.23.1` (`.node-version` / `.nvmrc`)
- pnpm: `10.24.0` (`packageManager` で固定)
- package manager: pnpm (`pnpm-lock.yaml` をコミット対象)
- 依存方針: exact versionを維持し、CIは `pnpm install --frozen-lockfile` で再現します。

## セットアップ

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm run dev
```

ブラウザで `http://localhost:3000` を開きます。

## 主な画面

- `/` ホーム
- `/search?q=TypeScript` 検索結果
- `/watch/vf-001` 動画詳細/再生画面、コメント欄、関連動画、保存操作
- `/channel/ch-tech` チャンネル概要
- `/states?auth=session_expired&billing=payment_failed` 認証/課金/ネットワーク状態
- `/design-system` コンポーネントカタログ
- `/error-demo` エラー状態

## Mock service

Next.js Route Handlerに加えて、E2Eでは独立したNode mock serviceを実依存として使います。Docker Composeを優先し、Dockerが使えない環境ではNode直接起動へフォールバックします。

```bash
pnpm run mock:start
pnpm run mock:stop
pnpm run mock:doctor
```

主なserviceは次の通りです。

- `mock-api`: `http://127.0.0.1:4010/videos`, `/search`, `/state`
- `mock-media`: `http://127.0.0.1:4020/video`, `/captions/ja.vtt`, `/state`
- `mock-auth`: `http://127.0.0.1:4030/auth`, `/state`
- `mock-billing`: `http://127.0.0.1:4040/billing`, `/state`

`POST /__control/state` はE2E用のmock専用制御endpointです。本番APIとして扱いません。詳細は `docs/mock-services.md` を参照してください。

## 検証

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run test:coverage
pnpm run build
pnpm exec playwright test --project=chromium --project=webkit
```

Firefoxを含める場合は次を使います。

```bash
pnpm exec playwright install --with-deps
pnpm run test:e2e
```

Visual Regression の基準更新は次のコマンドです。

```bash
pnpm run test:e2e:update
```

## CI artifact

GitHub Actionsでは `playwright-report/`、`test-results/`、`coverage/` をartifactとして保存し、Actions summaryにcoverageとE2E確認先を表示します。CIではPlaywrightブラウザを `--with-deps` で導入し、Firefoxを含むE2Eを走らせる前提です。ローカルではChromium/WebKitだけの確認でもよく、最終証跡はCIでFirefox込みにします。

## 設計メモ

- 技術選定: `docs/decisions/0001-technology-selection.md`
- デザインシステム: `docs/design-system.md`
- テスト方針: `docs/testing.md`
- Mock service: `docs/mock-services.md`
- アクセシビリティ: `docs/accessibility.md`
- GDPR準備: `docs/privacy-gdpr-readiness.md`
- 公開リポジトリ運用: `docs/public-repo.md`
- 自己レビュー: `docs/score-self-review.md`

## 既知の制約

- 動画、poster、字幕は検証用のローカルmockです。
- 「保存」はブラウザlocalStorageを使う簡易実装です。
- 学習履歴、保存、集中キューはブラウザlocalStorageを使う簡易実装です。将来はmock APIのライブラリ境界へ移し、ユーザーID単位で永続化します。
- 課金、通知の一部はUI表現中心で、実サービス相当の永続データ操作までは持ちません。
- READMEやdocsでローカルパスを説明する場合は、個人ユーザー名を含む絶対パスを出さず、`/path/to/project-root/` のように伏せます。

## License

MIT Licenseです。詳細は `LICENSE` を参照してください。
