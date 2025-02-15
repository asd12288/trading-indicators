"use client";

import { useEffect, useState } from "react";
import supabaseClient from "@/database/supabase/supabase.js";

const useInstrumentData = (instrumentName) => {
  const [instrumentData, setInstrumentData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInstrumentData = async () => {
    if (!instrumentName) return;

    setIsLoading(true);

    const { data, error } = await supabaseClient
      .from("all_signals")
      .select("*")
      .eq("instrument_name", instrumentName) // Filter by instrument name
      .order("entry_time", { ascending: false }); // Order by latest entry

    if (error) {
      console.error("Error fetching instrument data:", error);
    } else {
      setInstrumentData(data);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchInstrumentData();

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
        (payload) => {
          console.log("Instrument data updated:", payload);
          fetchInstrumentData(); // Refetch data on changes
        },
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(subscription);
    };
  }, [instrumentName]);

  return { instrumentData, isLoading };
};

export default useInstrumentData;
