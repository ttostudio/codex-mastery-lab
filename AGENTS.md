# Codex Mastery Lab Agent Instructions

このrepoは、AI駆動開発で「見た目だけのvibe code」から、CI・mock backend・3ブラウザE2E・記事化まで到達できるかを検証する実験場です。

## Default stack

- Next.js + TypeScript を基本スタックにする。
- package managerは `pnpm`。
- UIは日本語で書く。
- テストケース名・docs・記事も原則日本語で書く。
- AIDD-Spec説明では建築/建物メタファーを使わない。

## 100-point app-clone lab workflow

新しい「〇〇風」サンプルを0から作るときは、以下を満たすまで完了扱いにしない。

1. **Product brief**
   - `docs/product-brief.md` に、対象サービス風の体験、差別化したゴール、非ゴール、主要ユーザーフローを書く。
   - 実サービスの商標・ロゴ・コピーは使わず、認識できる体験パターンだけを抽象化する。

2. **Mock backend contract**
   - `mocks/api`, `mocks/media`, `mocks/auth`, `mocks/billing` など、UIから独立したmock serviceを用意する。
   - 各serviceは `/health`, `/state`, `/__control/state` を持つ。
   - `pnpm run mock:start`, `pnpm run mock:stop`, `pnpm run mock:doctor` を提供する。
   - Docker Compose経路を優先し、Dockerが使えない場合はNode fallbackで起動できるようにする。

3. **State and failure handling**
   - online / offline / timeout / media failure / auth anonymous / auth premium / billing failed などをUIに反映する。
   - E2Eから `/__control/state` を叩いて状態を変え、画面反映を確認する。

4. **Testing gate**
   - 少なくとも次を用意する。
     - `pnpm run lint`
     - `pnpm run typecheck`
     - `pnpm run test`
     - `pnpm run test:coverage`
     - `pnpm run build`
     - `pnpm run doctor:playwright`
     - `pnpm run mock:doctor`
     - `pnpm run test:e2e`
   - PlaywrightはChromium / Firefox / WebKitを対象にする。
   - Firefoxが遅い場合はアプリを諦めず、3ブラウザ連続実行では `timeout: 120_000`、`expect: { timeout: 90_000 }`、`workers: 1`、ローカル `retries: 1` などで安定化する。
   - Visual snapshotはOS差分が出るため、CIでは機能E2Eを優先し、visualは別証跡として扱ってよい。

5. **CI gate**
   - repo rootの `.github/workflows/` にworkflowを置く。generated repo内だけに置いて終わらせない。
   - CIでは `pnpm exec playwright install --with-deps` を実行する。
   - `coverage`, `playwright-report`, `test-results` をartifact保存する。
   - GitHub Actionsが `success` になるまで完了扱いにしない。

6. **Evidence and article**
   - `experiments/<name>/artifacts/<name>/terminal/` に実行ログを保存する。
   - スクリーンショット/GIFを `assets/` に保存する。
   - `articles/` に日本語記事を書く。
   - `scripts/build_preview.py` に記事を追加し、`preview/` を再生成する。
   - 公開前に `<home>`, `<host>`, `tail...` などローカル環境名が記事・preview・artifactに残っていないことを確認する。

## Score rubric

100点にするには、次の証跡が必要。

- Product parity: 主要フローが複数あり、操作できる。
- Mock backend: UIと独立したmock serviceがあり、E2Eから状態を制御できる。
- Failure states: 通信・認証・課金・media失敗がUIに出る。
- Tests: lint/typecheck/unit/coverage/build/e2eが通る。
- 3 browser E2E: Chromium / Firefox / WebKit が通る。
- CI success: GitHub Actionsで成功し、artifactが残る。
- Publishable article: 日本語で背景、手順、証跡、失敗と修正が読める。

## Commit discipline

- 大きなruntime生成物（`node_modules`, `.next`, `coverage`, `playwright-report`, `test-results`）はコミットしない。
- 実験の証跡ログ、記事、軽量画像/GIF、workflow、docs、sourceはコミットする。
- 変更後は `git status --short` と `git diff --cached --stat` を確認してからcommitする。
