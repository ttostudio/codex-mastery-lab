import type { Channel, Comment, Video } from "./types";

export const channels: Channel[] = [
  {
    id: "ch-design",
    name: "Flow Design Lab",
    handle: "@flow-design",
    description: "UI設計、プロトタイピング、アクセシビリティを扱う制作チャンネルです。",
    subscriberCount: 128400,
    verified: true,
    avatarColor: "#176b87"
  },
  {
    id: "ch-craft",
    name: "暮らしのクラフト便",
    handle: "@craft-note",
    description: "道具、料理、日々の制作過程を落ち着いたテンポで紹介します。",
    subscriberCount: 84200,
    verified: false,
    avatarColor: "#8a5a44"
  },
  {
    id: "ch-tech",
    name: "Tokyo Dev Journal",
    handle: "@tokyo-dev",
    description: "Web開発、テスト自動化、プロダクト品質の実践メモを配信します。",
    subscriberCount: 245900,
    verified: true,
    avatarColor: "#365c3a"
  }
];

export const videos: Video[] = [
  {
    id: "vf-001",
    title: "小さな動画サービスを設計する: ホーム画面から再生体験まで",
    description:
      "動画視聴サービスの情報設計、状態設計、再生UIの責務分割をサンプル実装で確認します。",
    channelId: "ch-design",
    durationSeconds: 742,
    publishedAt: "2026-05-12T09:30:00.000Z",
    viewCount: 482300,
    category: "設計",
    tags: ["UI", "動画", "設計"],
    thumbnail: "/api/media/poster?v=vf-001",
    poster: "/api/media/poster?v=vf-001",
    captions: [{ lang: "ja", label: "日本語", src: "/mock-media/captions-ja.vtt" }]
  },
  {
    id: "vf-002",
    title: "週末の作業机リセットと道具の手入れ",
    description: "作業環境を整えるためのルーティンを短い映像でまとめました。",
    channelId: "ch-craft",
    durationSeconds: 508,
    publishedAt: "2026-04-20T11:00:00.000Z",
    viewCount: 90300,
    category: "暮らし",
    tags: ["クラフト", "整理", "道具"],
    thumbnail: "/api/media/poster?v=vf-002",
    poster: "/api/media/poster?v=vf-002",
    captions: [{ lang: "ja", label: "日本語", src: "/mock-media/captions-ja.vtt" }]
  },
  {
    id: "vf-003",
    title: "TypeScript strictで守るフロントエンドの境界",
    description: "APIレスポンス、表示状態、テストを型でつなぐ実装例を紹介します。",
    channelId: "ch-tech",
    durationSeconds: 1024,
    publishedAt: "2026-03-29T13:15:00.000Z",
    viewCount: 318000,
    category: "開発",
    tags: ["TypeScript", "Next.js", "テスト"],
    thumbnail: "/api/media/poster?v=vf-003",
    poster: "/api/media/poster?v=vf-003",
    captions: [{ lang: "ja", label: "日本語", src: "/mock-media/captions-ja.vtt" }]
  },
  {
    id: "vf-004",
    title: "プレミアム向け: 高画質ワークフローの考え方",
    description: "課金状態に応じた体験差分、支払い失敗時のUI、リトライ導線を扱います。",
    channelId: "ch-tech",
    durationSeconds: 689,
    publishedAt: "2026-06-01T08:00:00.000Z",
    viewCount: 126700,
    category: "開発",
    tags: ["課金", "品質", "UI"],
    thumbnail: "/api/media/poster?v=vf-004",
    poster: "/api/media/poster?v=vf-004",
    captions: [{ lang: "ja", label: "日本語", src: "/mock-media/captions-ja.vtt" }]
  }
];

export const comments: Comment[] = [
  {
    id: "cm-001",
    videoId: "vf-001",
    author: "佐藤みなみ",
    body: "読み込み失敗やリトライまで設計している点が参考になりました。",
    postedAt: "2026-05-13T10:10:00.000Z",
    likeCount: 42
  },
  {
    id: "cm-002",
    videoId: "vf-001",
    author: "北川レン",
    body: "字幕トラックの差し替え余地があるのが実務的です。",
    postedAt: "2026-05-14T02:25:00.000Z",
    likeCount: 18
  },
  {
    id: "cm-003",
    videoId: "vf-003",
    author: "dev_taro",
    body: "strict前提のモック境界はチーム導入時にも使えそうです。",
    postedAt: "2026-04-01T05:00:00.000Z",
    likeCount: 31
  }
];
