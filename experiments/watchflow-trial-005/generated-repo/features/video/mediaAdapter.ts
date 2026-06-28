import type { MediaMode } from "@/lib/mocks/types";

export const playbackRates = [0.5, 1, 1.25, 1.5, 2] as const;

export type PlaybackRate = (typeof playbackRates)[number];

export function buildMediaSourceUrl(mediaMode: MediaMode, retryKey: number): string {
  if (mediaMode === "normal") return `/api/media/video?retry=${retryKey}`;
  return `/api/media/video?mode=${mediaMode}&retry=${retryKey}`;
}

export function canUsePictureInPicture(element: HTMLVideoElement | null): boolean {
  return Boolean(element && "requestPictureInPicture" in element && !document.pictureInPictureElement);
}

export function canUseFullscreen(element: HTMLVideoElement | null): boolean {
  return Boolean(element?.requestFullscreen);
}
