"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import useSWR from "swr";
import supabaseClient from "@/database/supabase/supabase.js";

// Type for the API response
interface LastPriceData {
  last: number;
  timestamp: string;
  instrument_name: string;
  source?: string;
}

// Fetch function for SWR
const fetcher = async (url: string): Promise<LastPriceData> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
};

export default function useLast(instrumentName: string) {
  // Use SWR for data fetching with caching and revalidation
  const { data, error, isLoading, mutate } = useSWR<LastPriceData>(
    instrumentName
      ? `/api/instrument-price?instrument=${instrumentName}`
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 2000,
    },
  );

  // Subscribe to real-time price updates via Supabase
  useEffect(() => {
    if (!instrumentName) return;
    const channel = supabaseClient
      .channel(`price-channel-${instrumentName}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "instrument_price",
          filter: `instrument_name=eq.${instrumentName}`,
        },
        (payload) => {
          const newData = payload.new as LastPriceData;
          mutate(newData, false);
        },
      )
      .subscribe();
    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [instrumentName, mutate]);

  // Keep track of the last value for UI transition purposes
  const prevPriceRef = useRef<number | null>(null);
  const [direction, setDirection] = useState<"up" | "down" | "neutral">(
    "neutral",
  );

  // Update direction when price changes
  useEffect(() => {
    if (data?.last && prevPriceRef.current !== null) {
      if (data.last > prevPriceRef.current) {
        setDirection("up");
      } else if (data.last < prevPriceRef.current) {
        setDirection("down");
      }
    }

    if (data?.last) {
      prevPriceRef.current = data.last;
    }
  }, [data?.last]);

  // Function to manually refresh data
  const refreshNow = useCallback(() => {
    return mutate();
  }, [mutate]);

  // Function to force refresh by purging the cache
  const forceRefresh = useCallback(() => {
    return fetch(
      `/api/instrument-price?instrument=${instrumentName}&purge=true`,
    ).then(() => mutate());
  }, [instrumentName, mutate]);

  return {
    lastPrice: data ? { last: data.last } : null,
    isLoading,
    error,
    isLive: !error,
    direction,
    source: data?.source,
    lastUpdated: data?.timestamp ? new Date(data.timestamp) : null,
    refreshNow,
    forceRefresh,
    hasError: !!error,
  };
}
