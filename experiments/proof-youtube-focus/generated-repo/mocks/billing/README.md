# mock-billing

Trial 003で追加した軽量Node http serverです。課金状態をローカルで切り替えます。

## 起動

```bash
pnpm --dir mocks/billing start
```

## 契約

- `GET /health`
- `GET /billing?state=free`
- `GET /billing?state=premium`
- `GET /billing?state=payment_failed`

レスポンスは `{ "state": "...", "label": "..." }` を返します。未定義値は `free` に丸めます。`payment_failed` はHTTP 402で返します。
