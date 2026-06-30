# Learning Log

対象はAIDD-Spec v0.1とstandards/aidd-control-plane-mvp-v0.1.mdに接続するAIDD Control Plane MVP 006: Verification Run Tracker。

## 期待する学び

- AIDD Control Planeの価値を、入力フォームと生成物の対応で説明できるか。
- readiness scoreとmissing fieldsが、次の入力を促す十分な手がかりになるか。
- 状態契約と品質ゲートを最初から表示することで、AI依頼前の品質観点が伝わるか。
- Verification Evidence、Review Record、Learning LogをUIと生成物に含めることで、完了証拠の不足が伝わるか。

## 実装メモ

- 永続化は使わず、Reactのローカルstateだけで決定的に動かす。
- 生成処理は`src/lib/intake.ts`の純粋関数に集約する。
- doctor:aiddでファイル、scripts、UIコピー、状態契約、禁止プリミティブを確認する。
- Verification Run Trackerの成功/失敗/証跡不足サンプルも`src/lib/intake.ts`のドメインロジックとして分離する。
- terminal evidenceとscreenshot evidenceが揃わない場合は、コマンドが成功していてもreadyにしない。

## 次回改善候補

- Readiness Reviewにサンプル回答の補助を追加する。
- 生成物をファイルとして保存する導線を検討する。
- AIDD-Specのconformance level選択を追加する。
- Verification Evidenceの実ファイル存在確認を次のMVPで追加する。
- Review Recordのfindings入力とLearning Logのspec_updates_needed入力を編集可能にする。
