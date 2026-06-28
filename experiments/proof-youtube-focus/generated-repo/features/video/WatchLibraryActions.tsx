"use client";

import { Button } from "@/components/ui/Button";
import { BookmarkCheck, BookmarkPlus, History, ListPlus, ListX, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

const storageKeys = {
  history: "studystream.history",
  saved: "studystream.saved",
  queue: "studystream.focusQueue"
} as const;

type VideoSummary = {
  id: string;
  title: string;
};

function readStringArray(key: string): string[] {
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function writeStringArray(key: string, values: string[]) {
  window.localStorage.setItem(key, JSON.stringify(values));
}

function readHistory(): VideoSummary[] {
  try {
    const raw = window.localStorage.getItem(storageKeys.history);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter(
          (item): item is VideoSummary =>
            typeof item === "object" &&
            item !== null &&
            typeof item.id === "string" &&
            typeof item.title === "string"
        )
      : [];
  } catch {
    return [];
  }
}

function writeHistory(values: VideoSummary[]) {
  window.localStorage.setItem(storageKeys.history, JSON.stringify(values));
}

export function WatchLibraryActions({ video }: { video: VideoSummary }) {
  const [saved, setSaved] = useState(false);
  const [inPlaylist, setInPlaylist] = useState(false);
  const [history, setHistory] = useState<VideoSummary[]>([]);

  useEffect(() => {
    const currentHistory = readHistory().filter((item) => item.id !== video.id);
    const nextHistory = [{ id: video.id, title: video.title }, ...currentHistory].slice(0, 8);
    writeHistory(nextHistory);
    queueMicrotask(() => {
      setHistory(nextHistory);
      setSaved(readStringArray(storageKeys.saved).includes(video.id));
      setInPlaylist(readStringArray(storageKeys.queue).includes(video.id));
    });
  }, [video.id, video.title]);

  const toggleWatchLater = () => {
    const current = new Set(readStringArray(storageKeys.saved));
    if (current.has(video.id)) {
      current.delete(video.id);
      setSaved(false);
    } else {
      current.add(video.id);
      setSaved(true);
    }
    writeStringArray(storageKeys.saved, Array.from(current));
  };

  const togglePlaylist = () => {
    const current = new Set(readStringArray(storageKeys.queue));
    if (current.has(video.id)) {
      current.delete(video.id);
      setInPlaylist(false);
    } else {
      current.add(video.id);
      setInPlaylist(true);
    }
    writeStringArray(storageKeys.queue, Array.from(current));
  };

  const clearHistory = () => {
    const nextHistory = readHistory().filter((item) => item.id !== video.id);
    writeHistory(nextHistory);
    setHistory(nextHistory);
  };

  return (
    <section className="library-panel" aria-label="ライブラリ操作">
      <div className="watch-actions">
        <Button onClick={toggleWatchLater} aria-pressed={saved}>
          {saved ? <BookmarkCheck size={18} aria-hidden /> : <BookmarkPlus size={18} aria-hidden />}
          {saved ? "保存済み" : "保存する"}
        </Button>
        <Button onClick={togglePlaylist} aria-pressed={inPlaylist}>
          {inPlaylist ? <ListX size={18} aria-hidden /> : <ListPlus size={18} aria-hidden />}
          {inPlaylist ? "集中キューから解除" : "集中キューへ追加"}
        </Button>
        <Button onClick={clearHistory}>
          <Trash2 size={18} aria-hidden />
          この学習履歴を削除
        </Button>
      </div>
      <div className="library-list">
        <h2>
          <History size={18} aria-hidden />
          学習履歴
        </h2>
        {history.length > 0 ? (
          <ol>
            {history.map((item) => (
              <li key={item.id}>{item.title}</li>
            ))}
          </ol>
        ) : (
          <p className="muted">学習履歴はありません。</p>
        )}
      </div>
    </section>
  );
}
