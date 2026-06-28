"use client";

import { Bookmark, Check, Clock, History, RotateCcw, User, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { drills, gradeAnswer, nextIndex } from "@/lib/drills";
import {
  CombinedMockState,
  defaultMockState,
  fetchServiceState,
  serviceUrls
} from "@/lib/mock-state";
import {
  emptyProgress,
  loadProgress,
  ProgressState,
  remember,
  saveProgress,
  toggleId
} from "@/lib/persistence";

type AnswerResult = "正解" | "不正解" | "未回答";

function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(emptyProgress);

  useEffect(() => {
    queueMicrotask(() => setProgress(loadProgress(window.localStorage)));
  }, []);

  function update(next: ProgressState) {
    setProgress(next);
    saveProgress(next, window.localStorage);
  }

  return [progress, update] as const;
}

export function DrillSwipeApp() {
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<AnswerResult>("未回答");
  const [progress, setProgress] = useProgress();
  const [mockState, setMockState] = useState<CombinedMockState>(defaultMockState);
  const [networkMessage, setNetworkMessage] = useState("mock service 未接続");
  const current = drills[index];

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 4500);
    Promise.all([
      fetchServiceState(serviceUrls.api, controller.signal),
      fetchServiceState(serviceUrls.media, controller.signal),
      fetchServiceState(serviceUrls.auth, controller.signal),
      fetchServiceState(serviceUrls.billing, controller.signal)
    ])
      .then(([api, media, auth, billing]) => {
        setMockState({ api, media, auth, billing });
        setNetworkMessage(api.mode === "timeout" ? "API応答がタイムアウトしています" : "online");
      })
      .catch(() => setNetworkMessage("offline: mock serviceに接続できません"))
      .finally(() => window.clearTimeout(timer));
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      setProgress({ ...progress, history: remember(progress.history, current.id) });
      setResult("未回答");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current.id]);

  const stats = useMemo(() => {
    const correctTotal = Object.values(progress.correct).reduce((sum, value) => sum + value, 0);
    return {
      correctTotal,
      savedTotal: progress.saved.length,
      reviewTotal: progress.review.length,
      watchedTotal: progress.history.length
    };
  }, [progress]);

  function move(direction: 1 | -1) {
    setIndex((value) => nextIndex(value, direction));
  }

  function answer(choice: string) {
    const ok = gradeAnswer(current, choice);
    setResult(ok ? "正解" : "不正解");
    if (ok) {
      setProgress({
        ...progress,
        correct: { ...progress.correct, [current.id]: (progress.correct[current.id] ?? 0) + 1 }
      });
    }
  }

  function toggleSaved() {
    setProgress({ ...progress, saved: toggleId(progress.saved, current.id) });
  }

  function toggleReview() {
    setProgress({ ...progress, review: toggleId(progress.review, current.id) });
  }

  function clearHistory() {
    setProgress({ ...progress, history: [] });
  }

  const isSaved = progress.saved.includes(current.id);
  const isReview = progress.review.includes(current.id);
  const mediaFailed = mockState.media.media === "failed";
  const billingFailed = mockState.billing.billing === "failed";
  const isPremium = mockState.auth.auth === "premium";

  return (
    <main className="shell">
      <aside className="rail" aria-label="ホーム">
        <div className="brand">
          <h1>DrillSwipe</h1>
          <span className="badge">短尺反復</span>
        </div>
        <div className="stack">
          <section>
            <div className="section-title">
              <h2>ホーム</h2>
              <span className="small">{current.topic}</span>
            </div>
            <p className="small">縦型カードで1問ずつ確認し、保存と復習キューで弱点だけを戻します。</p>
            <div
              className="progress"
              role="progressbar"
              aria-label="進捗"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.min(100, (stats.correctTotal / 5) * 100)}
            >
              <span style={{ width: `${Math.min(100, (stats.correctTotal / 5) * 100)}%` }} />
            </div>
          </section>

          <section>
            <div className="section-title">
              <h3>状態</h3>
              <Clock size={18} aria-hidden="true" />
            </div>
            <div className="status-list">
              <div className="status"><span>通信</span><strong>{networkMessage}</strong></div>
              <div className="status"><span>認証</span><strong>{isPremium ? "premium" : "anonymous"}</strong></div>
              <div className="status"><span>課金</span><strong>{billingFailed ? "failed" : "ok"}</strong></div>
              <div className="status"><span>メディア</span><strong>{mediaFailed ? "failure" : "ok"}</strong></div>
            </div>
          </section>

          {networkMessage.includes("offline") ? <p className="alert error">オフライン表示: ドリル本文は端末側の履歴で継続できます。</p> : null}
          {networkMessage.includes("タイムアウト") ? <p className="alert">タイムアウト表示: 解答は保存し、同期待ちにします。</p> : null}
          {!isPremium ? <p className="alert">匿名モード: 端末内にだけ学習記録を保存します。</p> : null}
          {billingFailed ? <p className="alert error">課金失敗: premium復習分析を一時停止しています。</p> : null}
        </div>
      </aside>

      <section className="feed" aria-label="ドリル詳細">
        <article className="drill-card">
          <div className={`video ${mediaFailed ? "video-failed" : ""}`}>
            <div className="play-symbol" aria-label="短尺動画プレースホルダー">▶</div>
            {mediaFailed ? <p className="alert error">動画プレースホルダーを読み込めません。字幕で続行できます。</p> : null}
            <div className="actions" aria-label="ドリル操作">
              <button className="icon-button" aria-label="保存" aria-pressed={isSaved} onClick={toggleSaved}>
                <Bookmark size={22} aria-hidden="true" />
              </button>
              <button className="icon-button" aria-label="復習キュー" aria-pressed={isReview} onClick={toggleReview}>
                <RotateCcw size={22} aria-hidden="true" />
              </button>
              <button className="icon-button" aria-label="プロフィール">
                <User size={22} aria-hidden="true" />
              </button>
            </div>
            <div className="overlay">
              <h2>{current.title}</h2>
              <p className="subtitle">{current.subtitle}</p>
            </div>
          </div>
          <div className="detail">
            <p><strong>問題:</strong> {current.prompt}</p>
            <div className="answer-row" aria-label="回答">
              {current.choices.map((choice) => (
                <button className="secondary" key={choice} onClick={() => answer(choice)}>
                  {choice}
                </button>
              ))}
            </div>
            <p aria-live="polite" data-testid="answer-result">
              判定: <strong>{result}</strong>
            </p>
            <div className="nav-row">
              <button className="secondary" onClick={() => move(-1)}>前のドリル</button>
              <button className="primary" onClick={() => move(1)}>次のドリル</button>
            </div>
          </div>
        </article>
      </section>

      <aside className="side" aria-label="プロフィールと履歴">
        <div className="stack">
          <section>
            <div className="section-title">
              <h2>プロフィール</h2>
              <span className="badge">{isPremium ? "premium" : "anonymous"}</span>
            </div>
            <div className="profile-grid">
              <div className="metric"><strong>{stats.correctTotal}</strong><span className="small">正解</span></div>
              <div className="metric"><strong>{stats.savedTotal}</strong><span className="small">保存</span></div>
              <div className="metric"><strong>{stats.reviewTotal}</strong><span className="small">復習</span></div>
            </div>
          </section>

          <section>
            <div className="section-title">
              <h3>復習キュー</h3>
              <RotateCcw size={18} aria-hidden="true" />
            </div>
            <ul className="list" data-testid="review-list">
              {progress.review.length === 0 ? <li className="small">復習キューは空です。</li> : null}
              {progress.review.map((id) => {
                const drill = drills.find((item) => item.id === id);
                return <li key={id}>{drill?.title ?? id}</li>;
              })}
            </ul>
          </section>

          <section>
            <div className="section-title">
              <h3>視聴履歴</h3>
              <History size={18} aria-hidden="true" />
            </div>
            <ul className="list" data-testid="history-list">
              {progress.history.length === 0 ? <li className="small">履歴はありません。</li> : null}
              {progress.history.map((id) => {
                const drill = drills.find((item) => item.id === id);
                return <li key={id}>{drill?.title ?? id}</li>;
              })}
            </ul>
            <div className="control-row" style={{ marginTop: 10 }}>
              <button className="danger" onClick={clearHistory}>履歴削除</button>
              <span className="badge"><Check size={14} aria-hidden="true" /> {stats.watchedTotal}</span>
              <span className="badge"><X size={14} aria-hidden="true" /> {result === "不正解" ? 1 : 0}</span>
            </div>
          </section>
        </div>
      </aside>
    </main>
  );
}
