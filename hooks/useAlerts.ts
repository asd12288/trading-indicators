"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import supabaseClient from "@/database/supabase/supabase";
import { Alert } from "@/lib/types";
import useProfile from "./useProfile";
import usePreferences from "./usePreferences";

const useAlerts = (userId) => {
  const [allAlerts, setAllAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const pingSoundRef = useRef<HTMLAudioElement | null>(null);

  // Get user profile to determine if they're a pro user
  const {
    isPro,
    isLoading: profileLoading,
    error: profileError,
  } = useProfile(userId);

  // Get user preferences including notification settings
  const { preferences, notificationsOn } = usePreferences(userId);

  // New ref for storing alert listeners
  const alertListenersRef = useRef<((alert: Alert) => void)[]>([]);

  // Filter alerts based on user preferences if user is pro
  const alerts = useMemo(() => {
    if (!isPro) {
      // Non-pro users get all alerts
      return allAlerts;
    }

    // Pro users only get alerts for instruments they've turned on notifications for
    return allAlerts.filter((alert) =>
      notificationsOn.includes(alert.instrument_name),
    );
  }, [allAlerts, isPro, notificationsOn]);

  useEffect(() => {
    pingSoundRef.current = new Audio("/audio/ping.mp3");

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabaseClient
          .from("signals_alert")
          .select("*")
          .order("time_utc", { ascending: false });

        if (error) {
          throw new Error(error.message);
        }

        console.log("Fetched alerts:", data); // Debug log
        setAllAlerts(data || []);
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
      .channel("alerts-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "signals_alert" },
        (payload) => {
          const newAlert = payload.new as Alert;

          // Only process this alert if not a pro user OR
          // if pro user and they have notifications turned on for this instrument
          const shouldProcess =
            !isPro || notificationsOn.includes(newAlert.instrument_name);

          if (shouldProcess) {
            // Update alerts state
            setAllAlerts((current) => [newAlert, ...current]);

            // Notify all listeners
            alertListenersRef.current.forEach((listener) => {
              try {
                listener(newAlert);
              } catch (err) {
                console.error("Error in alert listener:", err);
              }
            });
          }
        },
      )
      .subscribe();

    // Cleanup: remove subscription when unmounting
    return () => {
      subscription.unsubscribe();
    };
  }, [isPro, notificationsOn]);

  // Function to register a new alert listener
  const onNewAlert = useCallback((callback: (alert: Alert) => void) => {
    alertListenersRef.current.push(callback);

    // Return unsubscribe function
    return () => {
      alertListenersRef.current = alertListenersRef.current.filter(
        (listener) => listener !== callback,
      );
    };
  }, []);

  return {
    alerts, // Return filtered alerts instead of all alerts
    isLoading: isLoading || profileLoading,
    error: error || profileError,
    onNewAlert, // Expose the onNewAlert function
  };
};

export default useAlerts;
