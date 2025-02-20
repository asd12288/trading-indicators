"use client";

import { useEffect, useState, useRef } from "react";
import supabaseClient from "@/database/supabase/supabase";

const useAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const pingSoundRef = new Audio("/audio/ping.mp3");

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
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Subscribe to changes in the "signals_alert" table
    const subscription = supabaseClient
      .channel("signals_alert_changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "signals_alert" },
        async (payload) => {
          await fetchData();
          pingSoundRef.play();
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
