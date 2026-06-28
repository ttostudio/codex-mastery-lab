import { StateView } from "@/components/ui/StateView";
import { VideoGrid } from "@/features/video/VideoGrid";
import { listVideos } from "@/lib/mocks/adapter";
import Link from "next/link";
import type { CSSProperties } from "react";

export default async function HomePage() {
  const videos = await listVideos();
  const categories = Array.from(new Set(videos.map((video) => video.category)));
  const mentors = videos.slice(0, 3).map((video) => video.channel);
  const queue = videos.slice(0, 3);
  const goals = [
    { name: "集中視聴", count: "45分" },
    { name: "メモ作成", count: "3件" },
    { name: "復習キュー", count: "2本" }
  ];

  return (
    <main className="page home-shell">
      <aside className="side-nav" aria-label="主要ナビゲーション">
        <Link href="/">ホーム</Link>
        <Link href="/search?q=集中">検索</Link>
        <Link href="/states?auth=premium&billing=premium">学習状態</Link>
        <Link href="/watch/vf-001">集中キュー</Link>
        <Link href="/search?q=TypeScript">履歴</Link>
      </aside>

      <div className="home-main">
        <div className="page-header">
          <div>
            <h1 className="page-title">StudyStream</h1>
            <p className="muted">学習動画を検索し、集中キューに積み、今日の目標に沿って視聴します。</p>
          </div>
          <div className="notification-panel" aria-label="通知">
            <strong>今日の学習目標</strong>
            <span>45分視聴し、重要メモを3件残す</span>
          </div>
        </div>

        <section className="category-rail" aria-label="カテゴリ">
          {categories.map((category) => (
            <Link key={category} href={`/search?q=${encodeURIComponent(category)}`}>
              {category}
            </Link>
          ))}
        </section>

        <section className="home-dashboard" aria-label="学習ダッシュボード">
          <div className="panel compact-panel">
            <h2>講師</h2>
            <ul>
              {mentors.map((channel) => (
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
            <h2>集中キュー</h2>
            <ul>
              {queue.map((video) => (
                <li key={video.id}>
                  <span>{video.title}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="panel compact-panel">
            <h2>今日の目標</h2>
            <ul>
              {goals.map((goal) => (
                <li key={goal.name}>
                  <span>{goal.name}</span>
                  <span className="muted">{goal.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {videos.length > 0 ? <VideoGrid videos={videos} /> : <StateView title="該当する動画がありません" message="表示できる学習動画がありません。" />}
      </div>
    </main>
  );
}
