あなたはAIDD Control Plane MVP 015を実装するCodexです。

作業ディレクトリは `experiments/aidd-control-plane-mvp-015/generated-repo/` です。MVP 014のコードをベースに、以下を最後まで実装してください。

1. MVP番号、画面文言、テスト名、doctor、capture scriptを015へ更新する。
2. Mock CI Serviceの状態データを `mocks/ci-service/fixtures/*.json` へ分離する。
3. `server.mjs` はfixture JSONを読み、`/health`, `/state`, `/__control/state` を返す。
4. `docker-compose.yml` を追加し、Mock CI ServiceをComposeで起動できるようにする。ただしNode fallbackの `pnpm run mock:start` / `mock:stop` / `mock:doctor` も維持する。
5. UIに「fixture駆動」「Docker Compose経路」「Node fallback経路」「同一contract」を日本語で表示する。
6. `doctor:aidd` はfixture、Docker Compose、docs、capture画像、AIDD-Spec接続を検査する。
7. unit test / E2E / capture scriptを015へ更新する。
8. docsに `docs/verification-plan.md` と `docs/review-record.md` を更新し、AIDD-Spec v0.1と `standards/aidd-control-plane-mvp-v0.1.md` への接続を明記する。
9. package scriptに `capture:mvp015` を追加し、古い `capture:mvp014` 参照を残さない。

制約:
- UI、テスト名、docsは日本語を基本にする。
- 実サービス名、GitHub実URL、ローカル個人パスを入れない。
- runtime生成物を作ってもコミット対象にしない。
- 完了後に自己申告だけで終わらず、最低限 `pnpm run lint`, `pnpm run typecheck`, `pnpm run test` を実行して問題を修正してください。
