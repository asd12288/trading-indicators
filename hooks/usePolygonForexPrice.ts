import { useState, useEffect, useCallback } from "react";
import useSWR from "swr";

interface ForexPriceData {
  last: number;
  bid?: number;
  ask?: number;
  updatedAt: string;
  source?: string;
  fallbackUsed?: boolean;
}

// Fetcher function for SWR
const fetcher = async (url: string): Promise<ForexPriceData> => {
  const response = await fetch(url);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error: ${response.status} - ${errorText}`);
  }

  return response.json();
};

const usePolygonForexPrice = (instrumentName: string) => {
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Use SWR for data fetching with short refresh interval
  const { data, error, isLoading, mutate } = useSWR<ForexPriceData>(
    instrumentName ? `/api/forex-prices?symbol=${instrumentName}` : null,
    fetcher,
    {
      refreshInterval: 10000, // Refresh every 10 seconds
      revalidateOnFocus: false,
      dedupingInterval: 2000,
      onSuccess: (data) => {
        if (data?.updatedAt) {
          setLastUpdated(new Date(data.updatedAt));
        }
      },
    },
  );

  // Function to manually refresh data
  const refreshNow = useCallback(
    (source?: string) => {
      const url = source
        ? `/api/forex-prices?symbol=${instrumentName}&source=${source}`
        : `/api/forex-prices?symbol=${instrumentName}&purge=true`;
      return mutate(fetcher(url));
    },
    [mutate, instrumentName],
  );

  // Return formatted data
  return {
    lastPrice: data
      ? {
          last: data.last,
          bid: data.bid,
          ask: data.ask,
        }
      : null,
    isLoading,
    error,
    lastUpdated,
    isConnected: !error,
    refreshNow,
    source: data?.source || "unknown",
    fallbackUsed: data?.fallbackUsed || false,
    // Add a utility to force synthetic data (for testing)
    useSyntheticData: () => refreshNow("synthetic"),
    // Add a utility to force free API data
    useFreeData: () => refreshNow("free"),
  };
};

export default usePolygonForexPrice;
