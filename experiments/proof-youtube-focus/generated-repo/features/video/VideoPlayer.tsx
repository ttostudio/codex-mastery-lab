import type { MediaMode, Video } from "@/lib/mocks/types";
import { VideoPlayerShell } from "./VideoPlayerShell";

type VideoPlayerProps = {
  video: Video;
  mediaMode?: MediaMode;
};

export function VideoPlayer({ video, mediaMode = "normal" }: VideoPlayerProps) {
  return <VideoPlayerShell video={video} mediaMode={mediaMode} />;
}
