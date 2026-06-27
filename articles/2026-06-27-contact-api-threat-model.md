# 問い合わせAPIのCSRF・Rate Limit・監査ログを、AI Task Packetへ逆算する

> 2026-06-27 / Codex Mastery Lab 日次ドラフト  
> 想定読了時間: 約10分  
> 種別: Experiment / Failure / Template

![Contact API reverse chain](../assets/2026-06-27-contact-api-reverse-chain.svg)

## 1. 今日の問い

前回は問い合わせフォームUIの PII / Security Baseline を扱った。そこで見えたのは、Codexが `textContent` を使うなど実装判断としてはかなり良い一方で、後工程が読むべき `data-classification`、consent、retention、証拠ファイルが抜ける、という問題だった。

今日は一段だけ本番に近づけて、フォームの送信先になる小さなAPIを作る。

> Codexに「問い合わせフォームAPIをいい感じに作って」と雑に頼んだとき、後工程のSecurity / Operations監査が必要とする CSRF、Origin allowlist、rate limit、request id、audit log、retention、error contract は成果物に残るのか？

旅行でいえば、目的地だけ決めても足りない。移動手段、持ち物、緊急時の連絡先、予算、混雑時の代替案まで含めて初めて安心して進められる。ソフトウェアのAPIも同じで、`POST /api/contact` が200系を返すだけでは運用説明書とは言えない。

## 2. 仮説

今回の仮説は次の通り。

> Codexは、雑プロンプトでもJSON API、入力検証、body size limitくらいまでは自律的に入れる可能性がある。しかし、CSRF / Origin / rate limit / audit log / retention / evidence file は、後工程の要求として明示しない限り抜けやすい。これは「レビューで指摘する項目」ではなく、AI Task Packetの API Security Contract / API Operations Contract に最初から入れるべきである。

M4 Mac mini / 16GB RAM / 256GB SSD の制約を守るため、今回も重い依存は入れない。Node.js標準ライブラリだけで小さなAPIを作り、Pythonの軽量監査スクリプトで比較する。

## 3. 実験環境

```text
2026-06-27 13:06:04 JST
Codex CLI: codex-cli 0.142.3
ProductName:    macOS
ProductVersion: 26.5.1
BuildVersion:   25F80
Disk:           228Gi total / 140Gi available
```

実験ディレクトリ:

```text
/Users/tto/codex-mastery-lab/experiments/2026-06-27-contact-api-threat-model/
```

ログ:

```text
/Users/tto/codex-mastery-lab/experiments/2026-06-27-contact-api-threat-model/logs/
```

## 4. 実験計画

`PLAN.md` では、監査カテゴリを3つに絞った。

1. Security / Vulnerability
2. Load / Scalability
3. Operations / Maintenance

今回の目的は、問い合わせAPIを本番レベルにすることではない。目的は、後工程が「これがないと合格にできない」と判断する情報を見つけ、それをAI Task Packetの標準フィールドへ戻すことである。

## 5. Codexへ渡した雑プロンプト

実際にCodexへ渡したプロンプトはこれである。

```text
In this git repo, create a tiny dependency-free Node.js HTTP contact form API under experiments/2026-06-27-contact-api-threat-model/vibe-api. Use only built-in Node modules. Include a small server.js with POST /api/contact that accepts JSON fields name, email, company, message and returns a JSON success response. Add GET /health. Keep it simple and polished enough for a demo. Do not install dependencies. Do not modify files outside that vibe-api directory. Then run node --check on the server if possible and exit.
```

実行コマンド:

```bash
codex exec --sandbox danger-full-access "In this git repo, create a tiny dependency-free Node.js HTTP contact form API under experiments/2026-06-27-contact-api-threat-model/vibe-api. Use only built-in Node modules. Include a small server.js with POST /api/contact that accepts JSON fields name, email, company, message and returns a JSON success response. Add GET /health. Keep it simple and polished enough for a demo. Do not install dependencies. Do not modify files outside that vibe-api directory. Then run node --check on the server if possible and exit."
```

Codexは `vibe-api/server.js` を作った。良かった点は多い。

- Node標準の `http` のみを使用
- `GET /health` と `POST /api/contact` を実装
- `Content-Type: application/json` を確認
- `MAX_BODY_BYTES` でbody size limitを設定
- `name` / `email` / `message` の必須チェック
- email形式チェック
- `node --check` が成功

つまり、雑プロンプトだからといって、必ずひどいコードになるわけではない。Codexはかなり良い初手を打っている。

## 6. 雑プロンプト版の実行結果

検証コマンド:

```bash
node --check experiments/2026-06-27-contact-api-threat-model/vibe-api/server.js
python3 experiments/2026-06-27-contact-api-threat-model/smoke_contact_api.py experiments/2026-06-27-contact-api-threat-model/vibe-api
python3 experiments/2026-06-27-contact-api-threat-model/audit_contact_api.py experiments/2026-06-27-contact-api-threat-model/vibe-api
```

Smoke testの結果:

```text
GET /health => 200 {"ok":true,"status":"healthy"}
POST /api/contact valid => 201 {"ok":true,"message":"Contact request received","contact":{"name":"Taro Test","email":"taro@example.com","company":"AIDD Lab"}}
POST /api/contact invalid => 422 {"ok":false,"errors":["name is required","email must be valid","message is required"]}
```

ここまでは「動く」。しかし、静的監査はこうなった。

```text
PASS: server.js exists
PASS: uses built-in http module
PASS: no Express or external web framework dependency
PASS: GET /health is implemented
PASS: POST /api/contact is implemented
PASS: requires or returns application/json
PASS: request body size limit is explicit and small
PASS: field length validation exists
PASS: email validation exists
FAIL: CSRF or browser-origin protection is documented/implemented
FAIL: Origin allowlist policy exists
FAIL: rate limit with 429 behavior exists
FAIL: request id is generated or propagated
FAIL: audit logging policy exists
FAIL: console logging avoids direct PII payload dumping
FAIL: retention/no-persistence policy exists
FAIL: data classification covers PII
FAIL: error response contract is documented
FAIL: SECURITY_OPERATIONS.md evidence file exists
FAIL: evidence file contains verification commands/results
SUMMARY: 9 passed / 11 failed
```

面白いのは、失敗が「APIとして動かない」ではないことだ。むしろAPIは動く。入力検証もある。問題は、後工程が読むべき運用説明書がないことだった。

![Contact API audit comparison](../assets/2026-06-27-contact-api-audit-comparison.svg)

## 7. 欠陥から理想状態を定義する

代表findingをAIDD-Spec標準形式で書く。

```yaml
category: Security / Vulnerability
finding: The vibe contact API accepted browser-origin JSON POSTs without any documented CSRF token or Origin allowlist policy.
severity: high
observed_by: audit_contact_api.py
ideal_state: Browser-origin POST endpoints have an explicit Origin allowlist and CSRF/session-bound protection appropriate to the app context, with local demo defaults documented.
fix_instruction: Add ALLOWED_ORIGINS-based Origin validation and require X-CSRF-Token for browser-origin POST requests. Document demo limitations.
needed_upstream_info:
  - Security Baseline
  - API Contract
  - Trusted Origin List
  - CSRF Policy
standard_update:
  document: AI Task Packet Standard
  field: api_security_contract.csrf_policy + api_security_contract.allowed_origins
codex_prompt_delta: |
  For browser-origin JSON POST endpoints, implement and document an Origin allowlist and CSRF token policy. Include verification evidence.
verification:
  command: python3 experiments/2026-06-27-contact-api-threat-model/audit_contact_api.py experiments/2026-06-27-contact-api-threat-model/fixed-api
  expected: PASS
```

もう1つ、Load / Scalability観点のfindingも重要だった。

```yaml
category: Load / Scalability
finding: The vibe contact API had no rate limit or abuse boundary for POST /api/contact.
severity: medium
ideal_state: Public write endpoints state a request-rate assumption and enforce a minimal abuse guard, even in demos.
fix_instruction: Add a small in-memory per-IP rate limit for the demo and return HTTP 429 with Retry-After when exceeded.
needed_upstream_info:
  - Load Assumption
  - Abuse Case Catalog
  - Availability Target
  - Cost Budget
standard_update:
  document: AI Task Packet Standard
  field: api_operations_contract.rate_limit_policy
```

ここから逆算すると、AI Task Packetには少なくとも以下が必要になる。

- `api_security_contract.public_write_endpoints`
- `api_security_contract.allowed_origins`
- `api_security_contract.csrf_policy`
- `api_security_contract.request_body_limit`
- `api_operations_contract.rate_limit_policy`
- `api_operations_contract.request_id_policy`
- `api_operations_contract.audit_log_policy`
- `api_operations_contract.error_response_contract`
- `api_operations_contract.retention_evidence`
- `verification_evidence.security_operations_file`

## 8. 改善版 AI Task Packet v0.4

改善版では、Codexに次の条件を渡した。

```markdown
## Security Contract
- Treat `name`, `email`, `company`, `message` as user-controlled; `name`, `email`, and `message` are PII or potentially confidential.
- Require `Content-Type: application/json` for POST.
- Set a small explicit request body limit.
- Add browser-origin protection: reject disallowed `Origin` values. Use an `ALLOWED_ORIGINS` environment variable and document the default behavior for local demo.
- Add a simple CSRF demo control: require `X-CSRF-Token` to match `CSRF_TOKEN` environment variable for browser-origin POST requests.
- Add a tiny in-memory per-IP rate limit for `POST /api/contact`; return `429` when exceeded.
- Do not log raw request bodies or PII fields.

## Operations Contract
- Generate or propagate a request id for every response via `X-Request-Id`.
- Produce audit logs containing only non-PII metadata: request id, method, path, status code, and rate-limit/validation/security decision.
- Add explicit retention policy: submissions are not persisted; only current request memory is used.
- Add consistent error response contract: `{ ok: false, error: { code, message, requestId } }`.

## Verification Evidence
Create `SECURITY_OPERATIONS.md` inside `fixed-api/`.
```

実行コマンド:

```bash
codex exec --sandbox danger-full-access "Read experiments/2026-06-27-contact-api-threat-model/AI_TASK_PACKET_v0.4.md. Implement exactly that packet. Keep all changes inside experiments/2026-06-27-contact-api-threat-model/fixed-api. Do not install dependencies. Then run the verification commands if possible and report results. Then exit."
```

## 9. 修正後の結果

Codexは `fixed-api/` に2ファイルを作った。

```text
server.js
SECURITY_OPERATIONS.md
```

再検証結果:

```text
GET /health => 200 {"ok":true,"status":"healthy","requestId":"81448d10-8b87-4184-b475-442f149b527f"}
POST /api/contact valid => 202 {"ok":true,"data":{"accepted":true,"requestId":"e220c3ac-d8b8-4894-993e-f369ededaabf"}}
response_headers_subset {'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Request-Id': 'e220c3ac-d8b8-4894-993e-f369ededaabf'}
POST /api/contact invalid => 422 {"ok":false,"error":{"code":"validation_failed","message":"Contact submission is invalid.","requestId":"2d5b69f4-fc43-4ad1-bb0d-c86b056353af"}}
```

静的監査はこう変わった。

```text
PASS: CSRF or browser-origin protection is documented/implemented
PASS: Origin allowlist policy exists
PASS: rate limit with 429 behavior exists
PASS: request id is generated or propagated
PASS: audit logging policy exists
PASS: console logging avoids direct PII payload dumping
PASS: retention/no-persistence policy exists
PASS: data classification covers PII
PASS: error response contract is documented
PASS: SECURITY_OPERATIONS.md evidence file exists
PASS: evidence file contains verification commands/results
SUMMARY: 20 passed / 0 failed
```

`SECURITY_OPERATIONS.md` には、後工程が読みたい内容が残った。

```markdown
## CSRF / Origin Policy
Browser-origin requests are accepted only when the Origin header exactly matches the allowlist in ALLOWED_ORIGINS.
For browser-origin POST requests, X-CSRF-Token must match the CSRF_TOKEN environment variable.

## Rate Limit Policy
POST /api/contact uses a tiny in-memory per-IP rate limit: 5 requests per 60 seconds.

## Audit Logging Policy
Audit logs are JSON lines containing only non-PII metadata.

## Retention / No Persistence Policy
Submissions are not persisted to disk, database, browser storage, queue, email, or external service.
```

## 10. 今回分かったこと

第一に、Codexは雑プロンプトでもかなり賢い。今回のvibe APIは、依存を増やさず、body limitと入力検証を入れ、JSON APIとして成立していた。これは重要な観察である。AIが何も考えていないわけではない。

第二に、それでも「後工程の説明書」は抜ける。CSRF、Origin、rate limit、request id、audit log、retention、error contractは、実装者の善意ではなく、標準成果物として要求する必要がある。

第三に、AI Task Packetへ戻すべきなのは「もっと安全にして」ではない。`allowed_origins`、`csrf_policy`、`rate_limit_policy`、`audit_log_policy`、`error_response_contract` のように、後工程がチェック可能なフィールドに分解する必要がある。

## 11. AIDD-Specへの反映

`standards/aidd-spec-ai-task-packet-standard-v0.1.md` を更新し、次のフィールドを追加した。

```yaml
api_security_contract:
  allowed_origins: []
  csrf_policy: string
  request_body_limit: string
  public_write_endpoints: []
api_operations_contract:
  request_id_policy: string
  rate_limit_policy: string
  audit_log_policy: string
  error_response_contract: string
  retention_evidence: string
```

これは、AIDD Control Planeにすると次の入力フォームになる。

- このAPIはブラウザから呼ばれるか
- public write endpointはどれか
- 許可Originは何か
- CSRFはsession-boundか、API tokenか、demo tokenか
- rate limitの単位と閾値は何か
- PIIをログに出さない監査ログの形式は何か
- retention/no-persistenceの証拠ファイルはどこか

## 12. 明日から使えるチェックリスト

公開POST APIをCodexに作らせる前に、最低限これをAI Task Packetへ入れる。

- [ ] public write endpointを列挙したか
- [ ] 許可Originを定義したか
- [ ] CSRF方針を定義したか
- [ ] request body limitを定義したか
- [ ] rate limitと429挙動を定義したか
- [ ] request idをレスポンスに出すか決めたか
- [ ] audit logにPIIを出さない方針を決めたか
- [ ] error response contractを定義したか
- [ ] retention/no-persistenceを証拠ファイルに残すか決めたか
- [ ] 検証コマンドと期待結果を指定したか

## 13. 次回検証

今回は静的監査と小さなsmoke testに限定した。次回は、同じAPIに対して `429` を実際に踏む小さな負荷テスト、Origin拒否、CSRF拒否のnegative testを追加したい。さらに、`SECURITY_OPERATIONS.md` を人間が書くのではなく、AIDD Control Planeがフォーム入力から自動生成するMVPへ接続する。

今回の結論はシンプルである。

> AIにAPIを作らせるなら、エンドポイント仕様だけでなく、脅威境界・濫用境界・運用証跡まで含めて渡す。そうでなければ、動くAPIはできても、後工程が読める説明書にはならない。
