import { channels, comments, videos } from "./data";
import type { AuthState, BillingState, Channel, Comment, MediaMode, Video } from "./types";

const delayMs = 120;

function wait(ms = delayMs): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function listVideos(): Promise<Array<Video & { channel: Channel }>> {
  await wait();
  return videos.map((video) => ({ ...video, channel: getChannel(video.channelId) }));
}

export async function searchVideos(query: string): Promise<Array<Video & { channel: Channel }>> {
  await wait();
  const normalized = query.trim().toLowerCase();
  if (!normalized) return listVideos();
  return videos
    .filter((video) => {
      const channel = getChannel(video.channelId);
      return [video.title, video.description, video.category, channel.name, ...video.tags]
        .join(" ")
        .toLowerCase()
        .includes(normalized);
    })
    .map((video) => ({ ...video, channel: getChannel(video.channelId) }));
}

export async function getVideo(id: string): Promise<(Video & { channel: Channel }) | null> {
  await wait();
  const video = videos.find((item) => item.id === id);
  return video ? { ...video, channel: getChannel(video.channelId) } : null;
}

export async function getRelatedVideos(id: string): Promise<Array<Video & { channel: Channel }>> {
  const current = videos.find((item) => item.id === id);
  if (!current) return [];
  await wait();
  return videos
    .filter((item) => item.id !== id && (item.category === current.category || item.channelId === current.channelId))
    .map((video) => ({ ...video, channel: getChannel(video.channelId) }));
}

export async function getChannelWithVideos(id: string): Promise<(Channel & { videos: Video[] }) | null> {
  await wait();
  const channel = channels.find((item) => item.id === id);
  if (!channel) return null;
  return { ...channel, videos: videos.filter((video) => video.channelId === id) };
}

export async function getComments(videoId: string): Promise<Comment[]> {
  await wait();
  return comments.filter((comment) => comment.videoId === videoId);
}

export function getAuthState(value: string | null): AuthState {
  if (value === "logged_in" || value === "premium" || value === "session_expired") return value;
  return "anonymous";
}

export function getBillingState(value: string | null): BillingState {
  if (value === "premium" || value === "payment_failed") return value;
  return "free";
}

export function getMediaMode(value: string | null): MediaMode {
  if (value === "slow" || value === "not_found" || value === "failure" || value === "interrupted") return value;
  return "normal";
}

function getChannel(channelId: string): Channel {
  const channel = channels.find((item) => item.id === channelId);
  if (!channel) throw new Error(`チャンネルが見つかりません: ${channelId}`);
  return channel;
}
