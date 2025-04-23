"use client";

import supabaseClient from "@/database/supabase/supabase.js";
import { Signal } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";

interface RealtimePayload {
  eventType: "INSERT" | "UPDATE" | "DELETE";
  new: Signal & Record<string, unknown>;
  old?: Signal & Record<string, unknown>;
}

const useSignals = (allSignals: boolean = false) => {
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
      // Always fetch from latest_signals_per_instrument table
      const query = supabaseClient
        .from("latest_signals_per_instrument")
        .select("*")
        .order("entry_time", { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching signals:", error);
        setError(error.message);
      } else if (data) {
        setSignals(data as Signal[]);
      }
    } catch (err: unknown) {
      console.error("Unexpected error in useSignals:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [lastFetch]);

  // Handle real-time updates
  const handleRealtimeUpdate = useCallback(
    (payload: RealtimePayload) => {
      const updatedSignal = payload.new;

      // Update signals state based on the event type
      setSignals((current) => {
        // When showing all signals, just append new ones
        if (allSignals) {
          if (payload.eventType === "INSERT") {
            return [updatedSignal, ...current];
          } else if (payload.eventType === "UPDATE") {
            console.log("Updating signal:", updatedSignal);
            return current.map((signal) =>
              signal.client_trade_id === updatedSignal.client_trade_id
                ? updatedSignal
                : signal,
            );
          } else if (payload.eventType === "DELETE" && payload.old) {
            return current.filter(
              (s) => s.client_trade_id !== payload.old?.client_trade_id,
            );
          }
        } else {
          // Original behavior for latest signals per instrument
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
          } else if (payload.eventType === "DELETE" && payload.old) {
            return current.filter(
              (s) => s.client_trade_id !== payload.old?.client_trade_id,
            );
          }
        }

        return current;
      });
    },
    [allSignals],
  );

  useEffect(() => {
    // Initial data fetch
    fetchData();

    // Subscribe to real-time events on the latest_signals_per_instrument table
    const subscription = supabaseClient
      .channel("latest_signals_per_instrument_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "latest_signals_per_instrument",
        },
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
