import { StateView } from "@/components/ui/StateView";
import { VideoGrid } from "@/features/video/VideoGrid";
import { ja } from "@/lib/i18n/ja";
import { searchVideos } from "@/lib/mocks/adapter";

type SearchPageProps = {
  searchParams: Promise<{ q?: string; state?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q ?? "";

  if (params.state === "offline") {
    return (
      <main className="page">
        <StateView title={ja.offline} message="検索APIに到達できない想定の表示です。" />
      </main>
    );
  }

  if (params.state === "timeout") {
    return (
      <main className="page">
        <StateView title={ja.timeout} message="タイムアウト時の復帰導線を検証できます。" />
      </main>
    );
  }

  const videos = await searchVideos(query);
  return (
    <main className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">検索結果</h1>
          <p className="muted">{query ? `「${query}」の結果` : "検索語がないため全件を表示しています。"}</p>
        </div>
      </div>
      {videos.length > 0 ? <VideoGrid videos={videos} /> : <StateView title={ja.empty} message="別のキーワードで検索してください。" />}
    </main>
  );
}
