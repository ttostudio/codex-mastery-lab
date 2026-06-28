# mock-media

Trial 003で追加した軽量Node http serverです。動画バイナリ、Range request、遅延、404、500、途中破断、字幕VTTをローカルで再現します。

## 起動

```bash
pnpm --dir mocks/media start
```

## 契約

- `GET /health`
- `GET /video?mode=normal|slow|not_found|failure|interrupted`
- `GET /captions/ja.vtt`

`normal` は `Range` headerに対応し、`206 Partial Content` と `Content-Range` を返します。`interrupted` は `Content-Length` より短い本文で接続を破断します。
