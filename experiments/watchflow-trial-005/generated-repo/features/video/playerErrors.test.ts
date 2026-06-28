import { describe, expect, it } from "vitest";
import { mapPlayerError } from "./playerErrors";

describe("プレイヤーエラー文言", () => {
  it("404相当の文言を返す", () => {
    expect(mapPlayerError("media_not_found")).toContain("見つかりません");
  });

  it("再生ブロックの文言を返す", () => {
    expect(mapPlayerError("playback_blocked")).toContain("自動再生");
  });

  it("失敗モードの文言を返す", () => {
    expect(mapPlayerError("media_failure", "failure")).toContain("メディアAPI");
  });
});
