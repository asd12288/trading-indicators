import { useState, useEffect } from "react";
import { createClient } from "@/database/supabase/client";
import { format } from "date-fns";
import supabaseClient from "@/database/supabase/supabase";

interface SignalStatus {
  id: string;
  instrument_name: string;
  time: string;
  status: string;
  position_status: string;
}

interface ProcessedSignal {
  id: string;
  instrument_name: string;
  time: Date;
  status: string;
  position_status: string;
  isActive: boolean;
  isStandBy: boolean;
  displayStatus: string;
  displayTime: string;
  statusColor: string;
}

export const useSignalsStatus = () => {
  const [signalsStatus, setSignalsStatus] = useState<SignalStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const { data, error: fetchError } = await supabaseClient
          .from("status_alert")
          .select("*")
          .order("time", { ascending: false });

        if (fetchError) throw fetchError;
        setSignalsStatus(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSignals();
  }, []);

  const processedSignals = signalsStatus.reduce<
    Record<string, ProcessedSignal>
  >((acc, signal) => {
    const { instrument_name } = signal;

    try {
      const signalTime = new Date(signal.time);
      signalTime.setHours(signalTime.getHours() - 2);
      const now = new Date();
      const fiveMinutes = 5 * 60 * 1000;
      const isActive = now.getTime() - signalTime.getTime() < fiveMinutes;
      const isStandBy = isActive && signal.status === "STAND-BY";

      const processedSignal = {
        ...signal,
        time: signalTime,
        isActive,
        isStandBy,
        displayStatus: isStandBy
          ? "Stand-By"
          : isActive
            ? signal.status
            : "Deactivated",
        displayTime: format(signalTime, "MM-dd - HH:mm"),
        statusColor: isStandBy
          ? "bg-blue-950"
          : isActive
            ? "bg-green-700"
            : "bg-red-700",
      };

      if (!acc[instrument_name] || signalTime > acc[instrument_name].time) {
        acc[instrument_name] = processedSignal;
      }
    } catch (err) {
      console.error(`Error processing signal for ${instrument_name}:`, err);
    }

    return acc;
  }, {});

  return {
    signalsStatus: Object.values(processedSignals),
    loading,
    error,
  };
};
