"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import supabaseClient from "@/database/supabase/client";

export interface InstrumentStatusRow {
  id: number;
  created_at: string;
  instrument_name: string;
  trend?: string;
  timestamp: string;
  last?: number;
  vwap?: number;
  poc?: number;
  vpoc?: number;
  vah?: number;
  val?: number;
  high?: number;
  low?: number;
}

// Interface for combined data from multiple rows
export interface CompositeInstrumentStatus {
  trend?: { value: string; timestamp: string };
  last?: { value: number; timestamp: string };
  vwap?: { value: number; timestamp: string };
  poc?: { value: number; timestamp: string };
  vpoc?: { value: number; timestamp: string };
  vah?: { value: number; timestamp: string };
  val?: { value: number; timestamp: string };
  high?: { value: number; timestamp: string };
  low?: { value: number; timestamp: string };
  latestTimestamp?: string;
}

export default function useInstrumentStatus(instrumentName: string) {
  const [data, setData] = useState<InstrumentStatusRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Keep track of the last known values across updates
  const lastKnownValuesRef = useRef<Partial<Record<string, any>>>({});

  // Force a re-render when new data arrives to ensure UI updates
  const [updateCounter, setUpdateCounter] = useState(0);

  // Derive composite data from raw rows
  const compositeData = useMemo(() => {
    if (!data || data.length === 0) return {};

    const result: CompositeInstrumentStatus = {
      latestTimestamp: data[0]?.timestamp,
    };

    const fields = [
      "trend",
      "last",
      "vwap",
      "poc",
      "vpoc",
      "vah",
      "val",
      "high",
      "low",
    ] as const;

    // First pass: check most recent data for values
    for (const field of fields) {
      // Start by looking for values in the current dataset
      for (const row of data) {
        if (row[field] !== undefined && row[field] !== null) {
          result[field] = {
            value: row[field] as any,
            timestamp: row.timestamp,
          };

          // Update our reference of last known values
          lastKnownValuesRef.current[field] = row[field];
          break;
        }
      }

      // If we didn't find a value but have a historical one, use that
      if (!result[field] && lastKnownValuesRef.current[field] !== undefined) {
        result[field] = {
          value: lastKnownValuesRef.current[field],
          timestamp: result.latestTimestamp || "unknown", // Use latest timestamp or fallback
        };
      }
    }

    return result;
  }, [data, updateCounter]); // Include updateCounter to ensure re-calculation on forced updates

  useEffect(() => {
    if (!instrumentName) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    console.log("Fetching instrument status for:", instrumentName);

    // Initial fetch
    const fetchData = async () => {
      try {
        const { data: instrumentStatusData, error } = await supabaseClient
          .from("instruments_status")
          .select("*")
          .eq("instrument_name", instrumentName)
          .order("timestamp", { ascending: false })
          .limit(30); // Get more rows to ensure we have complete data

        if (error) throw new Error(error.message);

        if (instrumentStatusData && instrumentStatusData.length > 0) {
          console.log(
            `Fetched ${instrumentStatusData.length} rows of instrument status data`,
          );
          setData(instrumentStatusData);

          // Initialize lastKnownValues from fetched data
          instrumentStatusData.forEach((row) => {
            const fields = [
              "trend",
              "last",
              "vwap",
              "poc",
              "vpoc",
              "vah",
              "val",
              "high",
              "low",
            ];
            fields.forEach((field) => {
              if (
                row[field] !== undefined &&
                row[field] !== null &&
                lastKnownValuesRef.current[field] === undefined
              ) {
                lastKnownValuesRef.current[field] = row[field];
              }
            });
          });
        } else {
          console.log("No instrument status data found");
        }
      } catch (err) {
        console.error("Error fetching instrument status:", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Real-time subscription
    const channel = supabaseClient.channel(
      `instruments_status-live-${instrumentName}`,
    );

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
          if (
            payload.eventType === "INSERT" ||
            payload.eventType === "UPDATE"
          ) {
            setData((prevData) => {
              const exists = prevData.find(
                (item) => item.id === payload.new.id,
              );

              const updatedData = exists
                ? prevData.map((item) =>
                    item.id === payload.new.id ? payload.new : item,
                  )
                : [payload.new, ...prevData].slice(0, 20);

              return updatedData;
            });

            // Update lastKnownValues for fields that have values in this update
            const newRow = payload.new;
            const fields = [
              "trend",
              "last",
              "vwap",
              "poc",
              "vpoc",
              "vah",
              "val",
              "high",
              "low",
            ];

            let hasValidFields = false;
            fields.forEach((field) => {
              if (newRow[field] !== undefined && newRow[field] !== null) {
                lastKnownValuesRef.current[field] = newRow[field];
                hasValidFields = true;
              }
            });

            // Force re-render to update UI with new composite data
            if (hasValidFields) {
              setUpdateCounter((prev) => prev + 1);
            }
          }
        },
      )
      .subscribe((status) => {

        if (status === "SUBSCRIBED") {
          console.log(
            `Successfully subscribed to real-time updates for ${instrumentName}`,
          );
        }

        if (status === "CHANNEL_ERROR") {
          console.error("Error subscribing to real-time updates");
        }
      });

    return () => {
      console.log("Cleaning up subscription");
      channel.unsubscribe();
    };
  }, [instrumentName]);

  return {
    data,
    compositeData,
    isLoading,
    error,
    isLive: true, // Add an indicator that live updates are enabled
  };
}
