"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/database/supabase/client";
import { toast } from "sonner";

// Define the structure of preference values for each instrument
export interface PreferenceValues {
  notifications: boolean;
  volume: boolean;
  favorite: boolean;
}

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

  // New method to update global sound preference
  updateGlobalMute: (muted: boolean) => Promise<void>;

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
  const supabase = createClient();

  // Load user preferences from Supabase
  useEffect(() => {
    async function loadUserPreferences() {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("preferences")
          .eq("id", userId)
          .single();

        if (profileError) {
          throw profileError;
        }

        // If preferences exist in the profile, use them
        if (profile?.preferences) {
          setPreferences(profile.preferences);
        } else {
          // Initialize with empty preferences if none exist
          setPreferences({});
        }
      } catch (err) {
        console.error("Error loading preferences:", err);
        setError("Failed to load user preferences");
      } finally {
        setIsLoading(false);
      }
    }

    loadUserPreferences();
  }, [userId, supabase]);

  // Update a specific preference
  const updatePreference = async (
    signalId: string,
    updatedValues: Partial<PreferenceValues>,
  ) => {
    if (!userId) {
      toast.error("You must be logged in to update preferences");
      return;
    }

    try {
      // Optimistic update
      const currentPrefs = preferences[signalId] || {
        notifications: false,
        volume: false,
        favorite: false,
      };

      const updatedPrefs = {
        ...currentPrefs,
        ...updatedValues,
      };

      // Update local state optimistically
      setPreferences((prev) => ({
        ...prev,
        [signalId]: updatedPrefs,
      }));

      // Update in database
      const newPreferences = {
        ...preferences,
        [signalId]: updatedPrefs,
      };

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ preferences: newPreferences })
        .eq("id", userId);

      if (updateError) {
        throw updateError;
      }
    } catch (err) {
      console.error("Error updating preference:", err);
      // Revert optimistic update on error
      setError("Failed to update preference");
      toast.error("Failed to update preference");
      // Load the current state from database to revert changes
      const { data } = await supabase
        .from("profiles")
        .select("preferences")
        .eq("id", userId)
        .single();
      
      if (data?.preferences) {
        setPreferences(data.preferences);
      }
    }
  };

  // Update global mute setting
  const updateGlobalMute = async (muted: boolean): Promise<void> => {
    if (!userId) {
      toast.error("You must be logged in to update preferences");
      return;
    }

    try {
      // Get current system preferences or initialize empty object
      const currentSystemPrefs = preferences[SYSTEM_PREFS_KEY] || {};
      
      // Update with new muted value
      const newSystemPrefs = {
        ...currentSystemPrefs,
        globalMute: muted,
      };

      // Optimistically update local state
      setPreferences((prev) => ({
        ...prev,
        [SYSTEM_PREFS_KEY]: newSystemPrefs,
      }));

      // Update in database
      const newPreferences = {
        ...preferences,
        [SYSTEM_PREFS_KEY]: newSystemPrefs,
      };

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ preferences: newPreferences })
        .eq("id", userId);

      if (updateError) {
        throw updateError;
      }
    } catch (err) {
      console.error("Error updating global mute:", err);
      setError("Failed to update global mute setting");
      toast.error("Failed to update sound preference");
    }
  };

  // Derived global mute state
  const globalMute = preferences[SYSTEM_PREFS_KEY]?.globalMute || false;

  // Derived arrays for favorite and notification status
  const favorites = Object.entries(preferences)
    .filter(
      ([key, value]) => key !== SYSTEM_PREFS_KEY && value.favorite === true
    )
    .map(([key]) => key);

  const volumeOn = Object.entries(preferences)
    .filter(([key, value]) => key !== SYSTEM_PREFS_KEY && value.volume === true)
    .map(([key]) => key);

  const notificationsOn = Object.entries(preferences)
    .filter(
      ([key, value]) => key !== SYSTEM_PREFS_KEY && value.notifications === true
    )
    .map(([key]) => key);

  return {
    preferences,
    isLoading,
    error,
    updatePreference,
    updateGlobalMute,
    globalMute,
    favorites,
    volumeOn,
    notificationsOn,
  };
}

export default usePreferences;
