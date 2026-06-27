# Codex Mastery Lab Backlog

## North Star: AIDD-Spec / AI駆動開発の世界標準

- [x] Reverse Engineering Methodology: 雑バイブコーディング成果物を監査し、後工程から前工程成果物を逆算する（2026-06-27 FAQ検索アクセシビリティ契約で実施）
- [x] Vibe-coded sample appを1つ作り、監査カテゴリを通して欠陥を洗い出す（2026-06-27 vibe-app）
- [x] 監査結果からAI Task Packet v0.1を逆算する（2026-06-27 Accessibility Contract / Verification Evidence）
- [ ] AIDD-Spec v0.1: 建築図面に相当する標準成果物体系を定義する
- [ ] 書籍企画: 「AI駆動開発時代の設計図面」章立てを毎週更新する
- [ ] Product Brief テンプレートとCodex検証
- [ ] AI-Ready Requirement Spec テンプレートとCodex検証
- [ ] Design Contract: 画面/状態/アクセシビリティ設計テンプレート
- [ ] System Contract: API/DB/権限/外部連携テンプレート
- [x] Non-Functional Contract: Performance Budget / Asset Policy をAI Task Packetへ反映する（2026-06-27 performance-budget-vibe-gallery）
- [ ] Non-Functional Contract: 性能/可用性/セキュリティ/コスト/運用テンプレート
- [ ] AI Task Packet: Codexに渡す最小単位の標準化
- [ ] Verification Evidence: 「できた」の証拠標準
- [ ] Learning Log: 失敗を標準とプロンプトに還元する仕組み
- [ ] AIDD Control Plane SaaS MVP仕様
- [ ] AIDD Control Plane MVPプロトタイプ

## Phase 0: 安定運用の土台

- [ ] Codex CLI の sandbox / full-auto / danger-full-access の挙動比較
- [ ] 小規模repoでの TDD ワークフロー: RED→Codex→GREEN→人間レビュー
- [ ] HermesからCodexを呼ぶ時のPTY/非PTY/バックグラウンド実行の安定性
- [ ] M4 Mac mini 16GBで安全な並列Codex数の測定
- [ ] Codex実行ログを記事素材として自動整理する仕組み

## Phase 1: 開発品質

- [ ] 仕様書からテストを先に作らせるプロンプト
- [ ] 既存コード読解→設計メモ→実装の分割プロンプト
- [ ] 「小さなPR」単位にCodexを閉じ込める方法
- [ ] Codexによるリファクタリングの事故パターン集
- [ ] コードレビュー専用Codexプロンプト
- [ ] セキュリティ観点レビューをCodexに担当させる方法

## Phase 2: システム開発

- [ ] FastAPI + SQLite の小さなSaaSをCodex主導で作る
- [ ] Next.js + API の縦切り実装をCodexに任せる
- [ ] CLIツール開発でのCodex活用
- [ ] テストカバレッジを下げずに機能追加する運用
- [ ] GitHub Issue→ブランチ→実装→テスト→PR文面の自動化

## Phase 3: 複数エージェント/継続改善

- [ ] 次回候補: FAQ検索アプリに axe / Lighthouse / Playwright の軽量監査を追加し、静的監査では拾えない問題を比較する
- [x] 次回候補: 同じFAQ題材で「Performance Budget」を事前に渡すとCLS/LCP系の欠陥が減るか検証する（2026-06-27: 静的SaaSギャラリーでPerformance Budget Contractを検証。次は実Lighthouse接続）
- [ ] 次回候補: 追加依存を最小化して Lighthouse / axe / Playwright のうち1つを実行し、静的監査とのズレを比較する

- [ ] 2つのCodexに実装案を競わせる
- [ ] Codex実装をHermesがレビューする二段構え
- [ ] 失敗ログから「次回のCodexプロンプト」を改善する
- [ ] 毎晩マイクロアプリを1つ作らせる実験
- [ ] 実験からReusable Skillを作る

## Phase 4: 記事化/収益化

- [ ] note無料記事: Codexを安定運用する基本設計
- [ ] 有料級記事: CodexをCTO補佐として使う開発OS
- [ ] 図解: Codex/Hermes/Git/Test/Review の責務分担
- [ ] チェックリストPDF化
- [ ] 1週間分の実験を統合したマガジン構成
