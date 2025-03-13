"use client";

import supabaseClient from "@/database/supabase/supabase";
import { useEffect, useState, useCallback, useRef } from "react";

interface LastPriceData {
  last: number;
  timestamp: string;
}

export default function useLast(instrumentName: string) {
  const [lastPrice, setLastPrice] = useState<LastPriceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const channelRef = useRef<any>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Use callback to ensure this function has a stable identity
  const fetchLastPrice = useCallback(
    async (silent = false) => {
      if (!instrumentName) return;

      if (!silent) {
        console.log("Explicitly fetching last price for", instrumentName);
      }

      try {
        const { data, error } = await supabaseClient
          .from("instruments_status") // Make sure table name is correct
          .select("last, timestamp")
          .eq("instrument_name", instrumentName)
          .order("timestamp", { ascending: false })
          .limit(1);

        if (error) throw new Error(error.message);

        if (data && data.length > 0 && data[0].last !== null) {
          if (!silent) {
            console.log("Fetched last price:", data[0].last);
          }

          setLastPrice((prevPrice) => {
            // Only update if the price or timestamp has changed
            if (
              !prevPrice ||
              prevPrice.last !== data[0].last ||
              prevPrice.timestamp !== data[0].timestamp
            ) {
              return {
                last: data[0].last,
                timestamp: data[0].timestamp,
              };
            }
            return prevPrice;
          });
        } else if (!silent) {
          console.log("No last price found");
        }
      } catch (err) {
        console.error("Failed to fetch last price", err);
        if (!silent) {
          setError(err instanceof Error ? err : new Error("Unknown error"));
        }
      } finally {
        if (!silent) {
          setIsLoading(false);
        }
      }
    },
    [instrumentName],
  );

  // Set up real-time subscription and initial data fetch
  useEffect(() => {
    if (!instrumentName) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Initial fetch to get the latest price immediately
    fetchLastPrice();

    // Explicitly set up a channel with a unique name
    const channelName = `last-price-${instrumentName}-${Date.now()}`;
    const channel = supabaseClient.channel(channelName);
    channelRef.current = channel;


    channel
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "instruments_status",
          filter: `instrument_name=eq.${instrumentName}`,
        },
        (payload) => {
          console.log(`REAL-TIME UPDATE for ${instrumentName}:`, payload);

          // Process any update that contains last price data
          if (payload.new && payload.new.last !== null) {
            console.log(
              `✅ New price: ${payload.new.last} (${new Date().toISOString()})`,
            );

            // Use a function form of setState to ensure we're working with the latest state
            setLastPrice({
              last: payload.new.last,
              timestamp: payload.new.timestamp || new Date().toISOString(),
            });
          }
        },
      )
      .subscribe((status) => {
        console.log(`Subscription status for ${channelName}:`, status);

        if (status === "SUBSCRIBED") {
          console.log(
            `✅ Successfully subscribed to real-time updates for ${instrumentName}`,
          );
        } else if (status === "CHANNEL_ERROR") {
          console.error(
            `❌ Error subscribing to real-time updates for ${instrumentName}`,
          );
          // Try to reconnect on error
          setTimeout(() => {
            channel.subscribe();
          }, 5000);
        }
      });

    // Set up polling as a backup to real-time updates
    // This ensures we get updates even if real-time fails
    pollIntervalRef.current = setInterval(() => {
      fetchLastPrice(true); // Silent mode for polling
    }, 5000); // Poll every 5 seconds as a backup

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }

      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [instrumentName, fetchLastPrice]);

  return {
    lastPrice,
    isLoading,
    error,
    isLive: true,
    lastUpdated: lastPrice?.timestamp ? new Date(lastPrice.timestamp) : null,
    // Add a manual refresh function that can be called from the component
    refreshNow: fetchLastPrice,
  };
}
