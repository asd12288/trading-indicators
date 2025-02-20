"use client";

import supabaseClient from "@/database/supabase/supabase";
import { useEffect, useState } from "react";

const useAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const pingSound = new Audio("/audio/ping.mp3");

  const fetchData = async () => {
    const { data, error } = await supabaseClient
      .from("signals_alert")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      console.error("Error fetching alerts:", error);
    } else if (data) {
      setAlerts(data);
    }

    setIsLoading(false);
  };
  useEffect(() => {
    fetchData();
    const subscription = supabaseClient
      .channel("signals_alert_changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "signals_alert" },
        (payload) => {
          fetchData();
          pingSound.play();
        },
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(subscription);
    };
  }, []);

  return { alerts, isLoading };
};

export default useAlerts;
