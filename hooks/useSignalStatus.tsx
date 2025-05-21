import supabaseClient from "@/database/supabase/client";
import { useEffect, useState } from "react";

interface SignalData {
  time: string;
  status: string;
  position_status: string;
  instrument_name: string;
}

export const useSignalStatus = (instrumentName: string) => {
  const [signalStatus, setSignalStatus] = useState<SignalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchSignal = async () => {
      try {
        const { data, error: fetchError } = await supabaseClient
          .from("status_alert")
          .select("*")
          .order("time", { ascending: false })
          .eq("instrument_name", instrumentName)
          .limit(1);

        if (fetchError) throw fetchError;
        setSignalStatus(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSignal();
  }, [instrumentName, tick]);

  // Return early if no data
  if (!signalStatus.length) {
    return { InstrumentStatus: null, loading, error };
  }

  try {
    const { time, status, position_status } = signalStatus[0];
    const now = new Date().getTime();
    const tenMinutes = 10 * 60 * 1000;

    const InstrumentStatus = {
      time,
      status,
      position_status,
      isActive: now - new Date(time).getTime() < tenMinutes,
      isStandBy: status === "standby",
      displayStatus: status === "standby" ? "Standby" : "Active",
      displayTime: new Date(time).toLocaleTimeString(),
      statusColor: status === "standby" ? "gray" : "green",
    };

    return { InstrumentStatus, loading, error };
  } catch (err) {
    console.error("Error processing signal status:", err);
    return { InstrumentStatus: null, loading, error: "Error processing signal data" };
  }
};