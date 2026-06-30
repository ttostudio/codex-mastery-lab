# Learning Log

## 期待する学び

- AIDD Control Planeの価値を、入力フォームと生成物の対応で説明できるか。
- readiness scoreとmissing fieldsが、次の入力を促す十分な手がかりになるか。
- 状態契約と品質ゲートを最初から表示することで、AI依頼前の品質観点が伝わるか。

## 実装メモ

- 永続化は使わず、Reactのローカルstateだけで決定的に動かす。
- 生成処理は`src/lib/intake.ts`の純粋関数に集約する。
- doctor:aiddでファイル、scripts、UIコピー、状態契約、禁止プリミティブを確認する。

## 次回改善候補

- Readiness Reviewにサンプル回答の補助を追加する。
- 生成物をファイルとして保存する導線を検討する。
- AIDD-Specのconformance level選択を追加する。
