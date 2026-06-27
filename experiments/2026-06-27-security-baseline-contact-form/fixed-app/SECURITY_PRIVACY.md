# セキュリティ・プライバシー証跡

## データ分類

| Field | Control | Data classification |
| --- | --- | --- |
| 氏名 | `name` | `pii.name` |
| メールアドレス | `email` | `pii.email` |
| 会社規模 | `companySize` | `business.company_size` |
| 予算 | `budget` | `business.budget` |
| 相談内容 | `message` | `pii_or_confidential.free_text` |

## PII Handling and Retention

Submitted values are treated as user-controlled input. Preview cards are created with DOM nodes and submitted values are assigned with `textContent` only. The demo keeps at most three submissions in an in-memory JavaScript array and resets the form after rendering the preview. Data is retained only until the page refreshes, closes, or reloads.

## No Network and No Storage

The form declares `data-static-demo="true"`. The application does not call `fetch`, `XMLHttpRequest`, or `navigator.sendBeacon`, and it does not use `localStorage`, `sessionStorage`, or `indexedDB`. Submitted values are not written to console logs.

## Verification

Commands to run from the repository root:

```bash
node --check experiments/2026-06-27-security-baseline-contact-form/fixed-app/app.js
python3 experiments/2026-06-27-security-baseline-contact-form/audit_static_security.py experiments/2026-06-27-security-baseline-contact-form/fixed-app
```

Actual results:

- `node --check experiments/2026-06-27-security-baseline-contact-form/fixed-app/app.js`: exit 0, no syntax errors.
- `python3 experiments/2026-06-27-security-baseline-contact-form/audit_static_security.py experiments/2026-06-27-security-baseline-contact-form/fixed-app`: exit 0, `SUMMARY: 18 passed / 0 failed`.

## Known Limitations

Client-side validation is useful for this local prototype but is not a production security boundary. A production lead submission endpoint would need server-side validation, abuse protection, transport security, authorization decisions where applicable, logging policy, and retention controls.
