"use client";

import supabaseClient from "@/database/supabase/supabase.js";
import { Signal } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";
import { useUser } from "@/providers/UserProvider";
import { toast } from "@/hooks/use-toast";
import NotificationService from "@/lib/notification-service";

type PreferencesMap = Record<
  string,
  { notifications: boolean; volume: boolean }
>;

interface RealtimePayload {
  eventType: "INSERT" | "UPDATE" | "DELETE";
  new: Signal & Record<string, unknown>;
  old?: Signal & Record<string, unknown>;
}

const useSignals = (
  preferences: PreferencesMap = {},
  allSignals: boolean = false,
) => {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<number>(0);
  // Use the user context to get current user ID
  const { user } = useUser();

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
    } catch (err: unknown) {
      console.error("Unexpected error in useSignals:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [lastFetch, allSignals]);

  // Handle notifications for signal events based on user preferences
  const handleSignalNotification = useCallback(
    async (signal: Signal, eventType: "new" | "completed" | "updated") => {
      // Only send notifications if we have a user and the signal's instrument is in preferences
      if (!user || !preferences || !signal.instrument_name) return;

      // Check if this user has enabled notifications for this instrument
      const instrumentPrefs = preferences[signal.instrument_name];
      if (!instrumentPrefs?.notifications) return;

      const isBuy = ["BUY", "LONG", "Buy", "Long"].includes(signal.direction || "");
      const instrumentName = signal.instrument_name;

      // Different notification types based on event type
      switch (eventType) {
        case "new":
          // Show an immediate toast notification
          toast({
            title: `New ${isBuy ? "Buy" : "Sell"} Signal`,
            description: `${instrumentName} signal started at ${signal.entry_price}`,
            variant: "default",
            icon: isBuy ? "arrow-up-right" : "arrow-down-right"
          });

          // Also create a persistent notification in the database
          if (user.id) {
            await NotificationService.notifyNewSignal(
              user.id,
              instrumentName,
              isBuy ? "Buy" : "Sell"
            );
          }
          break;

        case "completed":
          if (!signal.exit_price || !signal.entry_price) return;

          // Calculate P&L
          let profitLoss = 0;

          // Calculate P&L based on the direction of the trade
          if (isBuy) {
            profitLoss = signal.exit_price - signal.entry_price;
          } else {
            profitLoss = signal.entry_price - signal.exit_price;
          }

          const isProfit = profitLoss > 0;
          const plDisplay = Math.abs(profitLoss).toFixed(2);

          // Show toast notification
          toast({
            title: `Signal Completed`,
            description: `${instrumentName} ${isBuy ? "Buy" : "Sell"} signal ended at ${signal.exit_price} (${isProfit ? "+" : "-"}${plDisplay})`,
            variant: isProfit ? "success" : "default",
            icon: isProfit ? "arrow-up-right" : "arrow-down-right"
          });

          // Create persistent notification
          if (user.id) {
            await NotificationService.notifySignalCompleted(
              user.id,
              instrumentName,
              profitLoss
            );
          }
          break;

        case "updated":
          // This could be used for target/stop changes or other updates
          // Currently not implemented, but ready for future expansion
          break;
      }
    },
    [user, preferences, toast]
  );

  // Handle real-time updates more efficiently
  const handleRealtimeUpdate = useCallback(
    async (payload: RealtimePayload) => {
      const updatedSignal = payload.new;

      // Check for notification triggers
      if (payload.eventType === "INSERT" && user) {
        // New signal started
        handleSignalNotification(updatedSignal, "new");
      } else if (payload.eventType === "UPDATE" && user) {
        const oldSignal = payload.old;

        // Signal completed (has exit_time now but didn't before)
        if (updatedSignal.exit_time && oldSignal && !oldSignal.exit_time) {
          handleSignalNotification(updatedSignal, "completed");
        }

        // Target/stop changes could be added here
        // if (updatedSignal.take_profit !== oldSignal.take_profit || 
        //     updatedSignal.stop_loss !== oldSignal.stop_loss) {
        //   handleSignalNotification(updatedSignal, "updated");
        // }
      }

      // Update signals state based on the event type
      setSignals((current) => {
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
    [allSignals, user, handleSignalNotification]
  );

  useEffect(() => {
    fetchData();

    // Subscribe to real-time events on the base all_signals table
    const subscription = supabaseClient
      .channel("all_signals_changes")
      .on(
        "postgres_changes" as any,
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
