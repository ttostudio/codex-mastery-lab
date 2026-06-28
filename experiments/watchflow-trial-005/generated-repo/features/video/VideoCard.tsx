import type { VideoWithChannel } from "@/lib/api/client";
import { formatDate, formatDuration, formatViews } from "@/lib/utils/format";
import Image from "next/image";
import Link from "next/link";

export function VideoCard({ video, priority = false }: { video: VideoWithChannel; priority?: boolean }) {
  return (
    <article className="video-card">
      <Link href={`/watch/${video.id}`} className="thumb" aria-label={`${video.title} を再生`}>
        <Image src={video.thumbnail} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" priority={priority} unoptimized />
        <span className="duration">{formatDuration(video.durationSeconds)}</span>
      </Link>
      <div>
        <h2 className="video-title">
          <Link href={`/watch/${video.id}`}>{video.title}</Link>
        </h2>
        <div className="meta-line">
          <Link href={`/channel/${video.channel.id}`}>{video.channel.name}</Link>
          <span>{formatViews(video.viewCount)}</span>
          <span>{formatDate(video.publishedAt)}</span>
        </div>
      </div>
    </article>
  );
}
