"use client";

import { useEffect, useState } from "react";
import supabaseClient from "@/database/supabase/supabase.js";

const useInstrumentData = (instrumentName) => {
  const [instrumentData, setInstrumentData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInstrumentData = async () => {
    // Early exit with error if instrumentName is missing
    if (!instrumentName) {
      setError("Missing instrument name");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabaseClient
        .from("all_signals")
        .select("*")
        .eq("instrument_name", instrumentName)
        .order("entry_time", { ascending: false });

      if (error) throw error;

      // Set data even if empty array
      setInstrumentData(data || []);
    } catch (err) {
      console.error("Error fetching instrument data:", err);
      setError(err.message || "Failed to fetch instrument data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Reset state when instrument changes
    setInstrumentData([]);
    setIsLoading(true);
    setError(null);

    fetchInstrumentData();

    // Only set up real-time subscription if we have a valid instrument name
    if (!instrumentName) return;

    const subscription = supabaseClient
      .channel(`instrument_data_${instrumentName}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "all_signals",
          filter: `instrument_name=eq.${instrumentName}`,
        },
        () => {
          // Debounce the refetch to prevent multiple rapid refreshes
          fetchInstrumentData();
        },
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(subscription);
    };
  }, [instrumentName]);

  return { instrumentData, isLoading, error };
};

export default useInstrumentData;
