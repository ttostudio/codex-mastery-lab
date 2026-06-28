export type AuthState = "anonymous" | "logged_in" | "premium" | "session_expired";
export type BillingState = "free" | "premium" | "payment_failed";
export type MediaMode = "normal" | "slow" | "not_found" | "failure" | "interrupted";

export type Channel = {
  id: string;
  name: string;
  handle: string;
  description: string;
  subscriberCount: number;
  verified: boolean;
  avatarColor: string;
};

export type Video = {
  id: string;
  title: string;
  description: string;
  channelId: string;
  durationSeconds: number;
  publishedAt: string;
  viewCount: number;
  category: string;
  tags: string[];
  thumbnail: string;
  poster: string;
  captions: Array<{ lang: "ja" | "en"; label: string; src: string }>;
};

export type Comment = {
  id: string;
  videoId: string;
  author: string;
  body: string;
  postedAt: string;
  likeCount: number;
};

export type ApiState<T> =
  | { status: "loading"; data?: undefined; message?: undefined }
  | { status: "success"; data: T; message?: undefined }
  | { status: "empty"; data: T; message: string }
  | { status: "error" | "offline" | "timeout"; data?: undefined; message: string };
