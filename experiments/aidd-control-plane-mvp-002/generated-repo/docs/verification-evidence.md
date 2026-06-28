# Verification Evidence

## 対象

- task_id: `aidd-control-plane-mvp-002`
- conformance_target: `L3`

## 実行予定コマンド

- `pnpm install --frozen-lockfile`
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`

## 検証する状態

- サンプル入力で `valid`
- 必須path削除で `missing_required`
- 壊れたJSONで `invalid_json`
- 初期/リセットで `empty`

## 証跡方針

このMVPは外部API未接続、ログイン不要、ブラウザ保存なしで動作する。コマンド結果は最終応答で報告し、PlaywrightのHTML reportはローカル生成物として扱う。
