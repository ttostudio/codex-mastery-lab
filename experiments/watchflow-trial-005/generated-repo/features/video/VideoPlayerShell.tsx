"use client";

import { Button } from "@/components/ui/Button";
import { ja } from "@/lib/i18n/ja";
import type { MediaMode, Video } from "@/lib/mocks/types";
import { RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { canUseFullscreen, canUsePictureInPicture } from "./mediaAdapter";
import { PlayerControls } from "./PlayerControls";
import { usePlayerStateMachine } from "./usePlayerStateMachine";

type VideoPlayerShellProps = {
  video: Video;
  mediaMode?: MediaMode;
};

export function VideoPlayerShell({ video, mediaMode = "normal" }: VideoPlayerShellProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { state, actions } = usePlayerStateMachine({ video, mediaMode, videoRef });
  const [featureSupport, setFeatureSupport] = useState({ fullscreen: false, pip: false });

  useEffect(() => {
    setFeatureSupport({
      fullscreen: canUseFullscreen(videoRef.current),
      pip: canUsePictureInPicture(videoRef.current)
    });
  }, [state.sourceUrl]);

  if (state.error) {
    return (
      <div className="player-stage">
        <div className="player-message" role="alert">
          <div>
            <h2>{ja.mediaFailure}</h2>
            <p>{state.error}</p>
            <Button onClick={actions.retry}>
              <RotateCcw size={18} aria-hidden /> {ja.retry}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="player-stage" onKeyDown={actions.handleKeyDown} tabIndex={0} aria-label="動画プレイヤー">
      <video
        key={state.sourceUrl}
        ref={videoRef}
        className="player-video"
        poster={video.poster}
        preload="metadata"
        data-lcp-poster="eager"
        onClick={() => void actions.togglePlay()}
        onWaiting={() => actions.setBuffering(true)}
        onCanPlay={() => actions.setBuffering(false)}
        onLoadedMetadata={(event) => actions.setDuration(event.currentTarget.duration || video.durationSeconds)}
        onTimeUpdate={(event) => actions.setProgress(event.currentTarget.currentTime)}
        onPause={() => actions.setIsPlaying(false)}
        onPlay={() => actions.setIsPlaying(true)}
        onVolumeChange={(event) => {
          actions.setVolume(event.currentTarget.volume);
          actions.setIsMuted(event.currentTarget.muted);
        }}
        onError={() => actions.fail(mediaMode === "not_found" ? "media_not_found" : "media_failure")}
      >
        <source src={state.sourceUrl} type="video/mp4" />
        {video.captions.map((caption) => (
          <track key={caption.lang} kind="captions" srcLang={caption.lang} label={caption.label} src={caption.src} />
        ))}
      </video>
      <PlayerControls
        {...state}
        canFullscreen={featureSupport.fullscreen}
        canPictureInPicture={featureSupport.pip}
        onTogglePlay={() => void actions.togglePlay()}
        onSeek={actions.seek}
        onToggleMuted={() => actions.setMuted(!state.isMuted)}
        onVolume={actions.setVolumeLevel}
        onPlaybackRate={actions.setPlaybackRate}
        onToggleCaptions={actions.toggleCaptions}
        onFullscreen={() => void videoRef.current?.requestFullscreen?.()}
        onPictureInPicture={() => {
          const element = videoRef.current;
          if (element && "requestPictureInPicture" in element) {
            void element.requestPictureInPicture();
          }
        }}
      />
    </div>
  );
}
