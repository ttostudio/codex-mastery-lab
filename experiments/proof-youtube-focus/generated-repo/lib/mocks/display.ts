import { ja } from "@/lib/i18n/ja";
import type { AuthState, BillingState } from "./types";

export const authLabels: Record<AuthState, string> = {
  anonymous: ja.auth.anonymous,
  logged_in: ja.auth.logged_in,
  premium: ja.auth.premium,
  session_expired: ja.auth.session_expired
};

export const billingLabels: Record<BillingState, string> = {
  free: "無料プラン",
  premium: "プレミアム",
  payment_failed: "支払い確認が必要"
};

export const authMessages: Record<AuthState, string> = {
  anonymous: "匿名学習者として視聴できます。保存、同期、プレミアム教材はログイン後に有効になります。",
  logged_in: "ログイン中です。通常教材の視聴、検索、学習履歴を利用できます。",
  premium: "プレミアム会員として高画質教材と優先キューの表示を確認できます。",
  session_expired: "セッションが期限切れです。再ログインを促す表示を確認できます。"
};

export const billingMessages: Record<BillingState, string> = {
  free: "無料プランの表示です。プレミアム教材の導線は控えめに表示します。",
  premium: "支払い状態は正常です。プレミアム教材の集中視聴を継続できます。",
  payment_failed: "支払いを確認できませんでした。学習を止めずに更新導線を表示します。"
};
