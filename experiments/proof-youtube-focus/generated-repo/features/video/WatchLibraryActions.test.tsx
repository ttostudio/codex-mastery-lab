import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { WatchLibraryActions } from "./WatchLibraryActions";

const video = {
  id: "vf-001",
  title: "集中学習キューを設計する"
};

describe("ライブラリ操作", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("学習履歴へ追加し、削除できる", async () => {
    const user = userEvent.setup();
    render(<WatchLibraryActions video={video} />);

    expect(await screen.findByText(video.title)).toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem("studystream.history") ?? "[]")).toEqual([video]);

    await user.click(screen.getByRole("button", { name: "この学習履歴を削除" }));

    expect(screen.getByText("学習履歴はありません。")).toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem("studystream.history") ?? "[]")).toEqual([]);
  });

  it("保存と集中キューを追加、解除できる", async () => {
    const user = userEvent.setup();
    render(<WatchLibraryActions video={video} />);

    const watchLaterButton = await screen.findByRole("button", { name: "保存する" });
    await user.click(watchLaterButton);
    expect(screen.getByRole("button", { name: "保存済み" })).toHaveAttribute("aria-pressed", "true");
    expect(JSON.parse(window.localStorage.getItem("studystream.saved") ?? "[]")).toEqual([video.id]);

    await user.click(screen.getByRole("button", { name: "集中キューへ追加" }));
    expect(screen.getByRole("button", { name: "集中キューから解除" })).toHaveAttribute("aria-pressed", "true");
    expect(JSON.parse(window.localStorage.getItem("studystream.focusQueue") ?? "[]")).toEqual([video.id]);

    await user.click(screen.getByRole("button", { name: "保存済み" }));
    await user.click(screen.getByRole("button", { name: "集中キューから解除" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "保存する" })).toHaveAttribute("aria-pressed", "false");
      expect(screen.getByRole("button", { name: "集中キューへ追加" })).toHaveAttribute("aria-pressed", "false");
    });
  });
});
