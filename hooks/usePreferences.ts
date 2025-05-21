"use client";

import { useState, useEffect, useMemo } from "react";
import supabaseClient from "@/database/supabase/client";
import { PreferenceValues } from "@/lib/types";

// The shape of your entire preferences object: { [instrumentId]: PreferenceValues }
type PreferencesMap = Record<string, PreferenceValues>;

// Add system level preferences with a special key
const SYSTEM_PREFS_KEY = "_system";

interface UsePreferencesReturn {
  preferences: PreferencesMap;
  isLoading: boolean;
  error: string | null;
  updatePreference: (
    signalId: string,
    updatedValues: Partial<PreferenceValues>,
  ) => Promise<void>;

  // Global sound state
  globalMute: boolean;

  // Derived arrays
  favorites: string[];
  volumeOn: string[];
  notificationsOn: string[];
}

// Updated to safely handle empty/null userId
function usePreferences(userId?: string): UsePreferencesReturn {
  const [preferences, setPreferences] = useState<PreferencesMap>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [globalMute, setGlobalMute] = useState(false);

  useEffect(() => {
    // Skip fetching if no userId is provided
    if (!userId) {
      setIsLoading(false);
      return;
    }

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
        const prefs = data?.preferences ?? {};
        setPreferences(prefs);

        // Initialize global mute state from preferences
        if (prefs[SYSTEM_PREFS_KEY]) {
          setGlobalMute(!!prefs[SYSTEM_PREFS_KEY].globalMute);
        }
      } catch (err: any) {
        console.error("Error fetching preferences:", err);
        setError(err.message || "An error occurred while loading preferences.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreferences();
  }, [userId]);

  // Fixed updatePreference to properly return a Promise<void>
  const updatePreference = async (
    signalId: string,
    updatedValues: Partial<PreferenceValues>,
  ): Promise<void> => {
    // If no userId, can't update preferences
    if (!userId) {
      console.error("Cannot update preferences: No user ID provided");
      return Promise.reject(
        new Error("User ID is required to update preferences"),
      );
    }

    try {
      // Get the current signal preference or use defaults
      const currentPreference = preferences[signalId] || {
        notifications: false,
        volume: false,
        favorite: false,
      };

      // Create a new preferences object with the updated values
      const updatedPreferences = {
        ...preferences,
        [signalId]: {
          ...currentPreference,
          ...updatedValues,
        },
      };

      // Update local state first for immediate UI feedback
      setPreferences(updatedPreferences);

      // Update the database
      const { error } = await supabaseClient
        .from("profiles")
        .update({ preferences: updatedPreferences })
        .eq("id", userId);

      if (error) {
        // Revert local state if database update fails
        setPreferences(preferences);
        throw error;
      }


      // Don't return anything (void)
    } catch (error: any) {
      console.error("Error updating preferences:", error);
      // Show error toast

      throw error;
    }
  };

  // --- Derived arrays ---
  // 1. favorites: instruments where "favorite" is true
  const favorites = useMemo(() => {
    return Object.entries(preferences)
      .filter(([key, prefs]) => key !== SYSTEM_PREFS_KEY && prefs.favorite)
      .map(([instrument]) => instrument);
  }, [preferences]);

  // 2. volumeOn: instruments where "volume" is true
  const volumeOn = useMemo(() => {
    return Object.entries(preferences)
      .filter(([key, prefs]) => key !== SYSTEM_PREFS_KEY && prefs.volume)
      .map(([instrument]) => instrument);
  }, [preferences]);

  // 3. notificationsOn: instruments where "notifications" is true
  const notificationsOn = useMemo(() => {
    return Object.entries(preferences)
      .filter(([key, prefs]) => key !== SYSTEM_PREFS_KEY && prefs.notifications)
      .map(([instrument]) => instrument);
  }, [preferences]);

  return {
    preferences,
    isLoading,
    error,
    updatePreference,
    globalMute,
    favorites,
    volumeOn,
    notificationsOn,
  };
}

export default usePreferences;
