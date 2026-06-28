import type { Channel, Comment, Video } from "./types";

export const channels: Channel[] = [
  {
    id: "ch-product",
    name: "集中プロダクト講座",
    handle: "@focus-product",
    description: "プロダクト設計、ユーザーフロー、検証計画を短い章で学ぶ講座です。",
    subscriberCount: 42800,
    verified: true,
    avatarColor: "#146c5f"
  },
  {
    id: "ch-data",
    name: "データ読解ノート",
    handle: "@data-notes",
    description: "統計、可視化、意思決定の読み解きを演習形式で扱います。",
    subscriberCount: 36100,
    verified: false,
    avatarColor: "#7b5b24"
  },
  {
    id: "ch-code",
    name: "実装集中ラボ",
    handle: "@code-focus",
    description: "TypeScript、テスト、自動化を集中視聴しやすい順番で配信します。",
    subscriberCount: 72900,
    verified: true,
    avatarColor: "#315c8a"
  }
];

export const videos: Video[] = [
  {
    id: "vf-001",
    title: "集中学習キューを設計する: 目標から動画順序まで",
    description:
      "今日の学習目標、視聴キュー、保存済み教材をつなげて、迷わず学習を進める設計を確認します。",
    channelId: "ch-product",
    durationSeconds: 742,
    publishedAt: "2026-05-12T09:30:00.000Z",
    viewCount: 52300,
    category: "集中設計",
    tags: ["UI", "学習", "キュー"],
    thumbnail: "/api/media/poster?v=vf-001",
    poster: "/api/media/poster?v=vf-001",
    captions: [{ lang: "ja", label: "日本語", src: "/mock-media/captions-ja.vtt" }]
  },
  {
    id: "vf-002",
    title: "データ可視化の読み方を30分で復習する",
    description: "グラフの軸、比較、外れ値を確認し、学習メモに残すポイントをまとめます。",
    channelId: "ch-data",
    durationSeconds: 508,
    publishedAt: "2026-04-20T11:00:00.000Z",
    viewCount: 29100,
    category: "データ読解",
    tags: ["統計", "可視化", "復習"],
    thumbnail: "/api/media/poster?v=vf-002",
    poster: "/api/media/poster?v=vf-002",
    captions: [{ lang: "ja", label: "日本語", src: "/mock-media/captions-ja.vtt" }]
  },
  {
    id: "vf-003",
    title: "TypeScript strictで学習アプリの状態を守る",
    description: "APIレスポンス、表示状態、テストを型でつなぎ、失敗時にも学習を止めない実装例です。",
    channelId: "ch-code",
    durationSeconds: 1024,
    publishedAt: "2026-03-29T13:15:00.000Z",
    viewCount: 68400,
    category: "実装演習",
    tags: ["TypeScript", "Next.js", "テスト"],
    thumbnail: "/api/media/poster?v=vf-003",
    poster: "/api/media/poster?v=vf-003",
    captions: [{ lang: "ja", label: "日本語", src: "/mock-media/captions-ja.vtt" }]
  },
  {
    id: "vf-004",
    title: "プレミアム教材の支払い失敗時UIを検証する",
    description: "課金状態に応じた集中視聴の差分、支払い失敗時のUI、復帰導線を扱います。",
    channelId: "ch-code",
    durationSeconds: 689,
    publishedAt: "2026-06-01T08:00:00.000Z",
    viewCount: 18700,
    category: "実装演習",
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
    body: "学習目標から動画順序を決める考え方を今日の復習に使います。",
    postedAt: "2026-05-13T10:10:00.000Z",
    likeCount: 42
  },
  {
    id: "cm-002",
    videoId: "vf-001",
    author: "北川レン",
    body: "保存とキューを分けると集中時間を守りやすいと分かりました。",
    postedAt: "2026-05-14T02:25:00.000Z",
    likeCount: 18
  },
  {
    id: "cm-003",
    videoId: "vf-003",
    author: "dev_taro",
    body: "strict前提のモック境界は学習ログの保守にも使えそうです。",
    postedAt: "2026-04-01T05:00:00.000Z",
    likeCount: 31
  }
];
