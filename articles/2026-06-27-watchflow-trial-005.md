# WatchFlow Trial 005：91点から96点へ、coverage thresholdとCI証跡の入口を入れる

> 2026-06-27 / WatchFlow 100点チャレンジ  
> 対象: Trial 005 / coverage threshold / 履歴削除 / プレイリスト操作 / mock doctor / GitHub Actions  
> 結果: **96 / 100**

![WatchFlow Trial 005 採点速報](../assets/2026-06-27-watchflow-trial005-score-card.png)

## 結果

Trial 004は **91 / 100** だった。

90点台には入ったが、まだ100点ではない。残っていた壁は、coverage threshold未導入、CI実行証跡なし、データ操作が浅い、Docker Compose経路の検証性が弱い、というものだった。

Trial 005では、これらをさらにAI Task Packetへ戻した。

結果は **96 / 100**。

![Trial 005 GIF](../assets/2026-06-27-watchflow-trial005-demo.gif)

## 主な改善

- coverage thresholdを導入
- coverageが全指標で改善
- 視聴履歴の表示/削除を追加
- 後で見るリストの追加/解除を維持
- 品質レビュープレイリストの追加/削除を追加
- Unit Test 21件 → 23件
- E2E 23件 → 27件
- `mock:doctor` 追加
- repo rootにTrial 005専用GitHub Actions workflowを追加
- READMEにCI badgeと記事リンクを追加

## 画面

### ホーム

![Trial 005 ホーム](../assets/2026-06-27-watchflow-trial005-home.png)

見た目の大変更はしていない。Trial 005の主眼は、操作と検証の密度を上げることだった。

### 動画詳細

![Trial 005 動画詳細](../assets/2026-06-27-watchflow-trial005-watch-detail.png)

### 後で見る + 品質レビュープレイリスト

![Trial 005 ライブラリ操作](../assets/2026-06-27-watchflow-trial005-library-actions.png)

Trial 005では、動画詳細画面にライブラリ操作を追加した。

```text
後で見るへ追加
品質レビューへ追加
この動画の履歴を削除
```

これにより、ただ表示されているだけのUIから、ユーザー操作を伴うProduct Parityへ少し近づいた。

### 視聴履歴の削除

![Trial 005 履歴削除](../assets/2026-06-27-watchflow-trial005-history-cleared.png)

視聴履歴はlocalStorageベースの簡易実装だが、追加/削除の境界を明示した。docsには、将来的にmock APIへ移す永続化境界も書いた。

### mock service doctor

![Trial 005 Mock Doctor](../assets/2026-06-27-watchflow-trial005-terminal-mock-doctor.png)

`mock:doctor` を追加した。

今回のローカル環境ではDocker daemonが起動していないため、Docker Composeの実起動はできない。ただし、compose設定の静的検証とNode fallback health確認は通った。

```text
OK: Docker Compose
OK: docker-compose.yml の静的検証
OK: Node fallback 起動
OK: mock-api health
OK: mock-media health
OK: mock-auth health
OK: mock-billing health
```

## 実行した検証

```text
pnpm install --frozen-lockfile  exit=0
pnpm run lint                   exit=0
pnpm run typecheck              exit=0
pnpm run test                   exit=0
pnpm run test:coverage          exit=0
pnpm run build                  exit=0
pnpm run mock:doctor            exit=0
```

Unit Testは23件合格。

![Trial 005 Unit](../assets/2026-06-27-watchflow-trial005-terminal-unit.png)

coverage threshold導入後も合格した。

```text
Statements: 71.34%
Branches:   67.56%
Functions:  60.82%
Lines:      75.08%
```

![Trial 005 Coverage](../assets/2026-06-27-watchflow-trial005-terminal-coverage.png)

Trial 004からのcoverage差分：

| 指標 | Trial 004 | Trial 005 |
|---|---:|---:|
| Statements | 67.35% | 71.34% |
| Branches | 64.28% | 67.56% |
| Functions | 54.87% | 60.82% |
| Lines | 71.08% | 75.08% |

## E2E

```text
pnpm exec playwright test --project=chromium --project=webkit
27 passed
```

![Trial 005 E2E](../assets/2026-06-27-watchflow-trial005-terminal-e2e.png)

増えた確認は主にこれだ。

```text
後で見るリストへ追加と解除ができる
視聴履歴を表示して削除できる
品質レビュープレイリストへ追加と削除ができる
```

Firefoxはローカルにはまだない。

![Trial 005 Doctor](../assets/2026-06-27-watchflow-trial005-terminal-doctor.png)

このため、Firefox込みの最終証跡はGitHub Actionsで取る方針にした。

## root GitHub Actionsを追加

Trial 004までは、generated repo内にはCI workflowがあった。しかしGitHub Actionsが読むのはrepo rootの `.github/workflows` だけなので、そのままだと実際のGitHub上では走らない。

Trial 005ではrepo rootに以下を追加した。

```text
.github/workflows/watchflow-trial005-ci.yml
```

このworkflowは、次を実行する。

```text
pnpm install --frozen-lockfile
pnpm exec playwright install --with-deps
pnpm run doctor:playwright
pnpm run mock:doctor
pnpm run lint
pnpm run typecheck
pnpm run test:coverage
pnpm run build
pnpm run test:e2e
```

artifactも保存する。

```text
playwright-report
test-results
coverage
```

## 採点

| カテゴリ | 配点 | Trial 004 | Trial 005 | 理由 |
|---|---:|---:|---:|---|
| Product Parity | 10 | 9 | 10 | 後で見る、履歴削除、品質レビュー操作が入った |
| Video Experience | 12 | 10 | 10 | Trial 004水準維持。Firefoxローカル未完 |
| Network / State Handling | 10 | 9 | 9 | mock state操作維持。通知既読/premium制御は浅い |
| Mock Backend Contracts | 8 | 8 | 8 | mock:doctor追加。Docker実起動は未確認 |
| Technical Foundation | 10 | 9 | 10 | coverage threshold、mock doctor、root workflow追加 |
| Next.js Architecture | 10 | 9 | 9 | external mock boundary維持。永続化はlocalStorage中心 |
| Component Architecture | 8 | 7 | 8 | WatchLibraryActionsを分離しUnit化 |
| Design System | 8 | 7 | 7 | 既存水準維持 |
| Accessibility | 8 | 8 | 8 | axe合格維持 |
| E2E / Visual / Unit | 13 | 12 | 13 | Unit 23件、E2E 27件、coverage threshold合格 |
| Public Repo Operations | 6 | 5 | 4 | root workflow追加。ただし実CI run確認前なので控えめ |
| **合計** | **100** | **91** | **96** | +5点 |

## 100点までの残り

96点まで来た。残り4点は、実行環境の証跡に近い。

1. GitHub ActionsでFirefox込みCIを実際に成功させる
2. CI artifactを確認する
3. Docker daemonあり環境でdocker compose pathを実起動確認する
4. premium権限制御や通知既読をE2E化する

## まとめ

Trial 005は、派手な画面追加ではなく、**100点に必要な検証の入口を増やす回**だった。

coverage thresholdを導入し、E2Eを増やし、repo rootにGitHub Actionsを置き、CI artifactの導線を作った。

ここまで来ると、AI駆動開発の評価は「アプリが動くか」ではなく、**第三者が同じ手順で品質を再確認できるか**に移ってくる。
