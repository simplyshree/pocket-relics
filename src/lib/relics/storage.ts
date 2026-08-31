import { useCallback, useEffect, useState } from "react";
import type { Relic } from "./types";

/**
 * Local-first persistence. Everything lives in one JSON blob so a future
 * Lovable Cloud sync can push/pull the same shape per account.
 */

export type DisplayMode = "cabinet" | "scrapbook" | "wall" | "desk" | "board";

export interface RelicState {
  relics: Relic[];
  streak: number;
  lastPlayedDay: string | null;
  dailyDoneDay: string | null;
  soundOn: boolean;
  display: DisplayMode;
  secretsFound: number;
}

const KEY = "pocket-relics:v1";

const EMPTY: RelicState = {
  relics: [],
  streak: 0,
  lastPlayedDay: null,
  dailyDoneDay: null,
  soundOn: true,
  display: "cabinet",
  secretsFound: 0,
};

export const todayKey = () => new Date().toISOString().slice(0, 10);

const dayDiff = (a: string, b: string) =>
  Math.round((Date.parse(b) - Date.parse(a)) / 86400000);

function read(): RelicState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    return { ...EMPTY, ...(JSON.parse(raw) as Partial<RelicState>) };
  } catch {
    return EMPTY;
  }
}

let state: RelicState = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function commit(next: RelicState) {
  state = next;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* quota — ignore */
    }
  }
  emit();
}

export function useRelicState() {
  const [snap, setSnap] = useState<RelicState>(state);
  const [ready, setReady] = useState(hydrated);

  useEffect(() => {
    if (!hydrated) {
      state = read();
      hydrated = true;
    }
    setSnap(state);
    setReady(true);
    const l = () => setSnap(state);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);

  const addRelic = useCallback((relic: Relic) => {
    const today = todayKey();
    const last = state.lastPlayedDay;
    let streak = state.streak;
    if (last !== today) {
      const gap = last ? dayDiff(last, today) : 99;
      streak = gap === 1 ? streak + 1 : 1;
    }
    commit({
      ...state,
      relics: [{ ...relic, number: state.relics.length + 1 }, ...state.relics],
      streak,
      lastPlayedDay: today,
      secretsFound: state.secretsFound + (relic.secret ? 1 : 0),
    });
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    commit({
      ...state,
      relics: state.relics.map((r) =>
        r.id === id ? { ...r, favorite: !r.favorite } : r,
      ),
    });
  }, []);

  const markDailyDone = useCallback(() => {
    commit({ ...state, dailyDoneDay: todayKey() });
  }, []);

  const setSound = useCallback((on: boolean) => {
    commit({ ...state, soundOn: on });
  }, []);

  const setDisplay = useCallback((display: DisplayMode) => {
    commit({ ...state, display });
  }, []);

  return {
    ...snap,
    ready,
    addRelic,
    toggleFavorite,
    markDailyDone,
    setSound,
    setDisplay,
  };
}

export function getRelicCount() {
  return state.relics.length;
}
