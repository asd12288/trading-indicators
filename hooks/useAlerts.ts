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
          .order("created_at", { ascending: false })
          .limit(200);

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

    // Subscribe to changes in the "signals_alert" table
    const subscription = supabaseClient
      .channel("signals_alert_changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "signals_alert" },
        async () => {
          await fetchData();
          pingSoundRef.current
            ?.play()
            .catch((err) => console.warn("Audio playback blocked", err));
        },
      )
      .subscribe();

    // Cleanup: remove subscription when unmounting
    return () => {
      supabaseClient.removeChannel(subscription);
    };
  }, []);

  return {
    alerts,
    isLoading,
    error,
  };
};

export default useAlerts;
