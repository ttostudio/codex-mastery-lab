import { StateView } from "@/components/ui/StateView";

export default function ErrorDemoPage() {
  return (
    <main className="page">
      <StateView title="エラー状態" message="API失敗、オフライン、タイムアウト時の共通表示を確認するための画面です。" />
      <div className="mode-bar">
        <a className="secondary-button" href="/states?auth=session_expired&billing=payment_failed">
          認証/課金状態を見る
        </a>
        <a className="secondary-button" href="/search?state=offline">
          オフライン検索を見る
        </a>
        <a className="secondary-button" href="/search?state=timeout">
          タイムアウト検索を見る
        </a>
      </div>
    </main>
  );
}
