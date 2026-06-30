# AIDD-Spec: AI Task Packet Standard v0.1

> 後工程の監査・レビュー・運用から逆算して、CodexなどのAI実装エージェントへ渡す最小実装単位を標準化する。

## 1. 目的

AI Task Packet は、AIに「何を作るか」を伝えるだけのプロンプトではない。

これは、後工程のレビュー担当・テスト担当・アクセシビリティ監査・運用担当が必要とする情報を、実装前にAIへ渡すための小さな共通説明書である。

## 2. 必須フィールド

```yaml
task_id: string
scope:
  target_paths: []
  forbidden_paths: []
product_intent: string
functional_requirements: []
non_goals: []
acceptance_criteria: []
state_design:
  empty: string
  loading: string
  error: string
  success: string
accessibility_contract:
  labels: []
  relationships: []
  collection_semantics: []
  keyboard_interactions: []
  focus_evidence: []
mobile_interaction_contract:
  target_viewports: []
  touch_targets: string
  input_keyboard_policy: []
  state_transition_focus: string
  reduced_motion_policy: string
  mobile_overflow_policy: string
security_contract:
  data_classification: string
  input_validation: []
  safe_rendering: []
  prohibited_browser_apis: []
  logging_policy: string
privacy_contract:
  pii_fields: []
  business_sensitive_fields: []
  consent_required: boolean
  retention_policy: string
  storage_policy: string
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
api_failure_state_contract:
  boundary_function: string
  scenarios: []
  timeout_policy: string
  retry_policy: string
  state_preservation_policy: string
  user_message_contract: string
performance_budget_contract:
  total_static_bytes: string
  css_budget: string
  js_budget: string
  lighthouse_targets: []
  motion_policy: string
asset_policy:
  external_network_assets: string
  image_dimensions_required: boolean
  lazy_loading_policy: string
  font_policy: string
quality_gate:
  required_commands: []
  expected_results: []
playwright_e2e_contract:
  target_browsers: []
  launch_url: string
  state_scenarios: []
  preserved_inputs: []
  recovery_flows: []
  negative_tests: []
  config_policy: string
verification_evidence:
  files_to_attach: []
  logs_to_save: []
prompt_delta_log:
  previous_failure: string
  added_instruction: string
```

## 3. 今日の実験から追加した項目

### 3.1 `accessibility_contract.relationships`

検索UIや動的フィルタUIでは、視覚的に近くに配置されているだけでは不十分である。
AI Task Packetには、支援技術が読める関係性を明記する。

例:

```yaml
accessibility_contract:
  relationships:
    - search_input controls faq-list via aria-controls
    - search_input is described by helper text, live result status, and no-result status via aria-describedby
    - result status uses aria-live="polite" and includes query context
```

### 3.2 `accessibility_contract.collection_semantics`

動的に生成されるカード一覧は、`div` の羅列になりやすい。
FAQ、検索結果、通知、メニューなど、コレクションとして読ませるべきUIは、前工程で明示する。

例:

```yaml
accessibility_contract:
  collection_semantics:
    - FAQ results must be rendered as <ul id="faq-list"> and <li> items
    - If custom elements are used, provide equivalent role="list" and role="listitem"
```

### 3.3 `accessibility_contract.keyboard_interactions`

フォーム内のライブ検索では、Enterキーの挙動が仕様になっていないと、AIはブラウザ既定動作に任せる可能性がある。

例:

```yaml
accessibility_contract:
  keyboard_interactions:
    - Typing filters results live
    - Pressing Enter in the search input must not reload or navigate
    - FAQ toggles must be real buttons or equivalent keyboard-operable controls
```

### 3.4 `quality_gate.required_commands`

UIが小さくても、最低限の検証証拠を要求する。
依存追加が重い場合は、軽量な静的監査でもよい。

例:

```yaml
quality_gate:
  required_commands:
    - node --check path/to/app.js
    - python3 path/to/audit_static.py path/to/app
  expected_results:
    - JavaScript syntax check exits 0
    - Static accessibility contract audit exits 0
```

## 4. Performance Budget実験から追加した項目

### 4.1 `performance_budget_contract`

見た目の品質をAIに任せると、静的ページでもCSSが必要以上に膨らみ、レビュー可能性・将来のLighthouse改善・モバイル性能の前提が曖昧になる。Performance Budgetは「あとで測るもの」ではなく、AI Task Packetに最初から渡す実装制約である。

例:

```yaml
performance_budget_contract:
  total_static_bytes: "index.html + styles.css + app.js <= 32KB"
  css_budget: "styles.css <= 12KB and <= 360 lines"
  js_budget: "app.js <= 5KB"
  lighthouse_targets:
    - performance >= 90 on target mobile profile
    - CLS <= 0.1
    - LCP target element is identified before implementation
  motion_policy: "Any transition must have prefers-reduced-motion fallback"
```

### 4.2 `asset_policy`

AIは「premium」「visual」という曖昧な指示に対し、リモート画像、CDNフォント、重い装飾CSS、外部スクリプトを選ぶ可能性がある。今回の実験ではCodexが外部依存を避けたが、それは幸運であって標準仕様ではない。後工程が必要とするのは、資産の取得元・サイズ・CLS対策・遅延読み込み方針の明文化である。

例:

```yaml
asset_policy:
  external_network_assets: "forbidden unless explicitly approved"
  image_dimensions_required: true
  lazy_loading_policy: "below-fold raster images must use loading=lazy"
  font_policy: "system fonts by default; no third-party font CDN in Lite experiments"
```

### 4.3 `verification_evidence.performance_budget_file`

Codexのチャット上の「確認しました」は証拠ではない。後工程で再監査できるよう、実測値・コマンド・トレードオフをファイルとして残す。

例:

```yaml
verification_evidence:
  files_to_attach:
    - PERFORMANCE_BUDGET.md
    - logs/fixed-verification.txt
  logs_to_save:
    - Codex run log
    - static performance audit output
```

## 5. Security / Privacy Baseline実験から追加した項目

### 5.1 `security_contract.safe_rendering`

フォームや検索UIのようにユーザー入力をDOMへ戻すUIでは、XSS対策をAIの暗黙判断に任せない。AI Task Packetには、ユーザー制御値を `textContent` などの安全なテキストAPIでのみ描画し、`innerHTML` / `outerHTML` / `insertAdjacentHTML` を禁止する条件を書く。

例:

```yaml
security_contract:
  safe_rendering:
    - Submitted user-controlled values must be rendered with textContent or equivalent safe text APIs
    - Do not use innerHTML, outerHTML, or insertAdjacentHTML for submitted values
  input_validation:
    - name maxlength=80
    - email type=email maxlength=120
    - message maxlength=600
```

### 5.2 `security_contract.prohibited_browser_apis`

静的プロトタイプであるにもかかわらず、AIが送信・保存・ログを実装すると、PIIの扱いが曖昧になる。許可される送信先や保存先がない場合は、禁止APIを明示する。

例:

```yaml
security_contract:
  prohibited_browser_apis:
    - fetch
    - XMLHttpRequest
    - navigator.sendBeacon
    - localStorage
    - sessionStorage
    - indexedDB
  logging_policy: "Do not console.log submitted PII or business-sensitive values"
```

### 5.3 `privacy_contract`

リード獲得フォーム、問い合わせフォーム、プロフィール編集など、PIIを扱うUIでは、Privacy/Data Classificationを後工程の監査証跡として残す。DOM上の `data-classification` と証拠ファイルの両方で確認できる状態を標準とする。

例:

```yaml
privacy_contract:
  pii_fields:
    - name: pii.name
    - email: pii.email
    - message: pii_or_confidential.free_text
  business_sensitive_fields:
    - companySize: business.company_size
    - budget: business.budget
  consent_required: true
  retention_policy: "in-memory only until refresh for static prototype"
  storage_policy: "no browser persistent storage"
verification_evidence:
  files_to_attach:
    - SECURITY_PRIVACY.md
```

## 6. Contact API Security / Operations実験から追加した項目

### 6.1 `api_security_contract.allowed_origins` / `csrf_policy`

ブラウザから呼ばれる公開POST APIは、UIと同じく「動いた」だけでは不十分である。後工程のセキュリティ監査は、どのOriginを信頼し、CSRFをどの境界で扱うかを読む必要がある。今回の雑プロンプト版はJSON APIとしては成立したが、CSRF / Origin allowlist の仕様と証拠がなかった。

例:

```yaml
api_security_contract:
  public_write_endpoints:
    - POST /api/contact
  allowed_origins:
    - http://127.0.0.1
  csrf_policy: "Browser-origin POST requests must include X-CSRF-Token matching the configured CSRF_TOKEN. Demo token is allowed only for local prototype and must be documented as non-production auth."
  request_body_limit: "16KB for contact API demo"
```

### 6.2 `api_operations_contract.rate_limit_policy`

公開write endpointには、たとえ小さなデモでも濫用境界が必要である。AI Task Packetに rate limit を書かない場合、Codexは入力検証までは入れても、負荷・コスト・スパムの境界を省きやすい。

例:

```yaml
api_operations_contract:
  rate_limit_policy: "POST /api/contact: 5 requests per IP per 60 seconds in memory for demo; return 429 with Retry-After when exceeded."
```

### 6.3 `api_operations_contract.request_id_policy` / `audit_log_policy` / `error_response_contract`

運用担当が読む証拠として、request id、非PII audit log、一貫したerror response contractを標準項目にする。チャット上の「確認しました」ではなく、`SECURITY_OPERATIONS.md` と実行ログに残す。

例:

```yaml
api_operations_contract:
  request_id_policy: "Generate or propagate X-Request-Id on every response"
  audit_log_policy: "Log JSON lines with requestId, method, path, status, decision only; never log raw request body or PII fields"
  error_response_contract: "{ ok: false, error: { code, message, requestId } }"
  retention_evidence: "SECURITY_OPERATIONS.md documents no persistence; payload exists only in current request memory"
verification_evidence:
  files_to_attach:
    - SECURITY_OPERATIONS.md
    - logs/fixed-verification.txt
```

## 7. Mobile Interaction / State Design実験から追加した項目

### 7.1 `mobile_interaction_contract`

スマホ向けUIでは「画面幅に収まる」だけでは足りない。後工程のレビューは、タップ領域、入力キーボード、フォーカス移動、エラー復帰、横スクロールなし、モーション配慮を確認する。今回の雑プロンプト版は、見た目としてはスマホ対応に見えたが、項目別エラー、送信後の結果領域focus、`:focus-visible`、`prefers-reduced-motion`、証拠ファイルが抜けた。

例:

```yaml
mobile_interaction_contract:
  target_viewports:
    - "360px mobile width without horizontal scroll"
    - "720px tablet/small desktop width"
  touch_targets: "Primary inputs and buttons must be at least 44px high; prefer 48px in forms."
  input_keyboard_policy:
    - "Use type=date for date input and type=time for time input when browser support is acceptable."
    - "Use inputmode and autocomplete intentionally; do not rely on placeholders as labels."
  state_transition_focus: "On successful submit, move focus to the result panel with tabindex=-1; on validation error, focus the first invalid field."
  reduced_motion_policy: "If motion exists, provide prefers-reduced-motion. If no motion exists, document the no-motion policy in evidence."
  mobile_overflow_policy: "At 360px width, no horizontal scroll; form controls use single column by default."
```

### 7.2 `state_design`をモバイル操作と接続する

空状態・エラー状態・成功状態は、画面に文言があるだけでは不十分である。スマホではキーボード表示中に視界が狭くなるため、状態遷移後にどこへ視線とフォーカスを戻すかを仕様に含める。

例:

```yaml
state_design:
  empty: "Explain that no reminder exists and the form creates the first reminder."
  error: "Show per-field Japanese messages, connect with aria-describedby, focus first invalid input."
  success: "Show a live success message, render the reminder summary, and focus the result panel."
  edit_return: "Provide a visible button to return focus to the first editable field."
```

### 7.3 `verification_evidence.mobile_state_file`

スマホ操作の品質は、チャット上の「対応しました」では確認できない。状態設計と操作配慮を証拠ファイルに残し、軽量監査で再実行できるようにする。

例:

```yaml
verification_evidence:
  files_to_attach:
    - MOBILE_STATE_EVIDENCE.md
    - assets/<date>-mobile-state-vibe.gif
    - assets/<date>-mobile-state-fixed.gif
  logs_to_save:
    - logs/vibe-audit.log
    - logs/fixed-audit.log
```

### 7.4 `api_failure_state_contract`

APIを呼ぶ画面では、成功時の一覧表示だけでは後工程のレビューに耐えない。2026-06-29 の読書ログ同期ビューア実験では、雑プロンプト版が「APIから取得する雰囲気」は作ったが、オフライン、タイムアウト、サーバーエラー、再試行、失敗時の検索入力保持、証拠ファイルが抜けた。

API失敗状態は、実APIが未接続の静的プロトタイプでも先に設計できる。AIDD-Specでは、UIがAPIに依存するタスクに以下を入れる。

```yaml
api_failure_state_contract:
  boundary_function: "requestReadingLogs or equivalent adapter separates API behavior from rendering"
  scenarios:
    - success
    - offline
    - timeout
    - server_error
    - empty
  timeout_policy: "Use AbortController or explicit timeout branch and show a Japanese timeout message."
  retry_policy: "Provide a visible retry button that reuses the current scenario/request context."
  state_preservation_policy: "On error, preserve search inputs and already loaded data unless the task explicitly says otherwise."
  user_message_contract: "Messages explain what happened and what the user can do next; do not expose raw stack traces."
verification_evidence:
  files_to_attach:
    - API_FAILURE_STATE_EVIDENCE.md
  logs_to_save:
    - logs/vibe-verification.log
    - logs/fixed-verification.log
```

Control Plane化する場合は、API呼び出しを含むUIタスクで success / offline / timeout / server_error / empty のチェックボックスを必須化し、再試行導線、入力保持、エラーメッセージ、タイムアウト制御、証拠ファイルを自動監査する。

### 7.5 `playwright_e2e_contract`

静的監査で `offline` や `timeout` という文字列を確認するだけでは、後工程のE2E担当は「利用者が本当に復帰できるか」を判断できない。2026-06-30 の配送状況トラッカー実験では、雑プロンプト版が成功表示と検索までは作ったが、失敗状態をブラウザで切り替えるUI、検索語保持、再試行、Playwrightテスト、E2E証拠ファイルが抜けた。

API失敗状態を扱うUIタスクでは、AI Task Packetに次を入れる。

```yaml
playwright_e2e_contract:
  target_browsers:
    - chromium
  launch_url: "file:// or local dev server URL used by the test"
  state_scenarios:
    - success_initial_list_visible
    - offline_keeps_search_and_previous_results
    - timeout_shows_recoverable_message
    - server_error_shows_recoverable_message
    - empty_shows_empty_state
  preserved_inputs:
    - search query
    - current scenario selection
  recovery_flows:
    - "Switch from error scenario to success and click retry; list must return."
  negative_tests:
    - "Do not clear user input on API failure."
    - "Do not hide last known results unless explicitly specified."
  config_policy: "If root Playwright config has no named project, create a scoped config near the test and document the exact command."
verification_evidence:
  files_to_attach:
    - PLAYWRIGHT_API_STATE_EVIDENCE.md
  logs_to_save:
    - logs/verification.log
    - playwright-report or text output
```

Control Plane化する場合は、API状態契約を入力した時点で「この状態をPlaywrightで確認するか」をチェックボックス化し、root config / scoped config / 実行コマンドの不一致も警告する。今回、`--project=chromium` はroot configなしでは失敗したため、E2E契約には「期待コマンド」だけでなく「そのコマンドを成立させる設定の置き場所」まで含める必要がある。

## 8. AI Task Packetテンプレート Lite

```markdown
# AI Task Packet: <task name>

## Scope

- Target paths:
- Forbidden paths:
- Dependencies policy:

## Product intent

## Functional requirements

## Non-goals

## State design

- Empty:
- Loading:
- Error:
- Success:

## Accessibility Contract

- Visible labels:
- Programmatic relationships:
- Collection semantics:
- Keyboard interactions:
- Focus evidence:
- Live regions:

## Mobile Interaction Contract

- Target viewports:
- Touch targets:
- Input keyboard policy:
- State transition focus:
- Reduced motion policy:
- Mobile overflow policy:

## Security Contract

- Data classification:
- Input validation:
- Safe rendering:
- Prohibited browser APIs:
- Logging policy:

## Privacy Contract

- PII fields:
- Business-sensitive fields:
- Consent required:
- Retention policy:
- Storage policy:

## API Security Contract

- Public write endpoints:
- Allowed origins:
- CSRF policy:
- Request body limit:

## API Operations Contract

- Request ID policy:
- Rate limit policy:
- Audit log policy:
- Error response contract:
- Retention evidence:

## API Failure State Contract

- Boundary function:
- Scenarios:
- Timeout policy:
- Retry policy:
- State preservation policy:
- User message contract:

## Performance Budget Contract

- Total static bytes:
- CSS budget:
- JS budget:
- Lighthouse / Core Web Vitals target:
- Motion policy:

## Asset Policy

- External network assets:
- Image dimensions:
- Lazy loading:
- Font policy:

## Quality Gate

Run these commands and include results:

```bash
<command 1>
<command 2>
```

## Verification Evidence

- Files changed:
- Commands run:
- Logs saved:
- Known limitations:
```

## 9. Control Plane機能仮説

AIDD Control Planeでは、AI Task Packetを自由記述ではなくフォームとして生成する。

- UI種別を「検索」「一覧」「フォーム」「認証」「決済」などから選ぶ
- UI種別に応じて Accessibility Contract の必須項目を自動提示する
- `aria-controls` / `aria-describedby` / live region / list semantics を静的監査する
- フォームUIでは PII/Data Classification、retention、consent、no-network/no-storage を必須入力にする
- Codex実行ログ、監査結果、修正プロンプトを Learning Log に自動保存する
- スマホフォームでは target viewport、tap target、inputmode/autocomplete、error focus、success focus、reduced motion を必須入力にする

## 10. 今日の検証結果との対応

2026-06-27 の FAQ検索アプリ実験では、雑プロンプト版で以下が抜けた。

- FAQ一覧のリストセマンティクス
- 検索欄と結果領域の `aria-controls`
- 検索欄とヘルプ/結果/未検出状態の `aria-describedby`
- Enterキーでフォーム送信を抑止する仕様
- `:focus-visible` によるキーボードフォーカス証拠
- 再実行可能な静的監査コマンド

AI Task Packet v0.1にこれらを事前に入れると、fixed-appでは静的監査がすべてPASSした。

2026-06-27 の問い合わせフォームSecurity Baseline実験では、雑プロンプト版で以下が抜けた。

- free-text入力の `maxlength`
- privacy consent
- `data-classification` によるPII/業務データ分類
- no-network / no-storage / retention の明示
- `SECURITY_PRIVACY.md` による監査証跡

AI Task Packet v0.3に Security Contract / Privacy Contract / Verification Evidence を事前に入れると、fixed-appでは静的セキュリティ監査が `18 passed / 0 failed` になった。

2026-06-27 の問い合わせAPI Security / Operations実験では、雑プロンプト版で以下が抜けた。

- CSRF / Origin allowlist の明示
- public write endpoint の rate limit と `429` 挙動
- `X-Request-Id` と非PII audit log
- data classification と retention/no-persistence の証拠
- 一貫した error response contract
- `SECURITY_OPERATIONS.md` による監査証跡

AI Task Packet v0.4に API Security Contract / API Operations Contract / Verification Evidence を事前に入れると、fixed-apiでは静的API監査が `20 passed / 0 failed` になった。

2026-06-28 のリマインダー予約メモ Mobile Interaction / State Design実験では、雑プロンプト版で以下が抜けた。

- 必須入力ごとの `aria-describedby` 付きエラー表示
- エラー/成功/空状態を分けた live region
- 送信成功後の結果領域focus
- 件名/メモの `maxlength`
- `:focus-visible` と `prefers-reduced-motion`
- `MOBILE_STATE_EVIDENCE.md` による状態設計と検証証拠

AI Task Packet v0.5に Mobile Interaction Contract / State Design / Verification Evidence を事前に入れると、fixed-appでは静的モバイル状態監査が `14 passed / 0 failed` になった。
