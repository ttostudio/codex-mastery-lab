# mock-auth

Trial 003で追加した軽量Node http serverです。認証状態をローカルで切り替えます。

## 起動

```bash
pnpm --dir mocks/auth start
```

## 契約

- `GET /health`
- `GET /auth?state=anonymous`
- `GET /auth?state=logged_in`
- `GET /auth?state=premium`
- `GET /auth?state=session_expired`

レスポンスは `{ "state": "..." }` を返します。未定義値は `anonymous` に丸めます。`session_expired` はHTTP 401で返します。
