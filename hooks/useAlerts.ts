"use client";

import { useEffect, useRef, useState } from "react";
import supabaseClient from "@/database/supabase/supabase";
import { Alert } from "@/lib/types";

const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const pingSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    pingSoundRef.current = new Audio("/audio/ping.mp3");

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabaseClient
          .from("signals_alert")
          .select("*")
          .order("time_utc", { ascending: false })
          .limit(20);

        if (error) {
          throw new Error(error.message);
        }

        setAlerts(data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching alerts:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Subscribe to changes in the "alerts" table
    const subscription = supabaseClient
      .channel("alerts-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "alerts" },
        (payload) => {
          setAlerts((current) => [payload.new as Alert, ...current]);
        },
      )
      .subscribe();

    // Cleanup: remove subscription when unmounting
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    alerts,
    isLoading,
    error,
  };
};

export default useAlerts;
