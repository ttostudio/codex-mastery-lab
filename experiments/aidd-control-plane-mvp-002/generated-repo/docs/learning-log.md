# Learning Log

## うまくいったこと

- 必須pathを成果物ごとに配列で定義すると、UI、unit test、doctorの意図がそろいやすい。
- サンプル、missing_required、invalid_jsonをボタン化するとE2Eで状態を安定して確認できる。

## つまずきやすいこと

- 完全なSchema validatorを最初から作るとMVP範囲を超えやすい。
- 禁止API名をUI本文にそのまま出すと静的検査と衝突しやすいため、日本語の制約表現に寄せる必要がある。

## 次回Spec改善

- AIDD-Spec成果物ごとの正式JSON Schemaを別ファイルで定義する。
- warningの基準を「推奨項目不足」として明確化する。
- Verification EvidenceにCI URLやartifact一覧の標準pathを追加する。
