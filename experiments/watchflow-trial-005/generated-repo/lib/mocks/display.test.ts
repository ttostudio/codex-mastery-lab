import { describe, expect, it } from "vitest";
import { authLabels, billingLabels } from "./display";

describe("認証/課金表示マッピング", () => {
  it("認証状態を日本語表示に変換する", () => {
    expect(authLabels.anonymous).toBe("ゲスト");
    expect(authLabels.logged_in).toBe("ログイン中");
    expect(authLabels.premium).toBe("プレミアム会員");
    expect(authLabels.session_expired).toBe("セッション期限切れ");
  });

  it("課金状態を日本語表示に変換する", () => {
    expect(billingLabels.free).toBe("無料プラン");
    expect(billingLabels.premium).toBe("プレミアム");
    expect(billingLabels.payment_failed).toBe("支払い確認が必要");
  });
});
