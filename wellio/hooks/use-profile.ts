import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

import type { Profile } from "@/constants/profile";

const STORAGE_KEY = "wellio.profile";

let currentProfile: Profile | null = null;
let hydrated = false;
const listeners = new Set<(p: Profile | null) => void>();

function emit() {
  for (const l of listeners) l(currentProfile);
}

const hydrate = AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
  if (raw) currentProfile = JSON.parse(raw) as Profile;
  hydrated = true;
  emit();
});

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(currentProfile);
  const [loading, setLoading] = useState(!hydrated);

  useEffect(() => {
    const listener = (p: Profile | null) => setProfile(p);
    listeners.add(listener);
    if (!hydrated) {
      hydrate.finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const save = useCallback(async (p: Profile) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    currentProfile = p;
    emit();
  }, []);

  const clear = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    currentProfile = null;
    emit();
  }, []);

  return { profile, loading, save, clear };
}
