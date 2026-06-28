import { describe, expect, it } from "vitest";
import { formatDuration, formatViews } from "./format";

describe("日本語フォーマット", () => {
  it("動画時間を m:ss 形式に整形する", () => {
    expect(formatDuration(65)).toBe("1:05");
  });

  it("動画時間の境界値を整形する", () => {
    expect(formatDuration(0)).toBe("0:00");
    expect(formatDuration(59)).toBe("0:59");
    expect(formatDuration(3600)).toBe("1:00:00");
    expect(formatDuration(3661)).toBe("1:01:01");
  });

  it("再生回数を日本語ラベル付きで整形する", () => {
    expect(formatViews(123456)).toBe("123,456 回視聴");
  });
});
