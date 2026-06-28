import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page">
      <div className="state">
        <div>
          <h1>ページが見つかりません</h1>
          <p className="muted">指定された動画またはチャンネルは存在しません。</p>
          <Link className="secondary-button" href="/">
            ホームへ戻る
          </Link>
        </div>
      </div>
    </main>
  );
}
