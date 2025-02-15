"use client";

import { useEffect, useState } from "react";
import supabaseClient from "@/database/supabase/supabase.js";

const useSignals = () => {
  const [signals, setSignals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
        data.reduce((acc, row) => {
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
          console.log("Change received!", payload);
          fetchData(); // Refetch data on change
        },
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(subscription);
    };
  }, []);

  return { signals, isLoading };
};

export default useSignals;
