"use client";

import type { MediaMode, Video } from "@/lib/mocks/types";
import { KeyboardEvent, RefObject, useCallback, useMemo, useState } from "react";
import { buildMediaSourceUrl, type PlaybackRate } from "./mediaAdapter";
import { mapPlayerError, type PlayerErrorCode } from "./playerErrors";

type PlayerStateArgs = {
  video: Video;
  mediaMode: MediaMode;
  videoRef: RefObject<HTMLVideoElement | null>;
};

export function usePlayerStateMachine({ video, mediaMode, videoRef }: PlayerStateArgs) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(video.durationSeconds);
  const [buffering, setBuffering] = useState(mediaMode === "slow");
  const [error, setError] = useState<string | null>(() => {
    if (mediaMode === "not_found") return mapPlayerError("media_not_found", mediaMode);
    if (mediaMode === "failure") return mapPlayerError("media_failure", mediaMode);
    return null;
  });
  const [retryKey, setRetryKey] = useState(0);
  const [playbackRate, setPlaybackRateValue] = useState<PlaybackRate>(1);
  const [captionsEnabled, setCaptionsEnabled] = useState(false);

  const sourceUrl = useMemo(() => buildMediaSourceUrl(mediaMode, retryKey), [mediaMode, retryKey]);

  const fail = useCallback((code: PlayerErrorCode) => {
    setError(mapPlayerError(code, mediaMode));
    setBuffering(false);
    setIsPlaying(false);
  }, [mediaMode]);

  const togglePlay = useCallback(async () => {
    const element = videoRef.current;
    if (!element || error) return;
    try {
      if (element.paused) {
        await element.play();
        setIsPlaying(true);
      } else {
        element.pause();
        setIsPlaying(false);
      }
    } catch {
      fail("playback_blocked");
    }
  }, [error, fail, videoRef]);

  const retry = () => {
    setError(null);
    setBuffering(mediaMode === "slow");
    setProgress(0);
    setIsPlaying(false);
    setRetryKey((value) => value + 1);
  };

  const seek = (next: number) => {
    setProgress(next);
    if (videoRef.current) videoRef.current.currentTime = next;
  };

  const setMuted = (nextMuted: boolean) => {
    if (videoRef.current) videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const setVolumeLevel = (nextVolume: number) => {
    if (videoRef.current) videoRef.current.volume = nextVolume;
    setVolume(nextVolume);
  };

  const setPlaybackRate = (nextRate: PlaybackRate) => {
    if (videoRef.current) videoRef.current.playbackRate = nextRate;
    setPlaybackRateValue(nextRate);
  };

  const toggleCaptions = () => {
    const next = !captionsEnabled;
    const tracks = videoRef.current?.textTracks;
    if (tracks) {
      Array.from(tracks).forEach((track) => {
        track.mode = next ? "showing" : "disabled";
      });
    }
    setCaptionsEnabled(next);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const element = videoRef.current;
    if (!element) return;
    if (event.key === " " || event.key.toLowerCase() === "k") {
      event.preventDefault();
      void togglePlay();
    }
    if (event.key === "ArrowRight") seek(Math.min(element.duration || duration, element.currentTime + 5));
    if (event.key === "ArrowLeft") seek(Math.max(0, element.currentTime - 5));
    if (event.key.toLowerCase() === "m") setMuted(!element.muted);
    if (event.key.toLowerCase() === "c") toggleCaptions();
  };

  return {
    state: { isPlaying, isMuted, volume, progress, duration, buffering, error, sourceUrl, playbackRate, captionsEnabled },
    actions: {
      togglePlay,
      retry,
      seek,
      setMuted,
      setVolumeLevel,
      setPlaybackRate,
      toggleCaptions,
      setBuffering,
      setDuration,
      setProgress,
      setIsPlaying,
      setVolume,
      setIsMuted,
      fail,
      handleKeyDown
    }
  };
}
