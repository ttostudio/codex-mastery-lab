import { describe, expect, it } from "vitest";
import { getAuthState, getBillingState, searchVideos } from "./adapter";

describe("モック検索フィルタ", () => {
  it("タイトル、タグ、チャンネル名を対象に検索する", async () => {
    await expect(searchVideos("TypeScript")).resolves.toEqual(
      expect.arrayContaining([expect.objectContaining({ id: "vf-003" })])
    );
    await expect(searchVideos("集中")).resolves.toEqual(
      expect.arrayContaining([expect.objectContaining({ id: "vf-001" })])
    );
  });

  it("空白だけの検索では全件を返す", async () => {
    await expect(searchVideos("   ")).resolves.toHaveLength(4);
  });
});

describe("状態値の丸め込み", () => {
  it("未知の認証値は anonymous にする", () => {
    expect(getAuthState("unknown")).toBe("anonymous");
  });

  it("未知の課金値は free にする", () => {
    expect(getBillingState("unknown")).toBe("free");
  });
});
