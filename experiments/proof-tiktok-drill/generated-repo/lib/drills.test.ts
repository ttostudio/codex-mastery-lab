import { describe, expect, it } from "vitest";
import { drills, gradeAnswer, nextIndex } from "./drills";
import { emptyProgress, remember, toggleId } from "./persistence";

describe("ドリル判定", () => {
  it("正答を判定できる", () => {
    expect(gradeAnswer(drills[0], drills[0].answer)).toBe(true);
    expect(gradeAnswer(drills[0], "TO")).toBe(false);
  });

  it("フィード位置を循環できる", () => {
    expect(nextIndex(0, -1)).toBe(drills.length - 1);
    expect(nextIndex(drills.length - 1, 1)).toBe(0);
  });
});

describe("反復学習の端末保存ロジック", () => {
  it("保存と復習キューを切り替えられる", () => {
    const once = toggleId(emptyProgress.saved, "accent-shadow");
    expect(once).toEqual(["accent-shadow"]);
    expect(toggleId(once, "accent-shadow")).toEqual([]);
  });

  it("視聴履歴は重複を先頭へ移動する", () => {
    expect(remember(["kanji-loop", "accent-shadow"], "accent-shadow")).toEqual([
      "accent-shadow",
      "kanji-loop"
    ]);
  });
});
