"use client";

import supabaseClient from "@/database/supabase/supabase.js";
import { notifyUser, soundNotification } from "@/lib/notification";
import { Signal } from "@/lib/types";
import { useCallback, useEffect, useState, useMemo } from "react";

type PreferencesMap = Record<
  string,
  { notifications: boolean; volume: boolean }
>;

const useSignals = (preferences: PreferencesMap = {}) => {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<number>(0);

  // Use memoized fetch function to prevent unnecessary re-creation
  const fetchData = useCallback(async () => {
    // Throttle fetches to prevent excessive database calls
    const now = Date.now();
    if (now - lastFetch < 2000) return; // Only fetch if last fetch was > 2 seconds ago

    setLastFetch(now);
    setIsLoading(true);
    try {
      // Optimize the query by getting the server to do more work
      // This uses a custom PostgreSQL view/function that returns only the latest signal per instrument
      const { data, error } = await supabaseClient
        .from("latest_signals_per_instrument") // Assuming this view exists or can be created
        .select("*")
        .order("entry_time", { ascending: false });

      if (error) {
        console.error("Error fetching signals:", error);
        setError(error.message);
      } else if (data) {
        // Remove debug logs in production
        if (process.env.NODE_ENV !== "production") {
          console.log("Processed signals:", data);
        }
        setSignals(data);
      }
    } catch (err) {
      console.error("Unexpected error in useSignals:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [lastFetch]);

  // Handle real-time updates more efficiently
  const handleRealtimeUpdate = useCallback(
    (payload: any) => {
      // Check if user has notifications or volume turned on for this instrument
      const instrumentName = (payload.new as { instrument_name: string })
        .instrument_name;
      const userPrefs = preferences[instrumentName] || {};

      if (userPrefs.notifications) {
        notifyUser(payload);
      }

      if (userPrefs.volume) {
        soundNotification(payload);
      }

      // Optimize how we update signals
      setSignals((current) => {
        const updatedSignal = payload.new as Signal;

        console.log(updatedSignal);

        // Using immutable update patterns for better performance
        if (payload.eventType === "INSERT") {
          return [
            updatedSignal,
            ...current.filter(
              (s) => s.instrument_name !== updatedSignal.instrument_name,
            ),
          ];
        } else if (payload.eventType === "UPDATE") {
          return current.map((signal) =>
            signal.instrument_name === updatedSignal.instrument_name
              ? updatedSignal
              : signal,
          );
        } else if (payload.eventType === "DELETE") {
          return current.filter((s) => s.id !== payload.old.id);
        }

        return current;
      });
    },
    [preferences],
  );

  useEffect(() => {
    fetchData();

    const subscription = supabaseClient
      .channel("all_signals_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "all_signals" },
        handleRealtimeUpdate,
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(subscription);
    };
  }, [fetchData, handleRealtimeUpdate]);

  return { signals, isLoading, error, refetch: fetchData };
};

export default useSignals;
