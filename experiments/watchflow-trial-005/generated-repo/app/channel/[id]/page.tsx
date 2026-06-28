import { StateView } from "@/components/ui/StateView";
import { VideoGrid } from "@/features/video/VideoGrid";
import { getChannelWithVideos } from "@/lib/mocks/adapter";
import { formatNumber } from "@/lib/utils/format";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";

type ChannelPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ChannelPage({ params }: ChannelPageProps) {
  const { id } = await params;
  const channel = await getChannelWithVideos(id);
  if (!channel) notFound();

  return (
    <main className="page">
      <section className="panel">
        <div className="channel-row" style={{ borderBottom: 0 }}>
          <div className="avatar" style={{ "--avatar-color": channel.avatarColor } as CSSProperties} aria-hidden>
            {channel.name.slice(0, 1)}
          </div>
          <div>
            <h1 className="page-title">{channel.name}</h1>
            <p className="muted">
              {channel.handle} / 登録者 {formatNumber(channel.subscriberCount)} 人 {channel.verified ? "/ 認証済み" : ""}
            </p>
            <p>{channel.description}</p>
          </div>
        </div>
      </section>
      <section style={{ marginTop: 24 }}>
        <h2>公開動画</h2>
        {channel.videos.length > 0 ? (
          <VideoGrid videos={channel.videos.map((video) => ({ ...video, channel }))} />
        ) : (
          <StateView title="動画がありません" message="このチャンネルには公開動画がありません。" />
        )}
      </section>
    </main>
  );
}
