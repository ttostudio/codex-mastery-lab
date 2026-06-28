"use client";

import { PlayerControls } from "@/features/video/PlayerControls";

export function PlayerControlsCatalog() {
  return (
    <PlayerControls
      isPlaying={false}
      isMuted={false}
      volume={0.8}
      progress={42}
      duration={180}
      buffering={false}
      playbackRate={1}
      captionsEnabled={false}
      canFullscreen
      canPictureInPicture
      onTogglePlay={() => undefined}
      onSeek={() => undefined}
      onToggleMuted={() => undefined}
      onVolume={() => undefined}
      onPlaybackRate={() => undefined}
      onToggleCaptions={() => undefined}
      onFullscreen={() => undefined}
      onPictureInPicture={() => undefined}
    />
  );
}
