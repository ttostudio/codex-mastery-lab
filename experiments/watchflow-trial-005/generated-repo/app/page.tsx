import { StateView } from "@/components/ui/StateView";
import { VideoGrid } from "@/features/video/VideoGrid";
import { ja } from "@/lib/i18n/ja";
import { listVideos } from "@/lib/mocks/adapter";
import Link from "next/link";
import type { CSSProperties } from "react";

export default async function HomePage() {
  const videos = await listVideos();
  const categories = Array.from(new Set(videos.map((video) => video.category)));
  const subscriptions = videos.slice(0, 3).map((video) => video.channel);
  const history = videos.slice(0, 2);
  const playlists = [
    { name: "あとで見る", count: 8 },
    { name: "UI設計リサーチ", count: 12 },
    { name: "開発品質メモ", count: 6 }
  ];

  return (
    <main className="page home-shell">
      <aside className="side-nav" aria-label="主要ナビゲーション">
        <Link href="/">ホーム</Link>
        <Link href="/search?q=設計">探索</Link>
        <Link href="/states?auth=logged_in&billing=free">登録チャンネル</Link>
        <Link href="/search?q=TypeScript">履歴</Link>
        <Link href="/design-system">プレイリスト</Link>
      </aside>

      <div className="home-main">
        <div className="page-header">
          <div>
            <h1 className="page-title">{ja.homeTitle}</h1>
            <p className="muted">独自モックデータで構成した WatchFlow のホームです。</p>
          </div>
          <div className="notification-panel" aria-label="通知">
            <strong>通知</strong>
            <span>新しい品質レビューが2件あります</span>
          </div>
        </div>

        <section className="category-rail" aria-label="カテゴリ">
          {categories.map((category) => (
            <Link key={category} href={`/search?q=${encodeURIComponent(category)}`}>
              {category}
            </Link>
          ))}
        </section>

        <section className="home-dashboard" aria-label="視聴ダッシュボード">
          <div className="panel compact-panel">
            <h2>登録チャンネル</h2>
            <ul>
              {subscriptions.map((channel) => (
                <li key={channel.id}>
                  <span className="mini-avatar" style={{ "--avatar-color": channel.avatarColor } as CSSProperties}>
                    {channel.name.slice(0, 1)}
                  </span>
                  <span>{channel.name}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="panel compact-panel">
            <h2>最近の履歴</h2>
            <ul>
              {history.map((video) => (
                <li key={video.id}>
                  <span>{video.title}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="panel compact-panel">
            <h2>プレイリスト</h2>
            <ul>
              {playlists.map((playlist) => (
                <li key={playlist.name}>
                  <span>{playlist.name}</span>
                  <span className="muted">{playlist.count}本</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {videos.length > 0 ? <VideoGrid videos={videos} /> : <StateView title={ja.empty} message="表示できる動画がありません。" />}
      </div>
    </main>
  );
}
