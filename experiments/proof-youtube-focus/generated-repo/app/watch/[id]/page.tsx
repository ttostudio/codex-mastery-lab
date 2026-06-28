import { ChannelSummary } from "@/features/channel/ChannelSummary";
import { CommentsSection } from "@/features/comments/CommentsSection";
import { RelatedVideos } from "@/features/video/RelatedVideos";
import { VideoPlayer } from "@/features/video/VideoPlayer";
import { WatchLibraryActions } from "@/features/video/WatchLibraryActions";
import { getComments, getMediaMode, getRelatedVideos, getVideo } from "@/lib/mocks/adapter";
import { getExternalMediaMode } from "@/lib/mocks/external";
import { formatDate, formatViews } from "@/lib/utils/format";
import { notFound } from "next/navigation";

type WatchPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ media?: string }>;
};

export default async function WatchPage({ params, searchParams }: WatchPageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const video = await getVideo(id);
  if (!video) notFound();

  const [related, comments] = await Promise.all([getRelatedVideos(id), getComments(id)]);
  const mediaMode = query.media ? getMediaMode(query.media) : await getExternalMediaMode("normal");

  return (
    <main className="page">
      <div className="watch-layout">
        <div>
          <VideoPlayer video={video} mediaMode={mediaMode} />
          <div className="mode-bar" aria-label="メディア状態の切り替え">
            <a className="secondary-button" href={`/watch/${video.id}?media=normal`}>
              正常
            </a>
            <a className="secondary-button" href={`/watch/${video.id}?media=slow`}>
              遅延
            </a>
            <a className="secondary-button" href={`/watch/${video.id}?media=not_found`}>
              404
            </a>
            <a className="secondary-button" href={`/watch/${video.id}?media=failure`}>
              失敗
            </a>
          </div>
          <h1 className="watch-title">{video.title}</h1>
          <section className="panel">
            <h2>章立て</h2>
            <ol className="chapter-list">
              <li>学習目標の確認</li>
              <li>要点の集中視聴</li>
              <li>メモと次のキュー整理</li>
            </ol>
          </section>
          <WatchLibraryActions video={{ id: video.id, title: video.title }} />
          <p className="meta-line">
            <span>{formatViews(video.viewCount)}</span>
            <span>{formatDate(video.publishedAt)}</span>
            <span>{video.category}</span>
          </p>
          <ChannelSummary channel={video.channel} />
          <section className="panel">
            <h2>学習ノート</h2>
            <p>{video.description}</p>
            <textarea aria-label="学習メモ" className="note-box" defaultValue="重要点: " />
          </section>
          <CommentsSection comments={comments} />
        </div>
        <RelatedVideos videos={related} />
      </div>
    </main>
  );
}

export function generateStaticParams() {
  return [{ id: "vf-001" }, { id: "vf-002" }, { id: "vf-003" }, { id: "vf-004" }];
}
