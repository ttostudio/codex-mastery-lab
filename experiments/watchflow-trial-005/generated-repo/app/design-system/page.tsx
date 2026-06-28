import { Button } from "@/components/ui/Button";
import { StateView } from "@/components/ui/StateView";
import { VideoCard } from "@/features/video/VideoCard";
import { listVideos } from "@/lib/mocks/adapter";
import { PlayerControlsCatalog } from "./PlayerControlsCatalog";

export default async function DesignSystemPage() {
  const [video] = await listVideos();

  return (
    <main className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">デザインシステム</h1>
          <p className="muted">WatchFlow の tokens、components、variants を確認するカタログです。</p>
        </div>
      </div>
      <section className="design-section">
        <h2>Colors</h2>
        <div className="swatch-grid">
          {["primary", "accent", "danger", "surface", "text"].map((name) => (
            <div key={name} className={`swatch swatch-${name}`}>
              {name}
            </div>
          ))}
        </div>
      </section>
      <section className="design-section">
        <h2>Button</h2>
        <div className="control-row">
          <Button variant="primary">主要操作</Button>
          <Button>副次操作</Button>
          <Button variant="icon" aria-label="アイコン操作">
            W
          </Button>
        </div>
      </section>
      <section className="design-section">
        <h2>StateView</h2>
        <StateView title="空状態" message="次の操作へ迷わないよう、短い説明と必要な導線を置きます。" />
      </section>
      <section className="design-section">
        <h2>VideoCard</h2>
        <div className="video-grid">{video ? <VideoCard video={video} /> : null}</div>
      </section>
      <section className="design-section dark-demo">
        <h2>PlayerControls</h2>
        <PlayerControlsCatalog />
      </section>
    </main>
  );
}
