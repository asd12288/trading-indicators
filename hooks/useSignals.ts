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

  const fetchData = async () => {
    const { data, error } = await supabaseClient
      .from("all_signals")
      .select("*, entry_time")
      .order("entry_time", { ascending: false });

    if (error) {
      console.error("Error fetching signals:", error);
    } else if (data) {
      // Filter only the latest entry for each instrument
      const latestSignals = Object.values(
        data.reduce<{ [key: string]: Signal }>((acc, row) => {
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
      setSignals(latestSignals);
    }
    setIsLoading(false);
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
          const instrumentName = (payload.new as { instrument_name: string }).instrument_name;
          const userPrefs = preferences[instrumentName] || {};

          if (userPrefs.notifications) {
            notifyUser(payload);
          }

          if (userPrefs.volume) {
            soundNotification(payload);
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

  return { signals, isLoading };
};

export default useSignals;
