import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { WatchLibraryActions } from "./WatchLibraryActions";

const video = {
  id: "vf-001",
  title: "小さな動画サービスを設計する"
};

describe("ライブラリ操作", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("視聴履歴へ追加し、削除できる", async () => {
    const user = userEvent.setup();
    render(<WatchLibraryActions video={video} />);

    expect(await screen.findByText(video.title)).toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem("watchflow.history") ?? "[]")).toEqual([video]);

    await user.click(screen.getByRole("button", { name: "この動画の履歴を削除" }));

    expect(screen.getByText("視聴履歴はありません。")).toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem("watchflow.history") ?? "[]")).toEqual([]);
  });

  it("後で見ると品質レビュープレイリストを追加、解除できる", async () => {
    const user = userEvent.setup();
    render(<WatchLibraryActions video={video} />);

    const watchLaterButton = await screen.findByRole("button", { name: "後で見るへ追加" });
    await user.click(watchLaterButton);
    expect(screen.getByRole("button", { name: "後で見るに追加済み" })).toHaveAttribute("aria-pressed", "true");
    expect(JSON.parse(window.localStorage.getItem("watchflow.watchLater") ?? "[]")).toEqual([video.id]);

    await user.click(screen.getByRole("button", { name: "品質レビューへ追加" }));
    expect(screen.getByRole("button", { name: "品質レビューから削除" })).toHaveAttribute("aria-pressed", "true");
    expect(JSON.parse(window.localStorage.getItem("watchflow.playlist.quality") ?? "[]")).toEqual([video.id]);

    await user.click(screen.getByRole("button", { name: "後で見るに追加済み" }));
    await user.click(screen.getByRole("button", { name: "品質レビューから削除" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "後で見るへ追加" })).toHaveAttribute("aria-pressed", "false");
      expect(screen.getByRole("button", { name: "品質レビューへ追加" })).toHaveAttribute("aria-pressed", "false");
    });
  });
});
