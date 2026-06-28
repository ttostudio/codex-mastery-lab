"use client";

import { Button } from "@/components/ui/Button";
import { ja } from "@/lib/i18n/ja";
import { formatDuration } from "@/lib/utils/format";
import { Maximize, Pause, PictureInPicture, Play, Volume2, VolumeX } from "lucide-react";
import { playbackRates, type PlaybackRate } from "./mediaAdapter";
import { CaptionsControl } from "./CaptionsControl";

type PlayerControlsProps = {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  progress: number;
  duration: number;
  buffering: boolean;
  playbackRate: PlaybackRate;
  captionsEnabled: boolean;
  canFullscreen: boolean;
  canPictureInPicture: boolean;
  onTogglePlay: () => void;
  onSeek: (value: number) => void;
  onToggleMuted: () => void;
  onVolume: (value: number) => void;
  onPlaybackRate: (value: PlaybackRate) => void;
  onToggleCaptions: () => void;
  onFullscreen: () => void;
  onPictureInPicture: () => void;
};

export function PlayerControls({
  isPlaying,
  isMuted,
  volume,
  progress,
  duration,
  buffering,
  playbackRate,
  captionsEnabled,
  canFullscreen,
  canPictureInPicture,
  onTogglePlay,
  onSeek,
  onToggleMuted,
  onVolume,
  onPlaybackRate,
  onToggleCaptions,
  onFullscreen,
  onPictureInPicture
}: PlayerControlsProps) {
  return (
    <div className="player-controls" aria-label="動画プレイヤー操作">
      {buffering ? <span aria-live="polite">{ja.buffering}</span> : null}
      <label>
        <span className="muted">{ja.seek}</span>
        <input
          aria-label={ja.seek}
          type="range"
          min="0"
          max={duration}
          value={progress}
          suppressHydrationWarning
          onChange={(event) => onSeek(Number(event.target.value))}
        />
      </label>
      <div className="control-row">
        <Button variant="icon" aria-label={isPlaying ? ja.pause : ja.play} onClick={onTogglePlay}>
          {isPlaying ? <Pause size={18} aria-hidden /> : <Play size={18} aria-hidden />}
        </Button>
        <span className="time-readout">
          {formatDuration(Math.floor(progress))} / {formatDuration(Math.floor(duration))}
        </span>
        <Button variant="icon" aria-label={isMuted ? ja.unmute : ja.mute} onClick={onToggleMuted}>
          {isMuted ? <VolumeX size={18} aria-hidden /> : <Volume2 size={18} aria-hidden />}
        </Button>
        <label className="control-row control-volume">
          <span className="muted">{ja.volume}</span>
          <input
            aria-label={ja.volume}
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            suppressHydrationWarning
            onChange={(event) => onVolume(Number(event.target.value))}
          />
        </label>
        <label className="control-rate">
          <span className="muted">速度</span>
          <select
            aria-label="再生速度"
            value={playbackRate}
            onChange={(event) => onPlaybackRate(Number(event.target.value) as PlaybackRate)}
          >
            {playbackRates.map((rate) => (
              <option key={rate} value={rate}>
                {rate}x
              </option>
            ))}
          </select>
        </label>
        <CaptionsControl enabled={captionsEnabled} onToggle={onToggleCaptions} />
        {canPictureInPicture ? (
          <Button variant="icon" aria-label="ピクチャーインピクチャー" onClick={onPictureInPicture}>
            <PictureInPicture size={18} aria-hidden />
          </Button>
        ) : null}
        {canFullscreen ? (
          <Button variant="icon" aria-label="全画面" onClick={onFullscreen}>
            <Maximize size={18} aria-hidden />
          </Button>
        ) : null}
      </div>
    </div>
  );
}
