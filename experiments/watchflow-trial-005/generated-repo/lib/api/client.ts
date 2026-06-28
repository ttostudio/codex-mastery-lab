import type { AuthState, BillingState, Channel, Comment, MediaMode, Video } from "@/lib/mocks/types";

export type VideoWithChannel = Video & { channel: Channel };
export type ChannelWithVideos = Channel & { videos: Video[] };

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...init?.headers
    }
  });
  if (!response.ok) {
    throw new Error(`APIエラー: ${response.status}`);
  }
  return (await response.json()) as T;
}

export const watchflowApi = {
  videos: () => requestJson<{ videos: VideoWithChannel[] }>("/api/videos"),
  search: (query: string) => requestJson<{ videos: VideoWithChannel[] }>(`/api/search?q=${encodeURIComponent(query)}`),
  comments: (videoId: string) => requestJson<{ comments: Comment[] }>(`/api/comments?videoId=${encodeURIComponent(videoId)}`),
  auth: (state: AuthState) => requestJson<{ state: AuthState }>(`/api/auth?state=${state}`),
  billing: (state: BillingState) => requestJson<{ state: BillingState }>(`/api/billing?state=${state}`),
  mediaUrl: (mode: MediaMode) => `/api/media/video?mode=${mode}`
};
