"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "@/hooks/use-toast";
import supabaseClient from "@/database/supabase/supabase";
import { PreferenceValues } from "@/lib/types";

// The shape of your entire preferences object: { [instrumentId]: PreferenceValues }
type PreferencesMap = Record<string, PreferenceValues>;

interface UsePreferencesReturn {
  preferences: PreferencesMap;
  isLoading: boolean;
  error: string | null;
  updatePreference: (
    signalId: string,
    updatedValues: Partial<PreferenceValues>,
  ) => Promise<void>;

  // Derived arrays
  favorites: string[];
  volumeOn: string[];
  notificationsOn: string[];
}

function usePreferences(userId: string): UsePreferencesReturn {
  const [preferences, setPreferences] = useState<PreferencesMap>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchPreferences = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data, error } = await supabaseClient
          .from("profiles")
          .select("preferences")
          .eq("id", userId)
          .single();

        if (error) throw error;
        setPreferences(data?.preferences ?? {});
      } catch (err: any) {
        console.error("Error fetching preferences:", err);
        setError(err.message || "An error occurred while loading preferences.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreferences();
  }, [userId]);

  const updatePreference = async (
    signalId: string,
    updatedValues: Partial<PreferenceValues>,
  ) => {
    try {
      const oldPreferences = structuredClone(preferences);

      // Optimistic update
      setPreferences((prev) => {
        const existingSignalPrefs = prev[signalId] || {
          notifications: true,
          volume: true,
          favorite: false,
        };
        return {
          ...prev,
          [signalId]: { ...existingSignalPrefs, ...updatedValues },
        };
      });

      // Build the new, merged preferences object
      const newPreferences = {
        ...preferences,
        [signalId]: {
          ...(preferences[signalId] ?? {
            notifications: true,
            volume: true,
            favorite: false,
          }),
          ...updatedValues,
        },
      };

      // Persist to the DB
      const { error: updateError } = await supabaseClient
        .from("profiles")
        .update({ preferences: newPreferences })
        .eq("id", userId);

      if (updateError) {
        console.error("Error updating preferences in Supabase:", updateError);
        // revert local changes
        setPreferences(oldPreferences);
        toast({
          title: "Error",
          description: "Failed to update preferences. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error updating preferences:", err);
      toast({
        title: "Error",
        description: "Failed to update preferences. Please try again.",
        variant: "destructive",
      });
    }
  };

  // --- Derived arrays ---
  // 1. favorites: instruments where "favorite" is true
  const favorites = useMemo(() => {
    return Object.entries(preferences)
      .filter(([_, prefs]) => prefs.favorite)
      .map(([instrument]) => instrument);
  }, [preferences]);

  // 2. volumeOn: instruments where "volume" is true
  const volumeOn = useMemo(() => {
    return Object.entries(preferences)
      .filter(([_, prefs]) => prefs.volume)
      .map(([instrument]) => instrument);
  }, [preferences]);

  // 3. notificationsOn: instruments where "notifications" is true
  const notificationsOn = useMemo(() => {
    return Object.entries(preferences)
      .filter(([_, prefs]) => prefs.notifications)
      .map(([instrument]) => instrument);
  }, [preferences]);

  return {
    preferences,
    isLoading,
    error,
    updatePreference,
    favorites,
    volumeOn,
    notificationsOn,
  };
}

export default usePreferences;
