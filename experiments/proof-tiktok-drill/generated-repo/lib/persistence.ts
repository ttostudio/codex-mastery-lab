export type ProgressState = {
  correct: Record<string, number>;
  saved: string[];
  review: string[];
  history: string[];
};

export const emptyProgress: ProgressState = {
  correct: {},
  saved: [],
  review: [],
  history: []
};

const key = "drillswipe-progress-v1";

export function loadProgress(storage?: Storage): ProgressState {
  if (!storage) return emptyProgress;
  const raw = storage.getItem(key);
  if (!raw) return emptyProgress;
  try {
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return {
      correct: parsed.correct ?? {},
      saved: parsed.saved ?? [],
      review: parsed.review ?? [],
      history: parsed.history ?? []
    };
  } catch {
    return emptyProgress;
  }
}

export function saveProgress(progress: ProgressState, storage?: Storage) {
  storage?.setItem(key, JSON.stringify(progress));
}

export function toggleId(list: string[], id: string) {
  return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
}

export function remember(history: string[], id: string) {
  return [id, ...history.filter((item) => item !== id)].slice(0, 12);
}
