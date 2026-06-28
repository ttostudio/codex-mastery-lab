import type { VideoWithChannel } from "@/lib/api/client";
import { ja } from "@/lib/i18n/ja";
import { VideoCard } from "./VideoCard";

export function RelatedVideos({ videos }: { videos: VideoWithChannel[] }) {
  return (
    <aside className="stack" aria-labelledby="related-heading">
      <h2 id="related-heading">{ja.relatedTitle}</h2>
      {videos.map((video, index) => (
        <VideoCard key={video.id} video={video} priority={index === 0} />
      ))}
    </aside>
  );
}
