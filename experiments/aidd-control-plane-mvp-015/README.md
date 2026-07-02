# AIDD Control Plane MVP 015

## テーマ

Mock CI ServiceをDocker Compose経路とfixtureファイルへ拡張し、Node fallbackと同じ契約を検証できるようにする。

## 背景

MVP 014ではCI証跡を独立Mock Serviceへ切り出した。しかし、状態データはserver.mjs内に直書きで、Docker Compose経路も未実装だった。AIDD-Spec v0.1のVerification Evidence / External Integration Contract / Test Planへ接続するには、UI、E2E、docs、mock serviceが同じfixtureを読む必要がある。

## 成功条件

- `mocks/ci-service/fixtures/*.json` に empty / valid / failure / timeout / rate_limit を分離する。
- Mock CI Serviceはfixtureから状態を返す。
- `/health`, `/state`, `/__control/state` は維持する。
- `docker-compose.yml` でmock serviceを起動できる。
- Dockerが使えない環境でもNode fallbackの `pnpm run mock:start` / `mock:doctor` が通る。
- UIに「fixture由来」「Docker/Node fallback」の契約説明を日本語で表示する。
- E2Eはfixture状態を `__control/state` で切り替え、empty / valid / failure / timeout / rate_limit を3ブラウザで検証する。
- `doctor:aidd` はDocker Compose設定、fixture、capture画像、AIDD-Spec接続docsを検査する。

## 検証コマンド

個別に実行し、`artifacts/terminal/*.txt` に保存する。

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
pnpm run mock:doctor
```
