"use client";

import supabaseClient from "@/database/supabase/supabase.js";
import { notifyUser, soundNotification } from "@/lib/notification";
import { Signal } from "@/lib/types";
import { useEffect, useState } from "react";

type PreferencesMap = Record<
  string,
  { notifications: boolean; volume: boolean }
>;

const useSignals = (preferences: PreferencesMap = {}) => {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabaseClient
        .from("all_signals")
        .select("*")
        .order("entry_time", { ascending: false });

      if (error) {
        console.error("Error fetching signals:", error);
        setError(error.message);
      } else if (data) {
        // Log raw data for debugging
        console.log("Raw signal data from DB:", data);

        // Filter only the latest entry for each instrument
        const latestSignals = Object.values(
          data.reduce<{ [key: string]: Signal }>((acc, row) => {
            // Validate required data fields are present
            if (!row.instrument_name) {
              console.warn(
                "Skipping signal with missing instrument_name:",
                row,
              );
              return acc;
            }

            if (
              !acc[row.instrument_name] ||
              new Date(row.entry_time) >
                new Date(acc[row.instrument_name].entry_time)
            ) {
              acc[row.instrument_name] = row;
            }
            return acc;
          }, {}),
        );

        console.log("Processed signals:", latestSignals);
        setSignals(latestSignals);
      }
    } catch (err) {
      console.error("Unexpected error in useSignals:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const subscription = supabaseClient
      .channel("all_signals_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "all_signals" },
        (payload) => {
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

          // Handle different types of changes
          if (
            payload.eventType === "INSERT" ||
            payload.eventType === "UPDATE"
          ) {
            setSignals((current) => {
              const updatedSignal = payload.new as Signal;
              const existingIndex = current.findIndex(
                (s) => s.id === updatedSignal.id,
              );

              if (existingIndex >= 0) {
                const updated = [...current];
                updated[existingIndex] = updatedSignal;
                return updated;
              } else {
                return [updatedSignal, ...current];
              }
            });
          } else if (payload.eventType === "DELETE") {
            setSignals((current) =>
              current.filter((s) => s.id !== payload.old.id),
            );
          }

          // Re-fetch the data
          fetchData();
        },
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(subscription);
    };
  }, [preferences]);

  return { signals, isLoading, error };
};

export default useSignals;
