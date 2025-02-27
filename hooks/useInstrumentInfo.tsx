"use client";

import supabaseClient from "@/database/supabase/supabase";
import { InstrumentInfo } from "@/lib/types";
import { useState, useEffect } from "react";

const useInstrumentInfo = (instrumentName: string) => {
  const [instrumentInfo, setInstrumentInfo] = useState<InstrumentInfo | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabaseClient
          .from("instruments_info")
          .select("*")
          .eq("instrument_name", instrumentName);

        if (error) {
          throw error;
        }

        if (data) {
          setInstrumentInfo(data[0] || {});
        }
      } catch (err) {
        console.error("Error fetching instrument info:", err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [instrumentName]); // Only re-run if instrumentName changes

  return { instrumentInfo, loading, error };
};

export default useInstrumentInfo;
