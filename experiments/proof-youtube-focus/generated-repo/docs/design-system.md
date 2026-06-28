# Design System

StudyStream のUIは日本語の動画視聴体験を前提に、情報密度を保ちながら状態差分を見つけやすい設計にします。実装例は `/design-system` で確認できます。

## Tokens

- colors: `--color-bg`, `--color-surface`, `--color-surface-muted`, `--color-text`, `--color-text-muted`, `--color-border`, `--color-primary`, `--color-primary-strong`, `--color-accent`, `--color-danger`
- typography: system UI stack。本文は通常サイズ、ページタイトルのみ `clamp(1.5rem, 3vw, 2.25rem)`。
- spacing: `--space-page` と 8px 系の gap を基本にします。
- radius: `--radius-sm: 6px`, `--radius-md: 8px`。カードや操作面は 8px 以下にします。
- focus: ブラウザ標準 outline を残し、操作要素のラベルを aria-label で補います。
- motion: Trial 002 では常時アニメーションを使いません。状態変化はテキストと操作ボタンで伝えます。
- responsive breakpoints: `820px` 以下でヘッダー検索と動画詳細を1カラムにします。

## Components

- Button: `primary`, `secondary`, `icon`。主要操作、副次操作、アイコン操作を分けます。
- StateView: empty/offline/timeout/error などの状態表示に使います。
- VideoCard: thumbnail、duration、title、channel、views、date を含む一覧表示です。ホームの上位カード画像は Next.js Image の `priority` で LCP 候補を優先します。
- PlayerControls: play/pause、seek、mute、volume、captions、playback rate、対応ブラウザのみ fullscreen/PiP を出します。

## Poster / LCP warning

`<video poster>` には `loading="eager"` や Next.js Image の `priority` と同等の標準属性がありません。Trial 002 では一覧の LCP 候補である `VideoCard` の先頭画像に `priority` を付け、動画詳細の `<video>` には `data-lcp-poster="eager"` を付けて判断を明示します。poster 自体を最適化対象にする場合は、poster を別の Next.js Image として先読み表示する設計へ変更します。
