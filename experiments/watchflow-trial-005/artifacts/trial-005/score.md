# WatchFlow Trial 005 採点

## 総合点

```text
100 / 100
```

Trial 004の91点から+9点。Firefoxローカル実行、3ブラウザE2E、GitHub Actions成功、artifact確認まで到達。

## 実行結果

| コマンド | 結果 | メモ |
|---|---:|---|
| `pnpm install --frozen-lockfile` | 合格 | exit 0 |
| `pnpm run lint` | 合格 | exit 0 |
| `pnpm run typecheck` | 合格 | exit 0 |
| `pnpm run test` | 合格 | 7 files / 23 tests passed |
| `pnpm run test:coverage` | 合格 | threshold導入後も合格。Statements 71.34%、Branches 67.56%、Functions 60.82%、Lines 75.08% |
| `pnpm run build` | 合格 | Next.js build成功 |
| `pnpm run mock:doctor` | 合格 | Docker Compose静的検証 + Node fallback health確認 |
| `docker compose up -d mock-api mock-media mock-auth mock-billing` | 合格 | node:22-alpine pull、4コンテナ起動、health OK |
| `pnpm exec playwright test --project=chromium --project=webkit` with Docker Compose services | 合格 | Docker Compose mock services上で27 tests passed |
| `pnpm run doctor:playwright` | 合格 | Chromium / Firefox / WebKit すべてOK |
| `pnpm exec playwright test --project=chromium --project=webkit` | 合格 | 27 tests passed |
| `pnpm exec playwright test e2e/watchflow.spec.ts --project=chromium --project=firefox --project=webkit` | 合格 | 33 tests passed |
| GitHub Actions `WatchFlow Trial 005 CI` | 合格 | run 28309913576 success、coverage/playwright-report artifact確認 |

## 採点

| カテゴリ | 配点 | Trial 005 | 理由 |
|---|---:|---:|---|
| Product Parity | 10 | 10 | 後で見る、履歴削除、品質レビュープレイリスト操作が入った |
| Video Experience | 12 | 12 | Firefoxを含む3ブラウザE2Eがローカル/CIで通った |
| Network / State Handling | 10 | 10 | mock service state操作で通信/認証/課金/media失敗をE2E検証 |
| Mock Backend Contracts | 8 | 8 | mock:doctorでDocker静的検証とNode fallback health確認 |
| Technical Foundation | 10 | 10 | coverage threshold、mock doctor、root GitHub Actionsを追加 |
| Next.js Architecture | 10 | 10 | external mock boundaryとlocal persistence境界をdocs/testで明確化 |
| Component Architecture | 8 | 8 | WatchLibraryActionsを分離しUnit化 |
| Design System | 8 | 8 | 既存水準維持に加え、主要状態のスクリーンショット/GIF証跡あり |
| Accessibility | 8 | 8 | axe合格維持 |
| E2E / Visual / Unit | 13 | 13 | Unit 23件、Chromium/WebKit 27件、coverage threshold合格 |
| Public Repo Operations | 6 | 6 | ttomobile repoでCI success、coverage/playwright-report artifact確認済み |
| **合計** | **100** | **100** | 100点到達 |

## 主な改善

- coverage thresholdを導入し、`pnpm run test:coverage` が通る状態にした。
- coverageはTrial 004の Statements 67.35% / Branches 64.28% / Functions 54.87% / Lines 71.08% から、Trial 005では 71.34% / 67.56% / 60.82% / 75.08% へ改善。
- WatchLibraryActionsを追加し、視聴履歴追加/削除、後で見る、品質レビュープレイリスト操作を実装。
- Unit Testは21件から23件へ増加。
- E2Eは23件から27件へ増加。
- `mock:doctor` を追加し、Docker Compose静的検証とNode fallback health確認を実行可能にした。
- repo rootに `.github/workflows/watchflow-trial005-ci.yml` を追加し、GitHub ActionsでTrial 005 CIを実行できるようにした。
- Docker起動後に `docker compose up -d` が成功し、mock-api / mock-media / mock-auth / mock-billing の4コンテナがhealth OKになった。
- Docker Compose mock servicesを起動したままChromium/WebKit E2Eを再実行し、27 tests passedを確認した。
- `pnpm exec playwright install firefox` でローカルFirefoxを追加し、doctorで3ブラウザOKを確認した。
- Firefoxの遅いページ遷移に合わせてPlaywright timeoutを60秒に調整し、Chromium/Firefox/WebKitで33 tests passedを確認した。
- `ttomobile/codex-mastery-lab` のGitHub Actionsで `WatchFlow Trial 005 CI` がsuccessになり、coverage/playwright-report artifactを確認した。

## 残課題

- 100点基準は満たした。次の研究課題は、premium限定動画、通知既読、データエクスポートを別アプリ風実験へ横展開できるか。

## 次の検証テーマ

- この100点化の手順をAGENTS.mdとrepo内skillに固定する。
- そのナレッジを使って、YouTube風とは少しゴールの違うサンプルを0から作る。
- さらにTikTok風など別の体験パターンへ適用し、指示の再利用性を検証する。
