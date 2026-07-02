# AI Task Packet: AIDD Control Plane MVP 015

## Spec接続

- AIDD-Spec v0.1
- standards/aidd-control-plane-mvp-v0.1.md
- Verification Evidence
- External Integration Contract
- Test Plan
- Review Record
- Learning Log

## 目的

AIDD Control PlaneのCI証跡取り込みを、画面内サンプルやserver内直書きではなく、fixtureとMock Service contractで再現できる状態へ進める。Docker Composeが使える場合はComposeで、使えない場合はNode fallbackで同じ `/health`, `/state`, `/__control/state` を検証する。

## 実装対象

`experiments/aidd-control-plane-mvp-015/generated-repo/`

## UI要件

- UI文言は日本語。
- MVP番号を015へ更新する。
- 画面上に次を表示する。
  - Mock CI Serviceがfixtureから状態を返していること
  - Docker Compose経路とNode fallback経路が同じcontractを使うこと
  - 現在のscenario
  - 必須artifactと不足artifact
  - 次回AI Task Packet Delta
- empty / valid / failure / timeout / rate_limit の状態を視覚的に区別する。

## Mock backend contract

- `mocks/ci-service/fixtures/empty.json`
- `mocks/ci-service/fixtures/valid.json`
- `mocks/ci-service/fixtures/failure.json`
- `mocks/ci-service/fixtures/timeout.json`
- `mocks/ci-service/fixtures/rate_limit.json`
- `mocks/ci-service/server.mjs` はfixtureを読み込んでレスポンスを返す。
- `GET /health`
- `GET /state`
- `POST /__control/state`
- CORS対応。
- 不正scenarioは400を返す。

## Docker / fallback

- `docker-compose.yml` を追加する。
- mock serviceは `node mocks/ci-service/server.mjs` で起動する。
- `pnpm run mock:start`, `mock:stop`, `mock:doctor` はNode fallbackとして維持する。
- `doctor:aidd` はDocker Composeファイル存在とfixtureの妥当性を確認する。

## テスト要件

- unit testはfixtureからReview Finding / Evidence Gap / Prompt Deltaが生成できることを確認する。
- E2EはChromium / Firefox / WebKitで、`/__control/state` を使って5状態を切り替える。
- テスト名は日本語にする。

## 証跡

- capture scriptで以下を生成する。
  - empty / initial
  - valid / filled
  - failure
  - timeout
  - rate_limit
  - terminal evidence
- 画像は `experiments/aidd-control-plane-mvp-015/artifacts/screenshots/` とrepo rootの `assets/` に保存する。

## 完了条件

以下がpassすること。

- pnpm install --frozen-lockfile
- pnpm run lint
- pnpm run typecheck
- pnpm run test
- pnpm run build
- pnpm run test:e2e
- pnpm run doctor:aidd
- pnpm run mock:doctor
