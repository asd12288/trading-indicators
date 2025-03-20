"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import useSWR from "swr";

// Type for the API response
interface LastPriceData {
  last: number;
  timestamp: string;
  instrument_name: string;
  source?: string;
  priceHistory?: number[];
}

// Fetch function for SWR
const fetcher = async (url: string): Promise<LastPriceData> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
};

export default function useForexPrice(instrumentName: string) {
  // Use SWR for data fetching with caching and revalidation
  const { data, error, isLoading, mutate } = useSWR<LastPriceData>(
    instrumentName
      ? `/api/instrument-price?instrument=${instrumentName}&history=20`
      : null,
    fetcher,
    {
      refreshInterval: 5000, // Refresh every 5 seconds
      revalidateOnFocus: false,
      dedupingInterval: 2000,
    },
  );

  // Keep track of the last value for UI transition purposes
  const prevPriceRef = useRef<number | null>(null);
  const [priceDirection, setDirection] = useState<"up" | "down" | "neutral">(
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
    priceHistory: data?.priceHistory || [],
    isLoading,
    error,
    isLive: !error,
    priceDirection,
    source: data?.source,
    lastUpdated: data?.timestamp ? new Date(data.timestamp) : null,
    refreshNow,
    forceRefresh,
    hasError: !!error,
  };
}
