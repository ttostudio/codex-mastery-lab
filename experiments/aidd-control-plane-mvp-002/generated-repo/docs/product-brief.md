# Product Brief: AIDD Control Plane MVP 002

## 体験

AIDD-Spec成果物のJSONを貼り付けると、AI Task Packet、Verification Evidence、Review Record、Learning Logの必須項目が足りているかを同じ画面で確認できる。

## ゴール

- 4種類の成果物JSONをローカル画面で編集できる。
- 必須path不足、JSON形式エラー、改善提案を日本語で表示する。
- 初学者が各必須項目の意図を理解できる。

## 非ゴール

- 外部API送信はしない。
- ログイン、DB接続、ブラウザ保存は作らない。
- 完全なJSON Schema Draft validatorは作らない。

## 主要ユーザーフロー

1. 「サンプルを入れる」で4成果物のJSONを投入する。
2. 全体statusと成果物ごとのstatusを確認する。
3. 「必須項目を1つ削って失敗を見る」でmissing_requiredを確認する。
4. 「JSONを壊してinvalid_jsonを見る」でJSON parse errorを確認する。
5. Schema Requirementsで各必須項目の意図を確認する。
