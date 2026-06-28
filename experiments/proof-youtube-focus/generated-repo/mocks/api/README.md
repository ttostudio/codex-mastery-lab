# mock-api

Trial 003で追加した軽量Node http serverです。Next.js Route Handlerとは別に、Docker Composeまたはpnpmで起動できます。

## 起動

```bash
pnpm --dir mocks/api start
```

## 契約

- `GET /health`
- `GET /videos`
- `GET /videos?id=vf-001`
- `GET /search?q=設計`

実データや実APIは使わず、ローカルの固定モックだけを返します。
