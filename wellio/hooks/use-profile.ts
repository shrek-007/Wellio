import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

import type { Profile } from "@/constants/profile";

const STORAGE_KEY = "wellio.profile";

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setProfile(JSON.parse(raw) as Profile);
      })
      .finally(() => setLoading(false));
  }, []);

  const save = useCallback(async (p: Profile) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    setProfile(p);
  }, []);

  const clear = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setProfile(null);
  }, []);

  return { profile, loading, save, clear };
}
