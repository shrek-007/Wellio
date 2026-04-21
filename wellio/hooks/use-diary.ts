import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

import { DayDiary, FoodEntry, emptyDiary } from "@/constants/diary";

const KEY_PREFIX = "wellio.diary.";

const cache = new Map<string, DayDiary>();
const listeners = new Map<string, Set<(d: DayDiary) => void>>();

function emit(date: string) {
  const set = listeners.get(date);
  if (!set) return;
  const d = cache.get(date) ?? emptyDiary(date);
  for (const l of set) l(d);
}

export async function loadDiary(date: string): Promise<DayDiary> {
  if (cache.has(date)) return cache.get(date)!;
  const raw = await AsyncStorage.getItem(KEY_PREFIX + date);
  const diary: DayDiary = raw ? JSON.parse(raw) : emptyDiary(date);
  cache.set(date, diary);
  return diary;
}

async function persist(diary: DayDiary) {
  cache.set(diary.date, diary);
  await AsyncStorage.setItem(KEY_PREFIX + diary.date, JSON.stringify(diary));
  emit(diary.date);
}

export function useDiary(date: string) {
  const [diary, setDiary] = useState<DayDiary>(
    () => cache.get(date) ?? emptyDiary(date),
  );
  const [loading, setLoading] = useState(!cache.has(date));

  useEffect(() => {
    let cancelled = false;
    const listener = (d: DayDiary) => setDiary(d);
    let set = listeners.get(date);
    if (!set) {
      set = new Set();
      listeners.set(date, set);
    }
    set.add(listener);

    loadDiary(date).then((d) => {
      if (cancelled) return;
      setDiary(d);
      setLoading(false);
    });

    return () => {
      cancelled = true;
      set?.delete(listener);
    };
  }, [date]);

  const addEntry = useCallback(
    async (entry: Omit<FoodEntry, "id">) => {
      const current = cache.get(date) ?? (await loadDiary(date));
      const next: DayDiary = {
        ...current,
        entries: [
          ...current.entries,
          { ...entry, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}` },
        ],
      };
      await persist(next);
    },
    [date],
  );

  const removeEntry = useCallback(
    async (id: string) => {
      const current = cache.get(date) ?? (await loadDiary(date));
      await persist({ ...current, entries: current.entries.filter((e) => e.id !== id) });
    },
    [date],
  );

  const setWater = useCallback(
    async (n: number) => {
      const current = cache.get(date) ?? (await loadDiary(date));
      await persist({ ...current, water: n });
    },
    [date],
  );

  return { diary, loading, addEntry, removeEntry, setWater };
}
