"use client";

import supabaseClient from "@/database/supabase/supabase.js";
import { notifyUser, soundNotification } from "@/lib/notification";
import { Signal } from "@/lib/types";
import { useCallback, useEffect, useState, useMemo } from "react";

type PreferencesMap = Record<
  string,
  { notifications: boolean; volume: boolean }
>;

const useSignals = (
  preferences: PreferencesMap = {},
  allSignals: boolean = false,
) => {
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
      // Always fetch from all_signals table
      const query = supabaseClient
        .from("all_signals")
        .select("*")
        .order("entry_time", { ascending: false })
        // Limit overall fetch size for performance
        .limit(allSignals ? 100 : 1000);

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching signals:", error);
        setError(error.message);
      } else if (data) {
        // Derive final signals list
        let finalSignals: Signal[] = data;
        if (!allSignals) {
          // Pick latest per instrument
          const map = new Map<string, Signal>();
          for (const sig of data) {
            if (!map.has(sig.instrument_name)) {
              map.set(sig.instrument_name, sig);
            }
          }
          finalSignals = Array.from(map.values());
        }
        setSignals(finalSignals);
      }
    } catch (err) {
      console.error("Unexpected error in useSignals:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [lastFetch, allSignals]);

  // Handle real-time updates more efficiently
  const handleRealtimeUpdate = useCallback(
    async (payload: any) => {
      // If this update only changes the stop or target, handle silently
      if (
        payload.eventType === "UPDATE" &&
        (payload.old.take_profit_price !== payload.new.take_profit_price ||
          payload.old.stop_loss_price !== payload.new.stop_loss_price)
      ) {
        const updatedSignal = payload.new as Signal;
        // Update only the changed signal in place
        setSignals((current) =>
          current.map((s) =>
            s.client_trade_id === updatedSignal.client_trade_id
              ? updatedSignal
              : s,
          ),
        );
        // Do not refetch entire list to preserve the other cards' state
        return;
      }

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

        // When showing all signals, just append new ones
        if (allSignals) {
          if (payload.eventType === "INSERT") {
            return [updatedSignal, ...current];
          } else if (payload.eventType === "UPDATE") {
            return current.map((signal) =>
              signal.client_trade_id === updatedSignal.client_trade_id
                ? updatedSignal
                : signal,
            );
          } else if (payload.eventType === "DELETE") {
            return current.filter(
              (s) => s.client_trade_id !== payload.old.client_trade_id,
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
          } else if (payload.eventType === "DELETE") {
            return current.filter(
              (s) => s.client_trade_id !== payload.old.client_trade_id,
            );
          }
        }

        return current;
      });
    },
    [preferences, allSignals],
  );

  useEffect(() => {
    fetchData();

    // Subscribe to real-time events on the base all_signals table
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
