# AIDD Control Plane MVP 014 PLAN

## テーマ
MVP 013で未達だった独立Mock CI Service契約を、後工程のmock:doctor/E2Eから逆算してAI Task Packetへ戻す。

## 監査カテゴリ
- Mock backend contract
- Playwright E2E Contract
- Verification Evidence / doctor checks

## 成功条件
- mocks/ci-service が /health /state /__control/state を持つ
- pnpm run mock:start / mock:stop / mock:doctor が存在し、mock:doctorがpassする
- UIがmock service由来の empty / valid / failure / timeout / rate_limit を反映する
- E2Eが /__control/state を使って状態変更を確認する
- lint/typecheck/test/build/mock:doctor/test:e2e/capture のログと画像を保存する
