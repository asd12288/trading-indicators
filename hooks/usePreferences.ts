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

// Updated to safely handle empty/null userId
function usePreferences(userId?: string): UsePreferencesReturn {
  const [preferences, setPreferences] = useState<PreferencesMap>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Fixed updatePreference to properly return a Promise<void>
  const updatePreference = async (
    signalId: string,
    updatedValues: Partial<PreferenceValues>,
  ): Promise<void> => {
    // If no userId, can't update preferences
    if (!userId) {
      console.error("Cannot update preferences: No user ID provided");
      toast({
        title: "Error",
        description: "Cannot update preferences: User not logged in",
        variant: "destructive",
      });
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

      // Debug toast to verify function is being called
      console.log("Preference updated:", signalId, updatedValues);

      // Don't return anything (void)
    } catch (error: any) {
      console.error("Error updating preferences:", error);
      // Show error toast
      toast({
        title: "Error updating preference",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      throw error;
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
