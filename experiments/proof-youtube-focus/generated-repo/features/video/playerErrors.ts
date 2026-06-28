import type { MediaMode } from "@/lib/mocks/types";

export type PlayerErrorCode = "media_not_found" | "media_failure" | "playback_blocked" | "unknown";

export function mapPlayerError(code: PlayerErrorCode, mode?: MediaMode): string {
  if (code === "media_not_found" || mode === "not_found") {
    return "動画ファイルが見つかりませんでした。別の状態に切り替えるか、時間を置いて再試行してください。";
  }
  if (code === "playback_blocked") {
    return "ブラウザが自動再生をブロックしました。再生ボタンをもう一度押してください。";
  }
  if (code === "media_failure" || mode === "failure") {
    return "メディアAPIが正常な動画を返しませんでした。モードを変えるか再試行してください。";
  }
  return "動画の再生中に不明な問題が発生しました。";
}
